// "use client"

// import { Inter } from "next/font/google"
// import "./globals.css"

// import { AuthProvider } from "@/contexts/AuthContext"
// import { Layout, ConfigProvider, theme } from "antd"
// import { Header } from "@/components/Header" // Seu Header.tsx atualizado
// import { useState } from "react"
// import { usePathname } from "next/navigation" // Importe usePathname
// import AppSidebar from "@/components/sidebar/AppSidebar"


// const inter = Inter({ subsets: ["latin"] })

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   const [darkMode, setDarkMode] = useState(false)
//   const [currentPage, setCurrentPage] = useState("dashboard") // Estado para a página atual da sidebar
//   const pathname = usePathname() // Obtenha o caminho da rota atual

//   const isLoginPage = pathname === "/login"

//   return (
//     <html lang="pt-BR">
//       <body className={inter.className}>
//         <ConfigProvider
//           theme={{
//             algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
//           }}
//         >
//           <AuthProvider>
//             <Layout style={{ minHeight: "100vh" }}>
//               {!isLoginPage && (
//                 <> {/* Renderiza sidebar e header apenas se não for a página de login */}
//                   {/* Sidebar */}
//                   <AppSidebar
//                     currentPage={currentPage}
//                     setCurrentPage={setCurrentPage}
//                     darkMode={darkMode}
//                     setDarkMode={setDarkMode}
//                   />
//                 </>
//               )}

//               {/* Layout principal */}
//               <Layout style={{ marginLeft: isLoginPage ? 0 : 0 }}> {/* Ajusta o marginLeft */}
//                 {!isLoginPage && (
//                   <> {/* Renderiza header apenas se não for a página de login */}
//                     {/* Header com informações do usuário */}
//                     <Header darkMode={darkMode} />
//                   </>
//                 )}

//                 {/* Conteúdo principal */}
//                 <Layout.Content
//                   style={{
//                     margin: isLoginPage ? "24px" : "64px 24px 24px", // Ajusta a margem superior
//                     // padding: 24,
//                     // minHeight: 280,
//                     background: darkMode ? "#141414" : "#fff",
//                     // borderRadius: 8,
//                   }}
//                 >
//                   {children}
//                 </Layout.Content>
//               </Layout>
//             </Layout>
//           </AuthProvider>
//         </ConfigProvider>
//       </body>
//     </html>
//   )
// }

"use client"

import { Inter } from "next/font/google"
import "./globals.css"

import { AuthProvider } from "@/contexts/AuthContext"
import { Layout, ConfigProvider, theme, App } from "antd" // ⬅️ IMPORTAR App
import { Header } from "@/components/Header"
import { useState } from "react"
import { usePathname } from "next/navigation"
import AppSidebar from "@/components/sidebar/AppSidebar"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [darkMode, setDarkMode] = useState(false)
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState(pathname)
  const isLoginPage = pathname === "/login"

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <AuthProvider>
            <App> {/* ⬅️ Envolver aqui */}
              <Layout style={{ minHeight: "100vh" }}>
                {!isLoginPage && (
                  <>
                    <AppSidebar
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                    />
                  </>
                )}

                <Layout style={{ marginLeft: isLoginPage ? 0 : 0 }}>
                  {!isLoginPage && (
                    <>
                      <Header darkMode={darkMode} />
                    </>
                  )}

                  <Layout.Content
                    style={{
                      margin: isLoginPage ? "24px" : "64px 24px 24px",
                      background: darkMode ? "#141414" : "#fff",
                    }}
                  >
                    {children}
                  </Layout.Content>
                </Layout>
              </Layout>
            </App> {/* ⬅️ Fecha o contexto do Ant Design */}
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  )
}
