
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
//       form.resetFields(); // Esta linha já é suficiente para limpar o formulário
//     } else if (key === "2" && logs.length === 0) {
//       handleSearchLogs();
//     }
//   }

//   // useEffect(() => {
//   //   if (perfil && perfil.toUpperCase() !== "GERENTE") {
//   //     message.error("Acesso negado. Apenas gerentes podem acessar o painel administrativo.")
//   //   } else if (perfil) {
//   //       // Carrega os logs na primeira vez que a aba de auditoria é acessada (ou ao carregar a página)
//   //       handleSearchLogs();
//   //   }
//   // }, [perfil])

//   useEffect(() => {
//     if (!perfil) return;

//     const perfilUpper = perfil.toUpperCase();

//     if (perfilUpper !== "GERENTE" && perfilUpper !== "ADMIN") {
//       message.error("Acesso negado. Apenas gerentes ou administradores podem acessar o painel administrativo.");
//       return;
//     }

//     // Somente GERENTE pode carregar os dados
//     if (perfilUpper === "GERENTE") {
//       handleSearchLogs();
//     }
//   }, [perfil]);



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

//   const handleSearchLogs = async (perfil?: string) => {
//     setLoadingLogs(true)
//     try {
//       const fetchedLogs = await auditLogService.getLogsDoMeuTime(filters)

//       let filteredLogs = fetchedLogs

//       if (perfil?.toUpperCase() === "ADMIN") {
//         filteredLogs = fetchedLogs.filter((log: any) => log.inseridoPor === "ADMIN")
//       }

//       setLogs(filteredLogs)

//       if (filteredLogs.length === 0 && (filters.usuarioEmail || filters.cnpj)) {
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
//       defaultSortOrder: 'descend',
//       width: 200,
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
//                     {/* CORREÇÃO: Adicionado autoComplete="off" */}
//                     <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: "Informe o nome" }]}>
//                       <Input placeholder="Digite o nome completo" prefix={<UserOutlined />} autoComplete="off" />
//                     </Form.Item>

//                     {/* CORREÇÃO: Adicionado autoComplete="off" */}
//                     <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Informe o e-mail" }, { type: 'email', message: 'E-mail inválido' }]}>
//                       <Input placeholder="Digite o e-mail" prefix={<MailOutlined />} autoComplete="off" />
//                     </Form.Item>

//                     {/* CORREÇÃO: Adicionado autoComplete="new-password" */}
//                     <Form.Item name="senha" label="Senha Inicial" rules={[{ required: true, message: "Informe a senha" }, { min: 6, message: 'Mínimo 6 caracteres' }]}>
//                       <Input.Password placeholder="Digite a senha inicial" prefix={<LockOutlined />} autoComplete="new-password" />
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
//                   <Form layout="inline" onFinish={handleSearchLogs}>
//                     <Form.Item label="E-mail do Usuário" style={{ flexGrow: 1 }}>
//                       <Input
//                         name="usuarioEmail"
//                         placeholder="Filtrar por e-mail"
//                         value={filters.usuarioEmail}
//                         onChange={handleFilterChange}
//                         prefix={<MailOutlined />}
//                       />
//                     </Form.Item>
//                     <Form.Item label="CNPJ da Empresa" style={{ flexGrow: 1 }}>
//                       <Input
//                         name="cnpj"
//                         placeholder="Filtrar por CNPJ"
//                         value={filters.cnpj}
//                         onChange={handleFilterChange}
//                         prefix={<UserOutlined />}
//                       />
//                     </Form.Item>
//                     <Form.Item>
//                       <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loadingLogs}>
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

// export default PaginaAdmin;

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Typography, Card, Form, Input, Button, message, Space, Divider, Alert, Spin, Tabs, Table, Tag, Modal, Popconfirm
} from "antd"
import {
  UserAddOutlined, SaveOutlined, UserOutlined, MailOutlined, LockOutlined, SettingOutlined, HistoryOutlined, SearchOutlined, SafetyCertificateOutlined,
  TeamOutlined, EditOutlined, DeleteOutlined, KeyOutlined
} from "@ant-design/icons"
import { useAuth } from "@/contexts/AuthContext"
import { usuariosService, type Operador, type OperadorData } from "@/services/api" // Verifique se os tipos estão exportados no seu serviço
import { auditLogService, type AuditLog } from "@/services/api"
import type { ColumnsType } from "antd/es/table"

const { Title, Text } = Typography

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
  const [cadastroForm] = Form.useForm<OperadorData>()
  const [editForm] = Form.useForm<Omit<OperadorData, 'senha'>>()
  const [passwordForm] = Form.useForm()

  // States
  const [loadingCadastro, setLoadingCadastro] = useState(false)
  const [apiAlert, setApiAlert] = useState<ApiAlert | null>(null)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [logFilters, setLogFilters] = useState<AuditLogFilters>({})
  const [operadores, setOperadores] = useState<Operador[]>([])
  const [loadingOperadores, setLoadingOperadores] = useState(false)
  const [editingOperador, setEditingOperador] = useState<Operador | null>(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)

  useEffect(() => {
    if (perfil && perfil.toUpperCase() !== "GERENTE") {
      message.error("Acesso negado. Apenas gerentes podem acessar o painel administrativo.")
    }
  }, [perfil])


  // --- FUNÇÕES DE GERENCIAMENTO DE OPERADORES ---

  const fetchOperadores = async () => {
    setLoadingOperadores(true)
    try {
      const data = await usuariosService.listarOperadores()
      setOperadores(data)
    } catch (error: any) {
      message.error(error.response?.data?.message || "Falha ao carregar operadores.")
    } finally {
      setLoadingOperadores(false)
    }
  }

  const handleShowEditModal = (operador: Operador) => {
    setEditingOperador(operador)
    editForm.setFieldsValue({ nome: operador.nome, email: operador.email })
    setIsEditModalVisible(true)
  }

  const handleShowPasswordModal = (operador: Operador) => {
    setEditingOperador(operador)
    setIsPasswordModalVisible(true)
  }

  const handleUpdateOperador = async (values: Omit<OperadorData, 'senha'>) => {
    if (!editingOperador) return
    setLoadingOperadores(true)
    try {
      await usuariosService.atualizarOperador(editingOperador.id, values)
      message.success("Operador atualizado com sucesso!")
      setIsEditModalVisible(false)
      setEditingOperador(null)
      fetchOperadores() // Recarrega a lista
    } catch (error: any) {
      message.error(error.response?.data?.message || "Falha ao atualizar operador.")
    } finally {
      setLoadingOperadores(false)
    }
  }

  const handleUpdateSenha = async (values: { senha_nova: string }) => {
    if (!editingOperador) return
    setLoadingOperadores(true)
    try {
      // AJUSTE: O payload agora é um objeto para ser compatível com o DTO do back-end.
      const payload = { novaSenha: values.senha_nova }
      await usuariosService.trocarSenhaOperador(editingOperador.id, payload)
      message.success("Senha do operador alterada com sucesso!")
      setIsPasswordModalVisible(false)
      passwordForm.resetFields()
    } catch (error: any) {
      message.error(error.response?.data?.message || "Falha ao alterar senha.")
    } finally {
      setLoadingOperadores(false)
    }
  }

  const handleDeleteOperador = async (id: number) => {
    setLoadingOperadores(true)
    try {
      await usuariosService.excluirOperador(id)
      message.success("Operador excluído com sucesso!")
      fetchOperadores() // Recarrega a lista
    } catch (error: any) {
      message.error(error.response?.data?.message || "Falha ao excluir operador.")
    } finally {
      setLoadingOperadores(false)
    }
  }

  // --- FUNÇÕES DAS OUTRAS ABAS ---

  const handleTabChange = (key: string) => {
    if (key === "1") {
      cadastroForm.resetFields()
      setApiAlert(null)
    } else if (key === "2" && operadores.length === 0) {
      fetchOperadores() // Busca operadores ao entrar na aba
    } else if (key === "3" && logs.length === 0) {
      handleSearchLogs()
    }
  }

  const handleSubmitCadastro = async (values: OperadorData) => {
    setApiAlert(null)
    setLoadingCadastro(true)
    try {
      await usuariosService.cadastrarUsuario(values)
      message.success("Operador cadastrado com sucesso!")
      cadastroForm.resetFields()
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

  const handleSearchLogs = async () => {
    setLoadingLogs(true)
    try {
      const fetchedLogs = await auditLogService.getLogsDoMeuTime(logFilters)
      setLogs(fetchedLogs)
      if (fetchedLogs.length === 0 && (logFilters.usuarioEmail || logFilters.cnpj)) {
        message.info("Nenhum registro encontrado para os filtros aplicados.")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Erro ao buscar logs de auditoria."
      message.error(errorMessage)
    } finally {
      setLoadingLogs(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // --- COLUNAS DAS TABELAS ---

  const operadoresColumns: ColumnsType<Operador> = [
    {
      title: 'Nome', dataIndex: 'nome', key: 'nome', sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (text) => <><UserOutlined style={{ marginRight: 6 }} />{text}</>,
    },
    {
      title: 'E-mail', dataIndex: 'email', key: 'email',
      render: (text) => <><MailOutlined style={{ marginRight: 6 }} />{text}</>,
    },
    {
      title: 'Ações', key: 'actions', align: 'center', width: 150,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleShowEditModal(record)} title="Editar" />
          <Button type="text" icon={<KeyOutlined />} onClick={() => handleShowPasswordModal(record)} title="Alterar Senha" />
          <Popconfirm
            title="Excluir Operador"
            description="Tem certeza que deseja excluir este operador?"
            onConfirm={() => handleDeleteOperador(record.id)}
            okText="Sim, Excluir" cancelText="Cancelar"
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Excluir" />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const logColumns: ColumnsType<AuditLog> = [
    {
      title: 'Data e Hora', dataIndex: 'criadoEm', key: 'criadoEm', width: 200, defaultSortOrder: 'descend',
      render: (text) => new Date(text).toLocaleString('pt-BR'),
      sorter: (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
    },
    { title: 'Usuário', dataIndex: 'usuario', key: 'usuario', render: (text) => <><UserOutlined style={{ marginRight: 6 }} />{text}</> },
    { title: 'Operação', dataIndex: 'operacao', key: 'operacao', render: (text) => <Tag color="blue" icon={<SafetyCertificateOutlined />}>{text}</Tag> },
    { title: 'Detalhes', dataIndex: 'detalhes', key: 'detalhes', ellipsis: true },
  ]

  // --- RENDERIZAÇÃO ---

  if (!perfil || perfil.toUpperCase() !== "GERENTE") {
    return (
      <div style={{ padding: "24px", background: "#f5f5f5" }}>
        <Alert message="Acesso Negado" description="Você não tem permissão para acessar esta página." type="error" showIcon />
      </div>
    )
  }

  const cardStyle = { borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }

  const tabsItems = [
    {
      key: "1",
      label: <span><UserAddOutlined />Cadastrar Operador</span>,
      children: (
        <>
          <div style={{ padding: '16px 0' }}><Title level={4}>Dados do Novo Operador</Title><Text type="secondary">Preencha os dados para criar um novo usuário.</Text></div>
          <Spin spinning={loadingCadastro}>
            {apiAlert && <Alert message={apiAlert.message} description={apiAlert.description} type={apiAlert.type} showIcon closable onClose={() => setApiAlert(null)} style={{ marginBottom: '24px' }} />}
            <Form form={cadastroForm} layout="vertical" onFinish={handleSubmitCadastro}>
              <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: "Informe o nome" }]}><Input placeholder="Digite o nome completo" prefix={<UserOutlined />} autoComplete="off" /></Form.Item>
              <Form.Item name="email" label="E-mail" rules={[{ required: true, message: "Informe o e-mail" }, { type: 'email', message: 'E-mail inválido' }]}><Input placeholder="Digite o e-mail" prefix={<MailOutlined />} autoComplete="off" /></Form.Item>
              <Form.Item name="senha" label="Senha Inicial" rules={[{ required: true, message: "Informe a senha" }, { min: 6, message: 'Mínimo 6 caracteres' }]}><Input.Password placeholder="Digite a senha inicial" prefix={<LockOutlined />} autoComplete="new-password" /></Form.Item>
              <Divider />
              <Form.Item style={{ textAlign: "right", marginBottom: 0 }}><Space><Button onClick={() => cadastroForm.resetFields()}>Limpar</Button><Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loadingCadastro}>Cadastrar Operador</Button></Space></Form.Item>
            </Form>
          </Spin>
        </>
      )
    },
    {
      key: "2",
      label: <span><TeamOutlined />Gerenciar Operadores</span>,
      children: (
        <>
          <div style={{ padding: '16px 0' }}><Title level={4}>Operadores Cadastrados</Title><Text type="secondary">Visualize, edite ou remova operadores do seu time.</Text></div>
          <Spin spinning={loadingOperadores}><Table columns={operadoresColumns} dataSource={operadores} rowKey="id" size="middle" /></Spin>
        </>
      ),
    },
    {
      key: "3",
      label: <span><HistoryOutlined />Log de Auditoria</span>,
      children: (
        <>
          <div style={{ padding: '16px 0' }}><Title level={4}>Registros de Atividade</Title><Text type="secondary">Filtre e visualize as ações realizadas por seu time.</Text></div>
          <Card bordered={false} style={{ background: '#fafafa', marginBottom: 24 }}>
            <Form layout="inline" onFinish={() => handleSearchLogs()}><Form.Item label="E-mail do Usuário" style={{ flexGrow: 1 }}><Input name="usuarioEmail" placeholder="Filtrar por e-mail" value={logFilters.usuarioEmail} onChange={handleFilterChange} prefix={<MailOutlined />} /></Form.Item><Form.Item label="CNPJ da Empresa" style={{ flexGrow: 1 }}><Input name="cnpj" placeholder="Filtrar por CNPJ" value={logFilters.cnpj} onChange={handleFilterChange} prefix={<UserOutlined />} /></Form.Item><Form.Item><Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loadingLogs}>Buscar</Button></Form.Item></Form>
          </Card>
          <Spin spinning={loadingLogs}><Table columns={logColumns} dataSource={logs} rowKey="id" size="middle" /></Spin>
        </>
      )
    }
  ]

  return (
    <div style={{ padding: "24px", background: "#f5f5f5" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}><div style={{ width: "4px", height: "32px", background: "linear-gradient(45deg, #1890ff, #fa8c16)", borderRadius: "2px", marginRight: "16px" }} /><SettingOutlined style={{ fontSize: "24px", color: "#1890ff", marginRight: "12px" }} /><Title level={2} style={{ margin: 0, color: "#262626" }}>Painel Administrativo</Title></div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>Gerencie operadores e audite as atividades do sistema.</Text>
      </div>

      <Card style={cardStyle}><Tabs defaultActiveKey="1" onChange={handleTabChange} items={tabsItems} /></Card>
      
      {/* --- MODAIS DE GERENCIAMENTO --- */}
      <Modal title="Editar Operador" open={isEditModalVisible} onCancel={() => setIsEditModalVisible(false)} footer={null} destroyOnClose>
        <Spin spinning={loadingOperadores}>
          <Form form={editForm} layout="vertical" onFinish={handleUpdateOperador} style={{ marginTop: 24 }}>
            <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: 'Informe o nome' }]}><Input prefix={<UserOutlined />} /></Form.Item>
            <Form.Item name="email" label="E-mail" rules={[{ required: true, message: 'Informe o e-mail' }, { type: 'email' }]}><Input prefix={<MailOutlined />} /></Form.Item>
            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}><Space><Button onClick={() => setIsEditModalVisible(false)}>Cancelar</Button><Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Salvar Alterações</Button></Space></Form.Item>
          </Form>
        </Spin>
      </Modal>

      <Modal title={`Alterar Senha de ${editingOperador?.nome || 'Operador'}`} open={isPasswordModalVisible} onCancel={() => { setIsPasswordModalVisible(false); passwordForm.resetFields(); }} footer={null} destroyOnClose>
        <Spin spinning={loadingOperadores}>
          <Form form={passwordForm} layout="vertical" onFinish={handleUpdateSenha} style={{ marginTop: 24 }}>
            <Form.Item name="senha_nova" label="Nova Senha" rules={[{ required: true, message: 'Informe a nova senha' }, { min: 6, message: 'A senha deve ter no mínimo 6 caracteres' }]}><Input.Password prefix={<LockOutlined />} placeholder="Digite a nova senha" /></Form.Item>
            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}><Space><Button onClick={() => { setIsPasswordModalVisible(false); passwordForm.resetFields(); }}>Cancelar</Button><Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Alterar Senha</Button></Space></Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default PaginaAdmin;