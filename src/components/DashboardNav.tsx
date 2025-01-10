import { FileText, History, Users, Mail, FileEdit, ListTodo, FileBox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  title: string;
  href: string;
  icon: JSX.Element;
}

interface NavConfig {
  [key: string]: NavItem[];
}

const navConfig: NavConfig = {
  '/emails/dashboard': [
    {
      title: 'Dashboard',
      href: '/emails/dashboard',
      icon: <FileText className="w-4 h-4" />
    }
  ],
  '/emails/sacados': [
    {
      title: 'Sacados',
      href: '/emails/sacados',
      icon: <Users className="w-4 h-4" />
    }
  ],
  '/emails/template': [
    {
      title: 'Template de E-mail',
      href: '/emails/template',
      icon: <FileEdit className="w-4 h-4" />
    }
  ],
  '/emails/enviar': [
    {
      title: 'Envio de E-mails',
      href: '/emails/enviar',
      icon: <Mail className="w-4 h-4" />
    },
    {
      title: 'Histórico de E-mails',
      href: '/emails/historico',
      icon: <History className="w-4 h-4" />
    }
  ],
  '/emails/historico': [
    {
      title: 'Envio de E-mails',
      href: '/emails/enviar',
      icon: <Mail className="w-4 h-4" />
    },
    {
      title: 'Histórico de E-mails',
      href: '/emails/historico',
      icon: <History className="w-4 h-4" />
    }
  ],
  '/tasks/dashboard': [
    {
      title: 'Tasks',
      href: '/tasks/dashboard',
      icon: <ListTodo className="w-4 h-4" />
    },
    {
      title: 'Notas',
      href: '/tasks/notes-dashboard',
      icon: <FileBox className="w-4 h-4" />
    }
  ],
  '/tasks/notes-dashboard': [
    {
      title: 'Tasks',
      href: '/tasks/dashboard',
      icon: <ListTodo className="w-4 h-4" />
    },
    {
      title: 'Notas',
      href: '/tasks/notes-dashboard',
      icon: <FileBox className="w-4 h-4" />
    }
  ],
  '/tasks': [
    {
      title: 'Tasks',
      href: '/tasks',
      icon: <ListTodo className="w-4 h-4" />
    }
  ],
  '/tasks/history': [
    {
      title: 'Notas',
      href: '/tasks/history',
      icon: <FileBox className="w-4 h-4" />
    }
  ]
};

export default function DashboardNav() {
  const location = useLocation();
  const items = navConfig[location.pathname];

  if (!items) return null;

  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg dark:shadow-[#000000]/10 p-4 mb-6">
      <div className="flex items-center justify-between">
        <nav className="flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors relative',
                  'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-all',
                  location.pathname === item.href || items.length === 1
                    ? 'text-blue-600 dark:text-blue-400 after:bg-blue-600 dark:after:bg-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 after:bg-transparent hover:after:bg-blue-600/50 dark:hover:after:bg-blue-400/50'
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}