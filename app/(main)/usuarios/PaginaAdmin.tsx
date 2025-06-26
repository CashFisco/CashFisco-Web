
// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import {
//   Typography, Card, Form, Input, Button, message, Space, Divider, Alert, Spin, Tabs, Table, Tag
// } from "antd"
// import {
//   UserAddOutlined, SaveOutlined, UserOutlined, MailOutlined, LockOutlined, SettingOutlined, HistoryOutlined, SearchOutlined, SafetyCertificateOutlined,
// } from "@ant-design/icons"
// import { useAuth } from "@/contexts/AuthContext"
// import { usuariosService } from "@/services/api"
// import { auditLogService, type AuditLog } from "@/services/api"
// import type { ColumnsType } from "antd/es/table"

// const { Title, Text } = Typography

// interface CadastroUsuarioData {
//   nome: string
//   email: string
//   senha: string
// }

// interface ApiAlert {
//   type: "success" | "error"
//   message: string
//   description: string
// }

// interface AuditLogFilters {
//   usuarioEmail?: string
//   cnpj?: string
// }

// const PaginaAdmin: React.FC = () => {
//   const { perfil } = useAuth()
//   const [form] = Form.useForm<CadastroUsuarioData>()

//   const [loadingCadastro, setLoadingCadastro] = useState(false)
//   const [apiAlert, setApiAlert] = useState<ApiAlert | null>(null)

//   const [logs, setLogs] = useState<AuditLog[]>([])
//   const [loadingLogs, setLoadingLogs] = useState(false)
//   const [filters, setFilters] = useState<AuditLogFilters>({})

//   const handleTabChange = (key: string) => {
//     if (key === "1") {
//       form.resetFields();
//       form.setFieldsValue({ nome: "", email: "", senha: "" });
//     } else if (key === "2" && logs.length === 0) {
//       handleSearchLogs();
//     }
//   }


//   useEffect(() => {
//     if (perfil && perfil.toUpperCase() !== "GERENTE") {
//       message.error("Acesso negado. Apenas gerentes podem acessar o painel administrativo.")
//     }
//   }, [perfil])

//   const handleSubmitCadastro = async (values: CadastroUsuarioData) => {
//     setApiAlert(null)
//     setLoadingCadastro(true)
//     try {
//       const payload = { ...values, perfil: "OPERADOR" as const }
//       await usuariosService.cadastrarUsuario(payload)
//       message.success("Operador cadastrado com sucesso!")
//       form.resetFields()
//       setApiAlert({
//         type: "success",
//         message: "Operador Cadastrado com Sucesso!",
//         description: `O usuário ${values.nome} foi criado e já pode acessar o sistema.`,
//       })
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || "Erro desconhecido ao cadastrar operador."
//       message.error(errorMessage)
//       setApiAlert({
//         type: "error",
//         message: "Falha no Cadastro",
//         description: errorMessage,
//       })
//     } finally {
//       setLoadingCadastro(false)
//     }
//   }

//   const handleSearchLogs = async () => {
//     setLoadingLogs(true)
//     try {
//       const fetchedLogs = await auditLogService.getLogsDoMeuTime(filters)
//       setLogs(fetchedLogs)
//       if (fetchedLogs.length === 0) {
//         message.info("Nenhum registro encontrado para os filtros aplicados.")
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || "Erro ao buscar logs de auditoria."
//       message.error(errorMessage)
//     } finally {
//       setLoadingLogs(false)
//     }
//   }

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   const logColumns: ColumnsType<AuditLog> = [
//     {
//       title: 'Data e Hora',
//       dataIndex: 'criadoEm',
//       key: 'criadoEm',
//       render: (text: string) => new Date(text).toLocaleString('pt-BR'),
//       sorter: (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
//       width: 180,
//     },
//     {
//       title: 'Usuário',
//       dataIndex: 'usuario',
//       key: 'usuario',
//       render: (text: string) => <><UserOutlined style={{ marginRight: 6 }} /> {text}</>,
//     },
//     {
//       title: 'Operação',
//       dataIndex: 'operacao',
//       key: 'operacao',
//       render: (text: string) => <Tag color="blue" icon={<SafetyCertificateOutlined />}>{text}</Tag>,
//     },
//     {
//       title: 'Detalhes',
//       dataIndex: 'detalhes',
//       key: 'detalhes',
//       ellipsis: true,
//     },
//   ]

//   if (!perfil || perfil.toUpperCase() !== "GERENTE") {
//     return (
//       <div style={{ padding: "24px", background: "#f5f5f5" }}>
//         <Alert
//           message="Acesso Negado"
//           description="Você não tem permissão para acessar esta página."
//           type="error"
//           showIcon
//         />
//       </div>
//     )
//   }

//   const cardStyle = {
//     borderRadius: "12px",
//     border: "none",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//   }

//   return (
//     <div style={{ padding: "24px", background: "#f5f5f5" }}>
//       <div style={{ marginBottom: "32px" }}>
//         <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
//           <div style={{ width: "4px", height: "32px", background: "linear-gradient(45deg, #1890ff, #fa8c16)", borderRadius: "2px", marginRight: "16px" }} />
//           <SettingOutlined style={{ fontSize: "24px", color: "#1890ff", marginRight: "12px" }} />
//           <Title level={2} style={{ margin: 0, color: "#262626" }}>Painel Administrativo</Title>
//         </div>
//         <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
//           Gerencie operadores e audite as atividades do sistema.
//         </Text>
//       </div>

//       <Card style={cardStyle}>
//         <Tabs defaultActiveKey="1" onChange={handleTabChange} items={[
//           {
//             key: "1",
//             label: <span><UserAddOutlined />Cadastrar Operador</span>,
//             children: (
//               <>
//                 <div style={{ padding: '16px 0' }}>
//                   <Title level={4}>Dados do Novo Operador</Title>
//                   <Text type="secondary">Preencha os dados para criar um novo usuário.</Text>
//                 </div>

//                 <Spin spinning={loadingCadastro}>
//                   {apiAlert && (
//                     <Alert
//                       message={apiAlert.message}
//                       description={apiAlert.description}
//                       type={apiAlert.type}
//                       showIcon
//                       closable
//                       onClose={() => setApiAlert(null)}
//                       style={{ marginBottom: '24px' }}
//                     />
//                   )}
//                   <Form form={form} layout="vertical" onFinish={handleSubmitCadastro}>
//                     <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: "Informe o nome" }]}>
//                       <Input placeholder="Digite o nome completo" prefix={<UserOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Informe o e-mail" }, { type: 'email', message: 'E-mail inválido' }]}>
//                       <Input placeholder="Digite o e-mail" prefix={<MailOutlined />} />
//                     </Form.Item>
//                     <Form.Item name="senha" label="Senha Inicial" rules={[{ required: true, message: "Informe a senha" }, { min: 6, message: 'Mínimo 6 caracteres' }]}>
//                       <Input.Password placeholder="Digite a senha inicial" prefix={<LockOutlined />} />
//                     </Form.Item>
//                     <Divider />
//                     <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
//                       <Space>
//                         <Button onClick={() => form.resetFields()}>Limpar</Button>
//                         <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loadingCadastro}>
//                           Cadastrar Operador
//                         </Button>
//                       </Space>
//                     </Form.Item>
//                   </Form>
//                 </Spin>
//               </>
//             )
//           },
//           {
//             key: "2",
//             label: <span><HistoryOutlined />Log de Auditoria</span>,
//             children: (
//               <>
//                 <div style={{ padding: '16px 0' }}>
//                   <Title level={4}>Registros de Atividade</Title>
//                   <Text type="secondary">Filtre e visualize as ações realizadas por seu time.</Text>
//                 </div>

//                 <Card bordered={false} style={{ background: '#fafafa', marginBottom: 24 }}>
//                   <Form layout="inline">
//                     <Form.Item label="E-mail do Usuário">
//                       <Input
//                         name="usuarioEmail"
//                         placeholder="Filtrar por e-mail"
//                         value={filters.usuarioEmail}
//                         onChange={handleFilterChange}
//                         prefix={<MailOutlined />}
//                       />
//                     </Form.Item>
//                     <Form.Item label="CNPJ da Empresa">
//                       <Input
//                         name="cnpj"
//                         placeholder="Filtrar por CNPJ"
//                         value={filters.cnpj}
//                         onChange={handleFilterChange}
//                         prefix={<UserOutlined />}
//                       />
//                     </Form.Item>
//                     <Form.Item>
//                       <Button
//                         type="primary"
//                         onClick={handleSearchLogs}
//                         icon={<SearchOutlined />}
//                         loading={loadingLogs}
//                       >
//                         Buscar
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </Card>

//                 <Spin spinning={loadingLogs}>
//                   <Table
//                     columns={logColumns}
//                     dataSource={logs}
//                     rowKey="id"
//                     size="middle"
//                   />
//                 </Spin>
//               </>
//             )
//           }
//         ]} />
//       </Card>
//     </div>
//   )
// }

// export default PaginaAdmin


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Typography, Card, Form, Input, Button, message, Space, Divider, Alert, Spin, Tabs, Table, Tag
} from "antd"
import {
  UserAddOutlined, SaveOutlined, UserOutlined, MailOutlined, LockOutlined, SettingOutlined, HistoryOutlined, SearchOutlined, SafetyCertificateOutlined,
} from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"
import { usuariosService } from "@/services/api"
import { auditLogService, type AuditLog } from "@/services/api"
import type { ColumnsType } from "antd/es/table"

const { Title, Text } = Typography

interface CadastroUsuarioData {
  nome: string
  email: string
  senha: string
}

interface ApiAlert {
  type: "success" | "error"
  message: string
  description: string
}

interface AuditLogFilters {
  usuarioEmail?: string
  cnpj?: string
}

const PaginaAdmin: React.FC = () => {
  const { perfil } = useAuth()
  const [form] = Form.useForm<CadastroUsuarioData>()

  const [loadingCadastro, setLoadingCadastro] = useState(false)
  const [apiAlert, setApiAlert] = useState<ApiAlert | null>(null)

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [filters, setFilters] = useState<AuditLogFilters>({})

  const handleTabChange = (key: string) => {
    if (key === "1") {
      form.resetFields(); // Esta linha já é suficiente para limpar o formulário
    } else if (key === "2" && logs.length === 0) {
      handleSearchLogs();
    }
  }

  // useEffect(() => {
  //   if (perfil && perfil.toUpperCase() !== "GERENTE") {
  //     message.error("Acesso negado. Apenas gerentes podem acessar o painel administrativo.")
  //   } else if (perfil) {
  //       // Carrega os logs na primeira vez que a aba de auditoria é acessada (ou ao carregar a página)
  //       handleSearchLogs();
  //   }
  // }, [perfil])

  useEffect(() => {
    if (!perfil) return;

    const perfilUpper = perfil.toUpperCase();

    if (perfilUpper !== "GERENTE" && perfilUpper !== "ADMIN") {
      message.error("Acesso negado. Apenas gerentes ou administradores podem acessar o painel administrativo.");
      return;
    }

    // Somente GERENTE pode carregar os dados
    if (perfilUpper === "GERENTE") {
      handleSearchLogs();
    }
  }, [perfil]);



  const handleSubmitCadastro = async (values: CadastroUsuarioData) => {
    setApiAlert(null)
    setLoadingCadastro(true)
    try {
      const payload = { ...values, perfil: "OPERADOR" as const }
      await usuariosService.cadastrarUsuario(payload)
      message.success("Operador cadastrado com sucesso!")
      form.resetFields()
      setApiAlert({
        type: "success",
        message: "Operador Cadastrado com Sucesso!",
        description: `O usuário ${values.nome} foi criado e já pode acessar o sistema.`,
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro desconhecido ao cadastrar operador."
      message.error(errorMessage)
      setApiAlert({
        type: "error",
        message: "Falha no Cadastro",
        description: errorMessage,
      })
    } finally {
      setLoadingCadastro(false)
    }
  }

  const handleSearchLogs = async (perfil?: string) => {
    setLoadingLogs(true)
    try {
      const fetchedLogs = await auditLogService.getLogsDoMeuTime(filters)

      let filteredLogs = fetchedLogs

      if (perfil?.toUpperCase() === "ADMIN") {
        filteredLogs = fetchedLogs.filter((log: any) => log.inseridoPor === "ADMIN")
      }

      setLogs(filteredLogs)

      if (filteredLogs.length === 0 && (filters.usuarioEmail || filters.cnpj)) {
        message.info("Nenhum registro encontrado para os filtros aplicados.")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao buscar logs de auditoria."
      message.error(errorMessage)
    } finally {
      setLoadingLogs(false)
    }
  }


  // const handleSearchLogs = async () => {
  //   setLoadingLogs(true)
  //   try {
  //     const fetchedLogs = await auditLogService.getLogsDoMeuTime(filters)
  //     setLogs(fetchedLogs)
  //     if (fetchedLogs.length === 0 && (filters.usuarioEmail || filters.cnpj)) {
  //       message.info("Nenhum registro encontrado para os filtros aplicados.")
  //     }
  //   } catch (error: any) {
  //     const errorMessage = error.response?.data?.message || "Erro ao buscar logs de auditoria."
  //     message.error(errorMessage)
  //   } finally {
  //     setLoadingLogs(false)
  //   }
  // }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const logColumns: ColumnsType<AuditLog> = [
    {
      title: 'Data e Hora',
      dataIndex: 'criadoEm',
      key: 'criadoEm',
      render: (text: string) => new Date(text).toLocaleString('pt-BR'),
      sorter: (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
      defaultSortOrder: 'descend',
      width: 200,
    },
    {
      title: 'Usuário',
      dataIndex: 'usuario',
      key: 'usuario',
      render: (text: string) => <><UserOutlined style={{ marginRight: 6 }} /> {text}</>,
    },
    {
      title: 'Operação',
      dataIndex: 'operacao',
      key: 'operacao',
      render: (text: string) => <Tag color="blue" icon={<SafetyCertificateOutlined />}>{text}</Tag>,
    },
    {
      title: 'Detalhes',
      dataIndex: 'detalhes',
      key: 'detalhes',
      ellipsis: true,
    },
  ]

  if (!perfil || perfil.toUpperCase() !== "GERENTE") {
    return (
      <div style={{ padding: "24px", background: "#f5f5f5" }}>
        <Alert
          message="Acesso Negado"
          description="Você não tem permissão para acessar esta página."
          type="error"
          showIcon
        />
      </div>
    )
  }

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ width: "4px", height: "32px", background: "linear-gradient(45deg, #1890ff, #fa8c16)", borderRadius: "2px", marginRight: "16px" }} />
          <SettingOutlined style={{ fontSize: "24px", color: "#1890ff", marginRight: "12px" }} />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>Painel Administrativo</Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Gerencie operadores e audite as atividades do sistema.
        </Text>
      </div>

      <Card style={cardStyle}>
        <Tabs defaultActiveKey="1" onChange={handleTabChange} items={[
          {
            key: "1",
            label: <span><UserAddOutlined />Cadastrar Operador</span>,
            children: (
              <>
                <div style={{ padding: '16px 0' }}>
                  <Title level={4}>Dados do Novo Operador</Title>
                  <Text type="secondary">Preencha os dados para criar um novo usuário.</Text>
                </div>

                <Spin spinning={loadingCadastro}>
                  {apiAlert && (
                    <Alert
                      message={apiAlert.message}
                      description={apiAlert.description}
                      type={apiAlert.type}
                      showIcon
                      closable
                      onClose={() => setApiAlert(null)}
                      style={{ marginBottom: '24px' }}
                    />
                  )}
                  <Form form={form} layout="vertical" onFinish={handleSubmitCadastro}>
                    {/* CORREÇÃO: Adicionado autoComplete="off" */}
                    <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: "Informe o nome" }]}>
                      <Input placeholder="Digite o nome completo" prefix={<UserOutlined />} autoComplete="off" />
                    </Form.Item>

                    {/* CORREÇÃO: Adicionado autoComplete="off" */}
                    <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Informe o e-mail" }, { type: 'email', message: 'E-mail inválido' }]}>
                      <Input placeholder="Digite o e-mail" prefix={<MailOutlined />} autoComplete="off" />
                    </Form.Item>

                    {/* CORREÇÃO: Adicionado autoComplete="new-password" */}
                    <Form.Item name="senha" label="Senha Inicial" rules={[{ required: true, message: "Informe a senha" }, { min: 6, message: 'Mínimo 6 caracteres' }]}>
                      <Input.Password placeholder="Digite a senha inicial" prefix={<LockOutlined />} autoComplete="new-password" />
                    </Form.Item>

                    <Divider />

                    <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                      <Space>
                        <Button onClick={() => form.resetFields()}>Limpar</Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loadingCadastro}>
                          Cadastrar Operador
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Spin>
              </>
            )
          },
          {
            key: "2",
            label: <span><HistoryOutlined />Log de Auditoria</span>,
            children: (
              <>
                <div style={{ padding: '16px 0' }}>
                  <Title level={4}>Registros de Atividade</Title>
                  <Text type="secondary">Filtre e visualize as ações realizadas por seu time.</Text>
                </div>

                <Card bordered={false} style={{ background: '#fafafa', marginBottom: 24 }}>
                  <Form layout="inline" onFinish={handleSearchLogs}>
                    <Form.Item label="E-mail do Usuário" style={{ flexGrow: 1 }}>
                      <Input
                        name="usuarioEmail"
                        placeholder="Filtrar por e-mail"
                        value={filters.usuarioEmail}
                        onChange={handleFilterChange}
                        prefix={<MailOutlined />}
                      />
                    </Form.Item>
                    <Form.Item label="CNPJ da Empresa" style={{ flexGrow: 1 }}>
                      <Input
                        name="cnpj"
                        placeholder="Filtrar por CNPJ"
                        value={filters.cnpj}
                        onChange={handleFilterChange}
                        prefix={<UserOutlined />}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loadingLogs}>
                        Buscar
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                <Spin spinning={loadingLogs}>
                  <Table
                    columns={logColumns}
                    dataSource={logs}
                    rowKey="id"
                    size="middle"
                  />
                </Spin>
              </>
            )
          }
        ]} />
      </Card>
    </div>
  )
}

export default PaginaAdmin;