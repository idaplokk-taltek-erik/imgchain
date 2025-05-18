import { useState } from 'react';
import { trpcHooks } from '../../lib/trpc';
import { MediaProof } from '../../../server/schema/media_proof';

const dummyUsers = [
  { id: 'ipK9W8smUti9Ei4SaIL5QsP2gk4t4c7a', email: 'admin@admin.ee' },
  { id: 'fVBtsQSruEFA7aTtofInazwgni0iMNX2', email: 'user@user.ee' },
  { id: 'SFKT1ahJ7ZAN41Ay41V9QF5aroRt90du', email: 'test@test.ee' },
];

export default function MediaByAuthorPage() {
  const [selectedUserId, setSelectedUserId] = useState('');
  const { data, isLoading, isError } = trpcHooks.media_proof.byAuthorId.useQuery(selectedUserId, {
    enabled: !!selectedUserId,
  });

  return (
    <div className="container mt-4">
      <h2>Media Proof'id kasutaja alusel</h2>

      <select
        className="form-select mb-3"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">-- Vali kasutaja --</option>
        {dummyUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>

      {isLoading && <p>Laen andmeid...</p>}
      {isError && <p className="text-danger">Viga päringu käigus.</p>}

      {data?.length ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Hash</th>
              <th>Failinimi</th>
              <th>Allikas</th>
              <th>Signatuur</th>
              <th>Loodud</th>
            </tr>
          </thead>
          <tbody>
            {data.map((proof) => (
              <tr key={proof.id}>
                <td>{proof.hash}</td>
                <td>{proof.file_name}</td>
                <td>{proof.source}</td>
                <td>{proof.signature || '–'}</td>
                <td>{new Date(proof.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedUserId && <p>Ühtegi kirjet ei leitud.</p>
      )}
    </div>
  );
}
