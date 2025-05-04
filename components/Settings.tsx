"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Typography, Card, Form, Input, Button, Tabs, Switch, Select, Divider, message, Space, Spin } from "antd"
import { SaveOutlined, UserOutlined, BankOutlined, SettingOutlined } from "@ant-design/icons"
import { configuracoesService, type EmpresaData, type UsuarioData, type ConfiguracoesData } from "@/services/api"

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select

const Settings: React.FC = () => {
  const [loadingEmpresa, setLoadingEmpresa] = useState<boolean>(false)
  const [loadingUsuario, setLoadingUsuario] = useState<boolean>(false)
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false)
  const [loadingData, setLoadingData] = useState<boolean>(true)

  const [empresaForm] = Form.useForm<EmpresaData>()
  const [usuarioForm] = Form.useForm<UsuarioData>()
  const [configForm] = Form.useForm<ConfiguracoesData>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)

        // Carregar dados da empresa
        const empresaData = await configuracoesService.getEmpresa()
        empresaForm.setFieldsValue(empresaData)

        // Carregar dados do usuário
        const usuarioData = await configuracoesService.getUsuario()
        usuarioForm.setFieldsValue(usuarioData)

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
  }, [empresaForm, usuarioForm, configForm])

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

  const handleSalvarUsuario = async (values: UsuarioData) => {
    try {
      setLoadingUsuario(true)
      await configuracoesService.salvarUsuario(values)
      message.success("Dados do usuário salvos com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error)
      message.error("Erro ao salvar dados do usuário")
    } finally {
      setLoadingUsuario(false)
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

  return (
    <div>
      <Title level={2}>Configurações</Title>
      <Text type="secondary">Gerencie as configurações do sistema</Text>

      <Spin spinning={loadingData}>
        <Tabs defaultActiveKey="empresa" style={{ marginTop: 16 }}>
          <TabPane
            tab={
              <span>
                <BankOutlined /> Dados da Empresa
              </span>
            }
            key="empresa"
          >
            <Card>
              <Form form={empresaForm} layout="vertical" onFinish={handleSalvarEmpresa}>
                <Form.Item
                  name="razaoSocial"
                  label="Razão Social"
                  rules={[{ required: true, message: "Por favor, informe a razão social" }]}
                >
                  <Input placeholder="Informe a razão social" />
                </Form.Item>

                <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true, message: "Por favor, informe o CNPJ" }]}>
                  <Input placeholder="XX.XXX.XXX/XXXX-XX" />
                </Form.Item>

                <Form.Item
                  name="endereco"
                  label="Endereço"
                  rules={[{ required: true, message: "Por favor, informe o endereço" }]}
                >
                  <Input placeholder="Informe o endereço" />
                </Form.Item>

                <div style={{ display: "flex", gap: 16 }}>
                  <Form.Item
                    name="cidade"
                    label="Cidade"
                    rules={[{ required: true, message: "Por favor, informe a cidade" }]}
                    style={{ flex: 2 }}
                  >
                    <Input placeholder="Informe a cidade" />
                  </Form.Item>

                  <Form.Item
                    name="estado"
                    label="Estado"
                    rules={[{ required: true, message: "Por favor, informe o estado" }]}
                    style={{ flex: 1 }}
                  >
                    <Select placeholder="Selecione o estado">
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
                    label="CEP"
                    rules={[{ required: true, message: "Por favor, informe o CEP" }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="XXXXX-XXX" />
                  </Form.Item>
                </div>

                <div style={{ display: "flex", gap: 16 }}>
                  <Form.Item
                    name="telefone"
                    label="Telefone"
                    rules={[{ required: true, message: "Por favor, informe o telefone" }]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="(XX) XXXX-XXXX" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                      { required: true, message: "Por favor, informe o e-mail" },
                      { type: "email", message: "Por favor, informe um e-mail válido" },
                    ]}
                    style={{ flex: 2 }}
                  >
                    <Input placeholder="exemplo@empresa.com" />
                  </Form.Item>
                </div>

                <Divider />

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loadingEmpresa}>
                    Salvar Dados da Empresa
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <UserOutlined /> Dados do Usuário
              </span>
            }
            key="usuario"
          >
            <Card>
              <Form form={usuarioForm} layout="vertical" onFinish={handleSalvarUsuario}>
                <Form.Item name="nome" label="Nome" rules={[{ required: true, message: "Por favor, informe o nome" }]}>
                  <Input placeholder="Informe o nome" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    { required: true, message: "Por favor, informe o e-mail" },
                    { type: "email", message: "Por favor, informe um e-mail válido" },
                  ]}
                >
                  <Input placeholder="exemplo@empresa.com" />
                </Form.Item>

                <Form.Item
                  name="cargo"
                  label="Cargo"
                  rules={[{ required: true, message: "Por favor, informe o cargo" }]}
                >
                  <Select placeholder="Selecione o cargo">
                    <Option value="Administrador">Administrador</Option>
                    <Option value="Contador">Contador</Option>
                    <Option value="Analista">Analista</Option>
                    <Option value="Gerente">Gerente</Option>
                  </Select>
                </Form.Item>

                <Divider />

                <Space>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loadingUsuario}>
                    Salvar Dados do Usuário
                  </Button>

                  <Button onClick={() => message.info("Funcionalidade em desenvolvimento")}>Alterar Senha</Button>
                </Space>
              </Form>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined /> Configurações do Sistema
              </span>
            }
            key="configuracoes"
          >
            <Card>
              <Form form={configForm} layout="vertical" onFinish={handleSalvarConfiguracoes}>
                <Form.Item name="notificacoesEmail" label="Receber notificações por e-mail" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item name="temaEscuro" label="Tema escuro" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item name="formatoRelatorio" label="Formato padrão de relatórios">
                  <Select>
                    <Option value="pdf">PDF</Option>
                    <Option value="excel">Excel</Option>
                    <Option value="csv">CSV</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="idioma" label="Idioma">
                  <Select>
                    <Option value="pt-BR">Português (Brasil)</Option>
                    <Option value="en-US">English (United States)</Option>
                    <Option value="es">Español</Option>
                  </Select>
                </Form.Item>

                <Divider />

                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loadingConfig}>
                    Salvar Configurações
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  )
}

export default Settings
