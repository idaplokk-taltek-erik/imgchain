import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Flex } from 'antd';
import { trpcHooks } from '../../lib/trpc';

export const Route = createFileRoute('/_authenticated/send/$hash')({
  component: RouteComponent,
});

function RouteComponent() {
  const { hash } = Route.useParams();
  const mediaProofQuery = trpcHooks.media_proof.byHash.useQuery({ hash });
  const signQuery = trpcHooks.media_proof.sign.useQuery(
    {
      hash,
    },
    {
      enabled: mediaProofQuery.isSuccess,
      queryHash: hash,
      retry: false,
    },
  );

  const navigate = useNavigate();

  return (
    <div className="card p-4 shadow">
      <h4>Tehingu staatuse kontroll</h4>
      {!hash && <p>Hash puudub</p>}
      {signQuery.isPending && <p>Saadan hash'i Solana võrku...</p>}
      {signQuery.error  && <p>Saatmine ebaõnnestus! {signQuery.error.message}</p>}
      {signQuery.isSuccess && (
        <>
          <p>Kõik salvestatud: räsikood + plokiahela signatuur!</p>
          <p>
            <strong>Tehingu ID:</strong> {signQuery.data.solana_txid}
          </p>
          <p>
            <strong>Memo sisu:</strong> {`MediaProof:${hash}`}
          </p>
        </>
      )}
      {hash && (
        <Flex vertical>
          <p>
            <strong>Pildi räsikood:</strong> {hash}
          </p>
          <img width="200px" src={mediaProofQuery.data?.image_url ?? ''} />
        </Flex>
      )}
      <button
        className="btn btn-primary mt-3"
        onClick={() =>
          navigate({
            to: '/upload',
          })
        }
      >
        Tagasi
      </button>
    </div>
  );
}
