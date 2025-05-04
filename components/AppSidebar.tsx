// "use client"

// import type React from "react"

// import { Layout, Menu, Switch, Typography } from "antd"
// import {
//   DashboardOutlined,
//   UploadOutlined,
//   FileTextOutlined,
//   BarChartOutlined,
//   SettingOutlined,
//   BulbOutlined,
// } from "@ant-design/icons"
// import { useRouter } from "next/navigation"

// const { Sider } = Layout
// const { Title } = Typography

// interface AppSidebarProps {
//   currentPage: string
//   setCurrentPage: (page: string) => void
//   darkMode: boolean
//   setDarkMode: (darkMode: boolean) => void
// }

// const AppSidebar: React.FC<AppSidebarProps> = ({ currentPage, setCurrentPage, darkMode, setDarkMode }) => {
//   const router = useRouter()

//   const menuItems = [
//     {
//       key: "dashboard",
//       icon: <DashboardOutlined />,
//       label: "Dashboard",
//     },
//     {
//       key: "upload",
//       icon: <UploadOutlined />,
//       label: "Upload XML",
//     },
//     {
//       key: "products",
//       icon: <FileTextOutlined />,
//       label: "Produtos",
//     },
//     {
//       key: "reports",
//       icon: <BarChartOutlined />,
//       label: "Relatórios",
//     },
//     {
//       key: "settings",
//       icon: <SettingOutlined />,
//       label: "Configurações",
//     },
//   ]

//   return (
//     <Sider
//       style={{
//         overflow: "auto",
//         height: "100vh",
//         position: "fixed",
//         left: 0,
//         top: 0,
//         bottom: 0,
//       }}
//       theme={darkMode ? "dark" : "light"}
//     >
//       <div style={{ padding: "16px", textAlign: "center" }}>
//         <Title level={4} style={{ margin: "8px 0", color: darkMode ? "white" : "inherit" }}>
//           Cash Fisco
//         </Title>
//       </div>
//       <Menu
//         theme={darkMode ? "dark" : "light"}
//         mode="inline"
//         selectedKeys={[currentPage]}
//         items={menuItems}
//         onClick={({ key }) => setCurrentPage(key)}
//       />
//       <div style={{ padding: "16px", position: "absolute", bottom: 0, width: "100%" }}>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <BulbOutlined style={{ marginRight: 8, color: darkMode ? "white" : "inherit" }} />
//           <Switch
//             checked={darkMode}
//             onChange={(checked) => setDarkMode(checked)}
//             checkedChildren="🌙"
//             unCheckedChildren="☀️"
//           />
//         </div>
//       </div>
//     </Sider>
//   )
// }

// export default AppSidebar


"use client"

import type React from "react"
import { Layout, Menu, Switch, Typography } from "antd"
import {
  DashboardOutlined,
  UploadOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  BulbOutlined,
  ShopOutlined // Ícone para empresas
} from "@ant-design/icons"
import { useRouter } from "next/navigation"

const { Sider } = Layout
const { Title } = Typography

interface AppSidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

const AppSidebar: React.FC<AppSidebarProps> = ({ currentPage, setCurrentPage, darkMode, setDarkMode }) => {
  const router = useRouter()

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "upload",
      icon: <UploadOutlined />,
      label: "Upload XML",
    },
    {
      key: "products",
      icon: <FileTextOutlined />,
      label: "Produtos",
    },
    {
      key: "companies", // Novo item para empresas
      icon: <ShopOutlined />,
      label: "Empresas",
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Relatórios",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configurações",
    },
  ]

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      theme={darkMode ? "dark" : "light"}
    >
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Title level={4} style={{ margin: "8px 0", color: darkMode ? "white" : "inherit" }}>
          Cash Fisco
        </Title>
      </div>
      <Menu
        theme={darkMode ? "dark" : "light"}
        mode="inline"
        selectedKeys={[currentPage]}
        items={menuItems}
        onClick={({ key }) => setCurrentPage(key)}
      />
      <div style={{ padding: "16px", position: "absolute", bottom: 0, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BulbOutlined style={{ marginRight: 8, color: darkMode ? "white" : "inherit" }} />
          <Switch
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </div>
      </div>
    </Sider>
  )
}

export default AppSidebar