import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, Switch, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getClient, createClient, updateClient, getStates } from '../services/clients';
import { Client, ClientFormData } from '../types';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await getStates();
        setStates(statesData);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      }
    };

    fetchStates();

    if (isEditing) {
      fetchClient();
    }
  }, [isEditing, id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const clientData = await getClient(Number(id));
      
      form.setFieldsValue({
        name: clientData.name,
        document: clientData.document,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        notes: clientData.notes,
        is_active: clientData.is_active,
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      message.error('Não foi possível carregar os dados do cliente.');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: ClientFormData) => {
    try {
      setSaving(true);
      
      if (isEditing) {
        await updateClient(Number(id), values);
        message.success('Cliente atualizado com sucesso!');
      } else {
        await createClient(values);
        message.success('Cliente criado com sucesso!');
      }
      
      navigate('/clients');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      message.error('Não foi possível salvar os dados do cliente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</Title>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/clients')}
        >
          Voltar
        </Button>
      </div>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ is_active: true }}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor informe o nome do cliente' }]}
          >
            <Input placeholder="Nome completo ou razão social" />
          </Form.Item>

          <Form.Item
            name="document"
            label="CPF/CNPJ"
            rules={[{ required: true, message: 'Por favor informe o CPF ou CNPJ' }]}
          >
            <Input placeholder="CPF ou CNPJ" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Por favor informe um email válido' }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefone"
          >
            <Input placeholder="Telefone com DDD" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Endereço"
          >
            <Input placeholder="Endereço completo" />
          </Form.Item>

          <Form.Item
            name="city"
            label="Cidade"
          >
            <Input placeholder="Cidade" />
          </Form.Item>

          <Form.Item
            name="state"
            label="Estado"
          >
            <Select
              placeholder="Selecione o estado"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {states.map(state => (
                <Option key={state} value={state}>{state}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Observações"
          >
            <TextArea rows={4} placeholder="Observações sobre o cliente" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Ativo"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              size="large"
            >
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ClientForm; 