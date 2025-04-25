import { initTRPC, TRPCError } from '@trpc/server';
import { RequestContext } from './context';
import { TRPCPanelMeta } from "trpc-ui";

const t = initTRPC
  .context<RequestContext>()
  .meta<TRPCPanelMeta>()
  .create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const openApiProcedure = t.procedure;

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

export const adminProcedure = protectedProcedure.use(
  async function isAdmin({ ctx, next }) {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ message: 'Forbidden', code: 'FORBIDDEN' });
    }

    return next();
  },
);

export const protectedOpenApiProcedure = openApiProcedure.use(async function isAuthed(opts) {
  const { ctx } = opts;

  if (!ctx.user || !ctx.session || ctx.session.expiresAt < new Date()) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});
