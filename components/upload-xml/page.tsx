"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Typography,
  Upload,
  Button,
  Table,
  Spin,
  Tabs,
  Card,
  Divider,
  Tag,
  Space,
  message,
  Checkbox,
  Input,
  Row,
  Col,
  Badge,
  Steps,
  Tooltip,
  Progress,
  Statistic,
  Radio,
  Alert,
  List,
  Modal,
} from "antd"
import {
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  FileExcelOutlined,
  BarChartOutlined,
  SyncOutlined,
  CloudUploadOutlined,
  FolderOpenOutlined,
  DollarOutlined,
  CalendarOutlined,
  BuildingOutlined,
  ThunderboltOutlined,
  FileAddOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import type { ColumnsType } from "antd/es/table"
import {
  xmlService,
  type NotaFiscal,
  type RelatorioFinal,
  type RespostaSalvar,
  type ProdutoNota,
  type NotaComSelecao,
  type ProdutoComSelecao,
  type RelatorioNotaFiscalDTO,
} from "@/services/api"

const { Dragger } = Upload
const { Title, Text } = Typography
const { TabPane } = Tabs
const { Search } = Input
const { Step } = Steps

// Tipos para análise em lote
interface ProcessingFile {
  file: File
  status: "waiting" | "processing" | "success" | "error"
  nota?: NotaComSelecao
  error?: string
}

const UploadXml: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [notasFiscais, setNotasFiscais] = useState<NotaComSelecao[]>([])
  const [selectedNota, setSelectedNota] = useState<NotaComSelecao | null>(null)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [searchText, setSearchText] = useState<string>("")
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [relatorio, setRelatorio] = useState<RelatorioFinal | null>(null)
  const [relatorioModalVisible, setRelatorioModalVisible] = useState<boolean>(false)
  const [tabelaAtiva, setTabelaAtiva] = useState(false)
  const [resumoRelatorio, setResumoRelatorio] = useState<RelatorioNotaFiscalDTO | null>(null)
  const [showResumo, setShowResumo] = useState(false)

  // Estados para análise em lote
  const [analysisMode, setAnalysisMode] = useState<"individual" | "batch">("individual")
  const [batchFiles, setBatchFiles] = useState<ProcessingFile[]>([])
  const [batchProcessing, setBatchProcessing] = useState(false)
  const [batchModalVisible, setBatchModalVisible] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  // Atualiza o selectedNota quando notasFiscais muda
  useEffect(() => {
    if (selectedNota) {
      const updatedNota = notasFiscais.find((nota) => nota.chave === selectedNota.chave)
      if (updatedNota) {
        setSelectedNota(updatedNota)
      }
    }
  }, [notasFiscais, selectedNota])

  // Upload individual (mantém o funcionamento atual)
  const handleIndividualUpload = async (fileList: FileList) => {
    setLoading(true)
    try {
      const fd = new FormData()
      Array.from(fileList).forEach((f) => fd.append("files", f))

      const respostas = await xmlService.analisarXml(fd)

      const notasComSelecao: NotaComSelecao[] = respostas.map((nf) => ({
        ...nf,
        produtosMonofasicos: nf.produtos.map((produto, idx) => ({
          ...produto,
          id: produto.id ?? `${nf.chave}-${idx}`,
          selecionado: false,
          valorProduto: produto.valorProduto ?? 0,
          valorNotaPis: produto.valorNotaPis ?? 0,
          valorNotaCofins: produto.valorNotaCofins ?? 0,
        })),
      }))

      setNotasFiscais((prev) => [...prev, ...notasComSelecao])
      message.success(`${notasComSelecao.length} nota(s) analisada(s) com sucesso!`)
      setActiveTab("notas")
      setCurrentStep(0)
    } catch (err) {
      console.error("Erro ao analisar XML(s):", err)
      message.error("Erro ao analisar o(s) arquivo(s)")
    } finally {
      setLoading(false)
    }
  }

  // Upload em lote
  const handleBatchUpload = async (fileList: FileList) => {
    const files = Array.from(fileList)

    if (files.length > 50) {
      message.error("Máximo de 50 arquivos permitidos por vez")
      return
    }

    // Inicializa os arquivos para processamento
    const processingFiles: ProcessingFile[] = files.map((file) => ({
      file,
      status: "waiting",
    }))

    setBatchFiles(processingFiles)
    setBatchModalVisible(true)
    setBatchProcessing(true)
    setProcessedCount(0)

    // Processa arquivo por arquivo
    for (let i = 0; i < processingFiles.length; i++) {
      const currentFile = processingFiles[i]

      // Atualiza status para processando
      setBatchFiles((prev) => prev.map((f, index) => (index === i ? { ...f, status: "processing" } : f)))

      try {
        const fd = new FormData()
        fd.append("files", currentFile.file)

        const respostas = await xmlService.analisarXml(fd)

        if (respostas && respostas.length > 0) {
          const notaComSelecao: NotaComSelecao = {
            ...respostas[0],
            produtosMonofasicos: respostas[0].produtos.map((produto, idx) => ({
              ...produto,
              id: produto.id ?? `${respostas[0].chave}-${idx}`,
              selecionado: false,
              valorProduto: produto.valorProduto ?? 0,
              valorNotaPis: produto.valorNotaPis ?? 0,
              valorNotaCofins: produto.valorNotaCofins ?? 0,
            })),
          }

          // Atualiza status para sucesso
          setBatchFiles((prev) =>
            prev.map((f, index) => (index === i ? { ...f, status: "success", nota: notaComSelecao } : f)),
          )

          // Adiciona à lista de notas
          setNotasFiscais((prev) => [...prev, notaComSelecao])
        } else {
          throw new Error("Resposta inválida da API")
        }
      } catch (error) {
        console.error(`Erro ao processar ${currentFile.file.name}:`, error)

        // Atualiza status para erro
        setBatchFiles((prev) =>
          prev.map((f, index) =>
            index === i
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Erro desconhecido",
                }
              : f,
          ),
        )
      }

      setProcessedCount(i + 1)

      // Pequena pausa entre processamentos para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setBatchProcessing(false)

    const successCount = processingFiles.filter(
      (f) => batchFiles.find((bf) => bf.file.name === f.file.name)?.status === "success",
    ).length

    message.success(`Processamento concluído! ${successCount} de ${files.length} arquivos processados com sucesso.`)
  }

  const handleUpload = async (fileList: FileList) => {
    if (analysisMode === "individual") {
      await handleIndividualUpload(fileList)
    } else {
      await handleBatchUpload(fileList)
    }
  }

  const handleSelecionarProduto = (produto: ProdutoComSelecao) => {
    if (!selectedNota) return

    setNotasFiscais((prev) => {
      return prev.map((nota) => {
        if (nota.chave !== selectedNota.chave) return nota

        return {
          ...nota,
          produtosMonofasicos: nota.produtosMonofasicos.map((p) =>
            p.id !== produto.id ? p : { ...p, selecionado: !p.selecionado },
          ),
        }
      })
    })

    setSelectedNota((nota) =>
      nota && nota.chave === produto.chave
        ? {
            ...nota,
            produtosMonofasicos: nota.produtosMonofasicos.map((p) =>
              p.id !== produto.id ? p : { ...p, selecionado: !p.selecionado },
            ),
          }
        : nota,
    )
  }

  const handleSelectAllProdutos = (checked: boolean) => {
    setSelectAll(checked)
    if (!selectedNota) return

    setNotasFiscais((prev) =>
      prev.map((nota) => {
        if (nota.chave !== selectedNota.chave) return nota

        const updated = nota.produtosMonofasicos.map((p) => {
          const matches =
            !searchText || p.descricao.toLowerCase().includes(searchText.toLowerCase()) || p.ncm?.includes(searchText)
          return matches ? { ...p, selecionado: checked } : p
        })

        return { ...nota, produtosMonofasicos: updated }
      }),
    )
  }

  const handleSalvarProdutos = async (): Promise<RespostaSalvar | void> => {
    if (!selectedNota) return

    setLoading(true)
    try {
      const produtosSelecionados = selectedNota.produtosMonofasicos.filter((p) => p.selecionado)
      if (produtosSelecionados.length === 0) {
        message.warning("Selecione ao menos um produto para salvar")
        return
      }

      const produtosParaSalvar: ProdutoNota[] = produtosSelecionados.map((p) => ({
        descricao: p.descricao,
        ncm: p.ncm,
        valorProduto: p.valorProduto,
        valorNotaPis: p.valorNotaPis,
        valorNotaCofins: p.valorNotaCofins,
        aliquotaNotaPis: p.aliquotaNotaPis,
        aliquotaNotaCofins: p.aliquotaNotaCofins,
        aliquotaTabelaPis: p.aliquotaTabelaPis ?? null,
        aliquotaTabelaCofins: p.aliquotaTabelaCofins ?? null,
      }))

      const payload = {
        chave: selectedNota.chave,
        cnpjEmitente: selectedNota.cnpjEmitente!,
        nomeRazaoSocial: selectedNota.nomeRazaoSocial!,
        dataEmissao: selectedNota.dataEmissao!,
        produtos: produtosParaSalvar,
      }

      await xmlService.salvarProdutos(payload)
      message.success("Produtos e Nota Fiscal salvos com sucesso!")
      setTabelaAtiva(true)
      setCurrentStep(1)
    } catch (err) {
      console.error(err)
      message.error("Erro ao salvar produtos")
    } finally {
      setLoading(false)
    }
  }

  const handleAtualizarTabelaSPED = async () => {
    if (!selectedNota) return

    setLoading(true)
    try {
      const monofasicos = selectedNota.produtosMonofasicos
      const selecionados = monofasicos.filter((p) => p.selecionado)
      if (!selecionados.length) {
        message.warning("Selecione pelo menos um produto para atualizar")
        return
      }

      const produtosParaAtualizar = selecionados.map((p) => {
        const pisNum = p.rawAliquotaTabelaPis
          ? Number.parseFloat(p.rawAliquotaTabelaPis.replace(",", "."))
          : (p.aliquotaTabelaPis ?? 0)
        const cofNum = p.rawAliquotaTabelaCofins
          ? Number.parseFloat(p.rawAliquotaTabelaCofins.replace(",", "."))
          : (p.aliquotaTabelaCofins ?? 0)

        return {
          descricao: p.descricao,
          ncm: p.ncm,
          valorProduto: p.valorProduto,
          valorNotaPis: p.valorNotaPis,
          valorNotaCofins: p.valorNotaCofins,
          aliquotaNotaPis: p.aliquotaNotaPis,
          aliquotaNotaCofins: p.aliquotaNotaCofins,
          aliquotaTabelaPis: pisNum,
          aliquotaTabelaCofins: cofNum,
        }
      })

      const resposta = await xmlService.atualizarTabelaSPED(selectedNota.chave, produtosParaAtualizar)

      setNotasFiscais((prev) =>
        prev.map((nota) =>
          nota.chave === selectedNota.chave
            ? {
                ...nota,
                produtosMonofasicos: nota.produtosMonofasicos.map((orig) => {
                  const upd = resposta.produtos.find((p) => p.descricao === orig.descricao)
                  return upd
                    ? { ...orig, ...upd, rawAliquotaTabelaPis: undefined, rawAliquotaTabelaCofins: undefined }
                    : orig
                }),
              }
            : nota,
        ),
      )

      message.success("Tabela SPED aplicada e diferenças calculadas!")

      const resumo = await xmlService.gerarRelatorio(selectedNota.chave)
      setResumoRelatorio(resumo)
      setShowResumo(true)
      setCurrentStep(2)
    } catch (err) {
      console.error(err)
      message.error("Erro ao atualizar tabela SPED")
    } finally {
      setLoading(false)
    }
  }

  const handleGerarRelatorio = async () => {
    if (!selectedNota) return

    setLoading(true)

    try {
      const relatorioData = await xmlService.gerarRelatorio(selectedNota.chave)
      setRelatorio(relatorioData)
      setRelatorioModalVisible(true)
      message.success("Relatório gerado com sucesso!")
      setCurrentStep(4)
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      message.error("Erro ao gerar relatório")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadExcel = async () => {
    if (!selectedNota) return

    setLoading(true)

    try {
      await xmlService.downloadExcel(selectedNota.chave)
      message.success("Excel gerado e baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao baixar Excel:", error)
      message.error("Erro ao baixar Excel")
    } finally {
      setLoading(false)
    }
  }

  const handleFinalizarProcesso = () => {
    if (selectedNota) {
      setNotasFiscais((prev) => prev.filter((n) => n.chave !== selectedNota.chave))
      setSelectedNota(null)
      setCurrentStep(0)
      setRelatorio(null)
    }
  }

  useEffect(() => {
    if (!selectedNota) return
    const filtrados = selectedNota.produtosMonofasicos.filter(
      (p) => p.descricao.toLowerCase().includes(searchText.toLowerCase()) || p.ncm?.includes(searchText),
    )
    const todos = filtrados.length > 0 && filtrados.every((p) => p.selecionado)
    setSelectAll(todos)
  }, [searchText, selectedNota])

  const props: UploadProps = {
    name: "files",
    multiple: analysisMode === "batch",
    accept: ".xml",
    showUploadList: false,
    beforeUpload: (_file, fileList) => {
      handleUpload(fileList as FileList)
      return false
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log("Arquivos selecionados:", info.fileList)
      }
    },
  }

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
      title: "Emitente",
      dataIndex: "nomeRazaoSocial",
      key: "nomeRazaoSocial",
      render: (text) => (
        <Text strong style={{ color: "#262626" }}>
          {text}
        </Text>
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
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => setSelectedNota(record)}
          style={{
            background: "linear-gradient(45deg, #1890ff, #40a9ff)",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Ver Produtos
        </Button>
      ),
    },
  ]

  const totalSelecionados = selectedNota ? selectedNota.produtosMonofasicos.filter((p) => p.selecionado).length : 0

  const produtosColumns: ColumnsType<ProdutoComSelecao> = [
    {
      title: (
        <Checkbox
          checked={selectAll}
          onChange={(e) => handleSelectAllProdutos(e.target.checked)}
          style={{ fontWeight: "600" }}
        >
          Selecionar
        </Checkbox>
      ),
      dataIndex: "selecionado",
      key: "selecionado",
      render: (_, record) => <Checkbox checked={record.selecionado} onChange={() => handleSelecionarProduto(record)} />,
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (text) => (
        <Text strong style={{ color: "#262626" }}>
          {text || "-"}
        </Text>
      ),
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
      title: "Valor Unitário",
      dataIndex: "valorProduto",
      key: "valorProduto",
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
          {value !== null && value !== undefined ? `R$ ${Number(value).toFixed(2).replace(".", ",")}` : "-"}
        </Tag>
      ),
    },
    {
      title: "Valor PIS",
      dataIndex: "valorNotaPis",
      key: "valorNotaPis",
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
          {value !== null && value !== undefined ? `R$ ${Number(value).toFixed(2).replace(".", ",")}` : "-"}
        </Tag>
      ),
    },
    {
      title: "Valor COFINS",
      dataIndex: "valorNotaCofins",
      key: "valorNotaCofins",
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
          {value !== null && value !== undefined ? `R$ ${Number(value).toFixed(2).replace(".", ",")}` : "-"}
        </Tag>
      ),
    },
    {
      title: "Alíq. PIS",
      dataIndex: "aliquotaNotaPis",
      key: "aliquotaNotaPis",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "6px" }}>
          {value !== null && value !== undefined ? `${Number(value).toFixed(2).replace(".", ",")}%` : "-"}
        </Tag>
      ),
    },
    {
      title: "Alíq. COFINS",
      dataIndex: "aliquotaNotaCofins",
      key: "aliquotaNotaCofins",
      render: (value) => (
        <Tag color="orange" style={{ borderRadius: "6px" }}>
          {value !== null && value !== undefined ? `${Number(value).toFixed(2).replace(".", ",")}%` : "-"}
        </Tag>
      ),
    },

    ...(tabelaAtiva
      ? [
          {
            title: "Alíq. PIS Tabela (%)",
            dataIndex: "aliquotaTabelaPis",
            key: "aliquotaTabelaPis",
            render: (_, record) => {
              const display =
                record.rawAliquotaTabelaPis != null
                  ? record.rawAliquotaTabelaPis
                  : record.aliquotaTabelaPis != null
                    ? record.aliquotaTabelaPis.toFixed(2).replace(".", ",")
                    : ""
              return (
                <Input
                  value={display}
                  onChange={(e) => handleRawChange(e.target.value, record.id, "rawAliquotaTabelaPis")}
                  onBlur={() => handleBlur(record.id, "rawAliquotaTabelaPis", "aliquotaTabelaPis")}
                  suffix="%"
                  placeholder="0,00"
                  disabled={!record.selecionado}
                  style={{
                    borderRadius: "6px",
                    border: record.selecionado ? "2px solid #1890ff" : "1px solid #d9d9d9",
                  }}
                />
              )
            },
          },
          {
            title: "Alíq. COFINS Tabela (%)",
            dataIndex: "aliquotaTabelaCofins",
            key: "aliquotaTabelaCofins",
            render: (_, record) => {
              const display =
                record.rawAliquotaTabelaCofins != null
                  ? record.rawAliquotaTabelaCofins
                  : record.aliquotaTabelaCofins != null
                    ? record.aliquotaTabelaCofins.toFixed(2).replace(".", ",")
                    : ""
              return (
                <Input
                  value={display}
                  onChange={(e) => handleRawChange(e.target.value, record.id, "rawAliquotaTabelaCofins")}
                  onBlur={() => handleBlur(record.id, "rawAliquotaTabelaCofins", "aliquotaTabelaCofins")}
                  suffix="%"
                  placeholder="0,00"
                  disabled={!record.selecionado}
                  style={{
                    borderRadius: "6px",
                    border: record.selecionado ? "2px solid #fa8c16" : "1px solid #d9d9d9",
                  }}
                />
              )
            },
          },
        ]
      : []),
  ]

  const handleRawChange = (
    text: string,
    produtoId: string,
    rawField: "rawAliquotaTabelaPis" | "rawAliquotaTabelaCofins",
  ) => {
    if (/^[0-9.,]*$/.test(text)) {
      setNotasFiscais((prev) =>
        prev.map((nota) =>
          nota.chave !== selectedNota?.chave
            ? nota
            : {
                ...nota,
                produtosMonofasicos: nota.produtosMonofasicos.map((p) =>
                  p.id !== produtoId ? p : { ...p, [rawField]: text },
                ),
              },
        ),
      )
      setSelectedNota(
        (n) =>
          n && {
            ...n,
            produtosMonofasicos: n.produtosMonofasicos.map((p) =>
              p.id !== produtoId ? p : { ...p, [rawField]: text },
            ),
          },
      )
    }
  }

  const handleBlur = (
    produtoId: string,
    rawField: "rawAliquotaTabelaPis" | "rawAliquotaTabelaCofins",
    numField: "aliquotaTabelaPis" | "aliquotaTabelaCofins",
  ) => {
    setNotasFiscais((prev) =>
      prev.map((nota) =>
        nota.chave !== selectedNota?.chave
          ? nota
          : {
              ...nota,
              produtosMonofasicos: nota.produtosMonofasicos.map((p) => {
                if (p.id !== produtoId) return p
                const raw = p[rawField] || ""
                const normalized = raw.replace(",", ".")
                const num = normalized === "" ? null : Number.parseFloat(normalized)
                return {
                  ...p,
                  [numField]: num,
                  [rawField]: undefined,
                }
              }),
            },
      ),
    )
    setSelectedNota(
      (n) =>
        n && {
          ...n,
          produtosMonofasicos: n.produtosMonofasicos.map((p) => {
            if (p.id !== produtoId) return p
            const raw = p[rawField] || ""
            const normalized = raw.replace(",", ".")
            const num = normalized === "" ? null : Number.parseFloat(normalized)
            return {
              ...p,
              [numField]: num,
              [rawField]: undefined,
            }
          }),
        },
    )
  }

  const relatorioColumns: ColumnsType<RelatorioFinal["produtos"][0]> = [
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (text) => (
        <Text strong style={{ color: "#262626" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Valor Produto",
      dataIndex: "valorProduto",
      key: "valorProduto",
      render: (value) => (
        <Tag color="green" style={{ borderRadius: "6px" }}>
          R$ {value.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "PIS Nota",
      dataIndex: "valorPisNota",
      key: "valorPisNota",
      render: (value) => (
        <Tag color="blue" style={{ borderRadius: "6px" }}>
          R$ {value.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "COFINS Nota",
      dataIndex: "valorCofinsNota",
      key: "valorCofinsNota",
      render: (value) => (
        <Tag color="orange" style={{ borderRadius: "6px" }}>
          R$ {value.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "PIS Tabela",
      dataIndex: "valorPisTabela",
      key: "valorPisTabela",
      render: (value) => (
        <Tag color="cyan" style={{ borderRadius: "6px" }}>
          R$ {value.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "COFINS Tabela",
      dataIndex: "valorCofinsTabela",
      key: "valorCofinsTabela",
      render: (value) => (
        <Tag color="purple" style={{ borderRadius: "6px" }}>
          R$ {value.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "Diferença PIS",
      dataIndex: "diferencaPis",
      key: "diferencaPis",
      render: (value) => (
        <Text type={value > 0 ? "success" : value < 0 ? "danger" : "secondary"} style={{ fontWeight: "600" }}>
          R$ {value.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Diferença COFINS",
      dataIndex: "diferencaCofins",
      key: "diferencaCofins",
      render: (value) => (
        <Text type={value > 0 ? "success" : value < 0 ? "danger" : "secondary"} style={{ fontWeight: "600" }}>
          R$ {value.toFixed(2)}
        </Text>
      ),
    },
  ]

  const steps = [
    {
      title: "Salvar Produtos",
      description: "Selecione e salve os produtos monofásicos",
      icon: <CheckCircleOutlined />,
      action: handleSalvarProdutos,
      buttonText: "Salvar Produtos",
    },
    {
      title: "Atualizar Tabela SPED",
      description: "Atualizar valores com a tabela SPED",
      icon: <SyncOutlined />,
      action: handleAtualizarTabelaSPED,
      buttonText: "Atualizar Tabela SPED",
    },
    {
      title: "Gerar Relatório",
      description: "Visualizar relatório final",
      icon: <BarChartOutlined />,
      action: handleGerarRelatorio,
      buttonText: "Gerar Relatório",
    },
    {
      title: "Exportar Excel",
      description: "Baixar relatório em Excel",
      icon: <FileExcelOutlined />,
      action: handleDownloadExcel,
      buttonText: "Baixar Excel",
    },
  ]

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }

  const getStatusIcon = (status: ProcessingFile["status"]) => {
    switch (status) {
      case "waiting":
        return <ClockCircleOutlined style={{ color: "#fa8c16" }} />
      case "processing":
        return <Spin size="small" />
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />
      case "error":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
      default:
        return null
    }
  }

  const getStatusColor = (status: ProcessingFile["status"]) => {
    switch (status) {
      case "waiting":
        return "#fa8c16"
      case "processing":
        return "#1890ff"
      case "success":
        return "#52c41a"
      case "error":
        return "#ff4d4f"
      default:
        return "#d9d9d9"
    }
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
          <CloudUploadOutlined
            style={{
              fontSize: "24px",
              color: "#1890ff",
              marginRight: "12px",
            }}
          />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Upload e Análise de XML
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "52px" }}>
          Faça upload de XMLs de notas fiscais para análise individual ou em lote
        </Text>
      </div>

      <Spin spinning={loading}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: 16 }}
          items={[
            {
              key: "upload",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <CloudUploadOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                  Upload
                </span>
              ),
              children: (
                <Card style={cardStyle}>
                  <div style={{ textAlign: "center", padding: "40px 24px" }}>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #1890ff, #fa8c16)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        boxShadow: "0 8px 16px rgba(24, 144, 255, 0.3)",
                      }}
                    >
                      <CloudUploadOutlined style={{ fontSize: "32px", color: "white" }} />
                    </div>

                    {/* Seletor de Modo de Análise */}
                    <Card
                      size="small"
                      style={{
                        ...cardStyle,
                        marginBottom: "32px",
                        background: "linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                      }}
                    >
                      <Title level={4} style={{ margin: "0 0 16px 0", color: "#262626" }}>
                        Modo de Análise
                      </Title>
                      <Radio.Group
                        value={analysisMode}
                        onChange={(e) => setAnalysisMode(e.target.value)}
                        style={{ width: "100%" }}
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Radio.Button
                              value="individual"
                              style={{
                                width: "100%",
                                height: "60px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                border: analysisMode === "individual" ? "2px solid #1890ff" : "1px solid #d9d9d9",
                                background: analysisMode === "individual" ? "rgba(24, 144, 255, 0.1)" : "white",
                              }}
                            >
                              <div style={{ textAlign: "center" }}>
                                <FileAddOutlined
                                  style={{ fontSize: "20px", color: "#1890ff", display: "block", marginBottom: "4px" }}
                                />
                                <Text strong>Individual</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                  Análise arquivo por arquivo
                                </Text>
                              </div>
                            </Radio.Button>
                          </Col>
                          <Col span={12}>
                            <Radio.Button
                              value="batch"
                              style={{
                                width: "100%",
                                height: "60px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "8px",
                                border: analysisMode === "batch" ? "2px solid #fa8c16" : "1px solid #d9d9d9",
                                background: analysisMode === "batch" ? "rgba(250, 140, 22, 0.1)" : "white",
                              }}
                            >
                              <div style={{ textAlign: "center" }}>
                                <ThunderboltOutlined
                                  style={{ fontSize: "20px", color: "#fa8c16", display: "block", marginBottom: "4px" }}
                                />
                                <Text strong>Em Lote</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                  Até 50 arquivos por vez
                                </Text>
                              </div>
                            </Radio.Button>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Card>

                    {/* Alert informativo */}
                    {analysisMode === "batch" && (
                      <Alert
                        message="Análise em Lote"
                        description="Você pode selecionar até 50 arquivos XML para processamento em lote. Cada arquivo será processado sequencialmente."
                        type="info"
                        showIcon
                        style={{ marginBottom: "24px", textAlign: "left" }}
                      />
                    )}

                    <Dragger
                      {...props}
                      style={{
                        padding: "40px 24px",
                        borderRadius: "12px",
                        border: `2px dashed ${analysisMode === "individual" ? "#1890ff" : "#fa8c16"}`,
                        background:
                          analysisMode === "individual"
                            ? "linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(24, 144, 255, 0.02))"
                            : "linear-gradient(135deg, rgba(250, 140, 22, 0.05), rgba(250, 140, 22, 0.02))",
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined
                          style={{ color: analysisMode === "individual" ? "#1890ff" : "#fa8c16", fontSize: "48px" }}
                        />
                      </p>
                      <p className="ant-upload-text" style={{ fontSize: "18px", fontWeight: "600", color: "#262626" }}>
                        {analysisMode === "individual"
                          ? "Clique ou arraste arquivos XML para análise individual"
                          : "Clique ou arraste até 50 arquivos XML para análise em lote"}
                      </p>
                      <p className="ant-upload-hint" style={{ fontSize: "14px", color: "#8c8c8c" }}>
                        {analysisMode === "individual"
                          ? "Suporte para upload de um ou múltiplos arquivos XML de notas fiscais."
                          : "Os arquivos serão processados sequencialmente, um por vez."}
                      </p>
                    </Dragger>

                    <Divider style={{ margin: "32px 0" }} />

                    <div style={{ textAlign: "center" }}>
                      <input
                        type="file"
                        id="fileInput"
                        multiple={analysisMode === "batch"}
                        accept=".xml"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleUpload(e.target.files)
                          }
                        }}
                      />
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => document.getElementById("fileInput")?.click()}
                        style={{
                          background:
                            analysisMode === "individual"
                              ? "linear-gradient(45deg, #1890ff, #40a9ff)"
                              : "linear-gradient(45deg, #fa8c16, #ffa940)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          height: "48px",
                          padding: "0 32px",
                          boxShadow:
                            analysisMode === "individual"
                              ? "0 4px 12px rgba(24, 144, 255, 0.3)"
                              : "0 4px 12px rgba(250, 140, 22, 0.3)",
                        }}
                        icon={<FolderOpenOutlined />}
                      >
                        {analysisMode === "individual" ? "Selecionar arquivos" : "Selecionar até 50 arquivos"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ),
            },
            {
              key: "notas",
              label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                  <FileTextOutlined style={{ marginRight: "8px", color: "#fa8c16" }} />
                  Notas Analisadas
                  <Badge
                    count={notasFiscais.length}
                    style={{
                      backgroundColor: "#fa8c16",
                      marginLeft: "8px",
                    }}
                  />
                </span>
              ),
              children: (
                <>
                  {notasFiscais.length > 0 && !selectedNota ? (
                    <Card style={cardStyle}>
                      <div style={{ marginBottom: "16px" }}>
                        <Title level={4} style={{ margin: 0, color: "#262626" }}>
                          <FileTextOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                          Notas Fiscais Processadas
                        </Title>
                        <Text type="secondary">Selecione uma nota para visualizar e processar os produtos</Text>
                      </div>
                      <Table
                        dataSource={notasFiscais}
                        columns={notasColumns}
                        rowKey="chave"
                        pagination={{ pageSize: 5 }}
                        style={{
                          ".ant-table-thead > tr > th": {
                            background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                            fontWeight: "600",
                          },
                        }}
                      />
                    </Card>
                  ) : null}

                  {selectedNota && (
                    <Card style={cardStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "24px",
                        }}
                      >
                        <Title level={4} style={{ margin: 0, color: "#262626" }}>
                          <FileTextOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                          Produtos da Nota Fiscal
                        </Title>
                        <Button onClick={() => setSelectedNota(null)} style={{ borderRadius: "6px" }}>
                          Voltar para Lista de Notas
                        </Button>
                      </div>

                      <Divider />

                      {/* Progress Steps */}
                      <Card
                        style={{
                          ...cardStyle,
                          marginBottom: "24px",
                          background: "linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                        }}
                      >
                        <Steps current={currentStep} style={{ marginBottom: 16 }}>
                          {steps.map((step, index) => (
                            <Step key={index} title={step.title} description={step.description} icon={step.icon} />
                          ))}
                        </Steps>
                        <Progress
                          percent={((currentStep + 1) / steps.length) * 100}
                          strokeColor={{
                            "0%": "#1890ff",
                            "100%": "#fa8c16",
                          }}
                          showInfo={false}
                        />
                      </Card>

                      {/* Nota Info */}
                      <Row gutter={[24, 16]} style={{ marginBottom: "24px" }}>
                        <Col span={12}>
                          <Card size="small" style={{ ...cardStyle, background: "#fafafa" }}>
                            <Space direction="vertical" style={{ width: "100%" }}>
                              <div>
                                <Text strong>Chave:</Text>
                                <br />
                                <Tag
                                  style={{
                                    background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                                    border: "none",
                                    color: "white",
                                    fontWeight: "500",
                                    borderRadius: "6px",
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {selectedNota.chave}
                                </Tag>
                              </div>
                              {selectedNota.nomeRazaoSocial && (
                                <div>
                                  <BuildingOutlined style={{ color: "#fa8c16", marginRight: "6px" }} />
                                  <Text strong>Emitente:</Text> {selectedNota.nomeRazaoSocial}
                                  {selectedNota.cnpjEmitente && ` (${selectedNota.cnpjEmitente})`}
                                </div>
                              )}
                              {selectedNota.dataEmissao && (
                                <div>
                                  <CalendarOutlined style={{ color: "#52c41a", marginRight: "6px" }} />
                                  <Text strong>Data Emissão:</Text>{" "}
                                  {new Date(selectedNota.dataEmissao).toLocaleDateString("pt-BR")}
                                </div>
                              )}
                              {selectedNota.valorTotal && (
                                <div>
                                  <DollarOutlined style={{ color: "#52c41a", marginRight: "6px" }} />
                                  <Text strong>Valor Total:</Text> R$ {selectedNota.valorTotal.toFixed(2)}
                                </div>
                              )}
                            </Space>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card size="small" style={cardStyle}>
                            <Search
                              placeholder="Buscar por descrição ou NCM"
                              allowClear
                              enterButton={<SearchOutlined />}
                              size="large"
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              style={{
                                marginBottom: 16,
                                ".ant-input": {
                                  borderRadius: "8px",
                                },
                                ".ant-btn": {
                                  borderRadius: "8px",
                                  background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                                  border: "none",
                                },
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Badge count={totalSelecionados} style={{ backgroundColor: "#1890ff" }}>
                                <Tag
                                  style={{
                                    background: "linear-gradient(45deg, #52c41a, #73d13d)",
                                    border: "none",
                                    color: "white",
                                    fontWeight: "500",
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  Produtos Selecionados
                                </Tag>
                              </Badge>
                              <Button
                                type="link"
                                onClick={() => handleSelectAllProdutos(false)}
                                disabled={totalSelecionados === 0}
                                style={{ color: "#fa8c16" }}
                              >
                                Limpar seleção
                              </Button>
                            </div>
                          </Card>
                        </Col>
                      </Row>

                      {/* Products Table */}
                      <Table
                        dataSource={selectedNota?.produtosMonofasicos || []}
                        columns={produtosColumns}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        rowClassName={(record) => (record.selecionado ? "ant-table-row-selected" : "")}
                        style={{
                          ".ant-table-thead > tr > th": {
                            background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
                            fontWeight: "600",
                          },
                        }}
                        scroll={{ x: 1400 }}
                      />

                      {/* Action Buttons */}
                      <div style={{ marginTop: 24, textAlign: "right" }}>
                        <Space size="middle">
                          <Button
                            onClick={() => handleSelectAllProdutos(true)}
                            icon={<CheckCircleOutlined />}
                            style={{ borderRadius: "6px" }}
                          >
                            Selecionar Todos
                          </Button>

                          {currentStep < steps.length && (
                            <Tooltip title={steps[currentStep].description}>
                              <Button
                                type="primary"
                                size="large"
                                onClick={steps[currentStep].action}
                                loading={loading}
                                disabled={currentStep === 0 && totalSelecionados === 0}
                                style={{
                                  background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                                  border: "none",
                                  borderRadius: "8px",
                                  fontWeight: "600",
                                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                                }}
                                icon={steps[currentStep].icon}
                              >
                                {steps[currentStep].buttonText}
                              </Button>
                            </Tooltip>
                          )}

                          {currentStep === steps.length && (
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleFinalizarProcesso}
                              style={{
                                background: "linear-gradient(45deg, #52c41a, #73d13d)",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                              }}
                            >
                              Finalizar Processo
                            </Button>
                          )}
                        </Space>
                      </div>
                    </Card>
                  )}
                </>
              ),
            },
          ]}
        />

        {/* Resumo do Relatório */}
        {showResumo && resumoRelatorio && (
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <BarChartOutlined style={{ color: "#52c41a", marginRight: "8px" }} />
                <span>Resumo de Restituição</span>
                <Tag
                  style={{
                    background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                    border: "none",
                    color: "white",
                    fontWeight: "500",
                    marginLeft: "12px",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                  }}
                >
                  {resumoRelatorio.chave}
                </Tag>
              </div>
            }
            style={{ ...cardStyle, margin: "16px 0" }}
            extra={
              <Space>
                <Button onClick={() => setRelatorioModalVisible(true)} style={{ borderRadius: "6px" }}>
                  Ver Relatório Completo
                </Button>
                <Button
                  type="primary"
                  onClick={handleDownloadExcel}
                  icon={<FileExcelOutlined />}
                  style={{
                    background: "linear-gradient(45deg, #52c41a, #73d13d)",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Baixar Excel
                </Button>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center", background: "rgba(82, 196, 26, 0.05)" }}>
                  <Statistic
                    title="Total Produtos Monofásicos"
                    value={resumoRelatorio.valorTotalProdutosMonofasicos}
                    precision={2}
                    prefix="R$"
                    valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center", background: "rgba(24, 144, 255, 0.05)" }}>
                  <Statistic
                    title="Total PIS"
                    value={resumoRelatorio.valorTotalPis}
                    precision={2}
                    prefix="R$"
                    valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center", background: "rgba(250, 140, 22, 0.05)" }}>
                  <Statistic
                    title="Total COFINS"
                    value={resumoRelatorio.valorTotalCofins}
                    precision={2}
                    prefix="R$"
                    valueStyle={{ color: "#fa8c16", fontWeight: "bold" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  style={{
                    textAlign: "center",
                    background: resumoRelatorio.direitoRestituicao
                      ? "rgba(82, 196, 26, 0.1)"
                      : "rgba(255, 77, 79, 0.1)",
                  }}
                >
                  <Statistic
                    title="Valor Restituição"
                    value={resumoRelatorio.valorRestituicao}
                    precision={2}
                    prefix="R$"
                    valueStyle={{
                      color: resumoRelatorio.direitoRestituicao ? "#52c41a" : "#ff4d4f",
                      fontWeight: "bold",
                    }}
                  />
                  <Tag
                    color={resumoRelatorio.direitoRestituicao ? "success" : "error"}
                    style={{ marginTop: "8px", borderRadius: "6px" }}
                  >
                    {resumoRelatorio.direitoRestituicao ? "TEM DIREITO" : "SEM DIREITO"}
                  </Tag>
                </Card>
              </Col>
            </Row>
          </Card>
        )}

        {/* Modal de Processamento em Lote */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <ThunderboltOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
              <span>Processamento em Lote</span>
            </div>
          }
          open={batchModalVisible}
          onCancel={() => {
            if (!batchProcessing) {
              setBatchModalVisible(false)
              setBatchFiles([])
              setProcessedCount(0)
            }
          }}
          footer={
            !batchProcessing
              ? [
                  <Button
                    key="close"
                    onClick={() => {
                      setBatchModalVisible(false)
                      setBatchFiles([])
                      setProcessedCount(0)
                      setActiveTab("notas")
                    }}
                  >
                    Fechar
                  </Button>,
                ]
              : null
          }
          width={800}
          closable={!batchProcessing}
          maskClosable={false}
        >
          <div style={{ marginBottom: "16px" }}>
            <Progress
              percent={batchFiles.length > 0 ? (processedCount / batchFiles.length) * 100 : 0}
              strokeColor={{
                "0%": "#1890ff",
                "100%": "#52c41a",
              }}
              format={() => `${processedCount}/${batchFiles.length}`}
            />
            <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
              {batchProcessing ? "Processando arquivos..." : "Processamento concluído"}
            </Text>
          </div>

          <List
            dataSource={batchFiles}
            renderItem={(item, index) => (
              <List.Item
                style={{
                  padding: "12px 16px",
                  border: "1px solid #f0f0f0",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  background:
                    item.status === "success"
                      ? "rgba(82, 196, 26, 0.05)"
                      : item.status === "error"
                        ? "rgba(255, 77, 79, 0.05)"
                        : item.status === "processing"
                          ? "rgba(24, 144, 255, 0.05)"
                          : "white",
                }}
              >
                <List.Item.Meta
                  avatar={getStatusIcon(item.status)}
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text strong>{item.file.name}</Text>
                      <Tag color={getStatusColor(item.status)} style={{ borderRadius: "4px" }}>
                        {item.status === "waiting" && "Aguardando"}
                        {item.status === "processing" && "Processando"}
                        {item.status === "success" && "Sucesso"}
                        {item.status === "error" && "Erro"}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary">{(item.file.size / 1024).toFixed(2)} KB</Text>
                      {item.error && (
                        <div style={{ marginTop: "4px" }}>
                          <Text type="danger" style={{ fontSize: "12px" }}>
                            {item.error}
                          </Text>
                        </div>
                      )}
                      {item.nota && (
                        <div style={{ marginTop: "4px" }}>
                          <Text type="success" style={{ fontSize: "12px" }}>
                            Chave: {item.nota.chave}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
            style={{ maxHeight: "400px", overflowY: "auto" }}
          />
        </Modal>
      </Spin>
    </div>
  )
}

export default UploadXml
