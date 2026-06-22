import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { useAuth } from '../../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: 'Total de Usuários', value: '-', icon: '👥', color: 'blue' },
    { label: 'Total de Agendamentos', value: '-', icon: '⏳', color: 'yellow' },
    { label: 'Impressões Pendentes', value: '-', icon: '✓', color: 'green' },
    { label: 'Laboratórios Ativos', value: '-', icon: '🔧', color: 'purple' },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home');
      return;
    }

    const loadDashboard = async () => {
      try {
        const dashboardResponse = await apiFetch('/api/dashboard');
        const printResponse = await apiFetch('/api/prints');

        const { totalUsers, totalBookings, pendingPrints, printingPrints, finishedPrints, totalLaboratories } = dashboardResponse.data;

        setStats([
          { label: 'Total de Usuários', value: totalUsers, icon: '👥', color: 'blue' },
          { label: 'Total de Agendamentos', value: totalBookings, icon: '⏳', color: 'yellow' },
          { label: 'Impressões Pendentes', value: pendingPrints, icon: '✓', color: 'green' },
          { label: 'Laboratórios Ativos', value: totalLaboratories, icon: '🔧', color: 'purple' },
        ]);

        setRecentOrders(
          printResponse.data.printRequests
            .slice(0, 3)
            .map((request) => ({
              id: request._id,
              user: request.user?.name || 'Usuário',
              type: request.title,
              status: request.status,
              date: new Date(request.createdAt).toLocaleDateString('pt-BR'),
            }))
        );
      } catch (error) {
        console.error('Falha ao carregar o dashboard:', error);
      }
    };

    loadDashboard();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Painel de controle</p>
              <h1 className="mt-2 text-3xl font-bold">Dashboard administrativo</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Visualize métricas gerais do sistema e gerencie usuários, pedidos e laboratórios.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => {
              const colorClass = {
                blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300',
                yellow: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300',
                green: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300',
                purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300',
              }[stat.color];
              return (
                <div key={idx} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    </div>
                    <div className={`rounded-3xl ${colorClass} p-4 text-2xl`}>{stat.icon}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Atividade recente</p>
                <h2 className="mt-2 text-2xl font-bold">Últimos pedidos</h2>
              </div>
              <a href="/admin/pedidos" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Ver tudo
              </a>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Usuário</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Pedido</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{order.user}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{order.type}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === 'finished'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : order.status === 'printing'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
