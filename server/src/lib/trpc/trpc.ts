import { initTRPC, TRPCError } from '@trpc/server';
import { RequestContext } from './context';

const t = initTRPC.context<RequestContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;

    // `ctx.user` is nullable
    if (!ctx.user || !ctx.session || ctx.session.expiresAt < new Date()) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        // ✅ user value is known to be non-null now
        user: ctx.user,
        session: ctx.session,
      },
    });
  },
);
