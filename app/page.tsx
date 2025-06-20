"use client"

import { useState } from "react"
import { Layout, Typography, theme } from "antd"
import AppSidebar from "@/components/AppSidebar"
import Dashboard from "@/components/Dashboard"
import UploadXml from "@/components/upload-xml/UploadXml"
import ProductsView from "@/components/produtos/ProdutosTabela"
import Reports from "@/components/relatorios/Relatorio"
import Settings from "@/components/configuracoes/Settings"
import Empresa from "@/components/empresa/page"
import CadastroUsuario from "@/components/usuarios/PaginaAdmin"
import PaginaAdmin from "@/components/usuarios/PaginaAdmin"

const { Content } = Layout
const { Title } = Typography

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard")
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "upload":
        return <UploadXml />
      case "products":
        return <ProductsView />
        case "companies":               // ← nova rota
        return <Empresa />
      case "reports":
        return <Reports />
         case "PaginaAdmin":
        return <PaginaAdmin />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Layout style={{ marginLeft: 200 }}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}
