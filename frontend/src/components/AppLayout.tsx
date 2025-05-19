import React from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', background: '#2e7d32' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              AgroMercantil
            </Link>
          </Title>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Space>
            {user && (
              <>
                <span style={{ color: 'white' }}>
                  Olá, {user.full_name || user.email}
                </span>
                <Button
                  icon={<LogoutOutlined />}
                  onClick={logout}
                  type="link"
                  style={{ color: 'white' }}
                >
                  Sair
                </Button>
              </>
            )}
          </Space>
        </div>
      </Header>
      <Layout>
        <Sider width={250} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            selectedKeys={[location.pathname]}
          >
            <Menu.Item key="/" icon={<DashboardOutlined />}>
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/clients" icon={<TeamOutlined />}>
              <Link to="/clients">Clientes</Link>
            </Menu.Item>
            <Menu.Item key="/quotes" icon={<FileTextOutlined />}>
              <Link to="/quotes">Cotações</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: '4px',
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            AgroMercantil ©{new Date().getFullYear()} - Sistema de Gestão de Cotações para o Agronegócio
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 