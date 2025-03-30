import { TRPCError } from '@trpc/server';
import { parse, serialize, SerializeOptions } from 'cookie';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { getUserByID } from '../models/user_modal';
import { User } from '../schema/user';

type SessionCookie = { user_id: number };

export const encodeSessionCookie = (data: SessionCookie) => {
  const secret = process.env.JWT_SECRET!;

  const token = jwt.sign(data, secret, {
    expiresIn: 60 * 60,
  });

  return token;
};

export const decodeSessionCookie = async (
  req: FastifyRequest,
): Promise<{ user: null | User }> => {
  try {
    const token = getCookie(req, 'token');

    const notAuthenticated = {
      user: null,
    };

    if (!token) {
      return notAuthenticated;
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as SessionCookie;

    if (!decoded) {
      return notAuthenticated;
    }

    const user = await getUserByID(decoded.user_id);

    if (!user) {
      return notAuthenticated;
    }

    return { user };
  } catch (err: any) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  }
};

export function getCookies(req: FastifyRequest) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}

export function getCookie(req: FastifyRequest, name: string) {
  const cookies = getCookies(req);
  return cookies[name];
}

export function setCookie(
  res: FastifyReply,
  name: string,
  value: string,
  options?: SerializeOptions,
) {
  res.header('Set-Cookie', serialize(name, value, options));
}
