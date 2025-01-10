import { ThemeProvider } from './components/ThemeProvider';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { EmailTemplateProvider } from './contexts/EmailTemplateContext';
import { EmailProvider } from './contexts/EmailContext';
import { TaskProvider } from './contexts/TaskContext';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopBanner from './components/TopBanner';
import DashboardNav from './components/DashboardNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import NumeroExtenso from './pages/NumeroExtenso';

// Import pages
import ContasSemanais from './pages/relatorios/ContasSemanais';
import ContasMensais from './pages/relatorios/ContasMensais';
import Fechamento from './pages/relatorios/Fechamento';
import FactoryDashboard from './pages/emails/FactoryDashboard';
import Sacados from './pages/emails/Sacados';
import EnviarEmail from './pages/emails/EnviarEmail';
import TemplateEmail from './pages/emails/TemplateEmail';
import HistoricoEmails from './pages/emails/HistoricoEmails';
import Tasks from './pages/tasks/Tasks';
import TaskHistory from './pages/tasks/TaskHistory';
import TasksDashboard from './pages/tasks/Dashboard';
import NotesDashboard from './pages/tasks/NotesDashboard';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const showDashboardNav = !['/profile', '/', '/settings', '/numero-extenso'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#111111]">
      <div className="flex h-screen max-w-[1600px] mx-auto">
        <div className="flex-none">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-50 bg-gray-100 dark:bg-[#111111]">
            <div className="p-8 pb-2">
              <TopBanner />
            </div>
          </div>
          <div className="px-8 pb-8">
            {showDashboardNav && <DashboardNav />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/numero-extenso" element={<NumeroExtenso />} />
              
              {/* Report Routes */}
              <Route path="/relatorios/contas-semanais" element={<ContasSemanais />} />
              <Route path="/relatorios/contas-mensais" element={<ContasMensais />} />
              <Route path="/relatorios/fechamento" element={<Fechamento />} />
              
              {/* Factory Routes */}
              <Route path="/emails/dashboard" element={<FactoryDashboard />} />
              <Route path="/emails/sacados" element={<Sacados />} />
              <Route path="/emails/enviar" element={<EnviarEmail />} />
              <Route path="/emails/template" element={<TemplateEmail />} />
              <Route path="/emails/historico" element={<HistoricoEmails />} />

              {/* Task Routes */}
              <Route path="/tasks/dashboard" element={<TasksDashboard />} />
              <Route path="/tasks/notes-dashboard" element={<NotesDashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/history" element={<TaskHistory />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <CustomerProvider>
              <EmailProvider>
                <EmailTemplateProvider>
                  <TaskProvider>
                    <Routes>
                      <Route path="/auth" element={<Auth />} />
                      <Route
                        path="/*"
                        element={
                          <RequireAuth>
                            <AppContent />
                          </RequireAuth>
                        }
                      />
                    </Routes>
                  </TaskProvider>
                </EmailTemplateProvider>
              </EmailProvider>
            </CustomerProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}