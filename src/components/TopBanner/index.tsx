import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import CalculatorComponent from '../Calculator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const pageNames: Record<string, string> = {
  '/tasks/dashboard': 'Dashboard - Tasks',
  '/tasks/notes-dashboard': 'Dashboard - Notas',
  '/emails/dashboard': 'Dashboard - Factory',
  '/emails/template': 'Templates de E-mail',
  '/emails/sacados': 'Sacados',
  '/emails/enviar': 'Envio de E-mails',
  '/relatorios/contas-semanais': 'Contas Semanais',
  '/relatorios/contas-mensais': 'Contas Mensais',
  '/relatorios/fechamento': 'Fechamento',
};

export default function TopBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const location = useLocation();
  const { user } = useUser();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = '';
    
    if (hour >= 5 && hour < 12) {
      greetingText = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      greetingText = 'Boa tarde';
    } else {
      greetingText = 'Boa noite';
    }

    const genderSuffix = user.gender === 'female' ? 'vinda' : 'vindo';
    setGreeting(`${greetingText}, ${user.firstName}! Seja bem ${genderSuffix} novamente.`);
  }, [user.firstName, user.gender]);

  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg dark:shadow-[#000000]/10 p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          {isHomePage ? (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {greeting}
            </h2>
          ) : (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {pageNames[location.pathname] || 'Página'}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Calculator className="h-5 w-5" />
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Calculator</DialogTitle>
              </DialogHeader>
              <CalculatorComponent />
            </DialogContent>
          </Dialog>
          <NotificationBell />
          <ThemeToggle />
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
          <UserProfile />
        </div>
      </div>
    </div>
  );
}