import { createTRPCContext } from '@trpc/tanstack-react-query';
import { AppRouter } from '../../../server/src/api_trpc/router';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

