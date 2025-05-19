import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, Typography, Select, Empty } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { getClients } from '../services/clients';
import { getQuotes, getProducts, getRegions } from '../services/quotes';
import { useAuth } from '../context/AuthContext';
import { Pagination, Quote } from '../types';

const { Title } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [clientsTotal, setClientsTotal] = useState<number>(0);
  const [quotesTotal, setQuotesTotal] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productsData = await getProducts();
        const regionsData = await getRegions();
        setProducts(productsData);
        setRegions(regionsData);

        const clientsData = await getClients(1, 1);
        setClientsTotal(clientsData.total);

        const quotesData = await getQuotes(1, 100, {
          product: selectedProduct,
          region: selectedRegion,
        });
        setQuotesTotal(quotesData.total);

        const validQuotes = quotesData.items.filter(quote => quote !== null);
        const totalAmount = validQuotes.reduce(
          (acc, quote) => acc + (quote.total_price || 0),
          0
        );
        setTotalValue(totalAmount);
        setRecentQuotes(validQuotes.slice(0, 5));
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setError('Não foi possível carregar alguns dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedProduct, selectedRegion]);

  const columns = [
    {
      title: 'Número',
      dataIndex: 'quote_number',
      key: 'quote_number',
    },
    {
      title: 'Produto',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Região',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Valor Total',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (value: number) => `R$ ${value?.toFixed(2) || '0.00'}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: '#faad14', text: 'Pendente' },
          approved: { color: '#52c41a', text: 'Aprovada' },
          rejected: { color: '#f5222d', text: 'Rejeitada' },
          'Em Análise': { color: '#1890ff', text: 'Em Análise' },
          'Pendente': { color: '#faad14', text: 'Pendente' },
          'Aprovada': { color: '#52c41a', text: 'Aprovada' },
          'Rejeitada': { color: '#f5222d', text: 'Rejeitada' },
        };

        const { color, text } = statusMap[status] || { color: '#1890ff', text: status };

        return (
          <span style={{ color }}>
            {text}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Dashboard</Title>
        <p>Bem-vindo, {user?.full_name || user?.email}! Aqui está um resumo da sua atividade.</p>
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Clientes"
              value={clientsTotal}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de Cotações"
              value={quotesTotal}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Valor Total (R$)"
              value={totalValue.toFixed(2)}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ticket Médio (R$)"
              value={quotesTotal > 0 ? (totalValue / quotesTotal).toFixed(2) : '0.00'}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Cotações Recentes"
        style={{ marginBottom: 24 }}
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Select
              style={{ width: 150 }}
              placeholder="Filtrar por produto"
              allowClear
              onChange={setSelectedProduct}
            >
              {products.map(product => (
                <Option key={product} value={product}>{product}</Option>
              ))}
            </Select>
            <Select
              style={{ width: 150 }}
              placeholder="Filtrar por região"
              allowClear
              onChange={setSelectedRegion}
            >
              {regions.map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
          </div>
        }
      >
        {recentQuotes.length > 0 ? (
          <Table
            dataSource={recentQuotes}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        ) : (
          <Empty description="Não há cotações recentes para exibir" />
        )}
      </Card>
    </div>
  );
};

export default Dashboard; 