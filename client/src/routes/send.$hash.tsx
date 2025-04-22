import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';

export const Route = createFileRoute('/send/$hash')({
  component: RouteComponent,
});

function RouteComponent() {
  const { hash } = Route.useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [txid, setTxid] = useState('');
  const [instruction, setInstruction] = useState('');

  // See jookseb react dev modis 2 korda by default, ala see trigger peaks kuidagi teisiti olema
  useEffect(() => {
    const send = async () => {
      if (!hash) return setStatus('Hash puudub');

      setStatus('Saadan hash’i Solana võrku...');
      try {
        const result = await trpc.media_proof.sign.mutate({ hash });
        if (result.error_message || !result.solana_txid) {
          console.error(result.error_message);
          setStatus('Saatmine ebaõnnestus!');
          return;
        }

        const txid = result.solana_txid;
        setTxid(txid);
        setInstruction(`MediaProof:${hash}`);
        setStatus('Kõik salvestatud: räsikood + plokiahela signatuur!');
      } catch (err) {
        console.error(err);
        setStatus('Saatmine ebaõnnestus!');
      }
    };

    send();
  }, []);

  return (
    <div className="card p-4 shadow">
      <h4>Tehingu staatuse kontroll</h4>
      <p>{status}</p>
      {txid && (
        <p>
          <strong>Tehingu ID:</strong> {txid}
        </p>
      )}
      {instruction && (
        <p>
          <strong>Memo sisu:</strong> {instruction}
        </p>
      )}
      {hash && (
        <p>
          <strong>Pildi räsikood:</strong> {hash}
        </p>
      )}
      <button
        className="btn btn-primary mt-3"
        onClick={() =>
          navigate({
            to: '/',
          })
        }
      >
        Tagasi
      </button>
    </div>
  );
}
