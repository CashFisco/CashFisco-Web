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
  Modal,
  Descriptions,
  Tooltip,
} from "antd"
import {
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  CalculatorOutlined,
  FileExcelOutlined,
  BarChartOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import type { ColumnsType } from "antd/es/table"
import { xmlService, type NotaFiscal, type Produto, type RelatorioFinal, type RespostaSalvar, type ProdutoNota, NotaComSelecao, ProdutoComSelecao } from "@/services/api"



const { Dragger } = Upload
const { Title, Text } = Typography
const { TabPane } = Tabs
const { Search } = Input
const { Step } = Steps

const UploadXml: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [notasFiscais, setNotasFiscais] = useState<NotaComSelecao[]>([]);
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




  // Atualiza o selectedNota quando notasFiscais muda
  useEffect(() => {
    if (selectedNota) {
      const updatedNota = notasFiscais.find((nota) => nota.chave === selectedNota.chave)
      if (updatedNota) {
        setSelectedNota(updatedNota)
      }
    }
  }, [notasFiscais, selectedNota])

  // const handleUpload = async (file: File) => {
  //   setLoading(true);
  //   console.log("Enviando arquivo:", file.name);

  //   try {
  //     const resposta = await xmlService.analisarXml(file);
  //     console.log("Resposta da API:", resposta);

  //     const notaFiscal = resposta?.[0];
  //     console.log("Nota fiscal extraída:", notaFiscal);

  //     if (!notaFiscal) {
  //       throw new Error("Resposta inválida da API");
  //     }

  //     const notaComSelecao: NotaComSelecao = {
  //       ...notaFiscal,
  //       produtosMonofasicos: (notaFiscal.produtos || []).map((produto, idx) => ({
  //         ...produto,
  //         id: produto.id ?? `${notaFiscal.chave}-${idx}`,
  //         selecionado: false,
  //         valorProduto: produto.valorProduto || 0,
  //         valorNotaPis: produto.valorNotaPis || 0,
  //         valorNotaCofins: produto.valorNotaCofins || 0,
  //       })),
  //     };


  //     setNotasFiscais((prev) => [...prev, notaComSelecao]);

  //     // Safer message handling
  //     try {
  //       message.success(`Nota fiscal ${file.name} analisada com sucesso!`);
  //     } catch (e) {
  //       console.log(`Nota fiscal ${file.name} analisada com sucesso!`);
  //     }

  //     setActiveTab("notas");
  //     setCurrentStep(0);
  //   } catch (error) {
  //     console.error("Erro ao analisar XML:", error);
  //     try {
  //       message.error(`Erro ao analisar o arquivo ${file.name}`);
  //     } catch (e) {
  //       console.error(`Erro ao analisar o arquivo ${file.name}`);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpload = async (fileList: FileList) => {
    setLoading(true);
    try {
      // Constrói o FormData com todos os arquivos
      const fd = new FormData();
      Array.from(fileList).forEach(f => fd.append("files", f));
  
      // Chama a API uma única vez
      const respostas = await xmlService.analisarXml(fd); // vamos ajustar o serviço
      // 'respostas' agora é um array de notas
  
      // Acrescenta 'selecionado' e 'id' em cada produto de cada nota
      const notasComSelecao: NotaComSelecao[] = respostas.map(nf => ({
        ...nf,
        produtosMonofasicos: nf.produtos.map((produto, idx) => ({
          ...produto,
          id: produto.id ?? `${nf.chave}-${idx}`,
          selecionado: false,
          valorProduto: produto.valorProduto ?? 0,
          valorNotaPis: produto.valorNotaPis ?? 0,
          valorNotaCofins: produto.valorNotaCofins ?? 0,
        })),
      }));
  
      setNotasFiscais(prev => [...prev, ...notasComSelecao]);
      message.success(`${notasComSelecao.length} nota(s) analisada(s) com sucesso!`);
      setActiveTab("notas");
      setCurrentStep(0);
  
    } catch (err) {
      console.error("Erro ao analisar XML(s):", err);
      message.error("Erro ao analisar o(s) arquivo(s)");
    } finally {
      setLoading(false);
    }
  };
  


  

  // const handleSelecionarProduto = (produto: Produto) => {
  //   if (!selectedNota) return

  //   setNotasFiscais((prev) => {
  //     const notas = [...prev]
  //     const notaIndex = notas.findIndex((n) => n.chave === selectedNota.chave)

  //     if (notaIndex === -1) return prev

  //     const produtos = [...notas[notaIndex].produtos]
  //     const produtoIndex = produtos.findIndex((p) => p.descricao === produto.descricao && p.ncm === produto.ncm)

  //     if (produtoIndex === -1) return prev

  //     produtos[produtoIndex] = {
  //       ...produtos[produtoIndex],
  //       selecionado: !produtos[produtoIndex].selecionado,
  //     }

  //     notas[notaIndex] = {
  //       ...notas[notaIndex],
  //       produtos: produtos,
  //     }

  //     return notas
  //   })
  // }

  const handleSelecionarProduto = (produto: ProdutoComSelecao) => {
    if (!selectedNota) return;

    setNotasFiscais(prev => {
      return prev.map(nota => {
        if (nota.chave !== selectedNota.chave) return nota;

        return {
          ...nota,
          produtosMonofasicos: nota.produtosMonofasicos.map(p =>
            p.id !== produto.id
              ? p
              : { ...p, selecionado: !p.selecionado }
          )
        };
      });
    });

    // sincroniza também o selectedNota imediatamente
    setSelectedNota(nota =>
      nota && nota.chave === produto.chave
        ? {
          ...nota,
          produtosMonofasicos: nota.produtosMonofasicos.map(p =>
            p.id !== produto.id ? p : { ...p, selecionado: !p.selecionado }
          )
        }
        : nota
    );
  };


  // Função para selecionar/desselecionar todos os produtos

  const handleSelectAllProdutos = (checked: boolean) => {
    setSelectAll(checked)
    if (!selectedNota) return

    setNotasFiscais(prev =>
      prev.map(nota => {
        if (nota.chave !== selectedNota.chave) return nota

        const updated = nota.produtosMonofasicos.map(p => {
          // se tiver filtro de busca, só marca aqueles que baterem no texto
          const matches =
            !searchText ||
            p.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
            p.ncm?.includes(searchText)
          return matches ? { ...p, selecionado: checked } : p
        })

        return { ...nota, produtosMonofasicos: updated }
      })
    )
  }


  const handleSalvarProdutos = async (): Promise<RespostaSalvar | void> => {
    if (!selectedNota) return;

    setLoading(true);
    try {
      // filtra em produtosMonofasicos, não em produtos
      const produtosSelecionados = selectedNota.produtosMonofasicos.filter(p => p.selecionado);
      if (produtosSelecionados.length === 0) {
        message.warning("Selecione ao menos um produto para salvar");
        return;
      }

      const produtosParaSalvar: ProdutoNota[] = produtosSelecionados.map(p => ({
        descricao: p.descricao,
        ncm: p.ncm,
        valorProduto: p.valorProduto,
        valorNotaPis: p.valorNotaPis,
        valorNotaCofins: p.valorNotaCofins,
        aliquotaNotaPis: p.aliquotaNotaPis,
        aliquotaNotaCofins: p.aliquotaNotaCofins,
        aliquotaTabelaPis: p.aliquotaTabelaPis ?? null,
        aliquotaTabelaCofins: p.aliquotaTabelaCofins ?? null,
      }));

      const payload = {
        chave: selectedNota.chave,
        cnpjEmitente: selectedNota.cnpjEmitente!,
        nomeRazaoSocial: selectedNota.nomeRazaoSocial!,
        dataEmissao: selectedNota.dataEmissao!,
        produtos: produtosParaSalvar,
      };

      await xmlService.salvarProdutos(payload);
      message.success("Produtos e Nota Fiscal salvos com sucesso!");
      setTabelaAtiva(true);
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      message.error("Erro ao salvar produtos");
    } finally {
      setLoading(false);
    }
  };



  const handleAtualizarTabelaSPED = async () => {
    if (!selectedNota) return

    setLoading(true)
    try {
      // 1) FILTRE pelo array que você realmente está editando:
      const monofasicos = selectedNota.produtosMonofasicos

      // 2) Só mantenha os selecionados:
      const selecionados = monofasicos.filter(p => p.selecionado)
      if (!selecionados.length) {
        message.warning("Selecione pelo menos um produto para atualizar")
        return
      }

      // 3) Construa o payload
      const produtosParaAtualizar = selecionados.map(p => {
        const pisNum = p.rawAliquotaTabelaPis
          ? parseFloat(p.rawAliquotaTabelaPis.replace(",", "."))
          : (p.aliquotaTabelaPis ?? 0)
        const cofNum = p.rawAliquotaTabelaCofins
          ? parseFloat(p.rawAliquotaTabelaCofins.replace(",", "."))
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

      // 4) Chama o endpoint
      const resposta = await xmlService.atualizarTabelaSPED(
        selectedNota.chave,
        produtosParaAtualizar
      )

      // 5) Atualiza o state de produtosMonofasicos com o que veio do backend
      setNotasFiscais(prev =>
        prev.map(nota =>
          nota.chave === selectedNota.chave
            ? {
              ...nota,
              produtosMonofasicos: nota.produtosMonofasicos.map(orig => {
                const upd = resposta.produtos.find(p => p.descricao === orig.descricao)
                return upd
                  ? { ...orig, ...upd, rawAliquotaTabelaPis: undefined, rawAliquotaTabelaCofins: undefined }
                  : orig
              })
            }
            : nota
        )
      )

      message.success("Tabela SPED aplicada e diferenças calculadas!")

      // 6) Agora busca o resumo global via relatório
      const resumo = await xmlService.gerarRelatorio(selectedNota.chave)
      setResumoRelatorio(resumo)
      setShowResumo(true)

      // 7) avançar passo
      setCurrentStep(2)

    } catch (err) {
      console.error(err)
      message.error("Erro ao atualizar tabela SPED")
    } finally {
      setLoading(false)
    }
  }



  const validarCampos = () => {
    if (!selectedNota) return false;

    const produtosInvalidos = selectedNota.produtos
      .filter(p => p.selecionado)
      .some(p =>
        p.aliquotaTabelaPis === null ||
        p.aliquotaTabelaPis === undefined ||
        p.aliquotaTabelaCofins === null ||
        p.aliquotaTabelaCofins === undefined
      );

    return !produtosInvalidos;
  };

  // No botão de atualizar:
  <Button
    type="primary"
    onClick={handleAtualizarTabelaSPED}
    loading={loading}
    disabled={!validarCampos()}
  >
    Atualizar Tabela SPED
  </Button>


  const handleGerarRelatorio = async () => {
    if (!selectedNota) return

    setLoading(true)

    try {
      const relatorioData = await xmlService.gerarRelatorio(selectedNota.chave)
      setRelatorio(relatorioData)
      setRelatorioModalVisible(true)
      message.success("Relatório gerado com sucesso!")

      // Avançar para o próximo passo
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
    // Remover a nota da lista após finalizar o processo
    if (selectedNota) {
      setNotasFiscais((prev) => prev.filter((n) => n.chave !== selectedNota.chave))
      setSelectedNota(null)
      setCurrentStep(0)
      setRelatorio(null)
    }
  }

  // Efeito para atualizar o estado de "selecionar todos" quando a pesquisa muda
  useEffect(() => {
    if (!selectedNota) return;
    const filtrados = selectedNota.produtosMonofasicos.filter(
      p =>
        p.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
        p.ncm?.includes(searchText)
    );
    const todos = filtrados.length > 0 && filtrados.every(p => p.selecionado);
    setSelectAll(todos);
  }, [searchText, selectedNota]);

  // 2) Selecionar / desselecionar todos os produtosMonofasicos:
  // const handleSelectAllProdutos = (checked: boolean) => {
  //   setSelectAll(checked);
  //   if (!selectedNota) return;

  //   setNotasFiscais(prev =>
  //     prev.map(nota => {
  //       if (nota.chave !== selectedNota.chave) return nota;
  //       // percorre produtosMonofasicos, não produtos!
  //       const updated = nota.produtosMonofasicos.map(p => {
  //         // se houver filtro de busca, só altera os filtrados
  //         const match =
  //           !searchText ||
  //           p.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
  //           p.ncm?.includes(searchText);
  //         return match ? { ...p, selecionado: checked } : p;
  //       });
  //       return { ...nota, produtosMonofasicos: updated };
  //     })
  //   );
  // };

  // const props: UploadProps = {
  //   name: "file",
  //   multiple: true, // Desabilitar múltiplos para garantir que cada arquivo seja processado individualmente
  //   accept: ".xml",
  //   showUploadList: false,
  //   beforeUpload: (file) => {
  //     handleUpload(file)
  //     return false // Impede o comportamento padrão de upload
  //   },
  //   onChange(info) {
  //     const { status } = info.file
  //     if (status !== "uploading") {
  //       console.log(info.file, info.fileList)
  //     }
  //   },
  // }

  const props: UploadProps = {
    name: "files",
    multiple: true,           // ⬅️ agora permite múltiplos
    accept: ".xml",
    showUploadList: false,
    beforeUpload: (_file, fileList) => {
      // fileList é um array de File
      handleUpload(fileList as FileList);
      return false;           // cancela o upload automático
    },
    onChange(info) {
      // opcional, só pra log
      if (info.file.status !== "uploading") {
        console.log("Arquivos selecionados:", info.fileList);
      }
    },
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
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Valor Total",
      dataIndex: "valorTotal",
      key: "valorTotal",
      render: (value) => (value ? `R$ ${value.toFixed(2)}` : "-"),
    },
    {
      title: "Total PIS",
      dataIndex: "totalPis",
      key: "totalPis",
      render: (value) => (value ? `R$ ${value.toFixed(2)}` : "-"),
    },
    {
      title: "Total COFINS",
      dataIndex: "totalCofins",
      key: "totalCofins",
      render: (value) => (value ? `R$ ${value.toFixed(2)}` : "-"),
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

  // Filtra os produtos com base no texto de pesquisa
  const filteredProdutos = selectedNota
    ? selectedNota.produtos.filter(
      (produto) =>
        produto.descricao.toLowerCase().includes(searchText.toLowerCase()) || produto.ncm?.includes(searchText),
    )
    : []

  // Conta quantos produtos estão selecionados
  const totalSelecionados = selectedNota
    ? selectedNota.produtosMonofasicos.filter(p => p.selecionado).length
    : 0







  const produtosColumns: ColumnsType<ProdutoComSelecao> = [
    {
      title: (
        <Checkbox
          checked={selectAll}
          onChange={e => handleSelectAllProdutos(e.target.checked)}
        >
          Selecionar
        </Checkbox>
      ),
      dataIndex: "selecionado",
      key: "selecionado",
      render: (_, record) => (
        <Checkbox
          checked={record.selecionado}
          onChange={() => handleSelecionarProduto(record)}
        />
      )
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
      render: (text) => text || "-", // Exibe "-" se for vazio
    },
    {
      title: "NCM",
      dataIndex: "ncm",
      key: "ncm",
      render: (ncm) => ncm ? <Tag color="blue">{ncm}</Tag> : "-",
    },
    {
      title: "Valor Unitário",
      dataIndex: "valorProduto",
      key: "valorProduto",
      render: (value) => value !== null && value !== undefined ? `R$ ${Number(value).toFixed(2).replace('.', ',')}` : "-",
    },
    {
      title: "Valor PIS",
      dataIndex: "valorNotaPis",
      key: "valorNotaPis",
      render: (value) => value !== null && value !== undefined ? `R$ ${Number(value).toFixed(2).replace('.', ',')}` : "-",
    },
    {
      title: "Valor COFINS",
      dataIndex: "valorNotaCofins",
      key: "valorNotaCofins",
      render: (value) => value !== null && value !== undefined ? `R$ ${Number(value).toFixed(2).replace('.', ',')}` : "-",
    },
    {
      title: "Alíq. PIS",
      dataIndex: "aliquotaNotaPis",
      key: "aliquotaNotaPis",
      render: (value) => value !== null && value !== undefined ? `${Number(value).toFixed(2).replace('.', ',')}%` : "-",
    },
    {
      title: "Alíq. COFINS",
      dataIndex: "aliquotaNotaCofins",
      key: "aliquotaNotaCofins",
      render: (value) => value !== null && value !== undefined ? `${Number(value).toFixed(2).replace('.', ',')}%` : "-",
    },


    ...(tabelaAtiva ? [
      {
        title: "Alíq. PIS Tabela (%)",
        dataIndex: "aliquotaTabelaPis",
        key: "aliquotaTabelaPis",
        render: (_, record) => {
          const display =
            record.rawAliquotaTabelaPis != null
              ? record.rawAliquotaTabelaPis
              : record.aliquotaTabelaPis != null
                ? record.aliquotaTabelaPis.toFixed(2).replace('.', ',')
                : '';
          return (
            <Input
              value={display}
              onChange={e => handleRawChange(e.target.value, record.id, 'rawAliquotaTabelaPis')}
              onBlur={() => handleBlur(record.id, 'rawAliquotaTabelaPis', 'aliquotaTabelaPis')}
              suffix="%"
              placeholder="0,00"
              disabled={!record.selecionado}
            />
          );
        }
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
                ? record.aliquotaTabelaCofins.toFixed(2).replace('.', ',')
                : '';
          return (
            <Input
              value={display}
              onChange={e => handleRawChange(e.target.value, record.id, 'rawAliquotaTabelaCofins')}
              onBlur={() => handleBlur(record.id, 'rawAliquotaTabelaCofins', 'aliquotaTabelaCofins')}
              suffix="%"
              placeholder="0,00"
              disabled={!record.selecionado}
            />
          );
        }
      },
    ] : [])


  ];


  // Só atualiza o raw (texto livre)
  const handleRawChange = (
    text: string,
    produtoId: string,
    rawField: 'rawAliquotaTabelaPis' | 'rawAliquotaTabelaCofins'
  ) => {
    // permite dígitos, vírgula e ponto
    if (/^[0-9.,]*$/.test(text)) {
      setNotasFiscais(prev =>
        prev.map(nota =>
          nota.chave !== selectedNota?.chave
            ? nota
            : {
              ...nota,
              produtosMonofasicos: nota.produtosMonofasicos.map(p =>
                p.id !== produtoId
                  ? p
                  : { ...p, [rawField]: text }
              )
            }
        )
      );
      // atualiza selectedNota para a UI refletir já
      setSelectedNota(n =>
        n && {
          ...n,
          produtosMonofasicos: n.produtosMonofasicos.map(p =>
            p.id !== produtoId
              ? p
              : { ...p, [rawField]: text }
          )
        }
      );
    }
  };

  // Quando sai do campo, converte o raw em number e limpa o raw
  const handleBlur = (
    produtoId: string,
    rawField: 'rawAliquotaTabelaPis' | 'rawAliquotaTabelaCofins',
    numField: 'aliquotaTabelaPis' | 'aliquotaTabelaCofins'
  ) => {
    setNotasFiscais(prev =>
      prev.map(nota =>
        nota.chave !== selectedNota?.chave
          ? nota
          : {
            ...nota,
            produtosMonofasicos: nota.produtosMonofasicos.map(p => {
              if (p.id !== produtoId) return p;
              const raw = p[rawField] || '';
              const normalized = raw.replace(',', '.');
              const num = normalized === '' ? null : parseFloat(normalized);
              return {
                ...p,
                [numField]: num,
                [rawField]: undefined
              };
            })
          }
      )
    );
    setSelectedNota(n =>
      n && {
        ...n,
        produtosMonofasicos: n.produtosMonofasicos.map(p => {
          if (p.id !== produtoId) return p;
          const raw = p[rawField] || '';
          const normalized = raw.replace(',', '.');
          const num = normalized === '' ? null : parseFloat(normalized);
          return {
            ...p,
            [numField]: num,
            [rawField]: undefined
          };
        })
      }
    );
  };





  const relatorioColumns: ColumnsType<RelatorioFinal["produtos"][0]> = [
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Valor Produto",
      dataIndex: "valorProduto",
      key: "valorProduto",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "PIS Nota",
      dataIndex: "valorPisNota",
      key: "valorPisNota",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "COFINS Nota",
      dataIndex: "valorCofinsNota",
      key: "valorCofinsNota",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "PIS Tabela",
      dataIndex: "valorPisTabela",
      key: "valorPisTabela",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "COFINS Tabela",
      dataIndex: "valorCofinsTabela",
      key: "valorCofinsTabela",
      render: (value) => `R$ ${value.toFixed(2)}`,
    },
    {
      title: "Diferença PIS",
      dataIndex: "diferencaPis",
      key: "diferencaPis",
      render: (value) => (
        <Text type={value > 0 ? "success" : value < 0 ? "danger" : "secondary"}>R$ {value.toFixed(2)}</Text>
      ),
    },
    {
      title: "Diferença COFINS",
      dataIndex: "diferencaCofins",
      key: "diferencaCofins",
      render: (value) => (
        <Text type={value > 0 ? "success" : value < 0 ? "danger" : "secondary"}>R$ {value.toFixed(2)}</Text>
      ),
    },
  ]

  // Passos do processo
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

  return (
    <Spin spinning={loading}>
      <Title level={2}>Upload e Análise de XML</Title>
      <Text type="secondary">Faça upload de XMLs de notas fiscais para análise</Text>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ marginTop: 16 }}
        items={[
          {
            key: 'upload',
            label: 'Upload',
            children: (
              <Card>
                <Dragger {...props} style={{ padding: 24 }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Clique ou arraste arquivos XML para esta área</p>
                  <p className="ant-upload-hint">Suporte para upload de um ou múltiplos arquivos XML de notas fiscais.</p>
                </Dragger>
                <Divider />
                <div style={{ textAlign: "center" }}>
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    accept=".xml"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUpload(e.target.files)
                      }
                    }}
                  />
                  <Button type="primary" onClick={() => document.getElementById("fileInput")?.click()}>
                    Selecionar múltiplos arquivos
                  </Button>
                </div>
              </Card>
            ),
          },
          {
            key: 'notas',
            label: `Notas Analisadas (${notasFiscais.length})`,
            children: (
              <>
                {notasFiscais.length > 0 && !selectedNota ? (
                  <Card>
                    <Table dataSource={notasFiscais} columns={notasColumns} rowKey="chave" pagination={{ pageSize: 5 }} />
                  </Card>
                ) : null}

                {selectedNota && (
                  <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Title level={4}>
                        <FileTextOutlined /> Produtos da Nota
                      </Title>
                      <Button onClick={() => setSelectedNota(null)}>Voltar para Lista de Notas</Button>
                    </div>

                    <Divider />

                    <Steps current={currentStep} style={{ marginBottom: 24 }}>
                      {steps.map((step, index) => (
                        <Step key={index} title={step.title} description={step.description} icon={step.icon} />
                      ))}
                    </Steps>

                    <div style={{ marginBottom: 16 }}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <div>
                              <Text strong>Chave:</Text> <Tag color="blue">{selectedNota.chave}</Tag>
                            </div>
                            {selectedNota.nomeRazaoSocial && (
                              <div>
                                <Text strong>Emitente:</Text> {selectedNota.nomeRazaoSocial}
                                {selectedNota.cnpjEmitente && `(${selectedNota.cnpjEmitente})`}
                              </div>
                            )}
                            {selectedNota.dataEmissao && (
                              <div>
                                <Text strong>Data Emissão:</Text> {new Date(selectedNota.dataEmissao).toLocaleDateString()}
                              </div>
                            )}
                            {selectedNota.valorTotal && (
                              <div>
                                <Text strong>Valor Total:</Text> R$ {selectedNota.valorTotal.toFixed(2)}
                              </div>
                            )}
                          </Col>
                          <Col span={12}>
                            <Search
                              placeholder="Buscar por descrição ou NCM"
                              allowClear
                              enterButton={<SearchOutlined />}
                              size="middle"
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                              style={{ marginBottom: 16 }}
                            />
                            <div style={{ marginTop: 8 }}>
                              <Badge count={totalSelecionados} style={{ backgroundColor: "#1890ff" }}>
                                <Tag color="processing" style={{ padding: "5px 10px" }}>
                                  Produtos Selecionados
                                </Tag>
                              </Badge>
                              <Button
                                type="link"
                                onClick={() => handleSelectAllProdutos(false)}
                                disabled={totalSelecionados === 0}
                              >
                                Limpar seleção
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Space>
                    </div>

                    {/* <Table
                      dataSource={filteredProdutos}
                      columns={produtosColumns}
                      rowKey={(record) => `${record.descricao}-${record.ncm}`}
                      pagination={{ pageSize: 10 }}
                      rowClassName={(record) => (record.selecionado ? "ant-table-row-selected" : "")}
                    /> */}


                    <Table
                      dataSource={selectedNota?.produtosMonofasicos || []}
                      columns={produtosColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      rowClassName={record => (record.selecionado ? 'ant-table-row-selected' : '')}
                    />



                    <div style={{ marginTop: 16, textAlign: "right" }}>
                      <Space>
                        <Button onClick={() => handleSelectAllProdutos(true)} icon={<CheckCircleOutlined />}>
                          Selecionar Todos
                        </Button>

                        {currentStep < steps.length && (
                          <Tooltip title={steps[currentStep].description}>
                            <Button
                              type="primary"
                              onClick={steps[currentStep].action}
                              loading={loading}
                              disabled={currentStep === 0 && totalSelecionados === 0}
                            >
                              {steps[currentStep].buttonText}
                            </Button>
                          </Tooltip>
                        )}

                        {currentStep === steps.length && (
                          <Button type="primary" onClick={handleFinalizarProcesso}>
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

      {showResumo && resumoRelatorio && (
        <Card
          title={`Resumo de Restituição (chave: ${resumoRelatorio.chave})`}
          style={{ margin: '16px 0' }}
          extra={
            <Space>
              <Button onClick={() => setRelatorioModalVisible(true)}>
                Ver Relatório
              </Button>
              <Button
            key="download"
            type="primary"
            onClick={handleDownloadExcel}
            icon={<FileExcelOutlined />}
          >
            Baixar Excel
          </Button>,
            </Space>
          }
        >
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Total Produtos Mono.">
              R$ {resumoRelatorio.valorTotalProdutosMonofasicos.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total PIS">
              R$ {resumoRelatorio.valorTotalPis.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total COFINS">
              R$ {resumoRelatorio.valorTotalCofins.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Tem Restituição?">
              {resumoRelatorio.direitoRestituicao ? 'SIM' : 'NÃO'}
            </Descriptions.Item>
            <Descriptions.Item label="Valor Restituição">
              R$ {resumoRelatorio.valorRestituicao.toFixed(2)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Modal para exibir o relatório */}
      {/* Modal para exibir o relatório */}
      {/* <Modal
        title="Relatório de Restituição"
        open={relatorioModalVisible}
        onCancel={() => setRelatorioModalVisible(false)}
        width={1000}
        footer={[
          <Button key="close" onClick={() => setRelatorioModalVisible(false)}>
            Fechar
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={handleDownloadExcel}
            icon={<FileExcelOutlined />}
          >
            Baixar Excel
          </Button>,
        ]}
      >
        {relatorio && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Chave da Nota">
                {relatorio.chaveNota}
              </Descriptions.Item>
              <Descriptions.Item label="Diferença Total">
                <Text
                  type={relatorio.diferencaTotal > 0 ? 'success' : 'danger'}
                >
                  R$ {relatorio.diferencaTotal.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total PIS Nota">
                R$ {relatorio.totalPisNota.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Total PIS Tabela">
                R$ {relatorio.totalPisTabela.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Total COFINS Nota">
                R$ {relatorio.totalCofinsNota.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Total COFINS Tabela">
                R$ {relatorio.totalCofinsTabela.toFixed(2)}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Table
              dataSource={relatorio.produtos}
              columns={relatorioColumns}
              rowKey="descricao"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1000 }}
            />
          </>
        )}
      </Modal> */}

    </Spin>
  )
}

export default UploadXml
