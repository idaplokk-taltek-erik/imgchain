import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import { sendHashToSolana } from '../lib/sendHashToSolana';

export const Route = createFileRoute('/send/$hash')({
  component: RouteComponent,
})

function RouteComponent() {
  const { hash } = Route.useParams()
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('');
  const [txid, setTxid] = useState('');
  const [instruction, setInstruction] = useState('');

  useEffect(() => {
    const send = async () => {
      if (!hash) return setStatus('Hash puudub');

      setStatus('Saadan hash’i Solana võrku...');
      try {
        const txid = await sendHashToSolana(hash);
        setTxid(txid);
        setInstruction(`MediaProof:${hash}`);
        setStatus(`Hash saadetud! Salvestan lokaalselt... (${txid})`);

        const res = await fetch(`/api/media/${hash}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signature: txid }),
        });

        if (res.ok) {
          setStatus('Kõik salvestatud: räsikood + plokiahela signatuur!');
        } else {
          setStatus('Hash saadetud, aga andmebaasi salvestamine ebaõnnestus!');
        }
      } catch (err) {
        console.error(err);
        setStatus('Saatmine ebaõnnestus!');
      }
    };

    send();
  }, [hash]);

  return (
    <div className="card p-4 shadow">
      <h4>Tehingu staatuse kontroll</h4>
      <p>{status}</p>
      {txid && <p><strong>Tehingu ID:</strong> {txid}</p>}
      {instruction && <p><strong>Memo sisu:</strong> {instruction}</p>}
      {hash && <p><strong>Pildi räsikood:</strong> {hash}</p>}
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate({
          to: '/'
        })}
      >
        Tagasi
      </button>
    </div>
  );
}