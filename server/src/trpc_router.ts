import { loginHandler, logoutHandler } from './controllers/login';
import { addMediaProofHandler } from './controllers/media_proofs/add_media_proof';
import { getMediaProofsByHashQueryHandler } from './controllers/media_proofs/get_media_proof_by_hash';
import { getMediaProofsByTxQueryHandler } from './controllers/media_proofs/get_media_proof_by_tx';
import { getUserMediaProofsQueryHandler } from './controllers/media_proofs/get_user_media_proofs';
import { listMediaProofsHandler } from './controllers/media_proofs/list_media_proofs';
import { signMediaProofHandler } from './controllers/media_proofs/sign_media_proof';
import { router } from './lib/trpc/trpc';

export const appRouter = router({
  media_proof: router({
    list: listMediaProofsHandler,
    byTx: getMediaProofsByTxQueryHandler,
    byHash: getMediaProofsByHashQueryHandler,
    user: getUserMediaProofsQueryHandler,
    add: addMediaProofHandler,
    sign: signMediaProofHandler,
  }),
  login: loginHandler,
  logout: logoutHandler,
});

export type AppRouter = typeof appRouter;
