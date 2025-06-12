"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Typography,
  Card,
  Form,
  Input,
  Button,
  Tabs,
  Switch,
  Select,
  Divider,
  message,
  Space,
  Spin,
  InputNumber,
  Alert,
} from "antd"
import { SaveOutlined, BankOutlined, SettingOutlined, UserAddOutlined } from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"

const { Title, Text } = Typography
const { Option } = Select

interface EmpresaData {
  razaoSocial: string
  cnpj: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
}

interface ConfiguracoesData {
  notificacoesEmail: boolean
  temaEscuro: boolean
  formatoRelatorio: "pdf" | "excel" | "csv"
  idioma: "pt-BR" | "en-US" | "es"
}

interface CadastroGerenteData {
  nome: string
  email: string
  senha: string
  perfil: "GERENTE"
  limiteOperadores: number
}

import { configuracoesService } from "@/services/configuracoesService"

const Settings: React.FC = () => {
  const router = useRouter()
  const { perfil } = useAuth()
  const [loadingEmpresa, setLoadingEmpresa] = useState<boolean>(false)
  const [loadingGerente, setLoadingGerente] = useState<boolean>(false)
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(true)

  const [empresaForm] = Form.useForm<EmpresaData>()
  const [gerenteForm] = Form.useForm<CadastroGerenteData>()
  const [configForm] = Form.useForm<ConfiguracoesData>()

  // Verificar se o usuário é ADMIN
  useEffect(() => {
    if (perfil && perfil.toUpperCase() !== "ADMIN") {
      message.error("Acesso negado. Apenas administradores podem acessar esta página.")
      router.push("/")
      return
    }
  }, [perfil, router])

  useEffect(() => {
    if (perfil?.toUpperCase() !== "ADMIN") return

    const fetchData = async () => {
      try {
        setLoadingData(true)

        // Carregar dados da empresa
        const empresaData = await configuracoesService.getEmpresa()
        empresaForm.setFieldsValue(empresaData)

        // Carregar configurações do sistema
        const configData = await configuracoesService.getConfiguracoes()
        configForm.setFieldsValue(configData)
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        message.error("Erro ao carregar configurações")
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [empresaForm, configForm, perfil])

  // Se não for ADMIN, não renderizar nada
  if (!perfil || perfil.toUpperCase() !== "ADMIN") {
    return null
  }

  const handleSalvarEmpresa = async (values: EmpresaData) => {
    try {
      setLoadingEmpresa(true)
      await configuracoesService.salvarEmpresa(values)
      message.success("Dados da empresa salvos com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar dados da empresa:", error)
      message.error("Erro ao salvar dados da empresa")
    } finally {
      setLoadingEmpresa(false)
    }
  }

  const handleCadastrarGerente = async (values: CadastroGerenteData) => {
    try {
      setLoadingGerente(true)

      const payload = {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        perfil: "GERENTE",
        limiteOperadores: values.limiteOperadores,
      }

      const response = await fetch("http://localhost:8080/cashfisco-ws/usuarios/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        message.success(result.message || "Gerente cadastrado com sucesso!")
        gerenteForm.resetFields()
      } else {
        message.error(result.message || "Erro ao cadastrar gerente")
      }
    } catch (error) {
      console.error("Erro ao cadastrar gerente:", error)
      message.error("Erro ao cadastrar gerente")
    } finally {
      setLoadingGerente(false)
    }
  }

  const handleSalvarConfiguracoes = async (values: ConfiguracoesData) => {
    try {
      setLoadingConfig(true)
      await configuracoesService.salvarConfiguracoes(values)
      message.success("Configurações do sistema salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações do sistema:", error)
      message.error("Erro ao salvar configurações do sistema")
    } finally {
      setLoadingConfig(false)
    }
  }

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
          <SettingOutlined
            style={{
              fontSize: "24px",
              color: "#1890ff",
              marginRight: "12px",
            }}
          />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Configurações do Sistema
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Gerencie as configurações e usuários do sistema CashFisco
        </Text>
      </div>

      {/* Alert de Acesso Restrito */}
      <Alert
        message="Área Restrita"
        description="Esta área é exclusiva para administradores do sistema."
        type="info"
        showIcon
        style={{
          marginBottom: "24px",
          borderRadius: "8px",
          border: "1px solid #1890ff",
          backgroundColor: "#e6f7ff",
        }}
      />

      <Spin spinning={loadingData}>
        <Tabs
          defaultActiveKey="empresa"
          style={{ marginTop: 16 }}
          items={[
            {
              key: "empresa",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <BankOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                  Dados da Empresa
                </span>
              ),
              children: (
                <Card style={cardStyle}>
                  <Form form={empresaForm} layout="vertical" onFinish={handleSalvarEmpresa}>
                    <Form.Item
                      name="razaoSocial"
                      label={<span style={{ fontWeight: "500" }}>Razão Social</span>}
                      rules={[{ required: true, message: "Por favor, informe a razão social" }]}
                    >
                      <Input placeholder="Informe a razão social" style={{ borderRadius: "8px", height: "40px" }} />
                    </Form.Item>

                    <Form.Item
                      name="cnpj"
                      label={<span style={{ fontWeight: "500" }}>CNPJ</span>}
                      rules={[{ required: true, message: "Por favor, informe o CNPJ" }]}
                    >
                      <Input placeholder="XX.XXX.XXX/XXXX-XX" style={{ borderRadius: "8px", height: "40px" }} />
                    </Form.Item>

                    <Form.Item
                      name="endereco"
                      label={<span style={{ fontWeight: "500" }}>Endereço</span>}
                      rules={[{ required: true, message: "Por favor, informe o endereço" }]}
                    >
                      <Input placeholder="Informe o endereço" style={{ borderRadius: "8px", height: "40px" }} />
                    </Form.Item>

                    <div style={{ display: "flex", gap: 16 }}>
                      <Form.Item
                        name="cidade"
                        label={<span style={{ fontWeight: "500" }}>Cidade</span>}
                        rules={[{ required: true, message: "Por favor, informe a cidade" }]}
                        style={{ flex: 2 }}
                      >
                        <Input placeholder="Informe a cidade" style={{ borderRadius: "8px", height: "40px" }} />
                      </Form.Item>

                      <Form.Item
                        name="estado"
                        label={<span style={{ fontWeight: "500" }}>Estado</span>}
                        rules={[{ required: true, message: "Por favor, informe o estado" }]}
                        style={{ flex: 1 }}
                      >
                        <Select placeholder="Selecione o estado" style={{ height: "40px" }}>
                          <Option value="SP">São Paulo</Option>
                          <Option value="RJ">Rio de Janeiro</Option>
                          <Option value="MG">Minas Gerais</Option>
                          <Option value="RS">Rio Grande do Sul</Option>
                          <Option value="PR">Paraná</Option>
                          <Option value="SC">Santa Catarina</Option>
                          <Option value="BA">Bahia</Option>
                          <Option value="DF">Distrito Federal</Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="cep"
                        label={<span style={{ fontWeight: "500" }}>CEP</span>}
                        rules={[{ required: true, message: "Por favor, informe o CEP" }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="XXXXX-XXX" style={{ borderRadius: "8px", height: "40px" }} />
                      </Form.Item>
                    </div>

                    <div style={{ display: "flex", gap: 16 }}>
                      <Form.Item
                        name="telefone"
                        label={<span style={{ fontWeight: "500" }}>Telefone</span>}
                        rules={[{ required: true, message: "Por favor, informe o telefone" }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="(XX) XXXX-XXXX" style={{ borderRadius: "8px", height: "40px" }} />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label={<span style={{ fontWeight: "500" }}>E-mail</span>}
                        rules={[
                          { required: true, message: "Por favor, informe o e-mail" },
                          { type: "email", message: "Por favor, informe um e-mail válido" },
                        ]}
                        style={{ flex: 2 }}
                      >
                        <Input placeholder="exemplo@empresa.com" style={{ borderRadius: "8px", height: "40px" }} />
                      </Form.Item>
                    </div>

                    <Divider />

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loadingEmpresa}
                        size="large"
                        style={{
                          background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          height: "48px",
                          boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                        }}
                      >
                        Salvar Dados da Empresa
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              ),
            },
            {
              key: "gerente",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <UserAddOutlined style={{ marginRight: "8px", color: "#fa8c16" }} />
                  Cadastrar Gerente
                </span>
              ),
              children: (
                <Card style={cardStyle}>
                  <div style={{ marginBottom: "24px" }}>
                    <Title level={4} style={{ margin: 0, color: "#262626" }}>
                      <UserAddOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                      Cadastro de Novo Gerente
                    </Title>
                    <Text type="secondary">
                      Cadastre um novo gerente e defina o limite de operadores que ele pode gerenciar
                    </Text>
                  </div>

                  <Form form={gerenteForm} layout="vertical" onFinish={handleCadastrarGerente}>
                    <Form.Item
                      name="nome"
                      label={<span style={{ fontWeight: "500" }}>Nome Completo</span>}
                      rules={[
                        { required: true, message: "Por favor, informe o nome" },
                        { min: 3, message: "Nome deve ter pelo menos 3 caracteres" },
                      ]}
                    >
                      <Input
                        placeholder="Informe o nome completo do gerente"
                        style={{ borderRadius: "8px", height: "40px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label={<span style={{ fontWeight: "500" }}>E-mail</span>}
                      rules={[
                        { required: true, message: "Por favor, informe o e-mail" },
                        { type: "email", message: "Por favor, informe um e-mail válido" },
                      ]}
                    >
                      <Input placeholder="exemplo@empresa.com" style={{ borderRadius: "8px", height: "40px" }} />
                    </Form.Item>

                    <Form.Item
                      name="senha"
                      label={<span style={{ fontWeight: "500" }}>Senha Inicial</span>}
                      rules={[
                        { required: true, message: "Por favor, informe a senha" },
                        { min: 6, message: "Senha deve ter pelo menos 6 caracteres" },
                      ]}
                    >
                      <Input.Password
                        placeholder="Informe a senha inicial (mínimo 6 caracteres)"
                        style={{ borderRadius: "8px", height: "40px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="limiteOperadores"
                      label={<span style={{ fontWeight: "500" }}>Limite de Operadores</span>}
                      rules={[
                        { required: true, message: "Por favor, informe o limite de operadores" },
                        { type: "number", min: 1, max: 50, message: "Limite deve ser entre 1 e 50" },
                      ]}
                    >
                      <InputNumber
                        placeholder="Quantidade máxima de operadores"
                        min={1}
                        max={50}
                        style={{
                          borderRadius: "8px",
                          height: "40px",
                          width: "100%",
                        }}
                        addonAfter="operadores"
                      />
                    </Form.Item>

                    <div
                      style={{
                        background: "rgba(250, 140, 22, 0.05)",
                        border: "1px solid rgba(250, 140, 22, 0.2)",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "24px",
                      }}
                    >
                      <Text strong style={{ color: "#fa8c16" }}>
                        Informações Importantes:
                      </Text>
                      <ul style={{ marginTop: "8px", marginBottom: 0 }}>
                        <li>
                          <Text type="secondary">O perfil será automaticamente definido como GERENTE</Text>
                        </li>
                        <li>
                          <Text type="secondary">O gerente poderá cadastrar operadores até o limite definido</Text>
                        </li>
                        <li>
                          <Text type="secondary">A senha inicial deve ser alterada no primeiro acesso</Text>
                        </li>
                      </ul>
                    </div>

                    <Divider />

                    <Form.Item>
                      <Space>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<UserAddOutlined />}
                          loading={loadingGerente}
                          size="large"
                          style={{
                            background: "linear-gradient(45deg, #fa8c16, #ffa940)",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            height: "48px",
                            boxShadow: "0 4px 12px rgba(250, 140, 22, 0.3)",
                          }}
                        >
                          Cadastrar Gerente
                        </Button>

                        <Button
                          onClick={() => gerenteForm.resetFields()}
                          size="large"
                          style={{ borderRadius: "8px", height: "48px" }}
                        >
                          Limpar Formulário
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              ),
            },
            {
              key: "configuracoes",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <SettingOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                  Configurações do Sistema
                </span>
              ),
              children: (
                <Card style={cardStyle}>
                  <Form form={configForm} layout="vertical" onFinish={handleSalvarConfiguracoes}>
                    <Form.Item
                      name="notificacoesEmail"
                      label={<span style={{ fontWeight: "500" }}>Receber notificações por e-mail</span>}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="temaEscuro"
                      label={<span style={{ fontWeight: "500" }}>Tema escuro</span>}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    <Form.Item
                      name="formatoRelatorio"
                      label={<span style={{ fontWeight: "500" }}>Formato padrão de relatórios</span>}
                    >
                      <Select style={{ height: "40px" }}>
                        <Option value="pdf">PDF</Option>
                        <Option value="excel">Excel</Option>
                        <Option value="csv">CSV</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item name="idioma" label={<span style={{ fontWeight: "500" }}>Idioma</span>}>
                      <Select style={{ height: "40px" }}>
                        <Option value="pt-BR">Português (Brasil)</Option>
                        <Option value="en-US">English (United States)</Option>
                        <Option value="es">Español</Option>
                      </Select>
                    </Form.Item>

                    <Divider />

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loadingConfig}
                        size="large"
                        style={{
                          background: "linear-gradient(45deg, #52c41a, #73d13d)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          height: "48px",
                          boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
                        }}
                      >
                        Salvar Configurações
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              ),
            },
          ]}
        />
      </Spin>
    </div>
  )
}

export default Settings
