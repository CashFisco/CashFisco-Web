"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Typography, Table, Card, Input, Button, Space, Spin, Tag, Popconfirm, message } from "antd"
import { SearchOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"
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

  const columns: ColumnsType<ProdutoMonofasico> = [
    {
      title: "Código",
      dataIndex: "codigo",
      key: "codigo",
      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
    },
    {
      title: "NCM",
      dataIndex: "ncm",
      key: "ncm",
      render: (ncm) => ncm ? <Tag color="blue">{ncm}</Tag> : '-',
    },
    {
      title: "PIS (%)",
      dataIndex: "valorPis",
      key: "valorPis",
      render: (valor) => valor.toFixed(4),
      sorter: (a, b) => a.valorPis - b.valorPis,
    },
    {
      title: "COFINS (%)",
      dataIndex: "valorCofins",
      key: "valorCofins",
      render: (valor) => valor.toFixed(4),
      sorter: (a, b) => a.valorCofins - b.valorCofins,
    },
    {
      title: "Início Vigência",
      dataIndex: "inicioVigencia",
      key: "inicioVigencia",
      render: (data) => new Date(data).toLocaleDateString(),
      sorter: (a, b) => new Date(a.inicioVigencia).getTime() - new Date(b.inicioVigencia).getTime(),
    },
    {
      title: "Fim Vigência",
      dataIndex: "fimVigencia",
      key: "fimVigencia",
      render: (data) => data ? new Date(data).toLocaleDateString() : '-',
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
            icon={<EditOutlined />}
            size="small"
            onClick={() => message.info("Funcionalidade de edição em desenvolvimento")}
          />
          <Popconfirm
            title="Tem certeza que deseja remover este produto?"
            onConfirm={() => handleDelete(record.codigo)}
            okText="Sim"
            cancelText="Não"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Tabela de Produtos Monofásicos</Title>
      <Text type="secondary">Visualize e gerencie a tabela de produtos monofásicos</Text>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Input
            placeholder="Buscar por código, descrição ou NCM"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Text>
            Total de produtos: <Tag color="green">{produtos.length}</Tag>
          </Text>
        </div>

        <Spin spinning={loading}>
          <Table 
            dataSource={filteredProdutos} 
            columns={columns} 
            rowKey="codigo"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100']
            }} 
          />
        </Spin>
      </Card>
    </div>
  )
}

export default ProductsView