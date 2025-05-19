import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Card, Space, Typography, message, Modal, Popconfirm, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getQuotes, deleteQuote } from '../services/quotes';
import { Quote, Pagination } from '../types';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

interface FilterState {
  product?: string;
  region?: string;
  clientId?: number;
  status?: string;
}

const QuoteList: React.FC = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<FilterState>({});

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await getQuotes(currentPage, pageSize, filters);
      setQuotes(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      message.error('Não foi possível carregar as cotações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage, pageSize, filters]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, product: value }));
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    navigate(`/quotes/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuote(id);
      message.success('Cotação excluída com sucesso!');
      fetchQuotes();
    } catch (error) {
      console.error('Erro ao excluir cotação:', error);
      message.error('Não foi possível excluir a cotação.');
    }
  };

  const getStatusTag = (status: string) => {
    let color = 'default';
    
    switch (status.toLowerCase()) {
      case 'pendente':
        color = 'warning';
        break;
      case 'aprovada':
        color = 'success';
        break;
      case 'rejeitada':
        color = 'error';
        break;
      case 'em análise':
        color = 'processing';
        break;
    }
    
    return <Tag color={color}>{status}</Tag>;
  };

  const columns = [
    {
      title: 'Nº Cotação',
      dataIndex: 'quote_number',
      key: 'quote_number',
    },
    {
      title: 'Cliente',
      key: 'client',
      render: (_: unknown, record: Quote) => record.client?.name || '-',
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
      key: 'total_price',
      render: (_: unknown, record: Quote) => 
        new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(record.total_price),
      sorter: (a: Quote, b: Quote) => a.total_price - b.total_price,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Quote) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            size="small"
          />
          <Popconfirm
            title="Tem certeza que deseja excluir esta cotação?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Cotações</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/quotes/new')}
        >
          Nova Cotação
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar por produto"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          style={{ maxWidth: 500 }}
        />
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={quotes}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: true,
            onShowSizeChange: (_, size) => setPageSize(size),
            showTotal: (total) => `Total de ${total} cotações`,
          }}
        />
      </Card>
    </div>
  );
};

export default QuoteList; 