"use client"

import type React from "react"
import { useState } from "react"
import { Typography, Card, Table, Spin, message, Space, Descriptions, Input, Alert, Button } from "antd"
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { relatoriosService, type RelatorioNotaFiscalDTO, type ProdutoNota } from "@/services/api"

const { Title, Text } = Typography

// Interface para o estado do alerta
interface ApiAlert {
  type: "success" | "error" | "warning"
  message: string
}

const ConsultaAuditoria: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [auditoria, setAuditoria] = useState<RelatorioNotaFiscalDTO | null>(null)
  
  const [apiAlert, setApiAlert] = useState<ApiAlert | null>(null)

  const handleBuscarPorChave = async (chave: string) => {
    setAuditoria(null)
    setApiAlert(null)

    if (!chave || chave.trim() === "") {
      setApiAlert({ type: "warning", message: "Por favor, informe a chave da NF-e." })
      return
    }

    const chaveLimpa = chave.replace(/\D/g, "")

    if (chaveLimpa.length !== 44) {
      setApiAlert({ type: "error", message: "Chave inválida! A chave da NF-e deve conter exatamente 44 dígitos." })
      return
    }

    setLoading(true)
    try {
      const data = await relatoriosService.buscarAuditoriaPorChave(chaveLimpa)
      setAuditoria(data)
      setApiAlert({ type: "success", message: "Auditoria encontrada com sucesso!" })
    } catch (error: any) {
      console.error("Erro ao buscar auditoria:", error)
      const errorMessage = error.response?.status === 404 
        ? "Nenhuma auditoria encontrada para a chave informada." 
        : "Ocorreu um erro ao realizar a consulta."
      setApiAlert({ type: "error", message: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadExcel = async () => {
    if (!auditoria?.chave) return

    setLoading(true)
    try {
      await relatoriosService.downloadAuditoriaExcel(auditoria.chave)
      message.success("Download do relatório iniciado.")
    } catch (error) {
      console.error("Erro ao baixar Excel:", error)
      message.error("Erro ao exportar para Excel")
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<ProdutoNota> = [
    { title: "Produto", dataIndex: "descricao", key: "descricao" },
    { title: "NCM", dataIndex: "ncm", key: "ncm" },
    { title: "Valor", dataIndex: "valorProduto", render: (v) => `R$ ${v.toFixed(2)}` },
    {
      title: "Dif. PIS",
      dataIndex: "valorDiferencaPis",
      key: "valorDiferencaPis",
      render: (v) => <Text type={v > 0 ? "success" : "secondary"}>{`R$ ${v.toFixed(2)}`}</Text>,
    },
    {
      title: "Dif. COFINS",
      dataIndex: "valorDiferencaCofins",
      key: "valorDiferencaCofins",
      render: (v) => <Text type={v > 0 ? "success" : "secondary"}>{`R$ ${v.toFixed(2)}`}</Text>,
    },
  ]

  return (
    <div style={{ padding: "24px", background: "#f5f5f5" }}>
      <div style={{ marginBottom: "32px" }}>
        <Title level={2}>Consulta de Auditoria</Title>
        <Text type="secondary">Consulte o resultado de uma auditoria já salva utilizando a chave da NF-e.</Text>
      </div>

      <Card style={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Title level={4}>Buscar por Chave de Acesso</Title>
        <Input.Search
          placeholder="Digite a chave completa da NF-e (44 dígitos)"
          enterButton={
            <Button type="primary" loading={loading} icon={<SearchOutlined />}>
              Buscar
            </Button>
          }
          size="large"
          onSearch={handleBuscarPorChave}
          allowClear
        />

        <Spin spinning={loading} style={{ width: '100%', marginTop: 24 }}>
          {apiAlert && (
            <Alert
              message={apiAlert.message}
              type={apiAlert.type}
              showIcon
              closable
              onClose={() => setApiAlert(null)}
              style={{ marginTop: 24, borderRadius: '8px' }}
            />
          )}

          {auditoria && (
            <div style={{ marginTop: 24 }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Chave" span={2}>{auditoria.chave}</Descriptions.Item>
                <Descriptions.Item label="Emitente">
                  {auditoria.nomeRazaoSocial} ({auditoria.cnpjEmitente})
                </Descriptions.Item>
                <Descriptions.Item label="Data Emissão">
                  {dayjs(auditoria.dataEmissao).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Total da Restituição" span={2}>
                  <Text strong style={{ fontSize: 16 }} type={auditoria.direitoRestituicao ? "success" : "danger"}>
                    R$ {auditoria.valorRestituicao.toFixed(2)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>

              <Table
                dataSource={auditoria.produtos}
                columns={columns}
                // CORREÇÃO: Usando 'descricao' como chave. É mais estável e recomendado que usar o index.
                rowKey="descricao"
                pagination={false}
                style={{ marginTop: 20 }}
                summary={(pageData) => {
                  let totalDiferencaPis = 0
                  let totalDiferencaCofins = 0

                  pageData.forEach(({ valorDiferencaPis, valorDiferencaCofins }) => {
                    totalDiferencaPis += valorDiferencaPis
                    totalDiferencaCofins += valorDiferencaCofins
                  })

                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <Text strong>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong type="success">
                          R$ {totalDiferencaPis.toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <Text strong type="success">
                          R$ {totalDiferencaCofins.toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }}
              />

              <div style={{ marginTop: 20, textAlign: "right" }}>
                <Button type="primary" icon={<FileExcelOutlined />} onClick={handleDownloadExcel} loading={loading}>
                  Exportar para Excel
                </Button>
              </div>
            </div>
          )}
        </Spin>
      </Card>
    </div>
  )
}

export default ConsultaAuditoria