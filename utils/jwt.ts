export interface DecodedToken {
  sub: string
  perfil: "ADMIN" | "GERENTE" | "OPERADOR"
  id: number
  nome: string       // <- precisa bater com o que está no token
  iat: number
  exp: number
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const [, payloadBase64] = token.split(".")
    const payload = atob(payloadBase64)
    return JSON.parse(payload)
  } catch (e) {
    console.error("Erro ao decodificar o token:", e)
    return null
  }
}
