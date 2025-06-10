"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Row, Col, Card, Statistic, Typography, Spin, Alert, Progress } from "antd"
import {
  FileTextOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

// Tipos
interface DashboardStats {
  totalNotas: number
  totalPis: number
  totalCofins: number
  totalProdutos: number
  crescimentoMensal: number
  eficienciaProcessamento: number
  lastUpdated?: string
}

// Mock data
const MOCK_DASHBOARD_DATA: DashboardStats = {
  totalNotas: 1245,
  totalPis: 125600.5,
  totalCofins: 98700.75,
  totalProdutos: 42,
  crescimentoMensal: 15.8,
  eficienciaProcessamento: 94.2,
  lastUpdated: new Date().toLocaleString("pt-BR"),
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalNotas: 0,
    totalPis: 0,
    totalCofins: 0,
    totalProdutos: 0,
    crescimentoMensal: 0,
    eficienciaProcessamento: 0,
  })

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setStats(MOCK_DASHBOARD_DATA)
      setError("Dados simulados - Modo offline")
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  }

  const statisticStyle = {
    ".ant-statistic-title": {
      color: "#595959",
      fontWeight: "500",
      fontSize: "14px",
    },
    ".ant-statistic-content": {
      color: "#262626",
      fontWeight: "600",
    },
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <div
            style={{
              width: "4px",
              height: "32px",
              background: "linear-gradient(45deg, #1890ff, #fa8c16)",
              borderRadius: "2px",
              marginRight: "16px",
            }}
          />
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Dashboard
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "16px", marginLeft: "20px" }}>
          Visão geral do sistema CashFisco
        </Text>
      </div>

      {/* Alert Section */}
      {error && (
        <Alert
          message="Atenção"
          description={error}
          type="warning"
          showIcon
          style={{
            marginBottom: "24px",
            borderRadius: "8px",
            border: "1px solid #fa8c16",
            backgroundColor: "#fff7e6",
          }}
        />
      )}

      <Spin spinning={loading} size="large">
        {/* Main Statistics */}
        <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(24, 144, 255, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={
                  <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Notas Fiscais Analisadas</span>
                }
                value={stats.totalNotas}
                prefix={<FileTextOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(250, 140, 22, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Total PIS</span>}
                value={stats.totalPis}
                precision={2}
                prefix={<DollarOutlined style={{ color: "white" }} />}
                suffix="R$"
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(82, 196, 26, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Total COFINS</span>}
                value={stats.totalCofins}
                precision={2}
                prefix={<DollarOutlined style={{ color: "white" }} />}
                suffix="R$"
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(114, 46, 209, 0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Statistic
                title={<span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>Produtos Monofásicos</span>}
                value={stats.totalProdutos}
                prefix={<CheckCircleOutlined style={{ color: "white" }} />}
                valueStyle={{ color: "white", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Secondary Statistics */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <WarningOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                  <span>Crescimento Mensal</span>
                </div>
              }
              style={cardStyle}
            >
              <div style={{ textAlign: "center" }}>
                <Statistic
                  value={stats.crescimentoMensal}
                  precision={1}
                  suffix="%"
                  valueStyle={{
                    color: "#52c41a",
                    fontSize: "32px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                />
                <Progress
                  percent={stats.crescimentoMensal}
                  strokeColor={{
                    "0%": "#1890ff",
                    "100%": "#fa8c16",
                  }}
                  showInfo={false}
                  strokeWidth={8}
                />
                <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
                  Comparado ao mês anterior
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BarChartOutlined style={{ color: "#fa8c16", marginRight: "8px" }} />
                  <span>Eficiência de Processamento</span>
                </div>
              }
              style={cardStyle}
            >
              <div style={{ textAlign: "center" }}>
                <Statistic
                  value={stats.eficienciaProcessamento}
                  precision={1}
                  suffix="%"
                  valueStyle={{
                    color: "#1890ff",
                    fontSize: "32px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                  }}
                />
                <Progress
                  percent={stats.eficienciaProcessamento}
                  strokeColor={{
                    "0%": "#fa8c16",
                    "100%": "#52c41a",
                  }}
                  showInfo={false}
                  strokeWidth={8}
                />
                <Text type="secondary" style={{ marginTop: "8px", display: "block" }}>
                  Taxa de sucesso no processamento
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Footer Info */}
        {stats.lastUpdated && (
          <Card
            style={{
              ...cardStyle,
              marginTop: "24px",
              background: "linear-gradient(90deg, rgba(24, 144, 255, 0.05), rgba(250, 140, 22, 0.05))",
              border: "1px solid rgba(24, 144, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CalendarOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
              <Text type="secondary">Última atualização: {stats.lastUpdated}</Text>
            </div>
          </Card>
        )}
      </Spin>
    </div>
  )
}

export default Dashboard
