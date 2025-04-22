import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { signIn, useSession } from '../lib/auth_client';


export function LoginModal() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      setIsOpen(false);
    } else if (!isPending && !session) {
      setIsOpen(true); 
    }
  }, [session, isPending]);

  // Handle login form submission
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoginLoading(true);

    try {
      // Call signIn from useSession
      const result = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        message.error('Login failed. Please check your credentials.');
        console.error('Login error:', result.error.message);
      } else {
        message.success('Login successful!');
      }
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoginLoading(false);
      console.log(session);
    }
  };

  return (
    <Modal
      title="Login Required"
      open={isOpen}
      footer={null}
      closable={false}
      maskClosable={false}
    >
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        style={{ maxWidth: 300, margin: '0 auto' }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loginLoading}
            style={{ width: '100%' }}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
