// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import {
//   Typography,
//   Table,
//   Card,
//   Input,
//   Button,
//   Space,
//   Spin,
//   Tag,
//   Modal,
//   Form,
//   Descriptions,
//   message,
//   Row,
//   Col,
//   Divider,
// } from "antd"
// import {
//   SearchOutlined,
//   PlusOutlined,
//   DeleteOutlined,
//   EditOutlined,
//   BuildOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   EnvironmentOutlined,
//   CalendarOutlined,
//   FileTextOutlined,
// } from "@ant-design/icons"
// import type { ColumnsType } from "antd/es/table"
// import { type Empresa, type EmpresaDetalhe, empresasService } from "@/services/api"

// const { Title, Text } = Typography

// const EmpresasView: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true)
//   const [empresas, setEmpresas] = useState<Empresa[]>([])
//   const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaDetalhe | null>(null)
//   const [modalVisible, setModalVisible] = useState<boolean>(false)
//   const [modalDetalheVisible, setModalDetalheVisible] = useState<boolean>(false)
//   const [searchText, setSearchText] = useState<string>("")
//   const [form] = Form.useForm()

//   useEffect(() => {
//     carregarEmpresas()
//   }, [])

//   const carregarEmpresas = async () => {
//     try {
//       setLoading(true)
//       const data = await empresasService.listarEmpresas()
//       setEmpresas(data)
//     } catch (error) {
//       console.error("Erro ao carregar empresas:", error)
//       message.error("Erro ao carregar empresas")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const carregarDetalhesEmpresa = async (cnpj: string) => {
//     try {
//       setLoading(true)
//       const data = await empresasService.buscarDetalhesEmpresa(cnpj)
//       setEmpresaSelecionada(data)
//       setModalDetalheVisible(true)
//     } catch (error) {
//       console.error("Erro ao carregar detalhes da empresa:", error)
//       message.error("Erro ao carregar detalhes da empresa")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (values: Empresa) => {
//     try {
//       setLoading(true)
//       await empresasService.cadastrarEmpresa(values)
//       message.success("Empresa cadastrada com sucesso!")
//       form.resetFields()
//       setModalVisible(false)
//       carregarEmpresas()
//     } catch (error) {
//       console.error("Erro ao cadastrar empresa:", error)
//       message.error("Erro ao cadastrar empresa")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (cnpj: string) => {
//     Modal.confirm({
//       title: "Confirmar Exclusão",
//       content: "Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.",
//       okText: "Sim, Excluir",
//       cancelText: "Cancelar",
//       okType: "danger",
//       onOk: async () => {
//         try {
//           setLoading(true)
//           await empresasService.excluirEmpresa(cnpj)
//           message.success("Empresa excluída com sucesso!")
//           carregarEmpresas()
//         } catch (error) {
//           console.error("Erro ao excluir empresa:", error)
//           message.error("Erro ao excluir empresa")
//         } finally {
//           setLoading(false)
//         }
//       },
//     })
//   }

//   const filteredEmpresas = empresas.filter(
//     (empresa) =>
//       empresa.nomeRazaoSocial.toLowerCase().includes(searchText.toLowerCase()) || empresa.cnpj.includes(searchText),
//   )

//   const columns: ColumnsType<Empresa> = [
//     {
//       title: "CNPJ",
//       dataIndex: "cnpj",
//       key: "cnpj",
//       render: (cnpj) => (
//         <Tag
//           color="blue"
//           style={{
//             background: "linear-gradient(45deg, #1890ff, #40a9ff)",
//             border: "none",
//             color: "white",
//             fontWeight: "500",
//             padding: "4px 12px",
//             borderRadius: "6px",
//           }}
//         >
//           {cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
//         </Tag>
//       ),
//       sorter: (a, b) => a.cnpj.localeCompare(b.cnpj),
//     },
//     {
//       title: "Razão Social",
//       dataIndex: "nomeRazaoSocial",
//       key: "nomeRazaoSocial",
//       render: (text) => (
//         <Text strong style={{ color: "#262626" }}>
//           {text}
//         </Text>
//       ),
//       sorter: (a, b) => a.nomeRazaoSocial.localeCompare(b.nomeRazaoSocial),
//     },
//     {
//       title: "Ações",
//       key: "acoes",
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="primary"
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => carregarDetalhesEmpresa(record.cnpj)}
//             style={{
//               background: "linear-gradient(45deg, #1890ff, #40a9ff)",
//               border: "none",
//               borderRadius: "6px",
//             }}
//           >
//             Detalhes
//           </Button>
//           <Button
//             danger
//             size="small"
//             type="primary"
//             icon={<DeleteOutlined />}
//             onClick={() => handleDelete(record.cnpj)}
//             style={{
//               borderRadius: "6px",
//             }}
//           />
//         </Space>
//       ),
//     },
//   ]

//   const cardStyle = {
//     borderRadius: "12px",
//     border: "none",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//   }

//   return (
//     <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
//       {/* Header Section */}
//       <div style={{ marginBottom: "32px" }}>
//         <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
//           <div
//             style={{
//               width: "4px",
//               height: "32px",
//               background: "linear-gradient(45deg, #1890ff, #fa8c16)",
//               borderRadius: "2px",
//               marginRight: "16px",
//             }}
//           />
//           <BuildOutlined
//             style={{
//               fontSize: "24px",
//               color: "#1890ff",
//               marginRight: "12px",
//             }}
//           />
//           <Title level={2} style={{ margin: 0, color: "#262626" }}>
//             Cadastro de Empresas
//           </Title>
//         </div>
//         <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
//           Gerencie as empresas cadastradas no sistema CashFisco
//         </Text>
//       </div>

//       {/* Main Card */}
//       <Card style={cardStyle}>
//         {/* Search and Actions Bar */}
//         <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
//           <Col xs={24} sm={12} md={8}>
//             <Input
//               placeholder="Buscar por CNPJ ou Razão Social"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
//               allowClear
//               style={{
//                 borderRadius: "8px",
//                 border: "2px solid #f0f0f0",
//                 transition: "all 0.3s",
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = "#1890ff"
//                 e.target.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)"
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "#f0f0f0"
//                 e.target.style.boxShadow = "none"
//               }}
//             />
//           </Col>
//           <Col>
//             <Button
//               type="primary"
//               size="large"
//               icon={<PlusOutlined />}
//               onClick={() => setModalVisible(true)}
//               style={{
//                 background: "linear-gradient(45deg, #fa8c16, #ffa940)",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontWeight: "600",
//                 height: "40px",
//                 boxShadow: "0 4px 12px rgba(250, 140, 22, 0.3)",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-2px)"
//                 e.currentTarget.style.boxShadow = "0 6px 16px rgba(250, 140, 22, 0.4)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)"
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(250, 140, 22, 0.3)"
//               }}
//             >
//               Nova Empresa
//             </Button>
//           </Col>
//         </Row>

//         {/* Table */}
//         <Spin spinning={loading}>
//           <Table
//             dataSource={filteredEmpresas}
//             columns={columns}
//             rowKey="id"
//             pagination={{
//               pageSize: 10,
//               showSizeChanger: true,
//               pageSizeOptions: ["10", "20", "50"],
//               showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} empresas`,
//             }}
//             style={{
//               ".ant-table-thead > tr > th": {
//                 background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
//                 fontWeight: "600",
//               },
//             }}
//           />
//         </Spin>
//       </Card>

//       {/* Modal de Cadastro */}
//       <Modal
//         title={
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <div
//               style={{
//                 width: "32px",
//                 height: "32px",
//                 borderRadius: "50%",
//                 background: "linear-gradient(45deg, #fa8c16, #ffa940)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginRight: "12px",
//               }}
//             >
//               <PlusOutlined style={{ color: "white", fontSize: "16px" }} />
//             </div>
//             <span style={{ fontSize: "18px", fontWeight: "600" }}>Cadastrar Nova Empresa</span>
//           </div>
//         }
//         open={modalVisible}
//         onCancel={() => {
//           form.resetFields()
//           setModalVisible(false)
//         }}
//         footer={null}
//         destroyOnClose
//         width={600}
//         style={{ borderRadius: "12px" }}
//       >
//         <Divider style={{ margin: "16px 0 24px 0" }} />

//         <Form<Empresa> form={form} layout="vertical" onFinish={handleSubmit}>
//           <Row gutter={16}>
//             <Col span={24}>
//               <Form.Item
//                 name="cnpj"
//                 label={<span style={{ fontWeight: "500" }}>CNPJ</span>}
//                 rules={[
//                   { required: true, message: "Por favor, informe o CNPJ" },
//                   {
//                     pattern: /^\d{14}$/,
//                     message: "CNPJ deve conter exatamente 14 dígitos",
//                   },
//                 ]}
//               >
//                 <Input
//                   placeholder="Digite o CNPJ (apenas números)"
//                   maxLength={14}
//                   style={{ borderRadius: "8px", height: "40px" }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             name="nomeRazaoSocial"
//             label={<span style={{ fontWeight: "500" }}>Razão Social</span>}
//             rules={[
//               { required: true, message: "Por favor, informe a Razão Social" },
//               {
//                 min: 5,
//                 message: "Razão Social deve ter pelo menos 5 caracteres",
//               },
//             ]}
//           >
//             <Input placeholder="Digite a Razão Social" style={{ borderRadius: "8px", height: "40px" }} />
//           </Form.Item>

//           <Form.Item
//             name="endereco"
//             label={<span style={{ fontWeight: "500" }}>Endereço</span>}
//             rules={[
//               {
//                 min: 10,
//                 message: "Endereço deve ter pelo menos 10 caracteres",
//               },
//             ]}
//           >
//             <Input.TextArea placeholder="Digite o endereço completo" rows={3} style={{ borderRadius: "8px" }} />
//           </Form.Item>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="contatoEmail"
//                 label={<span style={{ fontWeight: "500" }}>E-mail de Contato</span>}
//                 rules={[{ type: "email", message: "Por favor, informe um e-mail válido" }]}
//               >
//                 <Input placeholder="Digite o e-mail de contato" style={{ borderRadius: "8px", height: "40px" }} />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="contatoTelefone"
//                 label={<span style={{ fontWeight: "500" }}>Telefone de Contato</span>}
//                 rules={[
//                   {
//                     pattern: /^$$\d{2}$$ \d{4,5}-\d{4}$/,
//                     message: "Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX",
//                   },
//                 ]}
//               >
//                 <Input placeholder="Digite o telefone (XX) XXXX-XXXX" style={{ borderRadius: "8px", height: "40px" }} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item style={{ marginTop: "32px", textAlign: "right" }}>
//             <Space size="middle">
//               <Button
//                 size="large"
//                 onClick={() => {
//                   form.resetFields()
//                   setModalVisible(false)
//                 }}
//                 style={{ borderRadius: "8px" }}
//               >
//                 Cancelar
//               </Button>
//               <Button
//                 type="primary"
//                 size="large"
//                 htmlType="submit"
//                 loading={loading}
//                 style={{
//                   background: "linear-gradient(45deg, #1890ff, #40a9ff)",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontWeight: "600",
//                 }}
//               >
//                 Cadastrar Empresa
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal de Detalhes */}
//       <Modal
//         title={
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <div
//               style={{
//                 width: "32px",
//                 height: "32px",
//                 borderRadius: "50%",
//                 background: "linear-gradient(45deg, #1890ff, #40a9ff)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginRight: "12px",
//               }}
//             >
//               <BuildOutlined style={{ color: "white", fontSize: "16px" }} />
//             </div>
//             <span style={{ fontSize: "18px", fontWeight: "600" }}>Detalhes da Empresa</span>
//           </div>
//         }
//         open={modalDetalheVisible}
//         onCancel={() => setModalDetalheVisible(false)}
//         footer={null}
//         width={800}
//         style={{ borderRadius: "12px" }}
//       >
//         {empresaSelecionada && (
//           <>
//             <Divider style={{ margin: "16px 0 24px 0" }} />
//             <Descriptions
//               bordered
//               column={1}
//               labelStyle={{
//                 fontWeight: "600",
//                 background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
//                 width: "200px",
//               }}
//               contentStyle={{ background: "#fafafa" }}
//             >
//               <Descriptions.Item
//                 label={
//                   <span>
//                     <BuildOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
//                     CNPJ
//                   </span>
//                 }
//               >
//                 <Tag
//                   color="blue"
//                   style={{
//                     background: "linear-gradient(45deg, #1890ff, #40a9ff)",
//                     border: "none",
//                     color: "white",
//                     fontWeight: "500",
//                     padding: "4px 12px",
//                     borderRadius: "6px",
//                   }}
//                 >
//                   {empresaSelecionada.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
//                 </Tag>
//               </Descriptions.Item>

//               <Descriptions.Item
//                 label={
//                   <span>
//                     <BuildOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
//                     Razão Social
//                   </span>
//                 }
//               >
//                 <Text strong>{empresaSelecionada.nomeRazaoSocial}</Text>
//               </Descriptions.Item>

//               <Descriptions.Item
//                 label={
//                   <span>
//                     <EnvironmentOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
//                     Endereço
//                   </span>
//                 }
//               >
//                 {empresaSelecionada.endereco || "-"}
//               </Descriptions.Item>

//               <Descriptions.Item
//                 label={
//                   <span>
//                     <MailOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
//                     E-mail de Contato
//                   </span>
//                 }
//               >
//                 {empresaSelecionada.contatoEmail || "-"}
//               </Descriptions.Item>

//               <Descriptions.Item
//                 label={
//                   <span>
//                     <PhoneOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
//                     Telefone de Contato
//                   </span>
//                 }
//               >
//                 {empresaSelecionada.contatoTelefone || "-"}
//               </Descriptions.Item>

//               <Descriptions.Item
//                 label={
//                   <span>
//                     <CalendarOutlined style={{ color: "#722ed1", marginRight: "8px" }} />
//                     Cadastrado em
//                   </span>
//                 }
//               >
//                 {empresaSelecionada.criadoEm ? new Date(empresaSelecionada.criadoEm).toLocaleString("pt-BR") : "-"}
//               </Descriptions.Item>

//               <Descriptions.Item
//                 label={
//                   <span>
//                     <FileTextOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
//                     Total de Notas
//                   </span>
//                 }
//               >
//                 <Tag
//                   color="green"
//                   style={{
//                     background: "linear-gradient(45deg, #52c41a, #73d13d)",
//                     border: "none",
//                     color: "white",
//                     fontWeight: "500",
//                     padding: "4px 12px",
//                     borderRadius: "6px",
//                   }}
//                 >
//                   {empresaSelecionada.notas.length} notas
//                 </Tag>
//               </Descriptions.Item>
//             </Descriptions>
//           </>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default EmpresasView
