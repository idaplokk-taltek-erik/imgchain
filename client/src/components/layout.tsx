import { Layout } from 'antd';
import React from 'react';
import { Navigation } from './navigation';
import { useTheme } from '../lib/theme/hook';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navigation />
      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            backgroundColor: isDarkMode ? '#141414' : '#fff',
            borderRadius: '4px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
