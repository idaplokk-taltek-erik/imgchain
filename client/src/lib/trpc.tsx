import { createTRPCContext } from '@trpc/tanstack-react-query';
import { AppRouter } from '../../../server/src/trpc_router';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

