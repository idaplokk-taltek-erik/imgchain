import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Flex } from 'antd';
import { trpcHooks } from '../../lib/trpc';
import { useTheme } from '../../lib/theme/hook'; 

export const Route = createFileRoute('/_authenticated/send/$hash')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isDarkMode } = useTheme();
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
    <div className="card p-4 shadow" style={{
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      color: isDarkMode ? '#f0f0f0' : '#000000',
    }}>
      <h4>Transaction status check</h4>
      {!hash && <p>Hash missing</p>}
      {signQuery.isPending && <p>Sending hash to Solana network...</p>}
      {signQuery.error  && <p>Failed to send! {signQuery.error.message}</p>}
      {signQuery.isSuccess && (
        <>
          <p>All saved: hash + blockchain signature!</p>
          <p>
            <strong>Transaction ID:</strong> {signQuery.data.solana_txid}
          </p>
          <p>
            <strong>Memo content:</strong> {`MediaProof:${hash}`}
          </p>
        </>
      )}
      {hash && (
        <Flex vertical>
          <p>
            <strong>Hash of the image:</strong> {hash}
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
        Back
      </button>
    </div>
  );
}
