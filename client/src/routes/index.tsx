import { InboxOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  DraggerProps,
  Typography,
  Upload,
  UploadFile,
  message,
} from 'antd';
import { useState } from 'react';
import { useTRPC } from '../lib/trpc';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const testQuery = useQuery(
    useTRPC().test.query.queryOptions(undefined as never),
  );
  console.log('testQuery');
  console.log(testQuery);

  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  console.log('fileList', fileList);

  const props: DraggerProps = {
    name: 'file',
    listType: 'picture',
    multiple: true,
    fileList,
    onChange(info) {
      const { status } = info.file;

      // Update fileList
      setFileList(info.fileList);

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    customRequest: (options) => {
      console.log('options');
      console.log(options);

      // save file in backend
      setTimeout(() => {
        const onSuccess = options.onSuccess;

        if (onSuccess) {
          onSuccess('a');
        }
      }, 888);
    },
    // action: async (files) => {

    // },
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Typography>
        <Typography.Title level={2}>File Upload</Typography.Title>
        <Typography.Paragraph>
          Use this tool to upload your files for processing. You can upload
          multiple files at once by dragging and dropping them into the area
          below, or by clicking to select files from your computer. Supported
          file formats include PDF, DOCX, XLSX, and CSV.
        </Typography.Paragraph>
      </Typography>

      <Upload.Dragger {...props} style={{ marginTop: '1.5rem' }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag files to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for single or bulk upload. Strictly prohibited to upload
          company data or other banned files.
        </p>
      </Upload.Dragger>

      {fileList.length > 0 && (
        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button type="primary">Do something else with files?</Button>
        </div>
      )}
    </div>
  );
}

export default Index;
