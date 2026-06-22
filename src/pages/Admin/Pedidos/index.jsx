import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { useAuth } from '../../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch, API_BASE } from '../../../services/api';

export default function AdminPedidos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('pending');
  const [observation, setObservation] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home');
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await apiFetch('/api/prints');
        const mappedOrders = response.data.printRequests.map((printRequest) => ({
          id: printRequest._id,
          user: printRequest.user?.name || 'Usuário',
          email: printRequest.user?.email || '',
          type: printRequest.title,
          description: printRequest.description,
          material: printRequest.material,
          quantity: printRequest.quantity,
          status: printRequest.status,
          date: new Date(printRequest.createdAt).toLocaleDateString('pt-BR'),
          expectedDate: printRequest.status === 'finished' ? new Date(printRequest.updatedAt).toLocaleDateString('pt-BR') : '-',
          filePath: printRequest.filePath,
        }));
        setOrders(mappedOrders);
        setSelectedOrder(mappedOrders[0] || null);
      } catch (fetchError) {
        setError(fetchError.message || 'Falha ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedOrder) {
      setStatusUpdate(selectedOrder.status);
      setObservation(selectedOrder.observation || '');
      setSuccessMessage('');
    }
  }, [selectedOrder]);

  const statusLabels = {
    pending: 'Pendente',
    approved: 'Aprovado',
    printing: 'Em impressão',
    ready_for_pickup: 'Disponível para retirada',
    finished: 'Finalizado',
    delivered: 'Entregue',
    rejected: 'Rejeitado',
  };

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'approved', label: 'Aprovado' },
    { value: 'printing', label: 'Em impressão' },
    { value: 'ready_for_pickup', label: 'Disponível para retirada' },
    { value: 'finished', label: 'Finalizado' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'rejected', label: 'Rejeitado' },
  ];

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiFetch(`/api/prints/${selectedOrder.id}`, {
        method: 'PUT',
        body: { status: statusUpdate, observation },
      });

      const updatedOrder = response.data.printRequest;
      const mappedOrder = {
        id: updatedOrder._id,
        user: updatedOrder.user?.name || 'Usuário',
        email: updatedOrder.user?.email || '',
        type: updatedOrder.title,
        description: updatedOrder.description,
        material: updatedOrder.material,
        quantity: updatedOrder.quantity,
        status: updatedOrder.status,
        observation: updatedOrder.observation || '',
        date: new Date(updatedOrder.createdAt).toLocaleDateString('pt-BR'),
        expectedDate: updatedOrder.status === 'finished' ? new Date(updatedOrder.updatedAt).toLocaleDateString('pt-BR') : '-',
        filePath: updatedOrder.filePath,
      };

      setOrders((prevOrders) => prevOrders.map((order) => (order.id === mappedOrder.id ? mappedOrder : order)));
      setSelectedOrder(mappedOrder);
      setSuccessMessage('Pedido atualizado com sucesso.');
    } catch (fetchError) {
      setError(fetchError.message || 'Falha ao atualizar pedido');
    } finally {
      setSaving(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    printing: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    finished: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Gerenciamento</p>
              <h1 className="mt-2 text-3xl font-bold">Pedidos de impressão</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Acompanhe e gerencie todos os pedidos de impressão 3D do sistema.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              Carregando pedidos...
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`rounded-3xl border p-5 cursor-pointer transition ${
                      selectedOrder?.id === order.id
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{order.type}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{order.description}</p>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{order.user}</p>
                      </div>
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder ? (
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900 h-fit">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Detalhes do pedido</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Usuário</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.user}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Título</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Descrição</p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.description || 'Sem descrição'}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Material</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.material}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.quantity}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Arquivo</p>
                      {selectedOrder.filePath ? (
                        <a
                          href={`${API_BASE}/${selectedOrder.filePath.replaceAll('\\', '/').replace(/.*uploads/, 'uploads')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
                        >
                          Abrir arquivo de impressão
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Arquivo não disponível</p>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Status atual</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{statusLabels[selectedOrder.status] || selectedOrder.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Última atualização</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.expectedDate}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alterar status</label>
                        <select
                          value={statusUpdate}
                          onChange={(e) => setStatusUpdate(e.target.value)}
                          className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações do administrador</label>
                        <textarea
                          rows={4}
                          value={observation}
                          onChange={(e) => setObservation(e.target.value)}
                          className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                          placeholder="Digite observações para este pedido"
                        />
                      </div>
                      {successMessage && (
                        <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-700 dark:bg-green-950/30 dark:text-green-200">
                          {successMessage}
                        </div>
                      )}
                      <div className="space-y-3">
                        {error && (
                          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200">
                            {error}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={handleSaveOrder}
                          disabled={saving}
                          className="w-full rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {saving ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  Selecione um pedido para ver detalhes.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
