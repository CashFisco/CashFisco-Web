"use client"

import { useState } from "react"
import { Layout, Typography, theme } from "antd"
import AppSidebar from "@/components/AppSidebar"
import Dashboard from "@/components/Dashboard"
import UploadXml from "@/components/UploadXml"
import ProductsView from "@/components/ProdutosTabela"
import Reports from "@/components/Relatorio"
import Settings from "@/components/Settings"
import Empresa from "@/components/Empresa"

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
