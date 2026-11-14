import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Barcode, Box, CircleAlert, Edit3, PackagePlus, Plus, Search, Trash2, X } from 'lucide-react'

type Product = {
  id: string
  name: string
  sku: string
  barcode: string
  category: string
  unit: string
  costPrice: number
  salePrice: number
  quantity: number
  minimum: number
  description: string
  active: boolean
  createdAt: string
}

const STORAGE_KEY = 'wp-estoque-products-v1'
const emptyForm = {
  name: '', sku: '', barcode: '', category: '', unit: 'UN', costPrice: '',
  salePrice: '', quantity: '0', minimum: '0', description: '', active: true,
}

type FormValues = typeof emptyForm
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const numberValue = (value: string) => Math.max(0, Number(value.replace(',', '.')) || 0)

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Product[] } catch { return [] }
  })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [stockFilter, setStockFilter] = useState('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(products)) }, [products])

  const categories = useMemo(() => ['Todas', ...Array.from(new Set(products.map(p => p.category.trim()).filter(Boolean))).sort()], [products])
  const filtered = useMemo(() => products.filter(product => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    const matchesSearch = !term || [product.name, product.sku, product.barcode, product.category].some(value => value.toLocaleLowerCase('pt-BR').includes(term))
    const matchesCategory = categoryFilter === 'Todas' || product.category === categoryFilter
    const low = product.quantity <= product.minimum
    const matchesStock = stockFilter === 'Todos' || (stockFilter === 'Baixo' ? low : !low)
    return matchesSearch && matchesCategory && matchesStock
  }), [products, search, categoryFilter, stockFilter])

  const lowStock = products.filter(p => p.active && p.quantity <= p.minimum).length
  const inventoryCost = products.filter(p => p.active).reduce((total, p) => total + p.costPrice * p.quantity, 0)

  function openNew() { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true) }
  function openEdit(product: Product) {
    setEditingId(product.id)
    setForm({ name: product.name, sku: product.sku, barcode: product.barcode, category: product.category, unit: product.unit, costPrice: String(product.costPrice), salePrice: String(product.salePrice), quantity: String(product.quantity), minimum: String(product.minimum), description: product.description, active: product.active })
    setError(''); setModalOpen(true)
  }
  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim()) { setError('Informe o nome do produto.'); return }
    if (form.sku.trim() && products.some(p => p.sku.toLowerCase() === form.sku.trim().toLowerCase() && p.id !== editingId)) { setError('Este código interno já está cadastrado.'); return }
    const product: Product = {
      id: editingId || (globalThis.crypto?.randomUUID?.() ?? String(Date.now())),
      name: form.name.trim(), sku: form.sku.trim(), barcode: form.barcode.trim(), category: form.category.trim(), unit: form.unit,
      costPrice: numberValue(form.costPrice), salePrice: numberValue(form.salePrice), quantity: numberValue(form.quantity), minimum: numberValue(form.minimum),
      description: form.description.trim(), active: form.active, createdAt: products.find(p => p.id === editingId)?.createdAt || new Date().toISOString(),
    }
    setProducts(current => editingId ? current.map(p => p.id === editingId ? product : p) : [product, ...current])
    setModalOpen(false)
  }
  function deleteProduct(product: Product) {
    if (window.confirm(`Excluir o produto “${product.name}”? Esta ação não poderá ser desfeita.`)) setProducts(current => current.filter(p => p.id !== product.id))
  }
  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) { setForm(current => ({ ...current, [key]: value })) }

  return <>
    <div className="page-heading products-heading">
      <div><span className="eyebrow">CATÁLOGO E CONTROLE DE ESTOQUE</span><h1>Produtos</h1><p>Cadastre e acompanhe os produtos da sua empresa.</p></div>
      <button className="primary-button" onClick={openNew}><Plus size={16}/> Novo produto</button>
    </div>

    <div className="local-data-notice"><CircleAlert size={16}/><span><strong>Modo de demonstração:</strong> os cadastros ficam salvos somente neste navegador. A sincronização em nuvem será ativada na integração com o Firebase.</span></div>

    <div className="product-stats">
      <div className="product-stat"><span>Produtos cadastrados</span><strong>{products.length}</strong><small>Todos os registros</small></div>
      <div className="product-stat"><span>Produtos ativos</span><strong>{products.filter(p => p.active).length}</strong><small>Disponíveis no catálogo</small></div>
      <div className="product-stat warning"><span>Estoque baixo</span><strong>{lowStock}</strong><small>No mínimo ou abaixo dele</small></div>
      <div className="product-stat"><span>Valor em estoque</span><strong>{money(inventoryCost)}</strong><small>Estimativa pelo custo</small></div>
    </div>

    <section className="panel products-panel">
      <div className="products-toolbar">
        <div className="search-field"><Search size={17}/><input aria-label="Pesquisar produtos" placeholder="Buscar por nome, código ou categoria..." value={search} onChange={e => setSearch(e.target.value)}/></div>
        <select aria-label="Filtrar categoria" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</select>
        <select aria-label="Filtrar estoque" value={stockFilter} onChange={e => setStockFilter(e.target.value)}><option>Todos</option><option>Baixo</option><option>Normal</option></select>
      </div>
      {filtered.length === 0 ? <div className="products-empty"><div className="empty-icon"><Box size={24}/></div><strong>{products.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}</strong><span>{products.length === 0 ? 'Comece cadastrando seu primeiro item.' : 'Tente alterar os termos ou filtros da pesquisa.'}</span>{products.length === 0 && <button className="primary-button" onClick={openNew}><PackagePlus size={15}/> Cadastrar primeiro produto</button>}</div> : <>
        <div className="products-table-wrap"><table className="products-table"><thead><tr><th>Produto</th><th>Código</th><th>Categoria</th><th>Preço de venda</th><th>Estoque</th><th>Status</th><th aria-label="Ações"></th></tr></thead><tbody>
          {filtered.map(product => <tr key={product.id}>
            <td><div className="product-name-cell"><div className="product-avatar"><Box size={17}/></div><div><strong>{product.name}</strong><small>{product.unit} · Custo {money(product.costPrice)}</small></div></div></td>
            <td><span className="code-text">{product.sku || '—'}</span>{product.barcode && <small className="barcode-text"><Barcode size={12}/>{product.barcode}</small>}</td>
            <td>{product.category || '—'}</td><td className="price-cell">{money(product.salePrice)}</td>
            <td><strong className={product.quantity <= product.minimum ? 'stock-low' : 'stock-ok'}>{product.quantity.toLocaleString('pt-BR')} {product.unit}</strong><small className="minimum-text">Mínimo: {product.minimum.toLocaleString('pt-BR')}</small></td>
            <td><span className={`status-pill ${product.active ? 'active' : 'inactive'}`}>{product.active ? 'Ativo' : 'Inativo'}</span></td>
            <td><div className="row-actions"><button title="Editar produto" aria-label={`Editar ${product.name}`} onClick={() => openEdit(product)}><Edit3 size={16}/></button><button title="Excluir produto" aria-label={`Excluir ${product.name}`} onClick={() => deleteProduct(product)}><Trash2 size={16}/></button></div></td>
          </tr>)}
        </tbody></table></div>
        <div className="table-footer">Exibindo {filtered.length} de {products.length} produto(s)</div>
      </>}
    </section>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false) }}><section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="modal-header"><div><span className="eyebrow">CATÁLOGO DE PRODUTOS</span><h2 id="product-modal-title">{editingId ? 'Editar produto' : 'Novo produto'}</h2><p>Preencha os dados para manter seu estoque organizado.</p></div><button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Fechar"><X size={20}/></button></div>
      <form onSubmit={saveProduct}>
        <div className="form-section-title">Informações básicas</div>
        <div className="form-grid"><label className="field full">Nome do produto *<input autoFocus value={form.name} onChange={e => update('name', e.target.value)} placeholder="Ex.: Café tradicional 500g"/></label>
          <label className="field">Código interno / SKU<input value={form.sku} onChange={e => update('sku', e.target.value)} placeholder="Ex.: CAF-001"/></label>
          <label className="field">Código de barras<input value={form.barcode} onChange={e => update('barcode', e.target.value)} placeholder="EAN / GTIN"/></label>
          <label className="field">Categoria<input value={form.category} onChange={e => update('category', e.target.value)} placeholder="Ex.: Mercearia" list="product-categories"/><datalist id="product-categories">{categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}/>)}</datalist></label>
          <label className="field">Unidade de medida<select value={form.unit} onChange={e => update('unit', e.target.value)}>{['UN','KG','G','L','ML','CX','PCT','PAR','M'].map(unit => <option key={unit}>{unit}</option>)}</select></label>
        </div>
        <div className="form-section-title">Preços e estoque</div>
        <div className="form-grid four-fields"><label className="field">Preço de custo (R$)<input inputMode="decimal" value={form.costPrice} onChange={e => update('costPrice', e.target.value)} placeholder="0,00"/></label>
          <label className="field">Preço de venda (R$)<input inputMode="decimal" value={form.salePrice} onChange={e => update('salePrice', e.target.value)} placeholder="0,00"/></label>
          <label className="field">Quantidade atual<input type="number" min="0" step="0.001" value={form.quantity} onChange={e => update('quantity', e.target.value)}/></label>
          <label className="field">Estoque mínimo<input type="number" min="0" step="0.001" value={form.minimum} onChange={e => update('minimum', e.target.value)}/></label>
        </div>
        <label className="field description-field">Descrição / observações<textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Informações adicionais sobre o produto..."/></label>
        <label className="active-toggle"><input type="checkbox" checked={form.active} onChange={e => update('active', e.target.checked)}/> Produto ativo e disponível para uso</label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button">{editingId ? 'Salvar alterações' : 'Cadastrar produto'}</button></div>
      </form>
    </section></div>}
  </>
}
