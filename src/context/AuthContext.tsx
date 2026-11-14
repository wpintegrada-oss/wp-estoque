import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { auth, db, firebaseConfigured } from '../services/firebase'

const DEMO_COMPANY_ID = 'restaurante-frango-churrasco'
const DEMO_COMPANY_NAME = 'Restaurante Frango e Churrasco'

type AuthContextValue = {
  user: User | null
  companyId: string | null
  companyName: string
  loading: boolean
  error: string
  signIn: (email: string, password: string) => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function ensureDemoMembership(user: User) {
  if (!db) throw new Error('Firebase não está configurado. Confira as variáveis VITE_FIREBASE_* na Vercel.')
  const companyRef = doc(db, 'companies', DEMO_COMPANY_ID)
  const membershipRef = doc(db, 'company_members', `${user.uid}_${DEMO_COMPANY_ID}`)
  const membership = await getDoc(membershipRef)

  if (membership.exists() && membership.data().status === 'active') return
  if (membership.exists()) throw new Error('O acesso desta conta à empresa está inativo.')

  const company = await getDoc(companyRef)
  if (company.exists()) {
    throw new Error('A empresa de demonstração já foi provisionada por outra conta. Solicite ao administrador a liberação do seu usuário.')
  }

  const batch = writeBatch(db)
  batch.set(companyRef, {
    name: DEMO_COMPANY_NAME,
    ownerUid: user.uid,
    status: 'active',
    plan: 'demo',
    createdAt: serverTimestamp(),
  })
  batch.set(membershipRef, {
    uid: user.uid,
    companyId: DEMO_COMPANY_ID,
    role: 'company_admin',
    status: 'active',
    createdAt: serverTimestamp(),
  })
  await batch.commit()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!firebaseConfigured || !auth || !db) {
      setError('Firebase não está configurado. Confira as variáveis de ambiente da Vercel.')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setCompanyId(null)
      setError('')
      if (!currentUser) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        await ensureDemoMembership(currentUser)
        setCompanyId(DEMO_COMPANY_ID)
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a empresa.')
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    companyId,
    companyName: DEMO_COMPANY_NAME,
    loading,
    error,
    signIn: async (email, password) => {
      if (!auth) throw new Error('Firebase Authentication não está disponível.')
      await signInWithEmailAndPassword(auth, email.trim(), password)
    },
    signOutUser: async () => {
      if (auth) await signOut(auth)
    },
  }), [user, companyId, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa ser usado dentro de AuthProvider.')
  return context
}
