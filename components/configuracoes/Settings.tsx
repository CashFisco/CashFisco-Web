"use client"
import { useState, useEffect } from "react"
import {
  Typography,
  Card,
  Form,
  Input,
  Button,
  Alert,
  Spin,
  Tabs,
  Table,
  Tag,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Badge,
  App // Importar App
} from "antd"
import {
  SaveOutlined,
  MailOutlined,
  LockOutlined,
  TeamOutlined,
  BankOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  CrownOutlined,
  CheckOutlined,
} from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"
import { usuariosService, clientesService, type Cliente, type CadastroGerenteRequest } from "@/services/api"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"

dayjs.locale("pt-br")

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs

export default function SettingsPage() {
  const { perfil } = useAuth()
  const { message } = App.useApp();

  const [clienteForm] = Form.useForm<Cliente>()
  const [gerenteForm] = Form.useForm<CadastroGerenteRequest>()

  const [loading, setLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loadingClientes, setLoadingClientes] = useState(true)

  const fetchClientes = async () => {
    setLoadingClientes(true)
    try {
      const data = await clientesService.listarClientes()
      setClientes(data)
    } catch (error) {
      message.error("Falha ao carregar lista de clientes.")
    } finally {
      setLoadingClientes(false)
    }
  }

  useEffect(() => {
    // Apenas carrega os dados se o usuário for ADMIN
    if (perfil === "ADMIN") {
      fetchClientes()
    }
  }, [perfil])

  const handleCadastrarCliente = async (values: any) => {
    setLoading(true)
    try {
      const payload = {
        ...values,
        dataAquisicaoPlano: dayjs(values.dataAquisicaoPlano).format("YYYY-MM-DD"),
        dataFinalPlano: dayjs(values.dataFinalPlano).format("YYYY-MM-DD"),
      }
      await clientesService.cadastrarCliente(payload)
      message.success("Cliente cadastrado com sucesso!")
      clienteForm.resetFields()
      fetchClientes() // Atualiza a lista na outra aba
    } catch (error: any) {
      message.error(error.message || "Erro ao cadastrar cliente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCadastrarGerente = async (values: CadastroGerenteRequest) => {
    setLoading(true)
    try {
      const payload = { ...values, perfil: "GERENTE" as const }
      await usuariosService.cadastrarGerente(payload)
      message.success("Gerente cadastrado com sucesso!")
      gerenteForm.resetFields()
    } catch (error: any) {
      message.error(error.message || "Erro ao cadastrar gerente.")
    } finally {
      setLoading(false)
    }
  }

  const renderAlertaVencimento = (dataFinal: string) => {
    const hoje = dayjs()
    const dataVencimento = dayjs(dataFinal)
    const diasRestantes = dataVencimento.diff(hoje, "day")

    if (diasRestantes < 0) {
      return (
        <Tag
          color="error"
          style={{
            background: "linear-gradient(45deg, #ff4d4f, #ff7875)",
            border: "none",
            color: "white",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          Vencido há {Math.abs(diasRestantes)} dias
        </Tag>
      )
    }
    if (diasRestantes <= 15) {
      return (
        <Tag
          color="warning"
          icon={<ClockCircleOutlined />}
          style={{
            background: "linear-gradient(45deg, #fa8c16, #ffa940)",
            border: "none",
            color: "white",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          Vence em {diasRestantes} dias
        </Tag>
      )
    }
    return (
      <Tag
        color="success"
        style={{
          background: "linear-gradient(45deg, #52c41a, #73d13d)",
          border: "none",
          color: "white",
          fontWeight: "600",
          borderRadius: "6px",
        }}
      >
        Vence em {diasRestantes} dias
      </Tag>
    )
  }

  const columns: ColumnsType<Cliente> = [
    {
      title: "Nome / Razão Social",
      dataIndex: "nomeRazaoSocial",
      key: "nomeRazaoSocial",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
          <Text strong style={{ color: "#262626" }}>
            {text}
          </Text>
        </div>
      ),
      sorter: (a, b) => a.nomeRazaoSocial.localeCompare(b.nomeRazaoSocial),
    },
    {
      title: "CPF / CNPJ",
      dataIndex: "cpfCnpj",
      key: "cpfCnpj",
      render: (text) => (
        <Tag
          style={{
            background: "linear-gradient(45deg, #1890ff, #40a9ff)",
            border: "none",
            color: "white",
            fontWeight: "500",
            padding: "4px 12px",
            borderRadius: "6px",
            fontFamily: "monospace",
          }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "ATIVO" ? "success" : "error"}
          style={{
            borderRadius: "6px",
            fontWeight: "600",
            padding: "4px 12px",
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Plano",
      dataIndex: "tipoPlano",
      key: "tipoPlano",
      render: (plano) => (
        <Tag
          style={{
            background: "linear-gradient(45deg, #fa8c16, #ffa940)",
            border: "none",
            color: "white",
            fontWeight: "600",
            borderRadius: "6px",
            padding: "4px 12px",
          }}
        >
          {plano}
        </Tag>
      ),
    },
    {
      title: "Vencimento",
      dataIndex: "dataFinalPlano",
      key: "dataFinalPlano",
      render: (text) => renderAlertaVencimento(text),
      sorter: (a, b) => dayjs(a.dataFinalPlano).unix() - dayjs(b.dataFinalPlano).unix(),
    },
  ]

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }

  const inputStyle = {
    borderRadius: "8px",
    height: "40px",
    border: "2px solid #f0f0f0",
    transition: "all 0.3s",
  }

  // Proteção de rota: apenas ADMIN pode ver esta página
  if (perfil !== "ADMIN") {
    return (
      <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
        <Card style={cardStyle}>
          <Alert
            message="Acesso Negado"
            description="Esta área é exclusiva para Administradores do sistema."
            type="error"
            showIcon
            style={{ borderRadius: "8px" }}
          />
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <div
            style={{
              width: "4px",
              height: "32px",
              background: "linear-gradient(45deg, #1890ff, #fa8c16)",
              borderRadius: "2px",
              marginRight: "16px",
            }}
          />
          <CheckOutlined
            style={{
              fontSize: "24px",
              color: "#1890ff",
              marginRight: "12px",
            }}
          />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Painel do Administrador
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Gerencie clientes e usuários Gerentes do sistema CashFisco
        </Text>
      </div>

      {/* Main Card */}
      <Card style={cardStyle}>
        <Tabs
          defaultActiveKey="1"
          size="large"
          className="custom-tabs"
        >
          {/* Tab 1: Lista de Clientes */}
          <TabPane
            tab={
              <span style={{ fontSize: "16px" }}>
                <TeamOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                Clientes
                <Badge
                  count={clientes.length}
                  style={{
                    backgroundColor: "#fa8c16",
                    marginLeft: "8px",
                  }}
                />
              </span>
            }
            key="1"
          >
            <div style={{ marginBottom: "24px" }}>
              <Title level={4} style={{ color: "#262626", marginBottom: "8px" }}>
                Lista de Clientes Cadastrados
              </Title>
              <Text type="secondary">Visualize e gerencie todos os clientes do sistema</Text>
            </div>

            <Spin spinning={loadingClientes}>
              <Table
                dataSource={clientes}
                columns={columns}
                rowKey="cpfCnpj"
                className="custom-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} clientes`,
                }}
              />

            </Spin>
          </TabPane>

          {/* Tab 2: Cadastrar Cliente */}
          <TabPane
            tab={
              <span style={{ fontSize: "16px" }}>
                <BankOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                Cadastrar Cliente
              </span>
            }
            key="2"
          >
            <div style={{ marginBottom: "32px" }}>
              <Title level={4} style={{ color: "#262626", marginBottom: "8px" }}>
                Cadastro de Novo Cliente
              </Title>
              <Text type="secondary">Preencha os dados do cliente para cadastro no sistema</Text>
            </div>

            <Form form={clienteForm} layout="vertical" onFinish={handleCadastrarCliente}>
              {/* Dados Pessoais */}
              <Card
                size="small"
                title={
                  <span>
                    <UserOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                    Dados Pessoais
                  </span>
                }
                style={{ marginBottom: "24px", borderRadius: "8px" }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="nomeRazaoSocial"
                      label={<span style={{ fontWeight: "500" }}>Nome / Razão Social</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="Digite o nome ou razão social" style={inputStyle} autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="cpfCnpj"
                      label={<span style={{ fontWeight: "500" }}>CPF/CNPJ</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="Digite o CPF ou CNPJ" style={inputStyle} autoComplete="off" maxLength={14} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Contato */}
              <Card
                size="small"
                title={
                  <span>
                    <MailOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                    Informações de Contato
                  </span>
                }
                style={{ marginBottom: "24px", borderRadius: "8px" }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label={<span style={{ fontWeight: "500" }}>E-mail</span>}
                      rules={[
                        { required: true, message: "Campo obrigatório" },
                        { type: "email", message: "E-mail inválido" },
                      ]}
                    >
                      <Input placeholder="Digite o e-mail" style={inputStyle} autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="telefone"
                      label={<span style={{ fontWeight: "500" }}>Telefone</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="(XX) XXXX-XXXX" style={inputStyle} autoComplete="off" maxLength={11} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="whatsapp"
                      label={<span style={{ fontWeight: "500" }}>WhatsApp</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="(XX) XXXXX-XXXX" style={inputStyle} autoComplete="off" maxLength={11} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Endereço */}
              <Card
                size="small"
                title={
                  <span>
                    <EnvironmentOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
                    Endereço
                  </span>
                }
                style={{ marginBottom: "24px", borderRadius: "8px" }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="endereco"
                      label={<span style={{ fontWeight: "500" }}>Endereço</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="Digite o endereço completo" style={inputStyle} autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="cep"
                      label={<span style={{ fontWeight: "500" }}>CEP</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="00000-000" style={inputStyle} autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="cidade"
                      label={<span style={{ fontWeight: "500" }}>Cidade</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="Digite a cidade" style={inputStyle} autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="estado"
                      label={<span style={{ fontWeight: "500" }}>Estado (UF)</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Input placeholder="UF" style={inputStyle} autoComplete="off" maxLength={2} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* Plano */}
              <Card
                size="small"
                title={
                  <span>
                    <DollarOutlined style={{ color: "#722ed1", marginRight: "8px" }} />
                    Informações do Plano
                  </span>
                }
                style={{ marginBottom: "32px", borderRadius: "8px" }}
              >
                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item
                      name="status"
                      label={<span style={{ fontWeight: "500" }}>Status</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Select placeholder="Selecione o status" style={{ height: "40px" }}>
                        <Option value="ATIVO">Ativo</Option>
                        <Option value="INATIVO">Inativo</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="tipoPlano"
                      label={<span style={{ fontWeight: "500" }}>Tipo do Plano</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <Select placeholder="Selecione o plano" style={{ height: "40px" }}>
                        <Option value="MENSAL">Mensal</Option>
                        <Option value="ANUAL">Anual</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="valorPlano"
                      label={<span style={{ fontWeight: "500" }}>Valor do Plano (R$)</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <InputNumber style={{ width: "100%", height: "40px" }} min={0} precision={2} placeholder="0,00" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="dataAquisicaoPlano"
                      label={<span style={{ fontWeight: "500" }}>Data de Aquisição</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <DatePicker
                        style={{ width: "100%", height: "40px" }}
                        format="DD/MM/YYYY"
                        placeholder="Selecione a data"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      name="dataFinalPlano"
                      label={<span style={{ fontWeight: "500" }}>Data Final do Plano</span>}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <DatePicker
                        style={{ width: "100%", height: "40px" }}
                        format="DD/MM/YYYY"
                        placeholder="Selecione a data"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{
                    background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    height: "48px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(24, 144, 255, 0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(24, 144, 255, 0.3)"
                  }}
                >
                  Cadastrar Cliente
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Tab 3: Cadastrar Gerente */}
          <TabPane
            tab={
              <span style={{ fontSize: "16px" }}>
                <CrownOutlined style={{ color: "#722ed1", marginRight: "8px" }} />
                Cadastrar Gerente
              </span>
            }
            key="3"
          >
            <div style={{ marginBottom: "32px" }}>
              <Title level={4} style={{ color: "#262626", marginBottom: "8px" }}>
                Cadastro de Novo Gerente
              </Title>
              <Text type="secondary">Crie uma conta de gerente com permissões para cadastrar operadores</Text>
            </div>

            <Card style={{ borderRadius: "8px", maxWidth: "600px" }}>
              <Form form={gerenteForm} layout="vertical" onFinish={handleCadastrarGerente}>
                <Form.Item
                  name="nome"
                  label={<span style={{ fontWeight: "500" }}>Nome Completo</span>}
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Input
                    placeholder="Nome do novo gerente"
                    style={inputStyle}
                    autoComplete="off"
                    prefix={<UserOutlined style={{ color: "#1890ff" }} />}
                  />
                </Form.Item>
                <Form.Item
                  name="clienteId"
                  label={<span style={{ fontWeight: "500" }}>Vincular ao Cliente</span>}
                  rules={[{ required: true, message: "É obrigatório vincular a um cliente." }]}
                >
                  <Select
                    showSearch
                    loading={loadingClientes}
                    placeholder="Selecione ou pesquise um cliente para vincular"
                    style={{ height: "40px" }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {clientes.map((cliente) => (
                      // Supondo que 'cliente' tem um 'id'. Se o identificador for outro, ajuste o 'value'.
                      <Option key={cliente.id} value={cliente.id}>
                        {cliente.nomeRazaoSocial} ({cliente.cpfCnpj})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

            
                <Form.Item label={<span style={{ fontWeight: '500' }}>Credenciais de Acesso</span>}>
                  {/* 2. O Input.Group com a propriedade 'compact' faz a mágica de unir os campos */}
                  <Input.Group compact>

                    {/* 3. O Form.Item do e-mail agora não tem label e usa 'noStyle' para não quebrar o layout */}
                    <Form.Item
                      name="email"
                      noStyle
                      rules={[
                        { required: true, message: 'E-mail é obrigatório' },
                        { type: 'email', message: 'E-mail inválido' },
                      ]}
                    >
                      <Input
                        style={{ width: '50%', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }} // Ajusta a largura e o raio da borda
                        placeholder="E-mail que será usado para o login"
                        autoComplete="off"
                        prefix={<MailOutlined style={{ color: '#fa8c16' }} />}
                      />
                    </Form.Item>

                    {/* 4. O Form.Item da senha segue o mesmo padrão */}
                    <Form.Item
                      name="senha"
                      noStyle
                      rules={[
                        { required: true, message: 'Senha é obrigatória' },
                        { min: 6, message: 'Mínimo de 6 caracteres' },
                      ]}
                    >
                      <Input.Password
                        style={{ width: '50%', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }} // Ajusta a largura e o raio da borda
                        placeholder="Senha (mín. 6 caracteres)"
                        autoComplete="new-password"
                        prefix={<LockOutlined style={{ color: '#52c41a' }} />}
                      />
                    </Form.Item>

                  </Input.Group>
                </Form.Item>

                <Form.Item
                  name="limiteOperadores"
                  label={<span style={{ fontWeight: "500" }}>Limite de Operadores</span>}
                  rules={[
                    { required: true, message: "Campo obrigatório" },
                    { type: "number", min: 1, message: "Mínimo de 1 operador" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    placeholder="Quantos operadores este gerente pode criar"
                    style={{ width: "100%", height: "40px" }}
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: "32px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                    style={{
                      background: "linear-gradient(45deg, #722ed1, #9254de)",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      height: "48px",
                      width: "100%",
                      boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(114, 46, 209, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(114, 46, 209, 0.3)"
                    }}
                  >
                    Cadastrar Gerente
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
