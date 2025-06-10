"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { decodeToken, DecodedToken } from "@/utils/jwt"

interface AuthContextType {
  token: string | null
  perfil: string | null
  email: string | null
  nome: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [perfil, setPerfil] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [nome, setNome] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      const decoded = decodeToken(storedToken)
      setToken(storedToken)
      setPerfil(decoded?.perfil || null)
      setEmail(decoded?.sub || null)
      setNome(decoded?.nome || null) // <- CORRETO AQUI
    }
  }, [])

  const login = (newToken: string) => {
    const decoded = decodeToken(newToken)
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setPerfil(decoded?.perfil || null)
    setEmail(decoded?.sub || null)
    setNome(decoded?.nome || null) // <- CORRETO AQUI
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setPerfil(null)
    setEmail(null)
    setNome(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ token, perfil, email, nome, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }
  return context
}
