import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ThreeViewer from "../../components/ThreeViewer/ThreeViewer";

const retiradaItems = [
  {
    id: 1,
    title: "Peça 1 - Suporte de Celular",
    summary: "Suporte em PLA pronto para retirada.",
    status: "Disponível",
    details: "Peça finalizada e disponível no laboratório para retirada. Entre em contato com o responsável para agendar a coleta.",
    linkInfo: "Suporte leve e resistente, ideal para demonstração de montagem rápida.",
    model: { type: 'box', color: '#2563eb', dimensions: { x: 1.2, y: 0.5, z: 0.9 } },
  },
  {
    id: 2,
    title: "Peça 2 - Engrenagem Modular",
    summary: "Engrenagem produzida para projeto mecânico.",
    status: "Em preparo",
    details: "Ainda em acabamento. Deve ser finalizada em até 2 dias úteis.",
    linkInfo: "Peça que exige ajuste de tolerância no encaixe. Consulte o fluxo de produção para mais detalhes.",
    model: { type: 'cylinder', color: '#0ea5e9', radiusTop: 0.55, radiusBottom: 0.55, height: 1.2 },
  },
  {
    id: 3,
    title: "Peça 3 - Prototipo Educacional",
    summary: "Modelo para protótipos didáticos.",
    status: "Retirada pendente",
    details: "Peça pronta, aguardando confirmação de coleta pelo usuário responsável.",
    linkInfo: "Recomendado realizar retirada na próxima semana para evitar ocupação de espaço.",
    model: { type: 'sphere', color: '#ec4899', radius: 0.85 },
  },

];

export default function Retirada() {
  const [selected, setSelected] = useState(retiradaItems[0]);

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

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold">Itens para retirada</h2>
              <div className="space-y-2">
                {retiradaItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                      selected.id === item.id
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
                ))}
              </div>
            </aside>
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
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
                  <h3 className="text-lg font-semibold">Descrição detalhada</h3>
                  <p className="mt-2">{selected.details}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Informações de link</h3>
                  <p className="mt-2">{selected.linkInfo}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Visualização 3D</p>
                <div className="mt-3 h-72 min-h-[18rem] rounded-3xl border border-gray-200 bg-black/90 dark:border-gray-700">
                  <ThreeViewer model={selected.model} />
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
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
