import { useState } from 'react';
import Navbar from "../../../components/Navbar/Navbar";
import ThreeViewer from "../../../components/ThreeViewer/ThreeViewer";
import { useAuth } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminPedidos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);

  const orders = [
    {
      id: 1,
      user: 'João Silva',
      email: 'joao@example.com',
      type: 'Prototipagem',
      description: 'Suporte para impressora',
      material: 'PLA',
      status: 'Em andamento',
      date: '20/05/2026',
      expectedDate: '25/05/2026',
      model: {
        type: 'box',
        color: '#2563eb',
        dimensions: { x: 1.4, y: 0.8, z: 0.9 },
      },
    },
    {
      id: 2,
      user: 'Maria Santos',
      email: 'maria@example.com',
      type: 'Educacional',
      description: 'Modelo didático de célula',
      material: 'ABS',
      status: 'Pendente',
      date: '19/05/2026',
      expectedDate: '26/05/2026',
      model: {
        type: 'sphere',
        color: '#0ea5e9',
        radius: 0.95,
      },
    },
    {
      id: 3,
      user: 'Pedro Costa',
      email: 'pedro@example.com',
      type: 'Mecânica',
      description: 'Engrenagem de teste',
      material: 'PLA',
      status: 'Concluído',
      date: '18/05/2026',
      expectedDate: '22/05/2026',
      model: {
        type: 'cylinder',
        color: '#16a34a',
        radiusTop: 0.6,
        radiusBottom: 0.6,
        height: 1.0,
      },
    },
    {
      id: 4,
      user: 'Ana Oliveira',
      email: 'ana@example.com',
      type: 'Prototipagem',
      description: 'Carcaça eletrônica',
      material: 'PETG',
      status: 'Pendente',
      date: '17/05/2026',
      expectedDate: '24/05/2026',
      model: {
        type: 'box',
        color: '#c2410c',
        dimensions: { x: 1.2, y: 0.6, z: 1.2 },
      },
    },
  ];

  const statusColors = {
    'Pendente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    'Em andamento': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    'Concluído': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
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
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{order.user}</h3>
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{order.description}</p>
                      <div className="mt-3 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Material: <strong>{order.material}</strong></span>
                        <span>Tipo: <strong>{order.type}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder && (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900 h-fit">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Detalhes do pedido</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Usuário</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.user}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Descrição</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Material</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.material}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data do pedido</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Previsão</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{selectedOrder.expectedDate}</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Visualização 3D</p>
                    <div className="mt-3 h-72 min-h-[18rem] rounded-3xl border border-gray-200 bg-black/90 dark:border-gray-700">
                      <ThreeViewer model={selectedOrder.model} />
                    </div>
                  </div>
                  <div className="space-y-2 pt-3">
                    <button className="w-full rounded-full bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700">
                      Marcar como concluído
                    </button>
                    <button className="w-full rounded-full border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                      Editar pedido
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
