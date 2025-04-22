import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, message } from 'antd';
import { useState } from 'react';
import { signIn, signUp, useSession } from '../lib/auth_client';

export function LoginForm() {
  const [loginLoading, setLoginLoading] = useState(false);
  const { data: session } = useSession();
  const [type, setType] = useState<'login' | 'register'>('login');

  // Handle login form submission
  const handleLogin = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoginLoading(true);

    try {
      if (type === 'login') {
        const result = await signIn.email({
          email: values.email,
          password: values.password,
        });
        if (result.error) {
          message.error(`Login failed: ${result.error.message}`);
        } else {
          message.success('Login successful!');
        }
      } else if (type === 'register') {
        const result = await signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        if (result.error) {
          message.error(`Register failed: ${result.error.message}`);
        } else {
          message.success('Register successful!');
        }
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
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleLogin}
      style={{ maxWidth: 300, margin: '0 auto' }}
    >
      {type === 'register' && (
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>
      )}

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

      <Flex justify="space-between">
        <Button
          type="link"
          htmlType="submit"
          loading={loginLoading}
          onClick={(e) => {
            e.preventDefault();
            setType((type) => (type === 'login' ? 'register' : 'login'));
          }}
        >
          {type === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}
        </Button>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loginLoading}>
            {type === 'login' ? 'Login' : 'Register'}
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
}
