import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="bg-white dark:bg-[#1C1C1C] rounded-lg p-8 shadow-lg dark:shadow-[#000000]/10">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bem-vindo ao Sistema
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Gerencie seus dados e acompanhe suas atividades de forma simples e eficiente.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Usuários Ativos</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
        </div>
        <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Projetos</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">56</p>
        </div>
        <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Tarefas</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">789</p>
        </div>
      </div>
    </div>
  );
}