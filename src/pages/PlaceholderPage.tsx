import { Construction } from 'lucide-react'

interface Props { title: string; description: string }

export function PlaceholderPage({ title, description }: Props) {
  return (
    <section className="placeholder-page panel">
      <div className="placeholder-icon"><Construction size={27}/></div>
      <span className="eyebrow">MÓDULO DO WP ESTOQUE</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <span className="coming-soon">Módulo previsto para as próximas etapas</span>
    </section>
  )
}
