import AdminDashboard from './AdminDashboard.jsx'
import EntrepriseDashboard from './EntrepriseDashboard.jsx'
import UserDashboard from './UserDashboard.jsx'
import { useAuth } from '../context/useAuth'

export default function Dashboard() {
  const { role } = useAuth()

  // role may be null while loading; fall back to localStorage if needed
  const resolvedRole = role || (typeof localStorage !== 'undefined' ? localStorage.getItem('role') : null)

  if (resolvedRole === 'admin') return <AdminDashboard />
  if (resolvedRole === 'entreprise') return <EntrepriseDashboard />
  // default to user dashboard
  return <UserDashboard />
}
