import {
  BulbOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  Button,
  Divider,
  Layout,
  Menu,
  Switch,
  Typography,
} from 'antd';
import { useState } from 'react';
import { signOut, useSession } from '../lib/auth_client';
import { useTheme } from '../lib/theme/hook';

const { Sider } = Layout;
const { Text } = Typography;

export function Navigation() {
  const [collapsed, setCollapsed] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: '/' });
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleThemeChange = (checked: boolean) => {
    theme.setTheme(checked);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      trigger={null}
      theme="light"
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        {!collapsed && (
          <>
            <Avatar
              size={64}
              icon={<UserOutlined />}
              src={session.data?.user.image}
            />
            <Typography style={{ marginTop: 8 }}>
              <Text strong>
                {session.data?.user?.name ||
                  session.data?.user?.email ||
                  'User'}
              </Text>
            </Typography>
          </>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{
            marginTop: collapsed ? 16 : 8,
            marginBottom: 8,
            width: collapsed ? '100%' : 'auto',
          }}
        />
      </div>

      <Divider style={{ margin: '0 0 8px 0' }} />

      <Menu
        mode="inline"
        defaultSelectedKeys={['upload']}
        items={[
          {
            key: 'upload',
            icon: <UploadOutlined />,
            label: <Link to="/">Upload</Link>,
          },
          {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link to="/profile">Profile</Link>,
          },
        ]}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '16px',
        }}
      >
        <Divider style={{ margin: '8px 0' }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            marginBottom: '16px',
          }}
        >
          {!collapsed && <Text>Dark Mode</Text>}
          <Switch
            checkedChildren={<BulbOutlined />}
            unCheckedChildren={<BulbOutlined />}
            checked={theme.isDarkMode}
            onChange={handleThemeChange}
          />
        </div>

        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ width: '100%' }}
        >
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </Sider>
  );
}
