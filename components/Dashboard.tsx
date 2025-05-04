import { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Typography, Spin, Alert } from "antd";
import { FileTextOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// 1. Primeiro defina o tipo
interface DashboardStats {
  totalNotas: number;
  totalPis: number;
  totalCofins: number;
  totalProdutos: number;
  lastUpdated?: string; // Opcional para manter compatibilidade
}

// 2. Mock data com a mesma estrutura do state
const MOCK_DASHBOARD_DATA: DashboardStats = {
  totalNotas: 1245,
  totalPis: 125600,
  totalCofins: 98700,
  totalProdutos: 42,
  lastUpdated: new Date().toLocaleString()
};

const Dashboard: React.FC = () => {
  // 3. State tipado corretamente
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalNotas: 0,
    totalPis: 0,
    totalCofins: 0,
    totalProdutos: 0,
  });

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setStats(MOCK_DASHBOARD_DATA);
      setError("Dados simulados - Modo offline");
      setLoading(false);
    }, 300);
  
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Text type="secondary">Visão geral do sistema</Text>

      {error && (
        <Alert 
          message="Atenção" 
          description={error} 
          type="warning" 
          showIcon 
          style={{ marginTop: 16 }}
        />
      )}

      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Notas Fiscais Analisadas" 
                value={stats.totalNotas} 
                prefix={<FileTextOutlined />} 
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total PIS"
                value={stats.totalPis}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="R$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total COFINS"
                value={stats.totalCofins}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="R$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic 
                title="Produtos Monofásicos" 
                value={stats.totalProdutos} 
                prefix={<CheckCircleOutlined />} 
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Dashboard;