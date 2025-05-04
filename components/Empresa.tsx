"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  Typography, 
  Table, 
  Card, 
  Input, 
  Button, 
  Space, 
  Spin, 
  Tag, 
  Modal, 
  Form,
  Descriptions,
  message 
} from "antd"
import { 
  SearchOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { Empresa, EmpresaDetalhe, empresasService } from "@/services/api"

const { Title, Text } = Typography

const EmpresasView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaDetalhe | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalDetalheVisible, setModalDetalheVisible] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [form] = Form.useForm()

  useEffect(() => {
    carregarEmpresas()
  }, [])

  const carregarEmpresas = async () => {
    try {
      setLoading(true)
      const data = await empresasService.listarEmpresas()
      setEmpresas(data)
    } catch (error) {
      console.error("Erro ao carregar empresas:", error)
      message.error("Erro ao carregar empresas")
    } finally {
      setLoading(false)
    }
  }

  const carregarDetalhesEmpresa = async (cnpj: string) => {
    try {
      setLoading(true)
      const data = await empresasService.buscarDetalhesEmpresa(cnpj)
      setEmpresaSelecionada(data)
      setModalDetalheVisible(true)
    } catch (error) {
      console.error("Erro ao carregar detalhes da empresa:", error)
      message.error("Erro ao carregar detalhes da empresa")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (values: Empresa) => {
    try {
      setLoading(true)
      await empresasService.cadastrarEmpresa(values)
      message.success("Empresa cadastrada com sucesso!")
      form.resetFields()
      setModalVisible(false)
      carregarEmpresas()
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error)
      message.error("Erro ao cadastrar empresa")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cnpj: string) => {
    try {
      setLoading(true)
      await empresasService.excluirEmpresa(cnpj)
      message.success("Empresa excluída com sucesso!")
      carregarEmpresas()
    } catch (error) {
      console.error("Erro ao excluir empresa:", error)
      message.error("Erro ao excluir empresa")
    } finally {
      setLoading(false)
    }
  }

  const filteredEmpresas = empresas.filter(
    (empresa) =>
      empresa.nomeRazaoSocial.toLowerCase().includes(searchText.toLowerCase()) ||
      empresa.cnpj.includes(searchText),
  )

  const columns: ColumnsType<Empresa> = [
    {
      title: "CNPJ",
      dataIndex: "cnpj",
      key: "cnpj",
      render: (cnpj) => (
        <Tag color="blue">
          {cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
        </Tag>
      ),
      sorter: (a, b) => a.cnpj.localeCompare(b.cnpj),
    },
    {
      title: "Razão Social",
      dataIndex: "nomeRazaoSocial",
      key: "nomeRazaoSocial",
      sorter: (a, b) => a.nomeRazaoSocial.localeCompare(b.nomeRazaoSocial),
    },
    {
      title: "Ações",
      key: "acoes",
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => carregarDetalhesEmpresa(record.cnpj)}
          >
            Detalhes
          </Button>
          <Button 
            danger 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.cnpj)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={2}>Cadastro de Empresas</Title>
      <Text type="secondary">Gerencie as empresas cadastradas no sistema</Text>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <Input
            placeholder="Buscar por CNPJ ou Razão Social"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Nova Empresa
          </Button>
        </div>

        <Spin spinning={loading}>
          <Table 
            dataSource={filteredEmpresas} 
            columns={columns} 
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50']
            }}
          />
        </Spin>
      </Card>

      {/* Modal de Cadastro */}
      <Modal
        title="Cadastrar Nova Empresa"
        open={modalVisible}
        onCancel={() => {
          form.resetFields()
          setModalVisible(false)
        }}
        footer={null}
        destroyOnClose
      >
        <Form<Empresa>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="cnpj"
            label="CNPJ"
            rules={[
              { required: true, message: "Por favor, informe o CNPJ" },
              { 
                pattern: /^\d{14}$/, 
                message: "CNPJ deve conter exatamente 14 dígitos" 
              }
            ]}
          >
            <Input 
              placeholder="Digite o CNPJ (apenas números)" 
              maxLength={14} 
            />
          </Form.Item>

          <Form.Item
            name="nomeRazaoSocial"
            label="Razão Social"
            rules={[
              { required: true, message: "Por favor, informe a Razão Social" },
              { 
                min: 5, 
                message: "Razão Social deve ter pelo menos 5 caracteres" 
              }
            ]}
          >
            <Input placeholder="Digite a Razão Social" />
          </Form.Item>

          <Form.Item
            name="endereco"
            label="Endereço"
            rules={[
              { 
                min: 10, 
                message: "Endereço deve ter pelo menos 10 caracteres" 
              }
            ]}
          >
            <Input.TextArea placeholder="Digite o endereço completo" rows={3} />
          </Form.Item>

          <Form.Item
            name="contatoEmail"
            label="E-mail de Contato"
            rules={[
              { type: "email", message: "Por favor, informe um e-mail válido" }
            ]}
          >
            <Input placeholder="Digite o e-mail de contato" />
          </Form.Item>

          <Form.Item
            name="contatoTelefone"
            label="Telefone de Contato"
            rules={[
              { 
                pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/, 
                message: "Formato: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX" 
              }
            ]}
          >
            <Input placeholder="Digite o telefone (XX) XXXX-XXXX" />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
            <Space>
              <Button onClick={() => {
                form.resetFields()
                setModalVisible(false)
              }}>
                Cancelar
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Cadastrar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal
        title={`Detalhes da Empresa`}
        open={modalDetalheVisible}
        onCancel={() => setModalDetalheVisible(false)}
        footer={null}
        width={800}
      >
        {empresaSelecionada && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="CNPJ">
              {empresaSelecionada.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
            </Descriptions.Item>
            <Descriptions.Item label="Razão Social">
              {empresaSelecionada.nomeRazaoSocial}
            </Descriptions.Item>
            <Descriptions.Item label="Endereço">
              {empresaSelecionada.endereco || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="E-mail de Contato">
              {empresaSelecionada.contatoEmail || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone de Contato">
              {empresaSelecionada.contatoTelefone || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Cadastrado em">
              {empresaSelecionada.criadoEm ? new Date(empresaSelecionada.criadoEm).toLocaleString() : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Total de Notas">
              {empresaSelecionada.notas.length}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default EmpresasView