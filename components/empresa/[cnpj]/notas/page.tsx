"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import {
  Typography,
  Table,
  Card,
  Input,
  Button,
  Space,
  Spin,
  Tag,
  Modal,
  message,
  Row,
  Col,
  Divider,
  Breadcrumb,
  Tooltip,
  Empty,
  Tabs,
  Descriptions,
} from "antd"
import {
  SearchOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  BuildOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { notasService } from "@/services/api"

const { Title, Text } = Typography
const { TabPane } = Tabs

interface NotaFiscal {
  id: string
  chave: string
  dataEmissao: string
  valorTotal: number
  totalPis: number
  totalCofins: number
  cnpjEmitente: string
  nomeRazaoSocial: string
  status: "processada" | "pendente" | "erro"
}

interface RelatorioNota {
  id: string
  chave: string
  valorTotalProdutosMonofasicos: number
  valorTotalPis: number
  valorTotalCofins: number
  valorRestituicao: number
  direitoRestituicao: boolean
}

const NotasEmpresaPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const cnpj = params.cnpj as string
  const nomeEmpresa = searchParams.get("nome") || "Empresa"

  const [loading, setLoading] = useState<boolean>(true)
  const [notas, setNotas] = useState<NotaFiscal[]>([])
  const [relatorios, setRelatorios] = useState<RelatorioNota[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [notaSelecionada, setNotaSelecionada] = useState<NotaFiscal | null>(null)
  const [relatorioModalVisible, setRelatorioModalVisible] = useState<boolean>(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<RelatorioNota | null>(null)
  const [activeTab, setActiveTab] = useState<string>("notas")

  useEffect(() => {
    carregarNotas()
  }, [cnpj])

  const carregarNotas = async () => {
    try {
      setLoading(true)
      // Aqui você deve implementar a chamada real à API
      // Este é um exemplo simulado
      const response = await notasService.listarPorEmpresaCnpj(cnpj)
      setNotas(response)

      // Carregar relatórios
      const relatResponse = await notasService.listarRelatoriosPorCnpj(cnpj)
      setRelatorios(relatResponse)
    } catch (error) {
      console.error("Erro ao carregar notas:", error)
      message.error("Erro ao carregar notas fiscais")
    } finally {
      setLoading(false)
    }
  }

  const handleVerRelatorio = async (chave: string) => {
    try {
      setLoading(true)
      // Aqui você deve implementar a chamada real à API
      const relatorio = await notasService.buscarRelatorio(chave)
      setRelatorioSelecionado(relatorio)
      setRelatorioModalVisible(true)
    } catch (error) {
      console.error("Erro ao carregar relatório:", error)
      message.error("Erro ao carregar relatório")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadExcel = async (chave: string) => {
    try {
      setLoading(true)
      await notasService.downloadExcel(chave)
      message.success("Excel gerado e baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar Excel:", error)
      message.error("Erro ao baixar Excel")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadXml = () => {
    router.push(`/upload-xml?cnpj=${cnpj}`)
  }

  const filteredNotas = notas.filter(
    (nota) =>
      nota.chave.includes(searchText) ||
      nota.nomeRazaoSocial.toLowerCase().includes(searchText.toLowerCase()) ||
      (nota.dataEmissao && new Date(nota.dataEmissao).toLocaleDateString("pt-BR").includes(searchText)),
  )

  const notasColumns: ColumnsType<NotaFiscal> = [
    {
      title: "Chave",
      dataIndex: "chave",
      key: "chave",
      render: (text) => (
        <Tag
          style={{
            background: "linear-gradient(45deg, #1890ff, #40a9ff)",
            border: "none",
            color: "white",
            fontWeight: "500",
            padding: "4px 8px",
            borderRadius: "6px",
            fontFamily: "monospace",
            maxWidth: "200px",
          }}
        >
          <Text ellipsis style={{ color: "white", maxWidth: 180 }}>
            {text}
          </Text>
        </Tag>
      ),
    },
    {
      title: "Data Emissão",
      dataIndex: "dataEmissao",
      key: "dataEmissao",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ color: "#52c41a", marginRight: "6px" }} />
          <Text>{text ? new Date(text).toLocaleDateString("pt-BR") : "-"}</Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.dataEmissao).getTime() - new Date(b.dataEmissao).getTime(),
    },
    {
      title: "Valor Total",
      dataIndex: "valorTotal",
      key: "valorTotal",
      render: (value) => (
        <Tag
          style={{
            background: "rgba(82, 196, 26, 0.1)",
            color: "#52c41a",
            border: "1px solid rgba(82, 196, 26, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.valorTotal - b.valorTotal,
    },
    {
      title: "Total PIS",
      dataIndex: "totalPis",
      key: "totalPis",
      render: (value) => (
        <Tag
          style={{
            background: "rgba(24, 144, 255, 0.1)",
            color: "#1890ff",
            border: "1px solid rgba(24, 144, 255, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.totalPis - b.totalPis,
    },
    {
      title: "Total COFINS",
      dataIndex: "totalCofins",
      key: "totalCofins",
      render: (value) => (
        <Tag
          style={{
            background: "rgba(250, 140, 22, 0.1)",
            color: "#fa8c16",
            border: "1px solid rgba(250, 140, 22, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.totalCofins - b.totalCofins,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "#52c41a"
        let bgColor = "rgba(82, 196, 26, 0.1)"
        let borderColor = "rgba(82, 196, 26, 0.3)"
        let text = "Processada"

        if (status === "pendente") {
          color = "#fa8c16"
          bgColor = "rgba(250, 140, 22, 0.1)"
          borderColor = "rgba(250, 140, 22, 0.3)"
          text = "Pendente"
        } else if (status === "erro") {
          color = "#ff4d4f"
          bgColor = "rgba(255, 77, 79, 0.1)"
          borderColor = "rgba(255, 77, 79, 0.3)"
          text = "Erro"
        }

        return (
          <Tag
            style={{
              background: bgColor,
              color: color,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
              borderRadius: "6px",
            }}
          >
            {text}
          </Tag>
        )
      },
      filters: [
        { text: "Processada", value: "processada" },
        { text: "Pendente", value: "pendente" },
        { text: "Erro", value: "erro" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver relatório">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleVerRelatorio(record.chave)}
              style={{
                background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                border: "none",
                borderRadius: "6px",
              }}
            />
          </Tooltip>
          <Tooltip title="Baixar Excel">
            <Button
              type="primary"
              size="small"
              icon={<FileExcelOutlined />}
              onClick={() => handleDownloadExcel(record.chave)}
              style={{
                background: "linear-gradient(45deg, #52c41a, #73d13d)",
                border: "none",
                borderRadius: "6px",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const relatoriosColumns: ColumnsType<RelatorioNota> = [
    {
      title: "Chave",
      dataIndex: "chave",
      key: "chave",
      render: (text) => (
        <Tag
          style={{
            background: "linear-gradient(45deg, #1890ff, #40a9ff)",
            border: "none",
            color: "white",
            fontWeight: "500",
            padding: "4px 8px",
            borderRadius: "6px",
            fontFamily: "monospace",
            maxWidth: "200px",
          }}
        >
          <Text ellipsis style={{ color: "white", maxWidth: 180 }}>
            {text}
          </Text>
        </Tag>
      ),
    },
    {
      title: "Valor Produtos",
      dataIndex: "valorTotalProdutosMonofasicos",
      key: "valorTotalProdutosMonofasicos",
      render: (value) => (
        <Tag
          style={{
            background: "rgba(82, 196, 26, 0.1)",
            color: "#52c41a",
            border: "1px solid rgba(82, 196, 26, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.valorTotalProdutosMonofasicos - b.valorTotalProdutosMonofasicos,
    },
    {
      title: "Total PIS",
      dataIndex: "valorTotalPis",
      key: "valorTotalPis",
      render: (value) => (
        <Tag
          style={{
            background: "rgba(24, 144, 255, 0.1)",
            color: "#1890ff",
            border: "1px solid rgba(24, 144, 255, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.valorTotalPis - b.valorTotalPis,
    },
    {
      title: "Total COFINS",
      dataIndex: "valorTotalCofins",
      key: "valorTotalCofins",
      render: (value) => (
        <Tag
          style={{
            background: "rgba(250, 140, 22, 0.1)",
            color: "#fa8c16",
            border: "1px solid rgba(250, 140, 22, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.valorTotalCofins - b.valorTotalCofins,
    },
    {
      title: "Valor Restituição",
      dataIndex: "valorRestituicao",
      key: "valorRestituicao",
      render: (value, record) => (
        <Tag
          style={{
            background: record.direitoRestituicao ? "rgba(82, 196, 26, 0.1)" : "rgba(255, 77, 79, 0.1)",
            color: record.direitoRestituicao ? "#52c41a" : "#ff4d4f",
            border: record.direitoRestituicao ? "1px solid rgba(82, 196, 26, 0.3)" : "1px solid rgba(255, 77, 79, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {value ? `R$ ${value.toFixed(2)}` : "-"}
        </Tag>
      ),
      sorter: (a, b) => a.valorRestituicao - b.valorRestituicao,
    },
    {
      title: "Direito Restituição",
      dataIndex: "direitoRestituicao",
      key: "direitoRestituicao",
      render: (value) => (
        <Tag
          color={value ? "success" : "error"}
          style={{
            borderRadius: "6px",
          }}
        >
          {value ? "SIM" : "NÃO"}
        </Tag>
      ),
      filters: [
        { text: "Sim", value: true },
        { text: "Não", value: false },
      ],
      onFilter: (value, record) => record.direitoRestituicao === value,
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver relatório">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleVerRelatorio(record.chave)}
              style={{
                background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                border: "none",
                borderRadius: "6px",
              }}
            />
          </Tooltip>
          <Tooltip title="Baixar Excel">
            <Button
              type="primary"
              size="small"
              icon={<FileExcelOutlined />}
              onClick={() => handleDownloadExcel(record.chave)}
              style={{
                background: "linear-gradient(45deg, #52c41a, #73d13d)",
                border: "none",
                borderRadius: "6px",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

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
            Notas Fiscais da Empresa
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Visualize e gerencie as notas fiscais vinculadas à empresa
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
                Notas de {nomeEmpresa}
              </span>
            ),
          },
        ]}
      />

      {/* Empresa Info Card */}
      <Card style={{ ...cardStyle, marginBottom: "24px" }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={8}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BuildOutlined style={{ fontSize: "24px", color: "#1890ff", marginRight: "12px" }} />
              <div>
                <Text type="secondary">Empresa</Text>
                <Title level={4} style={{ margin: 0 }}>
                  {nomeEmpresa}
                </Title>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <FileTextOutlined style={{ fontSize: "24px", color: "#fa8c16", marginRight: "12px" }} />
              <div>
                <Text type="secondary">CNPJ</Text>
                <Title level={4} style={{ margin: 0 }}>
                  {cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                </Title>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleUploadXml}
              size="large"
              style={{
                background: "linear-gradient(45deg, #fa8c16, #ffa940)",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                height: "40px",
              }}
            >
              Fazer Upload de XML
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card style={cardStyle}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          items={[
            {
              key: "notas",
              label: (
                <span>
                  <FileTextOutlined /> Notas Fiscais ({notas.length})
                </span>
              ),
              children: (
                <>
                  {/* Search Bar */}
                  <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                    <Col xs={24} sm={12} md={8}>
                      <Input
                        placeholder="Buscar por chave ou data"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                        allowClear
                        style={{
                          borderRadius: "8px",
                          border: "2px solid #f0f0f0",
                          transition: "all 0.3s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1890ff"
                          e.target.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#f0f0f0"
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push("/empresas")}
                        style={{
                          borderRadius: "8px",
                        }}
                      >
                        Voltar para Empresas
                      </Button>
                    </Col>
                  </Row>

                  {/* Table */}
                  <Spin spinning={loading}>
                    {notas.length > 0 ? (
                      <Table
                        dataSource={filteredNotas}
                        columns={notasColumns}
                        rowKey="id"
                        pagination={{
                          pageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ["10", "20", "50"],
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} notas`,
                        }}
                        style={{
                          ".ant-table-thead > tr > th": {
                            background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                            fontWeight: "600",
                          },
                        }}
                      />
                    ) : (
                      <Empty
                        description={
                          <span>
                            Nenhuma nota fiscal encontrada para esta empresa.{" "}
                            <a onClick={handleUploadXml}>Fazer upload de XML</a>
                          </span>
                        }
                      />
                    )}
                  </Spin>
                </>
              ),
            },
            {
              key: "relatorios",
              label: (
                <span>
                  <FileExcelOutlined /> Relatórios ({relatorios.length})
                </span>
              ),
              children: (
                <>
                  {/* Search Bar */}
                  <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
                    <Col xs={24} sm={12} md={8}>
                      <Input
                        placeholder="Buscar por chave"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                        allowClear
                        style={{
                          borderRadius: "8px",
                          border: "2px solid #f0f0f0",
                          transition: "all 0.3s",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#1890ff"
                          e.target.style.boxShadow = "0 0 0 2px rgba(24, 144, 255, 0.1)"
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#f0f0f0"
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => message.info("Funcionalidade em desenvolvimento")}
                        style={{
                          background: "linear-gradient(45deg, #52c41a, #73d13d)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                      >
                        Baixar Todos os Relatórios
                      </Button>
                    </Col>
                  </Row>

                  {/* Table */}
                  <Spin spinning={loading}>
                    {relatorios.length > 0 ? (
                      <Table
                        dataSource={relatorios}
                        columns={relatoriosColumns}
                        rowKey="id"
                        pagination={{
                          pageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ["10", "20", "50"],
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} relatórios`,
                        }}
                        style={{
                          ".ant-table-thead > tr > th": {
                            background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                            fontWeight: "600",
                          },
                        }}
                      />
                    ) : (
                      <Empty
                        description={
                          <span>
                            Nenhum relatório encontrado para esta empresa.{" "}
                            <a onClick={handleUploadXml}>Fazer upload de XML</a>
                          </span>
                        }
                      />
                    )}
                  </Spin>
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* Modal de Relatório */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
              }}
            >
              <FileExcelOutlined style={{ color: "white", fontSize: "16px" }} />
            </div>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>Relatório da Nota Fiscal</span>
          </div>
        }
        open={relatorioModalVisible}
        onCancel={() => setRelatorioModalVisible(false)}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => setRelatorioModalVisible(false)}>Fechar</Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={() => relatorioSelecionado && handleDownloadExcel(relatorioSelecionado.chave)}
              style={{
                background: "linear-gradient(45deg, #52c41a, #73d13d)",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              Baixar Excel
            </Button>
          </div>
        }
        width={800}
        style={{ borderRadius: "12px" }}
      >
        {relatorioSelecionado && (
          <>
            <Divider style={{ margin: "16px 0 24px 0" }} />
            <Descriptions
              bordered
              column={1}
              labelStyle={{
                fontWeight: "600",
                background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                width: "250px",
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
              >
                <Tag
                  color="blue"
                  style={{
                    background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                    border: "none",
                    color: "white",
                    fontWeight: "500",
                    padding: "4px 12px",
                    borderRadius: "6px",
                  }}
                >
                  {relatorioSelecionado.chave}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <DollarOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
                    Valor Total Produtos Monofásicos
                  </span>
                }
              >
                <Text strong>R$ {relatorioSelecionado.valorTotalProdutosMonofasicos.toFixed(2)}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <DollarOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                    Valor Total PIS
                  </span>
                }
              >
                <Text strong>R$ {relatorioSelecionado.valorTotalPis.toFixed(2)}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <DollarOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                    Valor Total COFINS
                  </span>
                }
              >
                <Text strong>R$ {relatorioSelecionado.valorTotalCofins.toFixed(2)}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <DollarOutlined
                      style={{
                        color: relatorioSelecionado.direitoRestituicao ? "#52c41a" : "#ff4d4f",
                        marginRight: "8px",
                      }}
                    />
                    Valor de Restituição
                  </span>
                }
              >
                <Text strong style={{ color: relatorioSelecionado.direitoRestituicao ? "#52c41a" : "#ff4d4f" }}>
                  R$ {relatorioSelecionado.valorRestituicao.toFixed(2)}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span>
                    <FileTextOutlined
                      style={{
                        color: relatorioSelecionado.direitoRestituicao ? "#52c41a" : "#ff4d4f",
                        marginRight: "8px",
                      }}
                    />
                    Direito à Restituição
                  </span>
                }
              >
                <Tag
                  color={relatorioSelecionado.direitoRestituicao ? "success" : "error"}
                  style={{
                    fontWeight: "500",
                    padding: "4px 12px",
                    borderRadius: "6px",
                  }}
                >
                  {relatorioSelecionado.direitoRestituicao ? "SIM" : "NÃO"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  )
}

export default NotasEmpresaPage
