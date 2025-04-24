import { addMediaProofHandler } from './controllers/media_proofs/add_media_proof';
import { getAllMediaProofsQueryHandler } from './controllers/media_proofs/get_all_media_proofs';
import { getMediaProofsByHashQueryHandler, getMediaProofsByHashOpenApiHandler } from './controllers/media_proofs/get_media_proof_by_hash';
import { getMediaProofsByTxQueryHandler, getMediaProofsByTxOpenApiHandler } from './controllers/media_proofs/get_media_proof_by_tx';
import { getUserMediaProofsQueryHandler, getUserMediaProofsOpenApiHandler } from './controllers/media_proofs/get_user_media_proofs';
import { signMediaProofHandler, signMediaProofOpenApiHandler } from './controllers/media_proofs/sign_media_proof';
import { testQueryHandler } from './controllers/test/query';
import { router } from './lib/trpc/trpc';

export const appRouter = router({
  test: router({
    query: testQueryHandler,
  }),
  media_proof: router({
    all: getAllMediaProofsQueryHandler,
    byTx: getMediaProofsByTxQueryHandler,
    byTxOpenApi: getMediaProofsByTxOpenApiHandler,
    byHash: getMediaProofsByHashQueryHandler,
    byHashOpenApi: getMediaProofsByHashOpenApiHandler,
    user: getUserMediaProofsQueryHandler,
    userOpenApi: getUserMediaProofsOpenApiHandler,
    add: addMediaProofHandler,
    sign: signMediaProofHandler,
    signOpenApi: signMediaProofOpenApiHandler,
  }),
});

export type AppRouter = typeof appRouter;
