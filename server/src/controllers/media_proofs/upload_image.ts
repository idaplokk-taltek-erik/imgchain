import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { ulid } from 'ulid';
import { db } from '../../db/db';
import { betterAuth } from '../../lib/auth/better_auth';

export function registerUploadImageRoute(server: FastifyInstance) {
  server.register(
    async (routeInstance) => {
      routeInstance.register(multipart, {
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
        },
      });

      routeInstance.post<{ Params: { hash: string } }>(
        '/:hash',
        async (request, reply) => {
          try {
            const sessionAndUser = await betterAuth.api.getSession({
              headers: request.raw.headers as any,
            });

            if (!sessionAndUser) {
              return reply.code(401).send({ error: 'Unauthorized' });
            }

            const mediaProof = await db
              .selectFrom('media_proofs')
              .selectAll()
              .where('hash', '=', request.params.hash)
              .executeTakeFirst();

            if (!mediaProof) {
              return reply
                .code(400)
                .send({ error: 'No media proof uploaded prior' });
            }

            if (mediaProof.image_url) {
              return reply
                .code(400)
                .send({ error: 'Image already uploaded for the media proof!' });
            }

            const data = await request.file();

            if (!data) {
              return reply.code(400).send({ error: 'No file uploaded' });
            }

            const fileExt = data.filename.split('.').pop() || '';
            const fileName = `${mediaProof.hash}.${fileExt}`;

            const uploadDir = join(process.cwd(), 'uploads');
            await mkdir(uploadDir, { recursive: true });
            const filePath = join(uploadDir, fileName);
            await writeFile(filePath, await data.toBuffer());

            return await db
              .updateTable('media_proofs')
              .where('hash', '=', request.params.hash)
              .set({ image_url: `/uploads/${fileName}` })
              .returningAll()
              .executeTakeFirst();
          } catch (err) {
            console.error('File upload error:', err);
            return reply.code(500).send({ error: 'Failed to upload file' });
          }
        },
      );
    },
    { prefix: '/api/upload' },
  );
}
