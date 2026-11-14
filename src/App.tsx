import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProductsPage } from './pages/ProductsPage'

function AccessGate({ children }: { children: React.ReactNode }) {
  const { user, companyId, loading, error, signOutUser } = useAuth()

  if (loading) return <main className="auth-screen"><section className="auth-card"><strong>WP ESTOQUE</strong><p>Verificando seu acesso...</p></section></main>
  if (!user) return <LoginPage />
  if (!companyId) return <main className="auth-screen"><section className="auth-card"><strong>WP ESTOQUE</strong><h1>Acesso não liberado</h1><p className="auth-description">{error || 'Sua conta ainda não está vinculada a uma empresa.'}</p><button className="primary-button auth-submit" onClick={() => void signOutUser()}>Sair da conta</button></section></main>
  return <>{children}</>
}

export default function App() {
  return <AccessGate><Routes>
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
  </Routes></AccessGate>
}
