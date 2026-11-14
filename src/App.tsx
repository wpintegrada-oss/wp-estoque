import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductsPage } from './pages/ProductsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="vendas" element={<PlaceholderPage title="Vendas / PDV" description="Registre vendas e acompanhe a baixa automática do estoque." />} />
        <Route path="compras" element={<PlaceholderPage title="Compras" description="Registre compras, recebimentos e entradas de mercadorias." />} />
        <Route path="fornecedores" element={<PlaceholderPage title="Fornecedores" description="Organize os dados e o histórico dos seus fornecedores." />} />
        <Route path="movimentacoes" element={<PlaceholderPage title="Movimentações" description="Consulte entradas, saídas, ajustes e estornos." />} />
        <Route path="inventario" element={<PlaceholderPage title="Inventário" description="Faça contagens físicas e concilie diferenças de estoque." />} />
        <Route path="relatorios" element={<PlaceholderPage title="Relatórios" description="Acompanhe vendas, custos, perdas e posição do estoque." />} />
        <Route path="configuracoes" element={<PlaceholderPage title="Configurações" description="Configure os dados da empresa e as preferências do sistema." />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
