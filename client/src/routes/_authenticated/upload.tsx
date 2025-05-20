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
    setStatus(`🔍 Checking locally: ${hashHex}`);
    setShowButton(false);
    setShowChainCheck(true);

    try {
      const existingProof = await trpc.media_proof.byHash.query({ hash: hashHex });
      if (existingProof) {
        setTxId(existingProof.solana_txid);
        setStatus(`✅ Found in local database!
  TX ID: ${existingProof.solana_txid}
  Time (local): ${existingProof.created_at}
  Do You want to check from the blockchain?`);
      const imageUrl = await checkImageExists(hashHex); // Pildi otsimine
      if (imageUrl) {
        setExistingImage(imageUrl);
      } else {
        setExistingImage('');
      }
      } else {
        setStatus('❌ Was not found from local database.');
        setExistingImage('')
        setShowButton(true);
        setSaveable(true);
        setShowChainCheck(false);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Local check failed!');
    }
  };
  const checkChain = async () => {
    setStatus(
      (prev) => `${prev}
⏳ Checking from the blockchain...`,
    );

    try {
      const chain = await checkMemoViaWeb3Devnet_TX_ID(txId, hash);
      if (chain.found) {
        setStatus(
          (prev) => `${prev}
✅ Found from the blockchain!
  TX ID: ${chain.signature}
  Time (GMT): ${new Date(chain.timestamp ? chain.timestamp * 1000 : new Date()).toLocaleString()}`,
        );
        setShowChainCheck(true);
      } else if (!saveable) {
        setStatus(
          (prev) => `${prev}
❌ Hash was not found.`,
        );
        setShowButton(false);
      } else if (saveable && fileToSave) {
        setStatus(
          (prev) => `${prev}
❌ Hash was not found. Registering is possible.`,
        );
      }
    } catch (err) {
      console.error(err);
      setStatus(
        (prev) => `${prev}
❌ Check from the blockchain failed!`,
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

    if (!file.type.startsWith('image')) return alert('Only images allowed!');

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
      return alert('Hash has to be 64-characters!');
    }
    setFileToSave(null);
    setPreview('');
    setHash(manualHash);
    setSaveable(false); // käsitsi pole salvestatav
    setShowButton(false);
    await checkLocal(manualHash);
  };

  const handleSaveAndSend = async () => {
    if (!fileToSave || !hash || !saveable) return alert('Error: File is missing.');

    try {
      await trpc.media_proof.add.mutate({
        hash,
        file_name: fileToSave.name,
        file_size: fileToSave.size,
        mime_type: fileToSave.type,
      });
      setStatus('✅ Saved to the local database. Uploading image...');
      const formData = new FormData();
      formData.append('file', fileToSave);

      const fileUploadResponse = await fetch(`/api/upload/${hash}`, {
        method: 'POST',
        body: formData,
      });
      if (!fileUploadResponse.ok) {
        throw new Error('File upload failed');
      }

      setStatus('✅ Image saved. Redirecting...'); // Selle võib välja kommenteerida. See võib tekitada probleemi, et fail olemas, aga tegelikult ei ole plokiahelas. Ühtlasi ei ole kindel, kui jätkusuutlik on kõiki faile salvestada.
      navigate({
        to: '/send/$hash',
        params: {
          hash,
        },
      });
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to save!');
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
          placeholder="Input hash manually"
          value={manualHash}
          onChange={(e) => setManualHash(e.target.value.trim())}
        />
        <button className="btn btn-outline-primary" onClick={handleManualCheck}>
          Check
        </button>
      </div>

      {preview && (
        <img src={preview} className="img-fluid mb-3" alt="Eelvaade" />
      )}

      {hash && (
  <div
    className="alert alert-info d-flex flex-column flex-md-row justify-content-between align-items-start mt-3"
    style={{
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      color: isDarkMode ? '#f0f0f0' : '#000000',
      gap: '1rem', // vahe hash ja pildi vahel
      wordBreak: 'break-word',
      paddingBottom: '2rem',
    }}
  >
    <div style={{ flex: 1, minWidth: 0}}>
      <strong>Hash of the image:</strong>
      <br />
      <code style={{ wordBreak: 'break-word' }}>{hash}</code>
    </div>

    {existingImage && (
      <>
        {/* Mobiilivaade */}
        <div className="d-flex flex-column align-items-center d-md-none mt-3">
          <img
            src={existingImage}
            alt="Existing image"
            onClick={() => window.open(existingImage, '_blank')}
            className="rounded shadow-sm img-thumbnail"
            style={{
              cursor: 'pointer',
              maxWidth: '250px',
              width: '100%',
              height: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <small className="text-muted mt-2">Click to open</small>
        </div>

        {/* Desktopvaade */}
        <div className="d-none d-md-block mt-3">
          <img
            src={existingImage}
            alt="Existin image"
            onClick={() => window.open(existingImage, '_blank')}
            className="rounded shadow-sm img-thumbnail"
            style={{
              cursor: 'pointer',
              maxWidth: '250px',
              width: '100%',
              height: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <small className="text-muted">Click to open</small>
        </div>
      </>
    )}

        </div>
      )}
      {

      }

      {status && <pre>{status}</pre>}

      {showChainCheck && (
        <button className="btn btn-outline-secondary mt-2" onClick={checkChain}>
          Check from the blockchain
        </button>
      )}

      {showButton && saveable && (
        <button className="btn btn-primary mt-3" onClick={handleSaveAndSend}>
          ➕ Add to the blockchain and save
        </button>
      )}
    </div>
  );
}

export default Index;
