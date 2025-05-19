import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Card, Space, Typography, message, Modal, Popconfirm, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getClients, deleteClient } from '../services/clients';
import { Client, Pagination } from '../types';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Search } = Input;

const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await getClients(currentPage, pageSize, searchTerm);
      setClients(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      message.error('Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, pageSize, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEdit = (id: number) => {
    navigate(`/clients/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      message.success('Cliente excluído com sucesso!');
      fetchClients();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      message.error('Não foi possível excluir o cliente.');
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Client, b: Client) => a.name.localeCompare(b.name),
    },
    {
      title: 'Documento',
      dataIndex: 'document',
      key: 'document',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string | null) => email || '-',
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) => phone || '-',
    },
    {
      title: 'Cidade/Estado',
      key: 'location',
      render: (_: unknown, record: Client) => (
        <span>
          {record.city || '-'}/{record.state || '-'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: unknown, record: Client) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            size="small"
          />
          <Popconfirm
            title="Tem certeza que deseja excluir este cliente?"
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
        <Title level={2}>Clientes</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/clients/new')}
        >
          Novo Cliente
        </Button>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar por nome, documento ou cidade"
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
          dataSource={clients}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: true,
            onShowSizeChange: (_, size) => setPageSize(size),
            showTotal: (total) => `Total de ${total} clientes`,
          }}
        />
      </Card>
    </div>
  );
};

export default ClientList; 