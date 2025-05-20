import { Layout, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Navigation } from './navigation';
import { useTheme } from '../lib/theme/hook';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavigationProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);

      if (isNowMobile) {
        setCollapsed(true); // mobiilis peidetakse
      } else {
        setCollapsed(false); // desktopis näidatakse
      }
    };

    handleResize(); // esmalaadimisel
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', flexDirection: 'row' }}>
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile}/>

      <Layout style={{ padding: isMobile ? '12px' : '24px' }}>
        <Content
          style={{
            margin: isMobile ? '12px 0' : '24px 16px',
            padding: isMobile ? 12 : 24,
            minHeight: 280,
            backgroundColor: isDarkMode ? '#141414' : '#fff',
            borderRadius: '8px',
            maxWidth: '1000px',
            width: '100%',
            marginInline: 'auto',
            boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Ava menüü nupp ainult mobiilivaates, kui menüü on peidus */}
          {isMobile && collapsed && (
            <Button
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(false)}
              style={{ marginBottom: 16 }}
            >
              MENU
            </Button>
          )}

          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
