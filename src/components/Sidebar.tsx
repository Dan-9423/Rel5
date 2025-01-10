import { useState, useEffect } from 'react';
import { Plus, Minus, LayoutDashboard, Settings, BarChart2, FileText, LogOut, Home, ChevronLeft, ChevronRight, Factory, TextQuote, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MenuItem {
  title: string;
  icon: JSX.Element;
  path?: string;
  submenu?: { title: string; path: string }[];
}

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentDate = currentTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const currentTimeStr = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
  });

  const menuItems: MenuItem[] = [
    {
      title: 'Início',
      icon: <Home className="w-5 h-5" />,
      path: '/'
    },
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      submenu: [
        { title: 'Overview', path: '/overview' },
        { title: 'Analytics', path: '/analytics' },
        { title: 'Reports', path: '/reports' },
      ],
    },
    {
      title: 'Relatórios',
      icon: <FileText className="w-5 h-5" />,
      submenu: [
        { title: 'Contas Semanais', path: '/relatorios/contas-semanais' },
        { title: 'Contas Mensais', path: '/relatorios/contas-mensais' },
        { title: 'Fechamento', path: '/relatorios/fechamento' },
      ],
    },
    {
      title: 'Factory',
      icon: <Factory className="w-5 h-5" />,
      submenu: [
        { title: 'Dashboard', path: '/emails/dashboard' },
        { title: 'Sacados', path: '/emails/sacados' },
        { title: 'Envio de E-mails', path: '/emails/enviar' },
        { title: 'Template de E-mail', path: '/emails/template' },
      ],
    },
    {
      title: 'Tasks',
      icon: <ListTodo className="w-5 h-5" />,
      submenu: [
        { title: 'Dashboard', path: '/tasks/dashboard' },
        { title: 'Task', path: '/tasks' },
        { title: 'Bloco de Notas', path: '/tasks/history' },
      ],
    },
    {
      title: 'Número por Extenso',
      icon: <TextQuote className="w-5 h-5" />,
      path: '/numero-extenso'
    }
  ];

  return (
    <TooltipProvider>
      <div className={cn(
        "bg-white dark:bg-[#1C1C1C] shadow-lg h-screen rounded-2xl flex flex-col transition-all duration-300",
        isExpanded ? "w-64" : "w-20"
      )}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center">
            <Logo iconOnly={!isExpanded} />
          </div>
        </div>

        {/* Date, Time and Collapse Button */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          {isExpanded ? (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</span>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{currentTimeStr}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.path ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          'w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-100 text-[13px]',
                          location.pathname === item.path
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-[#242424] hover:text-blue-600 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {item.icon}
                        {isExpanded && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {!isExpanded && <TooltipContent side="right">{item.title}</TooltipContent>}
                  </Tooltip>
                ) : isExpanded ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(expandedMenu === item.title ? null : item.title)}
                      className={cn(
                        'w-full flex items-center justify-between p-2.5 rounded-lg transition-colors duration-100 text-[13px]',
                        expandedMenu === item.title
                          ? 'bg-blue-50 dark:bg-[#242424] text-blue-600 dark:text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-[#242424] hover:text-blue-600 text-gray-700 dark:text-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {expandedMenu === item.title ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                    {item.submenu && expandedMenu === item.title && (
                      <div className="ml-4 mt-1 mb-1 overflow-hidden animate-slideDown">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={cn(
                              'block w-full text-left p-2 pl-8 rounded-lg mb-0.5 transition-colors duration-100 text-[13px]',
                              location.pathname === sub.path
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-[#242424] hover:text-blue-600 text-gray-600 dark:text-gray-400'
                            )}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          'w-full flex items-center justify-center p-2.5 rounded-lg transition-colors duration-100',
                          expandedMenu === item.title
                            ? 'bg-blue-50 dark:bg-[#242424] text-blue-600 dark:text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-[#242424] hover:text-blue-600 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {item.icon}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="right" className="p-2 w-48">
                      <div className="flex items-center gap-2 px-2 py-1.5 mb-1 text-sm font-medium border-b border-gray-100 dark:border-gray-800">
                        {item.icon}
                        {item.title}
                      </div>
                      <div className="space-y-1">
                        {item.submenu?.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={cn(
                              'block w-full text-left px-2 py-1.5 rounded text-[13px] transition-colors duration-100',
                              location.pathname === sub.path
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-[#242424] hover:text-blue-600 text-gray-600 dark:text-gray-400'
                            )}
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Section with Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10 text-[13px]",
                  !isExpanded && "px-0"
                )}
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                {isExpanded && "Logout"}
              </Button>
            </TooltipTrigger>
            {!isExpanded && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}