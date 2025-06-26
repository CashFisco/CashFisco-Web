// Caminho: app/(main)/layout.tsx
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Spin, ConfigProvider, theme } from 'antd';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext'; // Agora pode ser usado sem erro
import AppSidebar from '@/components/sidebar/AppSidebar';

const { Content } = Layout;

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth(); // Usando o hook que agora funciona
  const [isVerifying, setIsVerifying] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const currentPageKey = pathname.split('/')[1] || 'dashboard';

  useEffect(() => {
    // A lógica de verificação é um pouco mais robusta
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.replace('/login');
    } else {
      setIsVerifying(false);
    }
  }, [token, router]);

  // Se estiver verificando ou se não houver token, mostra o carregamento/redireciona
  if (isVerifying) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
        <Spin size="large" tip="Verificando autenticação..." />
      </div>
    );
  }

  // Renderiza o layout principal apenas se autenticado
  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: '100vh' }}>
        <AppSidebar
                  currentPage={currentPageKey}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode} setCurrentPage={function (page: string): void {
                      throw new Error('Function not implemented.');
                  } }        />
        <Layout style={{ marginLeft: 200 }}>
          <Header darkMode={darkMode} />
          <Content style={{ padding: 24, marginTop: 64, background: darkMode ? '#141414' : '#f5f5f5' }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}