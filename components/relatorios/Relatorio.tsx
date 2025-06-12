// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import {
//   Typography,
//   Card,
//   Tabs,
//   Button,
//   Table,
//   DatePicker,
//   Form,
//   Select,
//   Spin,
//   message,
//   Space,
//   Statistic,
//   Divider,
//   Row,
//   Col,
//   Modal,
//   Input,
// } from "antd"
// import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons"
// import type { ColumnsType } from "antd/es/table"
// import dayjs from "dayjs"
// import { relatoriosService, type Produto, type RelatorioRestituicao, type RelatorioNotaFiscalDTO } from "@/services/api"

// const { Title, Text } = Typography
// const { TabPane } = Tabs
// const { RangePicker } = DatePicker
// const { Option } = Select

// const Reports: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(false)
//   const [produtosData, setProdutosData] = useState<Produto[]>([])
//   const [restituicoesData, setRestituicoesData] = useState<RelatorioRestituicao[]>([])
//   const [novaRestituicaoVisible, setNovaRestituicaoVisible] = useState<boolean>(false)
//   const [periodoRestituicao, setPeriodoRestituicao] = useState<string>("")
//   const [form] = Form.useForm()
//   const [auditoria, setAuditoria] = useState<RelatorioNotaFiscalDTO | null>(null);

//   const handleBuscarPorChave = async (chave: string) => {
//     if (!chave || chave.trim() === '') {
//     message.warning('Por favor, informe a chave da NF-e');
//     return;
//   }

//     setLoading(true);
//     try {
//       const data = await relatoriosService.buscarAuditoriaPorChave(chave);
//       setAuditoria(data);
//       message.success('Auditoria encontrada com sucesso!');
//     } catch (error) {
//       console.error('Erro ao buscar auditoria:', error);
//       setAuditoria(null);
//       message.error('Auditoria não encontrada ou erro na consulta');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadExcel = async () => {
//     if (!auditoria?.chave) return;

//     try {
//       setLoading(true);
//       await relatoriosService.downloadAuditoriaExcel(auditoria.chave);
//     } catch (error) {
//       console.error('Erro ao baixar Excel:', error);
//       message.error('Erro ao exportar para Excel');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchProdutosReport = async (values: any) => {
//   //   try {
//   //     setLoading(true)
//   //     const data = await relatoriosService.gerarRelatorioProdutos(values)
//   //     setProdutosData(data)
//   //     message.success("Relatório gerado com sucesso")
//   //   } catch (error) {
//   //     console.error("Erro ao gerar relatório:", error)
//   //     message.error("Erro ao gerar relatório")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   // const fetchRestituicoesReport = async () => {
//   //   try {
//   //     setLoading(true)
//   //     const data = await relatoriosService.listarRelatoriosRestituicao()
//   //     setRestituicoesData(data)
//   //   } catch (error) {
//   //     console.error("Erro ao carregar relatórios de restituição:", error)
//   //     message.error("Erro ao carregar relatórios de restituição")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   // useEffect(() => {
//   //   fetchRestituicoesReport()
//   // }, [])

//   // const handleDownload = (id: string, type: string) => {
//   //   const downloadUrl = relatoriosService.downloadRelatorio(id, type)
//   //   // Abre o download em uma nova aba
//   //   window.open(downloadUrl, "_blank")
//   // }

//   // const handleNovaRestituicao = async () => {
//   //   if (!periodoRestituicao) {
//   //     message.error("Por favor, informe o período da restituição")
//   //     return
//   //   }

//   //   try {
//   //     setLoading(true)
//   //     await relatoriosService.gerarNovaRestituicao(periodoRestituicao)
//   //     message.success("Restituição gerada com sucesso")
//   //     setNovaRestituicaoVisible(false)
//   //     setPeriodoRestituicao("")
//   //     // Recarregar a lista de restituições
//   //     fetchRestituicoesReport()
//   //   } catch (error) {
//   //     console.error("Erro ao gerar restituição:", error)
//   //     message.error("Erro ao gerar restituição")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const produtosColumns: ColumnsType<Produto> = [
//     {
//       title: "Descrição",
//       dataIndex: "descricao",
//       key: "descricao",
//     },
//     {
//       title: "NCM",
//       dataIndex: "ncm",
//       key: "ncm",
//     },
//     {
//       title: "Valor",
//       dataIndex: "valor",
//       key: "valor",
//       render: (valor) => `R$ ${valor.toFixed(2)}`,
//     },
//     {
//       title: "Valor PIS",
//       dataIndex: "valorPis",
//       key: "valorPis",
//       render: (valor) => `R$ ${valor.toFixed(2)}`,
//     },
//     {
//       title: "Valor COFINS",
//       dataIndex: "valorCofins",
//       key: "valorCofins",
//       render: (valor) => `R$ ${valor.toFixed(2)}`,
//     },
//     {
//       title: "Data de Inclusão",
//       dataIndex: "dataInclusao",
//       key: "dataInclusao",
//       render: (data) => (data ? new Date(data).toLocaleDateString() : "-"),
//     },
//   ]

//   const restituicoesColumns: ColumnsType<RelatorioRestituicao> = [
//     {
//       title: "Período",
//       dataIndex: "periodo",
//       key: "periodo",
//     },
//     {
//       title: "Total de Produtos",
//       dataIndex: "totalProdutos",
//       key: "totalProdutos",
//     },
//     {
//       title: "Valor Total",
//       dataIndex: "totalValor",
//       key: "totalValor",
//       render: (valor) => `R$ ${valor.toFixed(2)}`,
//     },
//     {
//       title: "Total PIS",
//       dataIndex: "totalPis",
//       key: "totalPis",
//       render: (valor) => `R$ ${valor.toFixed(2)}`,
//     },
//     {
//       title: "Total COFINS",
//       dataIndex: "totalCofins",
//       key: "totalCofins",
//       render: (valor) => `R$ ${valor.toFixed(2)}`,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         const colors = {
//           pendente: "orange",
//           aprovado: "green",
//           rejeitado: "red",
//         }
//         return (
//           <Text type={status === "aprovado" ? "success" : status === "rejeitado" ? "danger" : "warning"}>
//             {status.toUpperCase()}
//           </Text>
//         )
//       },
//     },
//     {
//       title: "Data de Geração",
//       dataIndex: "dataGeracao",
//       key: "dataGeracao",
//       render: (data) => new Date(data).toLocaleDateString(),
//     },
//     {
//       title: "Ações",
//       key: "acoes",
//       render: (_, record) => (
//         <Space>
//           <Button icon={<FileExcelOutlined />} size="small" onClick={() => handleDownload(record.id, "excel")}>
//             Excel
//           </Button>
//           <Button icon={<FilePdfOutlined />} size="small" onClick={() => handleDownload(record.id, "pdf")}>
//             PDF
//           </Button>
//         </Space>
//       ),
//     },
//   ]

//   return (
//     <div>
//       <Title level={2}>Relatórios</Title>
//       <Text type="secondary">Gere e visualize relatórios de produtos e restituições</Text>

//       <Tabs defaultActiveKey="produtos" style={{ marginTop: 16 }}>

//         <TabPane tab="Consultar Auditoria" key="consulta-auditoria">
//           <Card>
//             <Space direction="vertical" style={{ width: '100%' }}>
//               <Input.Search
//                 placeholder="Digite a chave completa da NF-e"
//                 enterButton="Buscar Auditoria"
//                 size="large"
//                 onSearch={handleBuscarPorChave}
//                 loading={loading}
//                 allowClear
//               />

//               {auditoria && (
//                 <>
//                   <Descriptions bordered column={2} style={{ marginTop: 20 }}>
//                     <Descriptions.Item label="Chave">{auditoria.chave}</Descriptions.Item>
//                     <Descriptions.Item label="Emitente">
//                       {auditoria.nomeRazaoSocial} ({auditoria.cnpjEmitente})
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Data Emissão">
//                       {new Date(auditoria.dataEmissao).toLocaleDateString()}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Valor Restituição">
//                       <Text strong type={auditoria.direitoRestituicao ? 'success' : 'danger'}>
//                         R$ {auditoria.valorRestituicao.toFixed(2)}
//                       </Text>
//                     </Descriptions.Item>
//                   </Descriptions>

//                   <Table
//                     dataSource={auditoria.produtos}
//                     columns={[
//                       { title: 'Produto', dataIndex: 'descricao' },
//                       { title: 'NCM', dataIndex: 'ncm' },
//                       { title: 'Valor', dataIndex: 'valorProduto', render: v => `R$ ${v.toFixed(2)}` },
//                       {
//                         title: 'Dif. PIS',
//                         dataIndex: 'valorDiferencaPis',
//                         render: v => <Text type={v > 0 ? 'success' : 'danger'}>{`R$ ${v.toFixed(2)}`}</Text>
//                       },
//                       {
//                         title: 'Dif. COFINS',
//                         dataIndex: 'valorDiferencaCofins',
//                         render: v => <Text type={v > 0 ? 'success' : 'danger'}>{`R$ ${v.toFixed(2)}`}</Text>
//                       },
//                     ]}
//                     rowKey="ncm"
//                     pagination={false}
//                     style={{ marginTop: 20 }}
//                   />

//                   <div style={{ marginTop: 20, textAlign: 'right' }}>
//                     <Button
//                       type="primary"
//                       icon={<FileExcelOutlined />}
//                       onClick={handleDownloadExcel}
//                       loading={loading}
//                     >
//                       Exportar para Excel
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </Space>
//           </Card>
//         </TabPane>
//         {/* <TabPane tab="Relatório de Produtos" key="produtos">
//           <Card>
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={fetchProdutosReport}
//               initialValues={{
//                 periodo: [dayjs().subtract(30, "days"), dayjs()],
//                 tipo: "todos",
//               }}
//             >
//               <Row gutter={16}>
//                 <Col xs={24} md={12}>
//                   <Form.Item
//                     name="periodo"
//                     label="Período"
//                     rules={[{ required: true, message: "Por favor, selecione o período" }]}
//                   >
//                     <RangePicker style={{ width: "100%" }} />
//                   </Form.Item>
//                 </Col>
//                 <Col xs={24} md={12}>
//                   <Form.Item
//                     name="tipo"
//                     label="Tipo de Produto"
//                     rules={[{ required: true, message: "Por favor, selecione o tipo" }]}
//                   >
//                     <Select>
//                       <Option value="todos">Todos</Option>
//                       <Option value="monofasicos">Apenas Monofásicos</Option>
//                       <Option value="outros">Outros</Option>
//                     </Select>
//                   </Form.Item>
//                 </Col>
//               </Row>

//               <Form.Item>
//                 <Button type="primary" htmlType="submit" loading={loading}>
//                   Gerar Relatório
//                 </Button>
//               </Form.Item>
//             </Form>

//             {produtosData.length > 0 && (
//               <>
//                 <Divider />

//                 <Row gutter={16} style={{ marginBottom: 16 }}>
//                   <Col span={8}>
//                     <Statistic title="Total de Produtos" value={produtosData.length} />
//                   </Col>
//                   <Col span={8}>
//                     <Statistic
//                       title="Total PIS"
//                       value={produtosData.reduce((acc, curr) => acc + curr.valorPis, 0).toFixed(2)}
//                       prefix="R$"
//                     />
//                   </Col>
//                   <Col span={8}>
//                     <Statistic
//                       title="Total COFINS"
//                       value={produtosData.reduce((acc, curr) => acc + curr.valorCofins, 0).toFixed(2)}
//                       prefix="R$"
//                     />
//                   </Col>
//                 </Row>

//                 <div style={{ marginBottom: 16, textAlign: "right" }}>
//                   <Space>
//                     <Button icon={<FileExcelOutlined />} onClick={() => handleDownload("produtos", "excel")}>
//                       Exportar Excel
//                     </Button>
//                     <Button icon={<FilePdfOutlined />} onClick={() => handleDownload("produtos", "pdf")}>
//                       Exportar PDF
//                     </Button>
//                   </Space>
//                 </div>

//                 <Table dataSource={produtosData} columns={produtosColumns} rowKey="id" pagination={{ pageSize: 10 }} />
//               </>
//             )}
//           </Card>
//         </TabPane>

//         <TabPane tab="Relatório de Restituições" key="restituicoes">
//           <Card>
//             <Spin spinning={loading}>
//               <div style={{ marginBottom: 16, textAlign: "right" }}>
//                 <Button type="primary" icon={<DownloadOutlined />} onClick={() => setNovaRestituicaoVisible(true)}>
//                   Gerar Nova Restituição
//                 </Button>
//               </div>

//               <Table
//                 dataSource={restituicoesData}
//                 columns={restituicoesColumns}
//                 rowKey="id"
//                 pagination={{ pageSize: 10 }}
//               />
//             </Spin>
//           </Card>
//         </TabPane> */}
//       </Tabs>

//       <Modal
//         title="Nova Restituição"
//         open={novaRestituicaoVisible}
//         onOk={handleNovaRestituicao}
//         onCancel={() => setNovaRestituicaoVisible(false)}
//         confirmLoading={loading}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Período (MM/AAAA)" rules={[{ required: true, message: "Por favor, informe o período" }]}>
//             <Input
//               placeholder="Ex: 01/2023"
//               value={periodoRestituicao}
//               onChange={(e) => setPeriodoRestituicao(e.target.value)}
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   )
// }

// export default Reports


////////////////////////////////////////////////////////////////////////////////////


"use client"

import type React from "react"
import { useState } from "react"
import {
  Typography,
  Card,
  Tabs,
  Button,
  Table,
  Spin,
  message,
  Space,
  Descriptions,
  Input
} from "antd"
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { relatoriosService, type RelatorioNotaFiscalDTO } from "@/services/api"

const { Title, Text } = Typography

const ConsultaAuditoria: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [auditoria, setAuditoria] = useState<RelatorioNotaFiscalDTO | null>(null)

  const handleBuscarPorChave = async (chave: string) => {
    if (!chave || chave.trim() === '') {
      message.warning('Por favor, informe a chave da NF-e')
      return
    }

    const chaveLimpa = chave.replace(/\D/g, '')
    
    if (chaveLimpa.length !== 44) {
      message.error('Chave inválida! A chave da NF-e deve conter exatamente 44 dígitos')
      return
    }

    setLoading(true)
    try {
      const data = await relatoriosService.buscarAuditoriaPorChave(chaveLimpa)
      setAuditoria(data)
      message.success('Auditoria encontrada com sucesso!')
    } catch (error) {
      console.error('Erro ao buscar auditoria:', error)
      setAuditoria(null)
      message.error('Auditoria não encontrada ou erro na consulta')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadExcel = async () => {
    if (!auditoria?.chave) return

    try {
      setLoading(true)
      await relatoriosService.downloadAuditoriaExcel(auditoria.chave)
    } catch (error) {
      console.error('Erro ao baixar Excel:', error)
      message.error('Erro ao exportar para Excel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Title level={2}>Consulta de Auditoria</Title>
      <Text type="secondary">Consulte auditorias por chave da NF-e</Text>

      <Card style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.Search
            placeholder="Digite a chave completa da NF-e (44 dígitos)"
            enterButton={
              <Button 
                type="primary" 
                loading={loading}
                icon={<SearchOutlined />}
              >
                Buscar
              </Button>
            }
            size="large"
            onSearch={handleBuscarPorChave}
            allowClear
          />
          
          {auditoria && (
            <>
              <Descriptions bordered column={2} style={{ marginTop: 20 }}>
                <Descriptions.Item label="Chave">{auditoria.chave}</Descriptions.Item>
                <Descriptions.Item label="Emitente">
                  {auditoria.nomeRazaoSocial} ({auditoria.cnpjEmitente})
                </Descriptions.Item>
                <Descriptions.Item label="Data Emissão">
                  {dayjs(auditoria.dataEmissao).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Restituição">
                  <Text strong type={auditoria.direitoRestituicao ? 'success' : 'danger'}>
                    R$ {auditoria.valorRestituicao.toFixed(2)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Table
                dataSource={auditoria.produtos}
                columns={[
                  { title: 'Produto', dataIndex: 'descricao' },
                  { title: 'NCM', dataIndex: 'ncm' },
                  { title: 'Valor', dataIndex: 'valorProduto', render: v => `R$ ${v.toFixed(2)}` },
                  { 
                    title: 'Dif. PIS', 
                    dataIndex: 'valorDiferencaPis',
                    render: v => <Text type={v > 0 ? 'success' : 'danger'}>{`R$ ${v.toFixed(2)}`}</Text>
                  },
                  { 
                    title: 'Dif. COFINS', 
                    dataIndex: 'valorDiferencaCofins',
                    render: v => <Text type={v > 0 ? 'success' : 'danger'}>{`R$ ${v.toFixed(2)}`}</Text>
                  },
                ]}
                rowKey="ncm"
                pagination={false}
                style={{ marginTop: 20 }}
              />

              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <Button
                  type="primary"
                  icon={<FileExcelOutlined />}
                  onClick={handleDownloadExcel}
                  loading={loading}
                >
                  Exportar para Excel
                </Button>
              </div>
            </>
          )}
        </Space>
      </Card>
    </div>
  )
}

export default ConsultaAuditoria