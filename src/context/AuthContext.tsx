import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, firebaseConfigured } from '../services/firebase'

const DEMO_COMPANY_ID = 'restaurante-frango-churrasco'

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState('')
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
      setCompanyName('')
      setError('')
      if (!currentUser) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const membershipRef = doc(db, 'company_members', `${currentUser.uid}_${DEMO_COMPANY_ID}`)
        const membershipSnap = await getDoc(membershipRef)
        if (!membershipSnap.exists() || membershipSnap.data().status !== 'active' || membershipSnap.data().uid !== currentUser.uid) {
          throw new Error('Sua conta ainda não está vinculada à empresa. O administrador precisa concluir a configuração inicial no Firestore.')
        }

        const companyRef = doc(db, 'companies', DEMO_COMPANY_ID)
        const companySnap = await getDoc(companyRef)
        if (!companySnap.exists() || companySnap.data().status !== 'active') {
          throw new Error('A empresa não foi configurada ou está inativa. Verifique o cadastro no Firestore.')
        }

        setCompanyId(DEMO_COMPANY_ID)
        setCompanyName(String(companySnap.data().name || 'Minha empresa'))
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os dados da empresa.')
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user, companyId, companyName, loading, error,
    signIn: async (email, password) => {
      if (!auth) throw new Error('Firebase Authentication não está disponível.')
      await signInWithEmailAndPassword(auth, email.trim(), password)
    },
    signOutUser: async () => { if (auth) await signOut(auth) },
  }), [user, companyId, companyName, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa ser usado dentro de AuthProvider.')
  return context
}
