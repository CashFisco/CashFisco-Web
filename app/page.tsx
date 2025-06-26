"use client"

import { useState } from "react"
import { Layout, Typography, theme } from "antd"
import AppSidebar from "@/components/sidebar/AppSidebar"
import Dashboard from "@/app/(main)/dashboard/Dashboard"
import UploadXml from "@/app/(main)/upload-xml/UploadXml"
import ProductsView from "@/app/(main)/produtos/ProdutosTabela"
import Reports from "@/app/(main)/relatorios/Relatorio"
import Settings from "@/components/configuracoes/Settings"
import Empresa from "@/app/(main)/empresa/page"
import CadastroUsuario from "@/app/(main)/usuarios/PaginaAdmin"
import PaginaAdmin from "@/app/(main)/usuarios/PaginaAdmin"

const { Content } = Layout
const { Title } = Typography

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>("login")
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


// // Caminho: app/page.tsx
// "use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { Spin } from 'antd';

// export default function RootPage() {
//   const router = useRouter();

//   useEffect(() => {
//     // Redireciona o usuário da rota raiz "/" para a página de login
//     router.replace('/login');
//   }, [router]);

//   // Exibe um carregamento para uma melhor experiência
//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <Spin size="large" />
//     </div>
//   );
// }