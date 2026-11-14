export type UserRole = 'platform_admin' | 'company_admin' | 'manager' | 'operator'

export interface Company {
  id: string
  name: string
  document?: string
  status: 'active' | 'suspended'
  createdAt: string
}

export interface Product {
  id: string
  companyId: string
  name: string
  sku: string
  categoryId?: string
  unit: string
  costPriceCents: number
  salePriceCents: number
  stockQuantity: number
  minimumStock: number
  active: boolean
}

export interface StockMovement {
  id: string
  companyId: string
  productId: string
  type: 'entry' | 'sale' | 'adjustment' | 'return' | 'loss'
  quantity: number
  reason: string
  createdAt: string
  createdBy: string
}
