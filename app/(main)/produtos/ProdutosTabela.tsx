"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Typography,
  Table,
  Card,
  Input,
  Button,
  Space,
  Spin,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Divider,
} from "antd"
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  CalendarOutlined,
  NumberOutlined,
  FileTextOutlined,
  PercentageOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { produtosService } from "@/services/api"

const { Title, Text } = Typography

interface ProdutoMonofasico {
  codigo: string
  descricao: string
  ncm: string | null
  valorPis: number
  valorCofins: number
  inicioVigencia: string
  fimVigencia: string | null
}

const ProductsView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [produtos, setProdutos] = useState<ProdutoMonofasico[]>([])
  const [searchText, setSearchText] = useState<string>("")

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true)
        const data = await produtosService.listarProdutos()
        setProdutos(data)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        message.error("Erro ao carregar produtos")
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [])

  const handleDelete = async (codigo: string) => {
    try {
      setLoading(true)
      await produtosService.excluirProduto(codigo)
      setProdutos((prev) => prev.filter((produto) => produto.codigo !== codigo))
      message.success("Produto removido com sucesso")
    } catch (error) {
      console.error("Erro ao remover produto:", error)
      message.error("Erro ao remover produto")
    } finally {
      setLoading(false)
    }
  }

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
      (produto.ncm && produto.ncm.includes(searchText)) ||
      produto.codigo.includes(searchText),
  )

  // Estatísticas dos produtos
  const produtosAtivos = produtos.filter((p) => !p.fimVigencia || new Date(p.fimVigencia) > new Date()).length
  const mediaPis = produtos.length > 0 ? produtos.reduce((acc, p) => acc + p.valorPis, 0) / produtos.length : 0
  const mediaCofins = produtos.length > 0 ? produtos.reduce((acc, p) => acc + p.valorCofins, 0) / produtos.length : 0

  const columns: ColumnsType<ProdutoMonofasico> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      render: (codigo) => (
        <Tag
          style={{
            background: "linear-gradient(45deg, #1890ff, #40a9ff)",
            border: "none",
            color: "white",
            fontWeight: "500",
            padding: "4px 8px",
            borderRadius: "6px",
            fontFamily: "monospace",
          }}
        >
          {codigo}
        </Tag>
      ),
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (text) => (
        <Text strong style={{ color: "#262626" }}>
          {text}
        </Text>
      ),
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
    },
    {
      title: "NCM",
      dataIndex: "ncm",
      key: "ncm",
      render: (ncm) =>
        ncm ? (
          <Tag
            style={{
              background: "linear-gradient(45deg, #fa8c16, #ffa940)",
              border: "none",
              color: "white",
              fontWeight: "500",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            {ncm}
          </Tag>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "PIS (%)",
      dataIndex: "valorPis",
      key: "valorPis",
      render: (valor) => (
        <Tag
          color="blue"
          style={{
            background: "rgba(24, 144, 255, 0.1)",
            color: "#1890ff",
            border: "1px solid rgba(24, 144, 255, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {valor.toFixed(2)}%
        </Tag>
      ),
      sorter: (a, b) => a.valorPis - b.valorPis,
    },
    {
      title: "COFINS (%)",
      dataIndex: "valorCofins",
      key: "valorCofins",
      render: (valor) => (
        <Tag
          style={{
            background: "rgba(250, 140, 22, 0.1)",
            color: "#fa8c16",
            border: "1px solid rgba(250, 140, 22, 0.3)",
            fontWeight: "600",
            borderRadius: "6px",
          }}
        >
          {valor.toFixed(2)}%
        </Tag>
      ),
      sorter: (a, b) => a.valorCofins - b.valorCofins,
    },
    {
      title: "Início Vigência",
      dataIndex: "inicioVigencia",
      key: "inicioVigencia",
      render: (data) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ color: "#52c41a", marginRight: "6px" }} />
          <Text>{new Date(data).toLocaleDateString("pt-BR")}</Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.inicioVigencia).getTime() - new Date(b.inicioVigencia).getTime(),
    },
    {
      title: "Fim Vigência",
      dataIndex: "fimVigencia",
      key: "fimVigencia",
      render: (data) =>
        data ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CalendarOutlined style={{ color: "#ff4d4f", marginRight: "6px" }} />
            <Text>{new Date(data).toLocaleDateString("pt-BR")}</Text>
          </div>
        ) : (
          <Tag color="green" style={{ borderRadius: "6px" }}>
            Ativo
          </Tag>
        ),
      sorter: (a, b) => {
        if (!a.fimVigencia) return 1
        if (!b.fimVigencia) return -1
        return new Date(a.fimVigencia).getTime() - new Date(b.fimVigencia).getTime()
      },
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => message.info("Funcionalidade de edição em desenvolvimento")}
            style={{
              background: "linear-gradient(45deg, #1890ff, #40a9ff)",
              border: "none",
              borderRadius: "6px",
            }}
          />
          <Popconfirm
            title="Confirmar Exclusão"
            description="Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita."
            onConfirm={() => handleDelete(record.codigo)}
            okText="Sim, Remover"
            cancelText="Cancelar"
            okType="danger"
          >
            <Button danger size="small" type="primary" icon={<DeleteOutlined />} style={{ borderRadius: "6px" }} />
          </Popconfirm>
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
          <ShoppingOutlined
            style={{
              fontSize: "24px",
              color: "#1890ff",
              marginRight: "12px",
            }}
          />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Tabela de Produtos Monofásicos
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Visualize e gerencie a tabela de produtos monofásicos do sistema
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8} lg={6}>
          <Card
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Total de Produtos</span>}
              value={produtos.length}
              prefix={<FileTextOutlined style={{ color: "white" }} />}
              valueStyle={{ color: "white", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Produtos Ativos</span>}
              value={produtosAtivos}
              prefix={<BarChartOutlined style={{ color: "white" }} />}
              valueStyle={{ color: "white", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Média PIS</span>}
              value={mediaPis}
              precision={4}
              suffix="%"
              prefix={<PercentageOutlined style={{ color: "white" }} />}
              valueStyle={{ color: "white", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Média COFINS</span>}
              value={mediaCofins}
              precision={4}
              suffix="%"
              prefix={<PercentageOutlined style={{ color: "white" }} />}
              valueStyle={{ color: "white", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Card */}
      <Card style={cardStyle}>
        {/* Search and Info Bar */}
        <Row justify="space-between" align="middle" style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={10}>
            <Input
              placeholder="Buscar por código, descrição ou NCM"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              allowClear
              size="large"
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <NumberOutlined style={{ color: "#1890ff", marginRight: "8px", fontSize: "16px" }} />
              <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                Exibindo:
                <Tag
                  style={{
                    background: "linear-gradient(45deg, #52c41a, #73d13d)",
                    border: "none",
                    color: "white",
                    fontWeight: "600",
                    marginLeft: "8px",
                    borderRadius: "6px",
                  }}
                >
                  {filteredProdutos.length} de {produtos.length}
                </Tag>
              </Text>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        {/* Table */}
        <Spin spinning={loading}>
          <Table
            dataSource={filteredProdutos}
            columns={columns}
            rowKey={(record) => `${record.codigo}-${record.chaveNota || record.id || Math.random()}`}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} produtos`,
              style: { marginTop: "16px" },
            }}
            scroll={{ x: 1200 }}
          />


        </Spin>
      </Card>
    </div>
  )
}

export default ProductsView
