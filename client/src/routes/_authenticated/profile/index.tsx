import {
  ClockCircleOutlined,
  EditOutlined,
  GlobalOutlined,
  KeyOutlined,
  MailOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSession } from '../../../lib/auth_client';

dayjs.extend(relativeTime);

const { Title, Paragraph, Text } = Typography;

export const Route = createFileRoute('/_authenticated/profile/')({
  component: ProfilePage,
});

function ProfilePage() {
  // In a real application, you would use the useSession hook
  // const { user, session } = useSession();

  // Using the provided data for demonstration
  const { data } = useSession();
  const userData = data?.user;
  const sessionData = data?.session;

  if (!userData || !sessionData) {
    return null;
  }

  // Format dates for display
  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format('MMMM D, YYYY [at] h:mm A');
  };

  // Calculate time until session expiry
  const timeUntilExpiry = dayjs(sessionData.expiresAt).fromNow(true);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={userData.image}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Title
                level={3}
                style={{ marginTop: '16px', marginBottom: '4px' }}
              >
                {userData.name}
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: '8px' }}>
                <MailOutlined style={{ marginRight: '8px' }} />
                {userData.email}
              </Paragraph>
              <Space>
                {userData.emailVerified ? (
                  <Tag color="success">Email Verified</Tag>
                ) : (
                  <Tag color="warning">Email Not Verified</Tag>
                )}
                <Tag color="blue">User</Tag>
              </Space>
            </div>

            <Divider style={{ marginTop: '8px', marginBottom: '16px' }} />

            <Descriptions column={1} layout="vertical" size="small">
              <Descriptions.Item label="Member Since">
                {formatDate(userData.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(userData.updatedAt)}
              </Descriptions.Item>
            </Descriptions>

            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ width: '100%', marginTop: '20px' }}
            >
              Edit Profile
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <KeyOutlined style={{ marginRight: '8px' }} />
                <span>Current Session</span>
                <Badge
                  status="processing"
                  text="Active"
                  style={{ marginLeft: '12px' }}
                />
              </div>
            }
            bordered={false}
            style={{ marginBottom: '24px' }}
          >
            <Descriptions bordered layout="vertical">
              <Descriptions.Item label="Session ID" span={3}>
                <Text code>{sessionData.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(sessionData.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(sessionData.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Expires">
                <ClockCircleOutlined
                  style={{ color: '#1890ff', marginRight: '8px' }}
                />
                {formatDate(sessionData.expiresAt)}
                <Tag color="blue" style={{ marginLeft: '8px' }}>
                  {`Expires in ${timeUntilExpiry}`}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="User ID" span={3}>
                <Text code>{sessionData.userId}</Text>
              </Descriptions.Item>
       
            </Descriptions>

            <div style={{ marginTop: '24px' }}>
              <Title level={5}>
                <GlobalOutlined style={{ marginRight: '8px' }} />
                Device Information
              </Title>
              <Paragraph
                style={{ marginTop: '16px' }}
                ellipsis={{ rows: 2, expandable: true }}
              >
                <Text strong>User Agent: </Text>
                {sessionData.userAgent || 'Not available'}
              </Paragraph>
              <Paragraph>
                <Text strong>IP Address: </Text>
                {sessionData.ipAddress || 'Not available'}
              </Paragraph>
            </div>
          </Card>

          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MobileOutlined style={{ marginRight: '8px' }} />
                <span>Security Settings</span>
              </div>
            }
            bordered={false}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Title level={5}>Two-Factor Authentication</Title>
                <Paragraph>
                  Enhance your account security by enabling two-factor
                  authentication.
                </Paragraph>
                <Button type="primary">Enable 2FA</Button>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <Title level={5}>Active Sessions</Title>
                <Paragraph>
                  View and manage all your active sessions across devices.
                </Paragraph>
                <Button>Manage Sessions</Button>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div>
                <Title level={5}>Change Password</Title>
                <Paragraph>
                  Regularly updating your password helps keep your account
                  secure.
                </Paragraph>
                <Button>Update Password</Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
