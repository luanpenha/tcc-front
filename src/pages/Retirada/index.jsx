import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
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

export default function Retirada() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrintRequests = async () => {
      try {
        const response = await apiFetch('/api/prints');
        const mappedItems = response.data.printRequests.map((item) => ({
          id: item._id,
          title: item.title,
          summary: item.description || 'Sem descrição',
          status: statusLabels[item.status] || item.status,
          details: `Material: ${item.material}. Quantidade: ${item.quantity}.`,
          linkInfo: item.filePath ? `${API_BASE}/${item.filePath.replaceAll('\\', '/').replace(/.*uploads\//, 'uploads/')}` : 'Arquivo não disponível',
          filePath: item.filePath,
          createdAt: new Date(item.createdAt).toLocaleDateString('pt-BR'),
        }));
        setItems(mappedItems);
        setSelected(mappedItems[0] || null);
      } catch (fetchError) {
        setError(fetchError.message || 'Falha ao carregar solicitações de retirada');
      } finally {
        setLoading(false);
      }
    };

    loadPrintRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Retirada de Peças</p>
              <h1 className="mt-2 text-3xl font-bold">Acompanhe os itens disponíveis</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Clique em um item à esquerda para ver informações detalhadas sobre a retirada e o status de cada peça.
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
              <h2 className="text-lg font-semibold">Itens para retirada</h2>
              <div className="space-y-2">
                {loading ? (
                  <div className="rounded-3xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">Carregando itens...</div>
                ) : items.length === 0 ? (
                  <div className="rounded-3xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">Nenhum item encontrado.</div>
                ) : (
                  items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelected(item)}
                      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                        selected?.id === item.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm dark:border-blue-400 dark:bg-blue-950 dark:text-blue-200'
                          : 'border-transparent bg-white text-gray-800 hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-700 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.summary}</p>
                        </div>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {item.status}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
              {selected ? (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Detalhes do item</p>
                      <h2 className="mt-2 text-2xl font-bold">{selected.title}</h2>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                      {selected.status}
                    </span>
                  </div>
                  <div className="mt-5 space-y-5 text-gray-600 dark:text-gray-300">
                    <div>
                      <h3 className="text-lg font-semibold">Resumo</h3>
                      <p className="mt-2">{selected.summary}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Detalhes</h3>
                      <p className="mt-2">{selected.details}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Arquivo</h3>
                      {selected.filePath ? (
                        <a
                          href={selected.linkInfo}
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
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Solicitado em</p>
                      <p className="mt-1 text-gray-900 dark:text-gray-100">{selected.createdAt}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="rounded-3xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                      <p className="font-semibold">Dica</p>
                      <p className="mt-1">Confira o status do item antes de agendar a retirada para evitar horários conflitantes.</p>
                    </div>
                    <Link
                      to="/retirada/marcar"
                      state={{ selectedId: selected.id }}
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-center text-white transition hover:bg-blue-700"
                    >
                      Marcar Retirada
                    </Link>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  Selecione um item para ver detalhes.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
