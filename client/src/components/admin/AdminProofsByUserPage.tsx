import React, { useState } from 'react';
import { trpcHooks } from '../../lib/trpc';

const AdminMediaProofsByUserPage = () => {
  const [authorId, setAuthorId] = useState('');
  const [triggerQuery, setTriggerQuery] = useState(false);

  const { data, isLoading, error } = trpcHooks.media_proof.byAuthorId.useQuery(authorId, {
    enabled: triggerQuery && !!authorId,
    onSettled: () => setTriggerQuery(false),
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTriggerQuery(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">User's uploads</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="authorId" className="form-label">User ID:</label>
          <input
            type="text"
            id="authorId"
            className="form-control"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            placeholder="Insert user ID (e.g SFKT1ahJ7ZAN...)"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">Error: {error.message}</div>}

      {data && data.length > 0 && (
        <div className="row">
          {data.map((proof, index) => (
            <div key={index} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{proof.id}</h5>
                  <p className="card-text"><strong>File name:</strong>{proof.file_name || 'Filename missing'}</p>
                  <p className="card-text"><strong>Hash:</strong> {proof.hash}</p>
                  <p className='card-text'><strong>TX id:</strong> {proof.solana_txid || 'No info'}</p>  
                  <p className="card-text"><strong>Date:</strong> {new Date(proof.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <div className="alert alert-warning">No data.</div>
      )}
    </div>
  );
};
export default AdminMediaProofsByUserPage;
