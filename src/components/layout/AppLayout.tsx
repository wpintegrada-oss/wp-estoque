import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3, Boxes, Building2, ClipboardList, LayoutDashboard,
  Package, Settings, ShoppingCart, Truck, Warehouse, Menu, Bell, LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const navigation = [
  { label: 'Visão geral', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Produtos', to: '/produtos', icon: Package },
  { label: 'Vendas / PDV', to: '/vendas', icon: ShoppingCart },
  { label: 'Compras', to: '/compras', icon: Truck },
  { label: 'Fornecedores', to: '/fornecedores', icon: Building2 },
  { label: 'Movimentações', to: '/movimentacoes', icon: ClipboardList },
  { label: 'Inventário', to: '/inventario', icon: Warehouse },
  { label: 'Relatórios', to: '/relatorios', icon: BarChart3 },
]

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { companyName, user, signOutUser } = useAuth()

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Boxes size={23} /></div>
          <div><strong>WP ESTOQUE</strong><span>GESTÃO INTELIGENTE</span></div>
        </div>
        <div className="workspace-label">MENU PRINCIPAL</div>
        <nav className="nav-list">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/configuracoes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={18} /><span>Configurações</span>
          </NavLink>
          <div className="sidebar-company"><div className="company-avatar">{(companyName || 'E').charAt(0).toUpperCase()}</div><div><strong>{companyName || 'Minha empresa'}</strong><span>Conta conectada</span></div></div>
          <button className="nav-link logout-link" onClick={() => void signOutUser()}><LogOut size={18}/><span>Sair da conta</span></button>
          <small>WP Integrada · WP Estoque</small>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu"><Menu size={20} /></button>
          <div className="breadcrumb">WP ESTOQUE <span>/</span> <strong>Painel</strong></div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notificações"><Bell size={19} /></button>
            <div className="user-avatar" title={user?.email || 'Usuário'}>WP</div>
            <button type="button" className="logout-topbar" onClick={() => void signOutUser()}>
              <LogOut size={17} /><span>Sair</span>
            </button>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
      {menuOpen && <button className="mobile-overlay" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
    </div>
  )
}
