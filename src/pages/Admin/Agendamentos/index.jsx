import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { useAuth } from '../../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../../services/api';

export default function AdminAgendamentos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home');
      return;
    }

    const loadBookings = async () => {
      try {
        const response = await apiFetch('/api/bookings');
        setAgendamentos(response.data.bookings.map((booking) => ({
          id: booking._id,
          usuario: booking.user?.name || 'Usuário',
          email: booking.user?.email || '',
          laboratorio: booking.laboratory?.name || 'Sem laboratório',
          tipo: booking.laboratory?.description || 'Agendamento',
          material: booking.laboratory?.resources?.join(', ') || 'N/A',
          dataAgendamento: new Date(booking.date).toLocaleDateString('pt-BR'),
          horaInicio: booking.startTime,
          horaFim: booking.endTime,
          status: booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pendente',
          observacoes: booking.notes || '',
          retirada: booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '-',
        })));
      } catch (fetchError) {
        setError(fetchError.message || 'Falha ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'Concluído':
      case 'finished':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'Pendente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'Cancelado':
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const filteredAgendamentos = filterStatus === 'Todos'
    ? agendamentos
    : agendamentos.filter((a) => a.status === filterStatus);

  const stats = [
    {
      label: 'Total de Agendamentos',
      value: agendamentos.length,
      icon: '📅',
      color: 'blue',
    },
    {
      label: 'Confirmados',
      value: agendamentos.filter((a) => a.status === 'Confirmado').length,
      icon: '✓',
      color: 'green',
    },
    {
      label: 'Pendentes',
      value: agendamentos.filter((a) => a.status === 'Pendente').length,
      icon: '⏳',
      color: 'yellow',
    },
    {
      label: 'Cancelados',
      value: agendamentos.filter((a) => a.status === 'Cancelado').length,
      icon: '✕',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Gerenciamento</p>
              <h1 className="mt-2 text-3xl font-bold">Agendamentos do sistema</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Visualize e gerencie todos os agendamentos do sistema.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
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

          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              Carregando agendamentos...
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="Todos">Todos</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Usuário</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Laboratório</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Tipo / Material</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Data & Hora</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgendamentos.map((agendamento) => (
                    <tr key={agendamento.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        <div>{agendamento.usuario}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{agendamento.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{agendamento.laboratorio}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>{agendamento.tipo}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{agendamento.material}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>{agendamento.dataAgendamento}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{agendamento.horaInicio} - {agendamento.horaFim}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(agendamento.status)}`}>
                          {agendamento.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
