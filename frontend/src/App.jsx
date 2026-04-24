import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import AcademicPlanner from './pages/AcademicPlanner'
import CalendarPage from './pages/CalendarPage'
import CategoriesPage from './pages/CategoriesPage'
import DashboardPage from './pages/DashboardPage'
import FinancialGoalsPage from './pages/FinancialGoalsPage'
import LoginPage from './pages/LoginPage'
import InvestmentsPage from './pages/InvestmentsPage'
import NotesPage from './pages/NotesPage'
import RegisterPage from './pages/RegisterPage'
import ReportsPage from './pages/ReportsPage'
import TransactionsPage from './pages/TransactionsPage'

function AuthOnlyRoute({ children }) {
  const token = localStorage.getItem('agender_token')

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthOnlyRoute>
            <LoginPage />
          </AuthOnlyRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <AuthOnlyRoute>
            <RegisterPage />
          </AuthOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/transacoes" element={<TransactionsPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/anotacoes" element={<NotesPage />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="/metas-financeiras" element={<FinancialGoalsPage />} />
        <Route path="/investimentos" element={<InvestmentsPage />} />
        <Route path="/planejamento-academico" element={<AcademicPlanner />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
