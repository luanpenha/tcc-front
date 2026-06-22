import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../AuthContext';
import { apiFetch, API_BASE } from '../../services/api';

const statusLabels = {
  pending: 'Pendente',
  approved: 'Aprovado',
  printing: 'Em impressão',
  ready_for_pickup: 'Disponível para retirada',
  finished: 'Finalizado',
  delivered: 'Entregue',
  rejected: 'Rejeitado',
};

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  approved: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  printing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200',
  ready_for_pickup: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-200',
  finished: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200',
};

export default function Pedidos() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    if (user?.role === 'admin') {
      navigate('/admin/pedidos');
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await apiFetch('/api/prints');
        const mappedOrders = response.data.printRequests.map((item) => ({
          id: item._id,
          title: item.title,
          description: item.description || 'Sem descrição',
          material: item.material,
          quantity: item.quantity,
          status: item.status,
          observation: item.observation || '',
          filePath: item.filePath,
          createdAt: new Date(item.createdAt).toLocaleDateString('pt-BR'),
          updatedAt: new Date(item.updatedAt).toLocaleDateString('pt-BR'),
        }));
        setOrders(mappedOrders);
        setSelectedOrder(mappedOrders[0] || null);
      } catch (fetchError) {
        setError(fetchError.message || 'Falha ao carregar seus pedidos');
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Meus pedidos</p>
              <h1 className="mt-2 text-3xl font-bold">Acompanhe seus pedidos</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Veja todos os pedidos feitos por você e acompanhe o status de cada impressão.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold">Pedidos</h2>
              {loadingOrders ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
                  Carregando pedidos...
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
                  Nenhum pedido encontrado.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                        selectedOrder?.id === order.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200'
                          : 'border-transparent bg-white text-gray-800 hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-700 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{order.title}</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{order.description}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[order.status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </aside>
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
              {selectedOrder ? (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Pedido selecionado</p>
                      <h2 className="mt-2 text-2xl font-bold">{selectedOrder.title}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[selectedOrder.status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {statusLabels[selectedOrder.status] || selectedOrder.status}
                    </span>
                  </div>

                  <div className="mt-5 space-y-5 text-gray-600 dark:text-gray-300">
                    <div>
                      <h3 className="text-lg font-semibold">Descrição</h3>
                      <p className="mt-2">{selectedOrder.description}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-semibold">Material</h3>
                        <p className="mt-2">{selectedOrder.material}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Quantidade</h3>
                        <p className="mt-2">{selectedOrder.quantity}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Solicitado em</h3>
                      <p className="mt-2">{selectedOrder.createdAt}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Última atualização</h3>
                      <p className="mt-2">{selectedOrder.updatedAt}</p>
                    </div>
                    {selectedOrder.observation && (
                      <div>
                        <h3 className="text-lg font-semibold">Observações do administrador</h3>
                        <p className="mt-2 whitespace-pre-wrap">{selectedOrder.observation}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">Arquivo</h3>
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
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Arquivo não disponível</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  Selecione um pedido para ver os detalhes.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
