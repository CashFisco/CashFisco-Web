"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Typography, Card, Button, Spin, Descriptions, message, Row, Col, Breadcrumb, Tag, Space } from "antd"
import {
  FileTextOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

interface RelatorioDetalhado {
  chave: string
  cnpjEmitente: string
  nomeRazaoSocial: string
  dataEmissao: string
  direitoRestituicao: boolean
  valorRestituicao: number
  produtosAuditados: Array<{
    id: number
    descricaoProduto: string
  }>
}

const RelatorioPage = () => {
  const params = useParams()
  const router = useRouter()
  const chave = params.chave as string

  const [loading, setLoading] = useState<boolean>(true)
  const [relatorio, setRelatorio] = useState<RelatorioDetalhado | null>(null)

  useEffect(() => {
    carregarRelatorio()
  }, [chave])

  const carregarRelatorio = async () => {
    try {
      setLoading(true)
      // Aqui você implementaria a chamada real à API
      // const data = await relatoriosService.buscarPorChave(chave)

      // Dados simulados para demonstração
      const data: RelatorioDetalhado = {
        chave: chave,
        cnpjEmitente: "02924249001786",
        nomeRazaoSocial: "CAFE RANCHEIRO AGRO INDUSTRIAL LTDA",
        dataEmissao: "2025-02-28T17:08:00",
        direitoRestituicao: true,
        valorRestituicao: 5.15,
        produtosAuditados: [
          {
            id: 1,
            descricaoProduto: "COOKIES CHOCOLATE RANCHEIRO 40X60G CEST:17.053.00",
          },
          {
            id: 2,
            descricaoProduto: "ROSQ RECHEADA RANCHEIRO CHOCOLATE 30X90G CEST:17.053.00",
          },
          {
            id: 3,
            descricaoProduto: "ROSQ RECHEADA RANCHEIRO MORANGO 30X90G CEST:17.053.00",
          },
          {
            id: 4,
            descricaoProduto: "ROSQ RECHEADA RANCHEIRO BAUNILHA 30X90G CEST:17.053.00",
          },
        ],
      }

      setRelatorio(data)
    } catch (error) {
      console.error("Erro ao carregar relatório:", error)
      message.error("Erro ao carregar relatório")
    } finally {
      setLoading(false)
    }
  }

  const handleBaixarRelatorio = async () => {
    try {
      setLoading(true)
      // Aqui você implementaria a chamada para baixar o Excel
      // await relatoriosService.downloadExcel(chave)
      message.success("Relatório baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar relatório:", error)
      message.error("Erro ao baixar relatório")
    } finally {
      setLoading(false)
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
          <FileTextOutlined
            style={{
              fontSize: "24px",
              color: "#1890ff",
              marginRight: "12px",
            }}
          />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Relatório da Nota Fiscal
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Visualize os detalhes do relatório de auditoria
        </Text>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          {
            title: (
              <a href="/empresas" style={{ display: "flex", alignItems: "center" }}>
                <BuildOutlined style={{ marginRight: "8px" }} />
                Empresas
              </a>
            ),
          },
          {
            title: (
              <span style={{ display: "flex", alignItems: "center" }}>
                <FileTextOutlined style={{ marginRight: "8px" }} />
                Relatório
              </span>
            ),
          },
        ]}
      />

      <Spin spinning={loading}>
        {relatorio && (
          <>
            {/* Resumo do Relatório */}
            <Card
              style={{
                ...cardStyle,
                marginBottom: "24px",
                background: relatorio.direitoRestituicao
                  ? "linear-gradient(135deg, rgba(82, 196, 26, 0.05), rgba(82, 196, 26, 0.02))"
                  : "linear-gradient(135deg, rgba(255, 77, 79, 0.05), rgba(255, 77, 79, 0.02))",
                border: relatorio.direitoRestituicao
                  ? "1px solid rgba(82, 196, 26, 0.2)"
                  : "1px solid rgba(255, 77, 79, 0.2)",
              }}
            >
              <Row gutter={24} align="middle">
                <Col xs={24} md={16}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    {relatorio.direitoRestituicao ? (
                      <CheckCircleOutlined style={{ fontSize: "32px", color: "#52c41a", marginRight: "16px" }} />
                    ) : (
                      <CloseCircleOutlined style={{ fontSize: "32px", color: "#ff4d4f", marginRight: "16px" }} />
                    )}
                    <div>
                      <Title
                        level={3}
                        style={{ margin: 0, color: relatorio.direitoRestituicao ? "#52c41a" : "#ff4d4f" }}
                      >
                        {relatorio.direitoRestituicao ? "TEM DIREITO À RESTITUIÇÃO" : "SEM DIREITO À RESTITUIÇÃO"}
                      </Title>
                      <Text style={{ fontSize: "18px", fontWeight: "600" }}>
                        Valor: R$ {relatorio.valorRestituicao.toFixed(2)}
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: "right" }}>
                  <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ borderRadius: "8px" }}>
                      Voltar
                    </Button>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleBaixarRelatorio}
                      style={{
                        background: "linear-gradient(45deg, #52c41a, #73d13d)",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Baixar Excel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Detalhes da Nota */}
            <Card style={{ ...cardStyle, marginBottom: "24px" }}>
              <Title level={4} style={{ marginBottom: "24px" }}>
                <FileTextOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                Informações da Nota Fiscal
              </Title>

              <Descriptions
                bordered
                column={2}
                labelStyle={{
                  fontWeight: "600",
                  background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                  width: "200px",
                }}
                contentStyle={{ background: "#fafafa" }}
              >
                <Descriptions.Item
                  label={
                    <span>
                      <FileTextOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                      Chave da Nota
                    </span>
                  }
                  span={2}
                >
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
                    {relatorio.chave}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <BuildOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                      CNPJ Emitente
                    </span>
                  }
                >
                  <Tag
                    style={{
                      background: "linear-gradient(45deg, #fa8c16, #ffa940)",
                      border: "none",
                      color: "white",
                      fontWeight: "500",
                      padding: "4px 12px",
                      borderRadius: "6px",
                    }}
                  >
                    {relatorio.cnpjEmitente.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <CalendarOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
                      Data de Emissão
                    </span>
                  }
                >
                  {new Date(relatorio.dataEmissao).toLocaleDateString("pt-BR")}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <BuildOutlined style={{ color: "#722ed1", marginRight: "8px" }} />
                      Razão Social
                    </span>
                  }
                  span={2}
                >
                  <Text strong>{relatorio.nomeRazaoSocial}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <DollarOutlined
                        style={{
                          color: relatorio.direitoRestituicao ? "#52c41a" : "#ff4d4f",
                          marginRight: "8px",
                        }}
                      />
                      Valor de Restituição
                    </span>
                  }
                >
                  <Text
                    strong
                    style={{
                      color: relatorio.direitoRestituicao ? "#52c41a" : "#ff4d4f",
                      fontSize: "16px",
                    }}
                  >
                    R$ {relatorio.valorRestituicao.toFixed(2)}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <CheckCircleOutlined
                        style={{
                          color: relatorio.direitoRestituicao ? "#52c41a" : "#ff4d4f",
                          marginRight: "8px",
                        }}
                      />
                      Direito à Restituição
                    </span>
                  }
                >
                  <Tag
                    color={relatorio.direitoRestituicao ? "success" : "error"}
                    style={{
                      fontWeight: "600",
                      padding: "4px 12px",
                      borderRadius: "6px",
                    }}
                  >
                    {relatorio.direitoRestituicao ? "SIM" : "NÃO"}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Produtos Auditados */}
            <Card style={cardStyle}>
              <Title level={4} style={{ marginBottom: "24px" }}>
                <FileTextOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
                Produtos Auditados ({relatorio.produtosAuditados.length})
              </Title>

              <Row gutter={[16, 16]}>
                {relatorio.produtosAuditados.map((produto) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={produto.id}>
                    <Card
                      size="small"
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e8f4fd",
                        background: "rgba(24, 144, 255, 0.05)",
                        height: "100%",
                      }}
                      bodyStyle={{ padding: "12px" }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <Tag
                          style={{
                            background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                            border: "none",
                            color: "white",
                            fontWeight: "500",
                            borderRadius: "4px",
                          }}
                        >
                          ID: {produto.id}
                        </Tag>
                      </div>
                      <Text style={{ fontSize: "13px", lineHeight: "1.4" }}>{produto.descricaoProduto}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </>
        )}
      </Spin>
    </div>
  )
}

export default RelatorioPage
