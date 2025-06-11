// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Row, Col, Card, Statistic, Typography, Spin, Alert, Progress } from "antd"
// import {
//   FileTextOutlined,
//   DollarOutlined,
//   CheckCircleOutlined,
//   WarningOutlined,
//   CalendarOutlined,
//   BarChartOutlined,
// } from "@ant-design/icons"

// const { Title, Text } = Typography

// // Tipos
// interface DashboardStats {
//   totalNotas: number
//   totalPis: number
//   totalCofins: number
//   totalProdutos: number
//   crescimentoMensal: number
//   eficienciaProcessamento: number
//   lastUpdated?: string
// }

// // Mock data
// const MOCK_DASHBOARD_DATA: DashboardStats = {
//   totalNotas: 1245,
//   totalPis: 125600.5,
//   totalCofins: 98700.75,
//   totalProdutos: 42,
//   crescimentoMensal: 15.8,
//   eficienciaProcessamento: 94.2,
//   lastUpdated: new Date().toLocaleString("pt-BR"),
// }

// const Dashboard: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [stats, setStats] = useState<DashboardStats>({
//     totalNotas: 0,
//     totalPis: 0,
//     totalCofins: 0,
//     totalProdutos: 0,
//     crescimentoMensal: 0,
//     eficienciaProcessamento: 0,
//   })

//   useEffect(() => {
//     setLoading(true)

//     const timer = setTimeout(() => {
//       setStats(MOCK_DASHBOARD_DATA)
//       setError("Dados simulados - Modo offline")
//       setLoading(false)
//     }, 800)

//     return () => clearTimeout(timer)
//   }, [])

//   const cardStyle = {
//     borderRadius: "12px",
//     border: "none",
//     boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//     transition: "all 0.3s ease",
//   }

//   const statisticStyle = {
//     ".ant-statistic-title": {
//       color: "#595959",
//       fontWeight: "500",
//       fontSize: "14px",
//     },
//     ".ant-statistic-content": {
//       color: "#262626",
//       fontWeight: "600",
//     },
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
//           <Title level={2} style={{ margin: 0, color: "#262626" }}>
//             Dashboard
//           </Title>
//         </div>
//         <Text type="secondary" style={{ fontSize: "16px", marginLeft: "20px" }}>
//           Visão geral do sistema CashFisco
//         </Text>
//       </div>

//       {/* Alert Section */}
//       {error && (
//         <Alert
//           message="Atenção"
//           description={error}
//           type="warning"
//           showIcon
//           style={{
//             marginBottom: "24px",
//             borderRadius: "8px",
//             border: "1px solid #fa8c16",
//             backgroundColor: "#fff7e6",
//           }}
//         />
//       )}

//       <Spin spinning={loading} size="large">
//         {/* Main Statistics */}
//         <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 ...cardStyle,
//                 background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
//                 color: "white",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-4px)"
//                 e.currentTarget.style.boxShadow = "0 8px 24px rgba(24, 144, 255, 0.3)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)"
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
//               }}
//             >
//               <Statistic
//                 title={
//                   <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Notas Fiscais Analisadas</span>
//                 }
//                 value={stats.totalNotas}
//                 prefix={<FileTextOutlined style={{ color: "white" }} />}
//                 valueStyle={{ color: "white", fontWeight: "bold" }}
//               />
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 ...cardStyle,
//                 background: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
//                 color: "white",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-4px)"
//                 e.currentTarget.style.boxShadow = "0 8px 24px rgba(250, 140, 22, 0.3)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)"
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
//               }}
//             >
//               <Statistic
//                 title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Total PIS</span>}
//                 value={stats.totalPis}
//                 precision={2}
//                 prefix={<DollarOutlined style={{ color: "white" }} />}
//                 suffix="R$"
//                 valueStyle={{ color: "white", fontWeight: "bold" }}
//               />
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 ...cardStyle,
//                 background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
//                 color: "white",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-4px)"
//                 e.currentTarget.style.boxShadow = "0 8px 24px rgba(82, 196, 26, 0.3)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)"
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
//               }}
//             >
//               <Statistic
//                 title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Total COFINS</span>}
//                 value={stats.totalCofins}
//                 precision={2}
//                 prefix={<DollarOutlined style={{ color: "white" }} />}
//                 suffix="R$"
//                 valueStyle={{ color: "white", fontWeight: "bold" }}
//               />
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={6}>
//             <Card
//               style={{
//                 ...cardStyle,
//                 background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
//                 color: "white",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translateY(-4px)"
//                 e.currentTarget.style.boxShadow = "0 8px 24px rgba(114, 46, 209, 0.3)"
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "translateY(0)"
//                 e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
//               }}
//             >
//               <Statistic
//                 title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Produtos Monofásicos</span>}
//                 value={stats.totalProdutos}
//                 prefix={<CheckCircleOutlined style={{ color: "white" }} />}
//                 valueStyle={{ color: "white", fontWeight: "bold" }}
//               />
//             </Card>
//           </Col>
//         </Row>

//         {/* Secondary Statistics */}
//         <Row gutter={[24, 24]}>
//           <Col xs={24} md={12}>
//             <Card
//               title={
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <WarningOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
//                   <span>Crescimento Mensal</span>
//                 </div>
//               }
//               style={cardStyle}
//             >
//               <div style={{ textAlign: "center" }}>
//                 <Statistic
//                   value={stats.crescimentoMensal}
//                   precision={1}
//                   suffix="%"
//                   valueStyle={{
//                     color: "#52c41a",
//                     fontSize: "32px",
//                     fontWeight: "bold",
//                     marginBottom: "16px",
//                   }}
//                 />
//                 <Progress
//                   percent={stats.crescimentoMensal}
//                   strokeColor={{
//                     "0%": "#1890ff",
//                     "100%": "#fa8c16",
//                   }}
//                   showInfo={false}
//                   strokeWidth={8}
//                 />
//                 <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
//                   Comparado ao mês anterior
//                 </Text>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} md={12}>
//             <Card
//               title={
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <BarChartOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
//                   <span>Eficiência de Processamento</span>
//                 </div>
//               }
//               style={cardStyle}
//             >
//               <div style={{ textAlign: "center" }}>
//                 <Statistic
//                   value={stats.eficienciaProcessamento}
//                   precision={1}
//                   suffix="%"
//                   valueStyle={{
//                     color: "#1890ff",
//                     fontSize: "32px",
//                     fontWeight: "bold",
//                     marginBottom: "16px",
//                   }}
//                 />
//                 <Progress
//                   percent={stats.eficienciaProcessamento}
//                   strokeColor={{
//                     "0%": "#fa8c16",
//                     "100%": "#52c41a",
//                   }}
//                   showInfo={false}
//                   strokeWidth={8}
//                 />
//                 <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
//                   Taxa de sucesso no processamento
//                 </Text>
//               </div>
//             </Card>
//           </Col>
//         </Row>

//         {/* Footer Info */}
//         {stats.lastUpdated && (
//           <Card
//             style={{
//               ...cardStyle,
//               marginTop: "24px",
//               background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
//               border: "1px solid rgba(24, 144, 255, 0.1)",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <CalendarOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
//               <Text type="secondary">Última atualização: {stats.lastUpdated}</Text>
//             </div>
//           </Card>
//         )}
//       </Spin>
//     </div>
//   )
// }

// export default Dashboard

"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Button,
  List,
  Avatar,
  Tag,
  Spin,
  Alert,
  Progress,
  Tooltip,
  Badge,
  message,
} from "antd"
import {
  FileTextOutlined,
  BuildOutlined,
  ShoppingOutlined,
  CloudUploadOutlined,
  DollarOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BellOutlined,
  RightOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileExcelOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

// Tipos
interface Atividade {
  id: string
  tipo: "upload" | "analise" | "relatorio" | "empresa" | "produto"
  descricao: string
  data: string
  usuario: string
  status: "concluido" | "pendente" | "erro"
}

interface Notificacao {
  id: string
  titulo: string
  descricao: string
  data: string
  lida: boolean
  tipo: "info" | "aviso" | "erro"
}

interface Estatisticas {
  totalNotas: number
  totalEmpresas: number
  totalProdutos: number
  totalRestituicao: number
  notasProcessadasHoje: number
  notasPendentes: number
  taxaProcessamento: number
  ultimaAtualizacao?: string
}

// Mock data
const MOCK_ESTATISTICAS: Estatisticas = {
  totalNotas: 1245,
  totalEmpresas: 87,
  totalProdutos: 423,
  totalRestituicao: 1256789.45,
  notasProcessadasHoje: 32,
  notasPendentes: 5,
  taxaProcessamento: 94.2,
  ultimaAtualizacao: new Date().toLocaleString("pt-BR"),
}

const MOCK_ATIVIDADES: Atividade[] = [
  {
    id: "1",
    tipo: "upload",
    descricao: "Upload de 12 notas fiscais",
    data: "2023-06-11T10:30:00",
    usuario: "Carlos Silva",
    status: "concluido",
  },
  {
    id: "2",
    tipo: "analise",
    descricao: "Análise de produtos monofásicos",
    data: "2023-06-11T09:45:00",
    usuario: "Maria Oliveira",
    status: "concluido",
  },
  {
    id: "3",
    tipo: "relatorio",
    descricao: "Geração de relatório de restituição",
    data: "2023-06-11T09:15:00",
    usuario: "João Santos",
    status: "pendente",
  },
  {
    id: "4",
    tipo: "empresa",
    descricao: "Cadastro de nova empresa",
    data: "2023-06-10T16:20:00",
    usuario: "Ana Costa",
    status: "concluido",
  },
  {
    id: "5",
    tipo: "produto",
    descricao: "Atualização de produtos monofásicos",
    data: "2023-06-10T14:10:00",
    usuario: "Pedro Almeida",
    status: "erro",
  },
]

const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: "1",
    titulo: "Atualização da tabela SPED",
    descricao: "Nova tabela SPED disponível para download",
    data: "2023-06-11T08:00:00",
    lida: false,
    tipo: "info",
  },
  {
    id: "2",
    titulo: "Manutenção programada",
    descricao: "Sistema ficará indisponível dia 15/06 das 22h às 23h",
    data: "2023-06-10T15:30:00",
    lida: false,
    tipo: "aviso",
  },
  {
    id: "3",
    titulo: "Erro no processamento",
    descricao: "Falha no processamento do lote #12345",
    data: "2023-06-09T11:45:00",
    lida: true,
    tipo: "erro",
  },
]

const ACESSO_RAPIDO = [
  {
    titulo: "Upload de XML",
    descricao: "Faça upload de notas fiscais XML",
    icone: <CloudUploadOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
    cor: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
    rota: "/upload-xml",
  },
  {
    titulo: "Empresas",
    descricao: "Gerencie cadastro de empresas",
    icone: <BuildOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />,
    cor: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
    rota: "/empresas",
  },
  {
    titulo: "Produtos",
    descricao: "Tabela de produtos monofásicos",
    icone: <ShoppingOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
    cor: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
    rota: "/produtos",
  },
  {
    titulo: "Relatórios",
    descricao: "Visualize e exporte relatórios",
    icone: <FileExcelOutlined style={{ fontSize: "24px", color: "#722ed1" }} />,
    cor: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
    rota: "/relatorios",
  },
]

const HomePage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalNotas: 0,
    totalEmpresas: 0,
    totalProdutos: 0,
    totalRestituicao: 0,
    notasProcessadasHoje: 0,
    notasPendentes: 0,
    taxaProcessamento: 0,
  })
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Em produção, substituir por chamadas reais à API
        setEstatisticas(MOCK_ESTATISTICAS)
        setAtividades(MOCK_ATIVIDADES)
        setNotificacoes(MOCK_NOTIFICACOES)

        // Comentar a linha abaixo em produção
        setError("Dados simulados - Modo demonstração")
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Erro ao carregar dados. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    const hoje = new Date()
    const ontem = new Date(hoje)
    ontem.setDate(hoje.getDate() - 1)

    if (data.toDateString() === hoje.toDateString()) {
      return `Hoje, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    } else if (data.toDateString() === ontem.toDateString()) {
      return `Ontem, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getIconeAtividade = (tipo: Atividade["tipo"], status: Atividade["status"]) => {
    if (status === "erro") {
      return <InfoCircleOutlined style={{ color: "#ff4d4f" }} />
    }

    switch (tipo) {
      case "upload":
        return <CloudUploadOutlined style={{ color: "#1890ff" }} />
      case "analise":
        return <BarChartOutlined style={{ color: "#fa8c16" }} />
      case "relatorio":
        return <FileExcelOutlined style={{ color: "#52c41a" }} />
      case "empresa":
        return <BuildOutlined style={{ color: "#722ed1" }} />
      case "produto":
        return <ShoppingOutlined style={{ color: "#eb2f96" }} />
      default:
        return <FileTextOutlined style={{ color: "#1890ff" }} />
    }
  }

  const getStatusTag = (status: Atividade["status"]) => {
    switch (status) {
      case "concluido":
        return (
          <Tag color="success" style={{ borderRadius: "10px" }}>
            Concluído
          </Tag>
        )
      case "pendente":
        return (
          <Tag color="processing" style={{ borderRadius: "10px" }}>
            Pendente
          </Tag>
        )
      case "erro":
        return (
          <Tag color="error" style={{ borderRadius: "10px" }}>
            Erro
          </Tag>
        )
      default:
        return null
    }
  }

  const getNotificacaoIcon = (tipo: Notificacao["tipo"]) => {
    switch (tipo) {
      case "info":
        return <InfoCircleOutlined style={{ color: "#1890ff" }} />
      case "aviso":
        return <ClockCircleOutlined style={{ color: "#fa8c16" }} />
      case "erro":
        return <InfoCircleOutlined style={{ color: "#ff4d4f" }} />
      default:
        return <BellOutlined style={{ color: "#1890ff" }} />
    }
  }

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    height: "100%",
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
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Bem-vindo ao CashFisco
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "20px" }}>
          Sistema de análise e restituição de tributos
        </Text>
      </div>

      {/* Alert Section */}
      {error && (
        <Alert
          message="Atenção"
          description={error}
          type="warning"
          showIcon
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            border: "1px solid #fa8c16",
            backgroundColor: "#fff7e6",
          }}
        />
      )}

      <Spin spinning={loading} size="large">
        {/* Estatísticas Principais */}
        <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(24, 144, 255, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Notas Fiscais Analisadas</span>
                }
                value={estatisticas.totalNotas}
                prefix={<FileTextOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
              <div style={{ marginTop: "8px" }}>
                <Text style={{ color: "rgba(255,255,255,0.8)" }}>{estatisticas.notasProcessadasHoje} notas hoje</Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(250, 140, 22, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Empresas Cadastradas</span>}
                value={estatisticas.totalEmpresas}
                prefix={<BuildOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
              <div style={{ marginTop: "8px" }}>
                <Button
                  type="text"
                  size="small"
                  style={{ color: "white", padding: 0 }}
                  onClick={() => router.push("/empresas")}
                >
                  Ver detalhes <RightOutlined />
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(82, 196, 26, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Produtos Monofásicos</span>}
                value={estatisticas.totalProdutos}
                prefix={<ShoppingOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
              <div style={{ marginTop: "8px" }}>
                <Button
                  type="text"
                  size="small"
                  style={{ color: "white", padding: 0 }}
                  onClick={() => router.push("/produtos")}
                >
                  Ver tabela <RightOutlined />
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(114, 46, 209, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Total Restituição</span>}
                value={estatisticas.totalRestituicao}
                precision={2}
                prefix={<DollarOutlined style={{ color: "white" }} />}
                suffix="R$"
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
              <div style={{ marginTop: "8px" }}>
                <Button
                  type="text"
                  size="small"
                  style={{ color: "white", padding: 0 }}
                  onClick={() => router.push("/relatorios")}
                >
                  Ver relatórios <RightOutlined />
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Conteúdo Principal */}
        <Row gutter={[24, 24]}>
          {/* Coluna Esquerda */}
          <Col xs={24} lg={16}>
            {/* Acesso Rápido */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ThunderboltOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                  <span>Acesso Rápido</span>
                </div>
              }
              style={{ ...cardStyle, marginBottom: "24px" }}
            >
              <Row gutter={[16, 16]}>
                {ACESSO_RAPIDO.map((item, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card
                      hoverable
                      style={{ borderRadius: "8px", height: "100%" }}
                      onClick={() => router.push(item.rota)}
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "8px",
                            background: item.cor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                          }}
                        >
                          {React.cloneElement(item.icone, { style: { fontSize: "24px", color: "white" } })}
                        </div>
                        <div>
                          <Text strong style={{ fontSize: "16px", display: "block" }}>
                            {item.titulo}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {item.descricao}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Status do Sistema */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BarChartOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                  <span>Status do Sistema</span>
                </div>
              }
              style={{ ...cardStyle, marginBottom: "24px" }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Taxa de Processamento"
                    value={estatisticas.taxaProcessamento}
                    precision={1}
                    suffix="%"
                    valueStyle={{ color: "#52c41a" }}
                    prefix={<CheckCircleOutlined />}
                  />
                  <Progress
                    percent={estatisticas.taxaProcessamento}
                    strokeColor={{
                      "0%": "#1890ff",
                      "100%": "#52c41a",
                    }}
                    showInfo={false}
                    style={{ marginTop: "8px" }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Notas Pendentes"
                    value={estatisticas.notasPendentes}
                    valueStyle={{ color: estatisticas.notasPendentes > 0 ? "#fa8c16" : "#52c41a" }}
                    prefix={<ClockCircleOutlined />}
                  />
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, marginTop: "8px" }}
                    onClick={() => router.push("/upload-xml")}
                    disabled={estatisticas.notasPendentes === 0}
                  >
                    {estatisticas.notasPendentes > 0 ? "Processar pendentes" : "Nenhuma pendência"}
                  </Button>
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title="Última Atualização"
                    value={estatisticas.ultimaAtualizacao ? estatisticas.ultimaAtualizacao : "Nunca"}
                    valueStyle={{ fontSize: "14px" }}
                    prefix={<CalendarOutlined />}
                  />
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, marginTop: "8px" }}
                    onClick={() => {
                      // Função para atualizar dados
                      message.info("Atualizando dados...")
                    }}
                  >
                    Atualizar agora
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Atividades Recentes */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TeamOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                    <span>Atividades Recentes</span>
                  </div>
                  <Button type="link" size="small" onClick={() => router.push("/atividades")}>
                    Ver todas
                  </Button>
                </div>
              }
              style={cardStyle}
            >
              <List
                itemLayout="horizontal"
                dataSource={atividades}
                renderItem={(item) => (
                  <List.Item
                    actions={[getStatusTag(item.status)]}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={getIconeAtividade(item.tipo, item.status)}
                          style={{
                            backgroundColor:
                              item.status === "erro" ? "#fff2f0" : item.status === "pendente" ? "#e6f7ff" : "#f6ffed",
                          }}
                        />
                      }
                      title={
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <Text strong>{item.descricao}</Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {formatarData(item.data)}
                          </Text>
                        </div>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {item.usuario}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Coluna Direita */}
          <Col xs={24} lg={8}>
            {/* Notificações */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <BellOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                    <span>Notificações</span>
                    <Badge
                      count={notificacoes.filter((n) => !n.lida).length}
                      style={{ marginLeft: "8px", backgroundColor: "#fa8c16" }}
                    />
                  </div>
                  <Button type="link" size="small" onClick={() => router.push("/notificacoes")}>
                    Ver todas
                  </Button>
                </div>
              }
              style={{ ...cardStyle, marginBottom: "24px" }}
            >
              {notificacoes.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={notificacoes}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0",
                        backgroundColor: !item.lida ? "rgba(24, 144, 255, 0.05)" : "transparent",
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge dot={!item.lida} offset={[0, 0]}>
                            <Avatar
                              icon={getNotificacaoIcon(item.tipo)}
                              style={{
                                backgroundColor:
                                  item.tipo === "erro" ? "#fff2f0" : item.tipo === "aviso" ? "#fff7e6" : "#e6f7ff",
                              }}
                            />
                          </Badge>
                        }
                        title={
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text strong>{item.titulo}</Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {formatarData(item.data)}
                            </Text>
                          </div>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: "13px" }}>
                            {item.descricao}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Text type="secondary">Nenhuma notificação disponível</Text>
                </div>
              )}
            </Card>

            {/* Links Úteis */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <InfoCircleOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                  <span>Links Úteis</span>
                </div>
              }
              style={{ ...cardStyle, marginBottom: "24px" }}
            >
              <List
                size="small"
                dataSource={[
                  {
                    titulo: "Manual do Usuário",
                    descricao: "Guia completo de utilização do sistema",
                    icone: <FileTextOutlined style={{ color: "#1890ff" }} />,
                  },
                  {
                    titulo: "Tabela SPED Atualizada",
                    descricao: "Download da tabela mais recente",
                    icone: <FileExcelOutlined style={{ color: "#52c41a" }} />,
                  },
                  {
                    titulo: "Suporte Técnico",
                    descricao: "Entre em contato com nossa equipe",
                    icone: <TeamOutlined style={{ color: "#fa8c16" }} />,
                  },
                  {
                    titulo: "Configurações do Sistema",
                    descricao: "Personalize suas preferências",
                    icone: <SettingOutlined style={{ color: "#722ed1" }} />,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item
                    style={{ padding: "12px 0", cursor: "pointer" }}
                    onClick={() => message.info(`Acessando: ${item.titulo}`)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={item.icone} style={{ backgroundColor: "#f5f5f5" }} />}
                      title={<Text strong>{item.titulo}</Text>}
                      description={<Text type="secondary">{item.descricao}</Text>}
                    />
                    <RightOutlined style={{ color: "#bfbfbf" }} />
                  </List.Item>
                )}
              />
            </Card>

            {/* Dicas Rápidas */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ThunderboltOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                  <span>Dicas Rápidas</span>
                </div>
              }
              style={cardStyle}
            >
              <div style={{ padding: "8px 0" }}>
                <Tooltip title="Clique para ver mais detalhes">
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: "rgba(24, 144, 255, 0.05)",
                      marginBottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => message.info("Dica sobre upload em lote")}
                  >
                    <Text strong>Upload em Lote</Text>
                    <Text type="secondary" style={{ display: "block", fontSize: "13px", marginTop: "4px" }}>
                      Você pode fazer upload de até 50 XMLs de uma vez para processamento em lote.
                    </Text>
                  </div>
                </Tooltip>

                <Tooltip title="Clique para ver mais detalhes">
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: "rgba(250, 140, 22, 0.05)",
                      marginBottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => message.info("Dica sobre exportação de relatórios")}
                  >
                    <Text strong>Exportação de Relatórios</Text>
                    <Text type="secondary" style={{ display: "block", fontSize: "13px", marginTop: "4px" }}>
                      Exporte seus relatórios em Excel para análises mais detalhadas.
                    </Text>
                  </div>
                </Tooltip>

                <Tooltip title="Clique para ver mais detalhes">
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: "rgba(82, 196, 26, 0.05)",
                      cursor: "pointer",
                    }}
                    onClick={() => message.info("Dica sobre atalhos de teclado")}
                  >
                    <Text strong>Atalhos de Teclado</Text>
                    <Text type="secondary" style={{ display: "block", fontSize: "13px", marginTop: "4px" }}>
                      Use Ctrl+B para abrir o menu lateral e Ctrl+F para busca rápida.
                    </Text>
                  </div>
                </Tooltip>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Footer Info */}
        {estatisticas.ultimaAtualizacao && (
          <Card
            style={{
              ...cardStyle,
              marginTop: "24px",
              background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
              border: "1px solid rgba(24, 144, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CalendarOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
              <Text type="secondary">Última atualização: {estatisticas.ultimaAtualizacao}</Text>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  )
}

export default HomePage
