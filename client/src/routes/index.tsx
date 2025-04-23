import { createFileRoute } from '@tanstack/react-router';
import { Col, Row } from 'antd';
import { useMemo } from 'react';
import type { MediaProof } from '../../../server/src/schema/media_proof';
import AppLayout from '../components/layout';
import { trpcHooks } from '../lib/trpc';

export const Route = createFileRoute('/')({
  component: LatestUploadsComponent,
});

function LatestUploadsComponent() {
  const images = trpcHooks.media_proof.all.useQuery();
  const gridChunks = useMemo(() => {
    if (!images.data) return [];

    const chunks: MediaProof[][] = [];
    const chunkSize = 3;
    for (let i = 0; i < images.data.length; i += chunkSize) {
      chunks.push(images.data.slice(i, i + chunkSize));
      // do whatever
    }

    return chunks;
  }, [images.data]);

  return (
    <AppLayout>
      {images.isPending && 'Loading...'}
      {!images.isPending && !images.data?.length && 'No images'}
      {!images.isPending &&
        gridChunks.length &&
        gridChunks.map(([col1, col2, col3]) => {
          return (
            <>
              <Row gutter={16} style={{ marginBottom: '16px' }}>
                <Col span={8}>
                  <img style={{ width: '100% ' }} src={col1.image_url!} />
                </Col>
                {col2 && (
                  <Col span={8}>
                    <img style={{ width: '100% ' }} src={col2.image_url!} />
                  </Col>
                )}
                {col3 && (
                  <Col span={8}>
                    <img style={{ width: '100% ' }} src={col3.image_url!} />
                  </Col>
                )}
              </Row>
            </>
          );
        })}
    </AppLayout>
  );
}
