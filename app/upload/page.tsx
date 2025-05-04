"use client"

import { useState } from "react"
import { Layout, Typography, Card, Button, Upload, message, Table, Spin, Divider } from "antd"
import {
  InboxOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import Link from "next/link"
import type { UploadProps } from "antd"
import type { ColumnsType } from "antd/es/table"

const { Dragger } = Upload
const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

interface NotaFiscal {
  chave: string
  cnpjEmitente: string
  nomeRazaoSocial: string
  dataEmissao: string
  valorTotal: number
  totalPis: number
  totalCofins: number
  produtosMonofasicos: Produto[]
}

interface Produto {
  descricao: string
  ncm: string
  valor: number
  valorPis: number
  valorCofins: number
  selecionado?: boolean
}

export default function UploadPage() {
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([])
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null)

  const handleUpload = async (file: File) => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulando a chamada à API
      // Na implementação real, você faria:
      // const response = await fetch('/api/xml/analisar', {
      //   method: 'POST',
      //   body: formData
      // })
      // const data = await response.json()

      // Simulando resposta da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData: NotaFiscal = {
        chave: `NFe${Math.random().toString().substring(2, 16)}`,
        cnpjEmitente: "12.345.678/0001-99",
        nomeRazaoSocial: "Empresa Exemplo LTDA",
        dataEmissao: new Date().toISOString(),
        valorTotal: Number.parseFloat((Math.random() * 10000).toFixed(2)),
        totalPis: Number.parseFloat((Math.random() * 300).toFixed(2)),
        totalCofins: Number.parseFloat((Math.random() * 1000).toFixed(2)),
        produtosMonofasicos: Array(5)
          .fill(null)
          .map((_, i) => ({
            descricao: `Produto ${i + 1}`,
            ncm: `${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`,
            valor: Number.parseFloat((Math.random() * 1000).toFixed(2)),
            valorPis: Number.parseFloat((Math.random() * 30).toFixed(2)),
            valorCofins: Number.parseFloat((Math.random() * 100).toFixed(2)),
            selecionado: false,
          })),
      }

      setNotasFiscais((prev) => [...prev, mockData])
      messageApi.success(`Nota fiscal ${file.name} analisada com sucesso!`)
    } catch (error) {
      console.error("Erro ao analisar XML:", error)
      messageApi.error(`Erro ao analisar o arquivo ${file.name}`)
    } finally {
      setLoading(false)
    }
  }

  const props: UploadProps = {
    name: "file",
    multiple: true,
    accept: ".xml",
    showUploadList: false,
    beforeUpload: (file) => {
      handleUpload(file)
      return false // Impede o comportamento padrão de upload
    },
    onChange(info) {
      const { status } = info.file
      if (status !== "uploading") {
        console.log(info.file, info.fileList)
      }
    },
  }

  const handleSelecionarProduto = (notaIndex: number, produtoIndex: number) => {
    setNotasFiscais((prev) => {
      const notas = [...prev]
      const produtos = [...notas[notaIndex].produtosMonofasicos]
      produtos[produtoIndex] = {
        ...produtos[produtoIndex],
        selecionado: !produtos[produtoIndex].selecionado,
      }
      notas[notaIndex] = {
        ...notas[notaIndex],
        produtosMonofasicos: produtos,
      }
      return notas
    })
  }

  const handleSalvarProdutos = async (nota: NotaFiscal) => {
    setLoading(true)

    try {
      const produtosSelecionados = nota.produtosMonofasicos.filter((p) => p.selecionado)

      if (produtosSelecionados.length === 0) {
        messageApi.warning("Selecione pelo menos um produto para salvar")
        setLoading(false)
        return
      }

      const payload = {
        chave: nota.chave,
        produtos: produtosSelecionados.map(({ descricao, ncm, valor, valorPis, valorCofins }) => ({
          descricao,
          ncm,
          valor,
          valorPis,
          valorCofins,
        })),
      }

      // Simulando a chamada à API
      // Na implementação real, você faria:
      // await fetch('/api/salvar', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(payload)
      // })

      // Simulando resposta da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      messageApi.success("Produtos salvos com sucesso!")

      // Remover a nota da lista após salvar
      setNotasFiscais((prev) => prev.filter((n) => n.chave !== nota.chave))
      setSelectedNota(null)
    } catch (error) {
      console.error("Erro ao salvar produtos:", error)
      messageApi.error("Erro ao salvar produtos")
    } finally {
      setLoading(false)
    }
  }

  const notasColumns: ColumnsType<NotaFiscal> = [
    {
      title: "Chave",
      dataIndex: "chave",
      key: "chave",
      render: (text) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Emitente",
      dataIndex: "nomeRazaoSocial",
      key: "nomeRazaoSocial",
    },
    {
      title: "Data Emissão",
      dataIndex: "dataEmissao",
      key: "dataEmissao",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Valor Total",
      dataIndex: "valorTotal",
      key: "valorTotal",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Total PIS",
      dataIndex: "totalPis",
      key: "totalPis",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Total COFINS",
      dataIndex: "totalCofins",
      key: "totalCofins",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Button type="primary" onClick={() => setSelectedNota(record)}>
          Ver Produtos
        </Button>
      ),
    },
  ]

  const produtosColumns: ColumnsType<Produto> = [
    {
      title: "Selecionado",
      dataIndex: "selecionado",
      key: "selecionado",
      render: (selecionado, _, index) => (
        <Button
          type={selecionado ? "primary" : "default"}
          shape="circle"
          icon={selecionado ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          onClick={() =>
            handleSelecionarProduto(
              notasFiscais.findIndex((n) => n.chave === selectedNota?.chave),
              index,
            )
          }
        />
      ),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "NCM",
      dataIndex: "ncm",
      key: "ncm",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Valor PIS",
      dataIndex: "valorPis",
      key: "valorPis",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Valor COFINS",
      dataIndex: "valorCofins",
      key: "valorCofins",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Header
        style={{
          padding: "0 16px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
            Voltar
          </Button>
        </Link>
        <Title level={4} style={{ margin: 0 }}>
          Upload e Análise de XML
        </Title>
      </Header>
      <Content style={{ padding: "24px 16px" }}>
        <Spin spinning={loading} tip="Processando...">
          <Card>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Clique ou arraste arquivos XML para esta área</p>
              <p className="ant-upload-hint">Suporte para upload de um ou múltiplos arquivos XML de notas fiscais.</p>
            </Dragger>
          </Card>

          {notasFiscais.length > 0 && !selectedNota && (
            <Card style={{ marginTop: 16 }}>
              <Title level={5}>
                <FileTextOutlined /> Notas Fiscais Analisadas
              </Title>
              <Table dataSource={notasFiscais} columns={notasColumns} rowKey="chave" pagination={false} />
            </Card>
          )}

          {selectedNota && (
            <Card style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={5}>
                  <FileTextOutlined /> Produtos da Nota {selectedNota.chave}
                </Title>
                <Button onClick={() => setSelectedNota(null)}>Voltar para Lista de Notas</Button>
              </div>

              <Divider />

              <div style={{ marginBottom: 16 }}>
                <Text strong>Emitente:</Text> {selectedNota.nomeRazaoSocial} ({selectedNota.cnpjEmitente})
                <br />
                <Text strong>Data Emissão:</Text> {new Date(selectedNota.dataEmissao).toLocaleDateString()}
                <br />
                <Text strong>Valor Total:</Text> R$ {selectedNota.valorTotal.toFixed(2)}
              </div>

              <Table
                dataSource={selectedNota.produtosMonofasicos}
                columns={produtosColumns}
                rowKey="descricao"
                pagination={false}
              />

              <div style={{ marginTop: 16, textAlign: "right" }}>
                <Button type="primary" onClick={() => handleSalvarProdutos(selectedNota)} loading={loading}>
                  Salvar Produtos Selecionados
                </Button>
              </div>
            </Card>
          )}
        </Spin>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <Text>Versão: 1.0 - Copyright © {new Date().getFullYear()}</Text>
        <br />
        <Text>Todos os direitos reservados The System</Text>
      </Footer>
    </Layout>
  )
}
