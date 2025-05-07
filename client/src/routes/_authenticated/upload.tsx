import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useState, useEffect } from 'react';
import { checkMemoViaWeb3Devnet_TX_ID } from '../../lib/checkMemoViaWeb3Devnet_by_tx_id';
import { generateSHA256Hash } from '../../lib/getHash';
import { trpc } from '../../lib/trpc';
import { checkImageExists } from '../../lib/check_Image_Exists';
import styles from './upload_module.module.css';

import { useTheme } from '../../lib/theme/hook';

export const Route = createFileRoute('/_authenticated/upload')({
  component: Index,
  // beforeLoad(ctx) {
  //   throw redirect({
  //     to: '/upload',
  //   });
  // },
});

function Index() {
  const [hash, setHash] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [fileToSave, setFileToSave] = useState<File | null>(null);
  const [manualHash, setManualHash] = useState('');
  const [showChainCheck, setShowChainCheck] = useState(false);
  const navigate = useNavigate({ from: '/' });
  const [saveable, setSaveable] = useState(false); // eesmärk võimaldada ainult pildi üleslaadimisel salvestamine
  const [txId, setTxId] = useState(null);
  const { isDarkMode } = useTheme();

  const checkLocal = async (hashHex: string) => {
    setStatus(`🔍 Kontrollin lokaalselt: ${hashHex}`);
    setShowButton(false);
    setShowChainCheck(true);

    try {
      const existingProof = await trpc.media_proof.byHash.query({ hash: hashHex });
      if (existingProof) {
        setTxId(existingProof.solana_txid);
        setStatus(`✅ Leitud lokaalselt!
  TX ID: ${existingProof.solana_txid}
  Aeg: ${existingProof.created_at}
  Soovid kontrollida ka plokiahelast?`);
      const imageUrl = await checkImageExists(hashHex); // Pildi otsimine
      if (imageUrl) {
        setExistingImage(imageUrl);
      } else {
        setExistingImage('');
      }
      } else {
        setStatus('❌ Ei leitud lokaalselt.');
        setExistingImage('')
        setShowButton(true);
        setSaveable(true);
        setShowChainCheck(false);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Lokaalne kontroll ebaõnnestus!');
    }
  };
  const checkChain = async () => {
    setStatus(
      (prev) => `${prev}
⏳ Kontrollin plokiahelast...`,
    );

    try {
      const chain = await checkMemoViaWeb3Devnet_TX_ID(txId, hash);
      if (chain.found) {
        setStatus(
          (prev) => `${prev}
✅ Leitud plokiahelast!
TX ID: ${chain.signature}
Aeg: ${new Date(chain.timestamp ? chain.timestamp * 1000 : new Date()).toLocaleString()}`,
        );
        setShowChainCheck(true);
      } else if (!saveable) {
        setStatus(
          (prev) => `${prev}
❌ Räsikoodi ei leitud.`,
        );
        setShowButton(false);
      } else if (saveable && fileToSave) {
        setStatus(
          (prev) => `${prev}
❌ Räsikoodi ei leitud. Võimalik salvestamiseks.`,
        );
      }
    } catch (err) {
      console.error(err);
      setStatus(
        (prev) => `${prev}
❌ Plokiahela kontroll ebaõnnestus!`,
      );
    } finally {
      setShowChainCheck(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith('image')) return alert('Palun vali pildifail!');

    setFileToSave(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPreview(reader.result!.toString());

    const buffer = await file.arrayBuffer();
    const hashHex = await generateSHA256Hash(buffer);

    setHash(hashHex);
    await checkLocal(hashHex);

    setSaveable(true);
  };

  const handleManualCheck = async () => {
    if (manualHash.length !== 64) {
      return alert('Hash peab olema 64-kohaline!');
    }
    setFileToSave(null);
    setPreview('');
    setHash(manualHash);
    setSaveable(false); // käsitsi pole salvestatav
    setShowButton(false);
    await checkLocal(manualHash);
  };

  const handleSaveAndSend = async () => {
    if (!fileToSave || !hash || !saveable) return alert('Viga: puudub fail.');

    try {
      await trpc.media_proof.add.mutate({
        hash,
        file_name: fileToSave.name,
        file_size: fileToSave.size,
        mime_type: fileToSave.type,
      });
      setStatus('✅ Salvestatud lokaalselt. Pildi üleslaadimine...');
      const formData = new FormData();
      formData.append('file', fileToSave);

      const fileUploadResponse = await fetch(`/api/upload/${hash}`, {
        method: 'POST',
        body: formData,
      });
      if (!fileUploadResponse.ok) {
        throw new Error('File upload failed');
      }

      setStatus('✅ Pilt salvestatud. Edasi suunamine...'); // Selle võib välja kommenteerida. See võib tekitada probleemi, et fail olemas, aga tegelikult ei ole plokiahelas. Ühtlasi ei ole kindel, kui jätkusuutlik on kõiki faile salvestada.
      navigate({
        to: '/send/$hash',
        params: {
          hash,
        },
      });
    } catch (err) {
      console.error(err);
      setStatus('❌ Salvestamine ebaõnnestus!');
    }
  };

  return (
    <div className="card p-4 shadow-sm" style={{
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      color: isDarkMode ? '#f0f0f0' : '#000000',
    }}>
      <input
        type="file"
        className="form-control mb-3"
        onChange={handleFileChange}
      />

      <div className="input-group mb-3" style={{
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      color: isDarkMode ? '#f0f0f0' : '#000000',
    }}>
        <input
          type="text"
          className="form-control"
          placeholder="Sisesta hash käsitsi"
          value={manualHash}
          onChange={(e) => setManualHash(e.target.value.trim())}
        />
        <button className="btn btn-outline-primary" onClick={handleManualCheck}>
          Kontrolli
        </button>
      </div>

      {preview && (
        <img src={preview} className="img-fluid mb-3" alt="Eelvaade" />
      )}

      {hash && (
        <div className="alert alert-info d-flex justify-content-between align-items-start mt-3" style={{
          backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
          color: isDarkMode ? '#f0f0f0' : '#000000',
        }}>
          <div style={{
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      color: isDarkMode ? '#f0f0f0' : '#000000',
    }}>
            <strong>Faili räsikood:</strong>
            <br />
            <code>{hash}</code>
          </div>
          {/* Pildi olemasolul kuvatakse ka meie andmebaasis olev pilt. */}
          {existingImage && (
            <div className={`${styles.imageWrapper} ms-3`}>
              <img
                src={existingImage}
                alt="Olemasolev pilt"
                className="rounded shadow-sm img-thumbnail"
              />
            </div>
          )}
        </div>
      )}
      {

      }

      {status && <pre>{status}</pre>}

      {showChainCheck && (
        <button className="btn btn-outline-secondary mt-2" onClick={checkChain}>
          Kontrolli plokiahelast
        </button>
      )}

      {showButton && saveable && (
        <button className="btn btn-primary mt-3" onClick={handleSaveAndSend}>
          ➕ Lisa plokiahelasse ja salvesta
        </button>
      )}
    </div>
  );
}

export default Index;
