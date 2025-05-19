import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, DatePicker, InputNumber, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuote, createQuote, updateQuote, getProducts, getRegions } from '../services/quotes';
import { getClients } from '../services/clients';
import { Client, QuoteFormData } from '../types';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface FormValues extends Omit<QuoteFormData, 'valid_until'> {
}

const QuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [products, setProducts] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const [productsData, regionsData, clientsData] = await Promise.all([
          getProducts(),
          getRegions(),
          getClients(1, 100, '').then(data => data.items)
        ]);

        setProducts(productsData);
        setRegions(regionsData);
        setClients(clientsData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        message.error('Não foi possível carregar algumas opções do formulário.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();

    if (isEditing) {
      fetchQuote();
    }
  }, [isEditing, id]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const quoteData = await getQuote(Number(id));

      setUnitPrice(quoteData.unit_price);
      setQuantity(quoteData.quantity);

      form.setFieldsValue({
        product: quoteData.product,
        quantity: quoteData.quantity,
        unit_price: quoteData.unit_price,
        region: quoteData.region,
        notes: quoteData.notes,
        status: quoteData.status,
        client_id: quoteData.client_id,
      });
    } catch (error) {
      console.error('Erro ao buscar cotação:', error);
      message.error('Não foi possível carregar os dados da cotação.');
      navigate('/quotes');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: FormValues) => {
    try {
      setSaving(true);

      const formData = {
        ...values,
      };

      if (isEditing) {
        await updateQuote(Number(id), formData);
        message.success('Cotação atualizada com sucesso!');
      } else {
        await createQuote(formData);
        message.success('Cotação criada com sucesso!');
      }

      navigate('/quotes');
    } catch (error) {
      console.error('Erro ao salvar cotação:', error);
      message.error('Não foi possível salvar os dados da cotação.');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    return (unitPrice * quantity).toFixed(2);
  };

  const currencyParser = (value: string | undefined): number => {
    if (!value) return 0;

    const cleanValue = value.replace(/[R$\s,.]/g, '').replace(',', '.');
    return cleanValue ? Number(cleanValue) : 0;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>{isEditing ? 'Editar Cotação' : 'Nova Cotação'}</Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/quotes')}
        >
          Voltar
        </Button>
      </div>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: 'Pendente', quantity: 1 }}
        >
          <Form.Item
            name="client_id"
            label="Cliente"
            rules={[{ required: true, message: 'Por favor selecione um cliente' }]}
          >
            <Select
              placeholder="Selecione um cliente"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {clients.map(client => (
                <Option key={client.id} value={client.id}>{client.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="product"
            label="Produto"
            rules={[{ required: true, message: 'Por favor informe o produto' }]}
          >
            <Select
              placeholder="Selecione um produto"
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {products.map(product => (
                <Option key={product} value={product}>{product}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="region"
            label="Região"
            rules={[{ required: true, message: 'Por favor informe a região' }]}
          >
            <Select
              placeholder="Selecione uma região"
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {regions.map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="quantity"
              label="Quantidade"
              rules={[{ required: true, message: 'Por favor informe a quantidade' }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                onChange={(value) => setQuantity(value || 1)}
              />
            </Form.Item>

            <Form.Item
              name="unit_price"
              label="Preço Unitário (R$)"
              rules={[{ required: true, message: 'Por favor informe o preço unitário' }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                style={{ width: '100%' }}
                formatter={value => `R$ ${value}`.replace('.', ',')}
                parser={currencyParser}
                onChange={(value) => setUnitPrice(value || 0)}
              />
            </Form.Item>
          </div>

          <div style={{
            padding: '16px',
            background: '#f0f2f5',
            borderRadius: '4px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <Typography.Text strong>Valor Total:</Typography.Text>
            </div>
            <div>
              <Typography.Title level={3} style={{ margin: 0 }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(calculateTotal()))}
              </Typography.Title>
            </div>
          </div>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Por favor selecione o status' }]}
          >
            <Select placeholder="Selecione o status">
              <Option value="Pendente">Pendente</Option>
              <Option value="Em Análise">Em Análise</Option>
              <Option value="Aprovada">Aprovada</Option>
              <Option value="Rejeitada">Rejeitada</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Observações"
          >
            <TextArea rows={4} placeholder="Observações sobre a cotação" />
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

export default QuoteForm; 