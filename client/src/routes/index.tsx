import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { ChangeEvent, useState } from 'react';
import { checkMemoViaWeb3Devnet } from '../lib/checkMemoViaWeb3Devnet';
import { generateSHA256Hash } from '../lib/getHash';
import { trpc } from '../lib/trpc';

export const Route = createFileRoute('/')({
  component: Index,
  // beforeLoad(ctx) {
  //   throw redirect({
  //     to: '/upload',
  //   });
  // },
});

const SIGNER_PUBLIC_KEY = import.meta.env.VITE_SIGNER_PUBLIC_KEY;

function Index() {
  const [hash, setHash] = useState('');
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [fileToSave, setFileToSave] = useState<File | null>(null);
  const [manualHash, setManualHash] = useState('');
  const [showChainCheck, setShowChainCheck] = useState(false);
  const navigate = useNavigate({ from: '/' });
  const [saveable, setSaveable] = useState(false); // eesmärk võimaldada ainult pildi üleslaadimisel salvestamine

  const checkLocal = async (hashHex: string) => {
    setStatus(`🔍 Kontrollin lokaalselt: ${hashHex}`);
    setShowButton(false);
    setShowChainCheck(true);

    try {
      const existingProof = await trpc.media_proof.byHash.query({ hash });

      if (existingProof) {
        setStatus(`✅ Leitud lokaalselt!
TX ID: ${existingProof.solana_txid}
Aeg: ${existingProof.created_at}
Soovid kontrollida ka plokiahelast?`);
      } else {
        setStatus(
          '❌ Ei leitud lokaalselt. Soovid kontrollida ka plokiahelast?',
        );
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
      const chain = await checkMemoViaWeb3Devnet(SIGNER_PUBLIC_KEY, hash);
      if (chain.found) {
        setStatus(
          (prev) => `${prev}
✅ Leitud plokiahelast!
TX ID: ${chain.signature}
Aeg: ${new Date(chain.timestamp ? chain.timestamp * 1000 : new Date()).toLocaleString()}`,
        );
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
        setShowButton(true);
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
      setStatus('✅ Salvestatud lokaalselt. Edasi suunamine...');
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
    <div className="card p-4 shadow-sm">
      <input
        type="file"
        className="form-control mb-3"
        onChange={handleFileChange}
      />

      <div className="input-group mb-3">
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
        <div className="alert alert-info mt-3">
          <strong>Faili räsikood:</strong>
          <br />
          <code>{hash}</code>
        </div>
      )}

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
