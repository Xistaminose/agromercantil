import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      await login(values.email, values.password);
      message.success('Login realizado com sucesso!');
      navigate('/');
    } catch (err: any) {
      setError('Email ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ color: '#2e7d32', margin: 0 }}>
            AgroMercantil
          </Title>
          <Title level={5} style={{ fontWeight: 'normal', margin: '10px 0 0' }}>
            Sistema de Gestão de Cotações
          </Title>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor informe seu email' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor informe sua senha' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', background: '#2e7d32', borderColor: '#2e7d32' }}
            >
              Entrar
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" style={{ color: '#2e7d32' }}>
                Registre-se
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 