"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { LogOut, User, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"

interface HeaderProps {
  darkMode?: boolean
}

export const Header: React.FC<HeaderProps> = ({ darkMode = false }) => {
  const { nome, perfil, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getTranslatedPerfil = (perfil: string | null) => {
    switch (perfil?.toUpperCase()) {
      case "ADMIN":
        return "Administrador"
      case "GERENTE":
        return "Gerente"
      case "OPERADOR":
        return "Operador"
      default:
        return perfil || "Usuário"
    }
  }

  const getPerfilIcon = (perfil: string | null) => {
    switch (perfil?.toUpperCase()) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />
      case "GERENTE":
        return <User className="h-4 w-4" />
      case "OPERADOR":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getPerfilColor = (perfil: string | null) => {
    switch (perfil?.toUpperCase()) {
      case "ADMIN":
        return "text-red-600"
      case "GERENTE":
        return "text-blue-600"
      case "OPERADOR":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getUserInitials = (nome: string | null) => {
    if (!nome) return "U"
    return nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header
      className={`
        fixed top-0 right-0 left-64 z-50 h-16 
        flex items-center justify-between px-6
        border-b shadow-sm
        ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* Logo/Title Area */}
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M18 8V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v1" />
            <path d="M3 8h18v9c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8Z" />
            <path d="M12 12v4" />
            <path d="M8 12v4" />
            <path d="M16 12v4" />
          </svg>
        </div>
        <h1 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>CashFisco</h1>
      </div>

      {/* User Info and Actions */}
      <div className="flex items-center space-x-4">
        {/* User Info Display */}
        <div className={`hidden md:flex items-center space-x-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          <div className="text-right">
            <p className="text-sm font-medium">{nome || "Usuário"}</p>
            <p className={`text-xs flex items-center justify-end space-x-1 ${getPerfilColor(perfil)}`}>
              {getPerfilIcon(perfil)}
              <span>{getTranslatedPerfil(perfil)}</span>
            </p>
          </div>
        </div>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium">
                  {getUserInitials(nome)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{nome || "Usuário"}</p>
                <p className={`text-xs leading-none ${getPerfilColor(perfil)} flex items-center space-x-1`}>
                  {getPerfilIcon(perfil)}
                  <span>{getTranslatedPerfil(perfil)}</span>
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
