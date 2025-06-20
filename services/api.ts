/**
 * Serviço centralizado para chamadas à API
 */

// URL base da API - pode ser configurada via variável de ambiente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
const API_PREFIX = "/cashfisco-ws"

// Função auxiliar para fazer requisições à API
import { useRouter } from "next/navigation"

// ...

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`
  const isFormData = options.body instanceof FormData
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers = {
    ...(isFormData ? { Accept: "application/json" } : {
      "Content-Type": "application/json",
      Accept: "application/json"
    }),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)

    // Redireciona se for 401
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
      throw new Error("Sessão expirada. Faça login novamente.")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
    }

    if (response.status === 204) {
      return {} as T
    }

    const contentType = response.headers.get("Content-Type") || ""
    if (contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      const blob = await response.blob()
      return { blob } as unknown as T
    }

    const data = await response.json()

    if (data && typeof data === "object" && "success" in data && "data" in data) {
      if (!data.success) {
        throw new Error(data.message || "Erro na requisição")
      }
      return data.data as T
    }

    return data as T
  } catch (error) {
    console.error("Erro na requisição:", error)
    throw error
  }
}

export interface ProdutoComSelecao {
  id?: string;
  descricao: string;
  ncm?: string;
  valorProduto: number;
  valorNotaPis: number;
  valorNotaCofins: number;
  aliquotaNotaPis?: number;
  aliquotaNotaCofins?: number;
  // campo definitivo
  aliquotaTabelaPis?: number | null;
  aliquotaTabelaCofins?: number | null;
  // FLAG para edição livre
  rawAliquotaTabelaPis?: string;
  rawAliquotaTabelaCofins?: string;
  selecionado: boolean;
}

export interface ProdutoNota {
  id: number;
  chaveNota?: string; // opcional, conforme já estava
  descricao: string;
  selecionado: boolean;
  valorProduto: number;
  valorNotaPis: number;
  valorNotaCofins: number;

  // Novos campos adicionados para cálculos de diferença e final
  valorTabelaPis: number;
  valorTabelaCofins: number;
  valorFinalPis: number;
  valorFinalCofins: number;
  valorDiferencaPis: number;
  valorDiferencaCofins: number;
}

// Interface para os filtros
interface AuditLogFilters {
  usuarioEmail?: string;
  cnpj?: string;
}

// Interface para o dado do log
export interface AuditLog {
  id: number;
  gerenteId: number;
  empresaId?: number;
  notaChave?: string;
  operacao: string;
  usuario: string;
  detalhes: string;
  criadoEm: string;
}


export interface NotaComSelecao {
  chave: string;
  cnpjEmitente: string;
  nomeRazaoSocial: string;
  dataEmissao: string;
  produtos: ProdutoNota[];
  produtosMonofasicos: ProdutoComSelecao[];
}


// dentro de api.ts, logo após as outras interfaces:
export interface ProdutoNota {
  id: number;
  descricao: string;
  ncm?: string;
  valorProduto: number;
  valorNotaPis: number;
  valorNotaCofins: number;
  aliquotaNotaPis?: number;
  aliquotaNotaCofins?: number;
  aliquotaTabelaPis?: number | null;
  aliquotaTabelaCofins?: number | null;
}

export interface RespostaSalvar {
  chave: string;
  cnpjEmitente: string;
  nomeRazaoSocial: string;
  dataEmissao: string;
  produtos: ProdutoNota[];
}


export interface AnaliseNota {
  chave: string
  cnpjEmitente: string
  nomeRazaoSocial: string
  dataEmissao: string        // “2025-02-28T17:08:00”
  valorTotal: number         // soma dos produtos monofásicos
  totalPis: number
  totalCofins: number
  produtos: ProdutoNota[]
}

export interface ProdutoNota {
  descricao: string
  ncm?: string
  valorProduto: number
  valorNotaPis: number
  valorNotaCofins: number
  aliquotaNotaPis?: number
  aliquotaNotaCofins?: number
  aliquotaTabelaPis?: number | null
  aliquotaTabelaCofins?: number | null
}

export interface RespostaSalvar {

  chave: string
  cnpjEmitente: string
  nomeRazaoSocial: string
  dataEmissao: string
  produtos: ProdutoNota[]
}



// Atualizar as interfaces para refletir a estrutura real da API
export interface NotaFiscal {
  chave: string;
  nomeRazaoSocial: string;
  cnpjEmitente: string;
  dataEmissao: string;
  valorTotalProdutosMonofasicos: number;
  valorTotalPis: number;
  valorTotalCofins: number;
  produtos: ProdutoNota[]
}


export interface Produto {
  id?: string
  descricao: string
  ncm?: string
  valorProduto: number // Alterado de valor para valorProduto
  valorNotaPis: number // Alterado de valorPis para valorNotaPis
  valorNotaCofins: number // Alterado de valorCofins para valorNotaCofins
  aliquotaNotaPis?: number
  aliquotaNotaCofins?: number
  aliquotaTabelaPis?: number | null
  aliquotaTabelaCofins?: number | null
  chaveNota?: string
  dataInclusao?: string
  selecionado?: boolean
  // Campos adicionais baseados na tabela
  diferencaPis?: number
  diferencaCofins?: number
  valorFinalPis?: number
  valorFinalCofins?: number
  aliquotaDiferencaPis?: number
  aliquotaDiferencaCofins?: number
  valorDiferencaPis?: number
  valorDiferencaCofins?: number
}

export interface RelatorioNotaFiscalDTO {
  produtosAuditados: any
  chave: string
  cnpjEmitente: string
  nomeRazaoSocial: string
  dataEmissao: string
  direitoRestituicao: boolean
  valorRestituicao: number
  produtos: ProdutoRelatorio[]
}

export interface ProdutoRelatorio extends ProdutoNota {
  aliquotaDiferencaPis: number
  aliquotaDiferencaCofins: number
  valorDiferencaPis: number
  valorDiferencaCofins: number
  valorFinalPis: number
  valorFinalCofins: number
}


interface DashboardStats {
  totalUsers: number;
  activeProjects: number;
  revenue: number;
  conversionRate: number;
  lastUpdated: string;
}

export interface EmpresaData {
  razaoSocial: string
  cnpj: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
}

export interface UsuarioData {
  nome: string
  email: string
  cargo: string
}

export interface ConfiguracoesData {
  notificacoesEmail: boolean
  temaEscuro: boolean
  formatoRelatorio: string
  idioma: string
}

export interface RelatorioRestituicao {
  id: string
  periodo: string
  totalProdutos: number
  totalValor: number
  totalPis: number
  totalCofins: number
  status: "pendente" | "aprovado" | "rejeitado"
  dataGeracao: string
}

export interface Empresa {
  id?: number
  cnpj: string
  nomeRazaoSocial: string
  endereco?: string
  contatoEmail?: string
  contatoTelefone?: string
}



export interface EmpresaResumo {
  id: number
  cnpj: string
  nomeRazaoSocial: string
}

export interface EmpresaDetalhe extends Empresa {
  criadoEm: string;
  notas: NotaResumo[];
}

export interface NotaResumo {
  chave: string;
  dataEmissao: string;
  direitoRestituicao: boolean;
  valorRestituicao: number;
  produtos: Produto[];
}

export interface NotaFiscal {
  chave: string;
  cnpjEmitente: string;
  nomeRazaoSocial: string;
  dataEmissao: string; // ou Date, dependendo do parsing
  direitoRestituicao: boolean;
  valorRestituicao: number;
}

export interface NotaFiscal {
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


export interface ProdutoAuditado {
  id: number
  descricaoProduto: string
}

export interface RelatorioNotaDetalhado {
  chave: string
  cnpjEmitente: string
  nomeRazaoSocial: string
  dataEmissao: string
  direitoRestituicao: boolean
  valorRestituicao: number
  produtosAuditados: ProdutoAuditado[]
}





// Serviços específicos para cada área da aplicação

// Dashboard
export const dashboardService = {
  // getStats: () => fetchApi<DashboardStats>("/dashboard/stats"),
}

// Upload e Análise de XML

export const xmlService = {
  // Agora recebe um FormData contendo um ou vários arquivos
  analisarXml: (fd: FormData): Promise<NotaComSelecao[]> => {
    return fetchApi<NotaComSelecao[]>("/analisar", {
      method: "POST",
      body: fd,
    });
  },


  // Agora recebe o payload completo que o back espera:
  // antes
  salvarProdutos: (payload: PayloadSalvar): Promise<RespostaSalvar> => {
    return fetchApi<RespostaSalvar>("/produtos/salvar", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  // Continua só chave + lista de produtos para atualização de tabela SPED
  atualizarTabelaSPED: (
    chave: string,
    produtos: ProdutoNota[]
  ): Promise<RespostaSalvar> => {
    return fetchApi<RespostaSalvar>("/produtos/atualizar-tabela", {
      method: "POST",
      body: JSON.stringify({ chave, produtos }),
    })
  },

  gerarRelatorio: (chave: string) =>
    fetchApi<RelatorioNotaFiscalDTO>(`/relatorio/${chave}`),

  downloadExcel: async (chave: string) => {
    const url = `${API_BASE_URL}${API_PREFIX}/relatorio/${chave}/excel`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // se precisar, inclua token ou CORS
      },
    });
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    // força o browser a baixar:
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `restituicao_${chave}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  },
};


// Empresa 

export const empresasService = {
  // Listar todas as empresas (resumo)
  listarEmpresas: (): Promise<EmpresaResumo[]> => {
    return fetchApi<EmpresaResumo[]>("/empresas/listar")
  },

  // Cadastrar nova empresa
  cadastrarEmpresa: (empresa: Empresa): Promise<Empresa> => {
    return fetchApi<Empresa>("/empresas/cadastrar", {
      method: "POST",
      body: JSON.stringify(empresa),
    })
  },

  // Buscar empresa por CNPJ (resumo)
  buscarEmpresa: (cnpj: string): Promise<EmpresaResumo> => {
    return fetchApi<EmpresaResumo>(`/empresas/buscar/${cnpj}`)
  },

  // Buscar detalhes completos da empresa
  buscarDetalhesEmpresa: (cnpj: string): Promise<EmpresaDetalhe> => {
    return fetchApi<EmpresaDetalhe>(`/empresas/detalhe/${cnpj}`)
  },

  // Excluir empresa por CNPJ
  excluirEmpresa: (cnpj: string): Promise<void> => {
    return fetchApi<void>(`/empresas/deletar/${cnpj}`, {
      method: "DELETE",
    })
  },

  // Atualizar empresa existente
  atualizarEmpresa: (cnpj: string, empresa: Empresa): Promise<Empresa> => {
    return fetchApi<Empresa>(`/empresas/atualizar/${cnpj}`, {
      method: "PUT",
      body: JSON.stringify(empresa),
    })
  }
}


// notas ficais por CNPJ

// export const notasService = {
//   listarPorEmpresaCnpj: (cnpj: string, chave?: string) => {
//     const query = chave ? `?chave=${encodeURIComponent(chave)}` : '';
//     return fetchApi<NotaFiscal[]>(`/notas/empresa/${cnpj}/chave${query}`);
//   },
// };

export const notasService = {
  // Buscar lista de notas por CNPJ
  listarPorEmpresaCnpj: (cnpj: string): Promise<NotaFiscal[]> => {
    return fetchApi<NotaFiscal[]>(`/notas/empresa/${cnpj}`, { method: "GET" });
  },

  // Buscar relatório detalhado de uma nota específica
  buscarRelatorioDetalhado: (cnpj: string, chave: string): Promise<RelatorioNotaDetalhado> => {
    return fetchApi<RelatorioNotaDetalhado>(`/notas/empresa/${cnpj}/chave/${chave}`, { method: "GET" });
  },

};



// Produtos
export const produtosService = {
  listarProdutos: () => fetchApi<Produto[]>("/tabela"),

  excluirProduto: (id: string) =>
    fetchApi<void>(`/tabela/${id}`, {
      method: "DELETE",
    }),

  atualizarProduto: (id: string, produto: Produto) =>
    fetchApi<Produto>(`/tabela/${id}`, {
      method: "PUT",
      body: JSON.stringify(produto),
    }),
}

// Relatórios

export const relatoriosService = {
  // ... outros métodos existentes ...

  buscarAuditoriaPorChave: (chave: string) =>
    fetchApi<RelatorioNotaFiscalDTO>(`/relatorio/${chave}`),

  downloadAuditoriaExcel: async (chave: string) => {
    const url = `${API_BASE_URL}${API_PREFIX}/relatorio/${chave}/excel`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `auditoria_${chave}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
}

export const authService = {
  login: async (dados: LoginRequest): Promise<LoginResponse> => {
    const response = await fetchApi<string>("/usuarios/login", {
      method: "POST",
      body: JSON.stringify(dados),
    });

    return { token: response }; // resposta é uma string (token)
  },
};

// Tipos para usuários
export interface CadastroUsuarioRequest {
  nome: string
  email: string
  senha: string
  perfil: "OPERADOR"
  empresaId: number
}

export interface Usuario {
  id: number
  nome: string
  email: string
  perfil: string
  empresaId?: number
  criadoEm: string
}

// Serviço de usuários
export const usuariosService = {
  // Cadastrar novo usuário (operador)
  cadastrarUsuario: (usuario: CadastroUsuarioRequest): Promise<Usuario> => {
    return fetchApi<Usuario>("/usuarios/cadastrar", {
      method: "POST",
      body: JSON.stringify(usuario),
    })
  },

  // Listar usuários (se necessário no futuro)
  listarUsuarios: (): Promise<Usuario[]> => {
    return fetchApi<Usuario[]>("/usuarios/listar")
  },
}

export const auditLogService = {
  /**
   * Busca os logs de auditoria para o time do gerente logado,
   * aplicando filtros opcionais.
   */
  getLogsDoMeuTime: (filters: AuditLogFilters): Promise<AuditLog[]> => {
    // 1. Cria os parâmetros de busca (query string) a partir do objeto de filtros
    const params = new URLSearchParams();
    if (filters.usuarioEmail) {
      params.append("usuarioEmail", filters.usuarioEmail);
    }
    if (filters.cnpj) {
      params.append("cnpj", filters.cnpj);
    }
    const queryString = params.toString();

    // 2. Monta a URL final, adicionando a query string se houver filtros
    const url = `/audit-logs/meu-time${queryString ? `?${queryString}` : ''}`;

    // 3. Chama a sua função fetchApi com a URL e o método GET
    return fetchApi<AuditLog[]>(url); // O método GET é geralmente o padrão, então options pode ser omitido
  },
};