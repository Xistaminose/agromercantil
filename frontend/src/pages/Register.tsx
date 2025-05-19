import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';

const { Title } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string; confirmPassword: string; fullName: string }) => {
    try {
      if (values.password !== values.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }

      setError(null);
      setLoading(true);
      await authService.register(values.email, values.password, values.fullName);
      message.success('Cadastro realizado com sucesso! Por favor, faça login.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Erro ao registrar usuário. Tente novamente.');
    } finally {
      setLoading(false);
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
        style={{ width: 450, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2} style={{ color: '#2e7d32', margin: 0 }}>
            AgroMercantil
          </Title>
          <Title level={5} style={{ fontWeight: 'normal', margin: '10px 0 0' }}>
            Cadastro de Usuário
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
          name="register"
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: 'Por favor informe seu nome completo' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nome Completo" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor informe seu email' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor informe sua senha' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Por favor confirme sua senha' },
              { min: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirme a Senha"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', background: '#2e7d32', borderColor: '#2e7d32' }}
            >
              Cadastrar
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" style={{ color: '#2e7d32' }}>
                Faça Login
              </Link>
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 