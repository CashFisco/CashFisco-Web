"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Typography, Row, Col, Card, Button, Steps, Divider, message } from "antd"
import {
  BookOutlined,
  BuildOutlined,
  CloudUploadOutlined,
  BarChartOutlined,
  RightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography
const { Step } = Steps

const HomePage: React.FC = () => {
  const router = useRouter()

  const cardStyle = {
    borderRadius: "12px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    height: "100%",
  }

  return (
    // CORREÇÃO: Mantemos o fundo cinza, mas aplicamos padding apenas nas laterais
    <div style={{ background: "#f5f5f5", padding: "1 1 1 1px" }}>
      {/* Header Section com padding no topo */}
      <div style={{ marginBottom: "40px", paddingTop: "32px" }}>
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
            Bem-vindo ao CashFisco!
          </Title>
        </div>
        <Text type="secondary" style={{ fontSize: "18px", marginLeft: "20px" }}>
          Sua plataforma inteligente para análise e recuperação de tributos de produtos monofásicos.
        </Text>
      </div>

      {/* Main Content com padding embaixo */}
      <Row gutter={[24, 24]} style={{ paddingBottom: "32px" }}>
        {/* Coluna Principal - Instruções */}
        <Col xs={24} lg={16}>
          <Card style={cardStyle}>
            <Title level={4} style={{ marginBottom: "24px" }}>
              Comece a usar em 3 passos simples
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: "32px" }}>
              Siga os passos abaixo para iniciar a análise e descobrir oportunidades de restituição fiscal para sua empresa.
            </Paragraph>

            <Steps direction="vertical" current={-1}>
              <Step
                title={<Title level={5}>Cadastre suas Empresas</Title>}
                description={
                  <>
                    <Text>O primeiro passo é adicionar as empresas que você deseja analisar. Vá para a seção de empresas e preencha as informações necessárias.</Text>
                    <br />
                    <Button
                      type="primary"
                      style={{ marginTop: "12px", background: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)", border: 'none' }}
                      icon={<BuildOutlined />}
                      onClick={() => router.push("/empresas")}
                    >
                      Cadastrar Empresa
                    </Button>
                  </>
                }
                icon={<BuildOutlined />}
              />
              <Step
                title={<Title level={5}>Faça o Upload das Notas Fiscais (XML)</Title>}
                description={
                  <>
                    <Text>Com a empresa cadastrada, o próximo passo é enviar os arquivos XML das notas fiscais de compra. Nosso sistema processará os arquivos automaticamente.</Text>
                    <br />
                    <Button
                      type="primary"
                      style={{ marginTop: "12px", background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)", border: 'none' }}
                      icon={<CloudUploadOutlined />}
                      onClick={() => router.push("/upload-xml")}
                    >
                      Fazer Upload
                    </Button>
                  </>
                }
                icon={<CloudUploadOutlined />}
              />
              <Step
                title={<Title level={5}>Analise os Resultados e Gere Relatórios</Title>}
                description={
                  <>
                    <Text>Após o processamento, o sistema apresentará um relatório detalhado com os valores de PIS e COFINS que podem ser restituídos. Você pode visualizar e exportar esses dados.</Text>
                    <br />
                    <Button
                      type="primary"
                      style={{ marginTop: "12px", background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)", border: 'none' }}
                      icon={<BarChartOutlined />}
                      onClick={() => router.push("/relatorios")}
                    >
                      Ver Relatórios
                    </Button>
                  </>
                }
                icon={<BarChartOutlined />}
              />
            </Steps>
          </Card>
        </Col>

        {/* Coluna Lateral - Recursos e Links */}
        <Col xs={24} lg={8}>
          <Card
            style={cardStyle}
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <ThunderboltOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                <Title level={5} style={{ margin: 0 }}>Recursos e Acesso Rápido</Title>
              </div>
            }
          >
            {/* Seção Manual do Usuário */}
            <div style={{ padding: '8px 0 16px' }}>
                <Paragraph type="secondary">
                    Tem alguma dúvida? Acesse nosso manual completo com o passo a passo de todas as funcionalidades.
                </Paragraph>
                <Button
                    type="primary"
                    size="large"
                    block
                    icon={<BookOutlined />}
                    onClick={() => message.info("Download do manual iniciado...")}
                    style={{
                        background: "linear-gradient(45deg, #1890ff, #40a9ff)",
                        border: "none",
                        fontWeight: 600
                    }}
                >
                    Baixar Manual do Usuário (PDF)
                </Button>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            {/* Seção Links Rápidos */}
            <Button type="text" block style={{ textAlign: 'left', height: 'auto', padding: '12px 0' }} onClick={() => router.push('/produtos')}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text strong>Tabela de Produtos Monofásicos</Text>
                <RightOutlined style={{color: '#bfbfbf'}}/>
              </div>
            </Button>
            <Divider style={{margin: '0'}}/>
            <Button type="text" block style={{ textAlign: 'left', height: 'auto', padding: '12px 0' }} onClick={() => router.push('/configuracoes')}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text strong>Configurações do Sistema</Text>
                <RightOutlined style={{color: '#bfbfbf'}}/>
              </div>
            </Button>
            <Divider style={{margin: '0'}}/>
            <Button type="text" block style={{ textAlign: 'left', height: 'auto', padding: '12px 0' }} onClick={() => message.info("Abrindo tela de suporte...")}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text strong>Suporte Técnico</Text>
                    <RightOutlined style={{color: '#bfbfbf'}}/>
                </div>
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HomePage