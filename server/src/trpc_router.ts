import { addMediaProofHandler } from './controllers/media_proofs/add_media_proof';
import { getAllMediaProofsQueryHandler } from './controllers/media_proofs/get_all_media_proofs';
import { getMediaProofsByHashQueryHandler } from './controllers/media_proofs/get_media_proof_by_hash';
import { getMediaProofsByTxQueryHandler } from './controllers/media_proofs/get_media_proof_by_tx';
import { getUserMediaProofsQueryHandler } from './controllers/media_proofs/get_user_media_proofs';
import { signMediaProofHandler } from './controllers/media_proofs/sign_media_proof';
import { testQueryHandler } from './controllers/test/query';
import { router } from './lib/trpc/trpc';

export const appRouter = router({
  test: router({
    query: testQueryHandler,
  }),
  media_proof: router({
    all: getAllMediaProofsQueryHandler,
    byTx: getMediaProofsByTxQueryHandler,
    byHash: getMediaProofsByHashQueryHandler,
    user: getUserMediaProofsQueryHandler,

    add: addMediaProofHandler,
    sign: signMediaProofHandler,
  }),
});

export type AppRouter = typeof appRouter;
