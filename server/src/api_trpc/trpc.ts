import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';
import { RequestContext } from './context';

const t = initTRPC.meta<OpenApiMeta>().context<RequestContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;


