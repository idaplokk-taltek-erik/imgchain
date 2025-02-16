import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../../../server/src/api_trpc/router';

export const trpc = createTRPCReact<AppRouter>();
