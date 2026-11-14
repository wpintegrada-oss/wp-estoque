import { ArrowDownRight, ArrowUpRight, AlertTriangle, Boxes, CircleDollarSign, Package, ShoppingCart } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'

const chartData = [
  { day: 'Seg', value: 120 }, { day: 'Ter', value: 185 }, { day: 'Qua', value: 145 },
  { day: 'Qui', value: 230 }, { day: 'Sex', value: 195 }, { day: 'Sáb', value: 285 }, { day: 'Dom', value: 245 },
]

const stats = [
  { title: 'Produtos cadastrados', value: '—', note: 'Cadastre seu primeiro produto', icon: Package, tone: 'blue' },
  { title: 'Valor em estoque', value: 'R$ 0,00', note: 'Custo total estimado', icon: Boxes, tone: 'violet' },
  { title: 'Vendas hoje', value: 'R$ 0,00', note: 'Nenhuma venda registrada', icon: ShoppingCart, tone: 'green' },
  { title: 'Estoque baixo', value: '0', note: 'Produtos precisam de atenção', icon: AlertTriangle, tone: 'orange' },
]

export function DashboardPage() {
  return (
    <div className="dashboard">
      <div className="page-heading">
        <div><div className="eyebrow">SEXTA-FEIRA, 13 DE NOVEMBRO</div><h1>Visão geral</h1><p>Acompanhe os números e a movimentação da sua empresa.</p></div>
        <button className="primary-button" onClick={() => window.location.assign('/produtos')}>＋ Novo produto</button>
      </div>

      <section className="stats-grid">
        {stats.map(({ title, value, note, icon: Icon, tone }) => (
          <article className="stat-card" key={title}>
            <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
            <span className="stat-title">{title}</span>
            <strong className="stat-value">{value}</strong>
            <span className="stat-note">{note}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel sales-panel">
          <div className="panel-heading"><div><h2>Movimentação de vendas</h2><p>Resumo ilustrativo da semana</p></div><span className="period-tag">Últimos 7 dias</span></div>
          <div className="chart-total"><strong>R$ 0,00</strong><span><ArrowUpRight size={15} /> Sem vendas registradas</span></div>
          <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2589e8" stopOpacity={0.22}/><stop offset="95%" stopColor="#2589e8" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8a96a8', fontSize: 12 }}/><Tooltip formatter={(value) => [`R$ ${value}`, 'Valor demonstrativo']} /><Area type="monotone" dataKey="value" stroke="#2589e8" strokeWidth={2.5} fill="url(#salesGradient)" /></AreaChart></ResponsiveContainer></div>
          <div className="demo-note">Gráfico demonstrativo — será alimentado pelas vendas reais.</div>
        </article>

        <article className="panel quick-panel">
          <div className="panel-heading"><div><h2>Acesso rápido</h2><p>Atalhos para as principais tarefas</p></div></div>
          <a className="quick-link" href="/produtos"><span className="quick-icon blue"><Package size={18}/></span><span><strong>Cadastrar produto</strong><small>Adicione um item ao catálogo</small></span><b>›</b></a>
          <a className="quick-link" href="/vendas"><span className="quick-icon green"><ShoppingCart size={18}/></span><span><strong>Registrar venda</strong><small>Abra o ponto de venda</small></span><b>›</b></a>
          <a className="quick-link" href="/compras"><span className="quick-icon violet"><ArrowDownRight size={18}/></span><span><strong>Registrar entrada</strong><small>Atualize seu estoque</small></span><b>›</b></a>
          <a className="quick-link" href="/relatorios"><span className="quick-icon orange"><CircleDollarSign size={18}/></span><span><strong>Ver relatórios</strong><small>Consulte os resultados</small></span><b>›</b></a>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-heading"><div><h2>Últimas movimentações</h2><p>Atividades recentes do estoque</p></div><a href="/movimentacoes" className="text-link">Ver todas</a></div>
        <div className="empty-state"><div className="empty-icon"><Boxes size={24}/></div><strong>Nenhuma movimentação por enquanto</strong><span>Quando houver entradas, vendas ou ajustes, eles aparecerão aqui.</span></div>
      </section>
    </div>
  )
}
