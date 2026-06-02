import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Painel principal</p>
              <h1 className="mt-2 text-3xl font-bold">Olá, {user?.name ?? 'Convidado'}</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Aqui você encontra as principais ações do sistema: agendamento, retirada e visualização de impressões.
              </p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              <p className="font-semibold">Status do acesso</p>
              <p className="mt-2">{user ? 'Você está autenticado e pode navegar nas áreas internas.' : 'Faça login para acessar o conteúdo completo.'}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Atalhos</p>
              <h2 className="mt-4 text-xl font-semibold">Navegação rápida</h2>
              <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                <li>• Ver galerias recentes</li>
                <li>• Consultar retirada de peças</li>
                <li>• Agendar laboratório</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Informações</p>
              <h2 className="mt-4 text-xl font-semibold">Acesso rápido</h2>
              <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                <p><span className="font-semibold">Usuário:</span> {user?.name ?? 'Convidado'}</p>
                <p><span className="font-semibold">E-mail:</span> {user?.email ?? 'não conectado'}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Próximos passos</p>
              <h2 className="mt-4 text-xl font-semibold">O que fazer agora</h2>
              <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                <p>• Acesse a galeria para visualizar novas peças impressas.</p>
                <p>• Verifique a disponibilidade de retirada.</p>
                <p>• Agende seu próximo laboratório.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

