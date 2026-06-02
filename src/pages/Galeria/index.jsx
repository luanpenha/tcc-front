import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Card from "../../components/card/Card";
import ThreeViewer from "../../components/ThreeViewer/ThreeViewer";

const galleryItems = [
  {
    id: 1,
    title: "Protótipo Educacional",
    subtitle: "Peça impressa em PLA",
    description: "Modelo de demonstração com detalhes finos e acabamento suave.",
    image: "https://images.unsplash.com/photo-1545235617-9465b42a0a51?auto=format&fit=crop&w=900&q=80",
    tags: ["PLA", "Detalhado", "Pronto"],
    model: { type: 'box', color: '#2563eb', dimensions: { x: 1.3, y: 0.7, z: 0.8 } },
  },
  {
    id: 2,
    title: "Peça de Montagem",
    subtitle: "Conjunto mecânico modular",
    description: "Conjunto produzido para teste de encaixe e resistência.",
    image: "https://images.unsplash.com/photo-1573164574392-5d7dca2093f6?auto=format&fit=crop&w=900&q=80",
    tags: ["ABS", "Mecânica"],
    model: { type: 'cylinder', color: '#0ea5e9', radiusTop: 0.55, radiusBottom: 0.55, height: 1.2 },
  },
  {
    id: 3,
    title: "Enfeite Personalizado",
    subtitle: "Design gráfico em 3D",
    description: "Peça decorativa feita para mostrar textura e contraste.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    tags: ["Estético", "Decoração"],
    model: { type: 'sphere', color: '#ec4899', radius: 0.9 },
  },

];

export default function Galeria() {
  const [selectedItem, setSelectedItem] = useState(galleryItems[0]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Galeria de Impressões</p>
              <h1 className="mt-2 text-3xl font-bold">Demonstração de Projetos</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Veja alguns exemplos de peças produzidas no laboratório. Clique nos cards para entender o estilo e os principais detalhes técnicos.
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Visualização do modelo</p>
                <h2 className="mt-2 text-2xl font-bold">{selectedItem.title}</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{selectedItem.description}</p>
              </div>
            </div>
            <div className="mt-6 h-80 min-h-[20rem] rounded-3xl border border-gray-200 bg-black/90 dark:border-gray-700">
              <ThreeViewer model={selectedItem.model} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`text-left ${selectedItem.id === item.id ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
              >
                <Card
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.description}
                  image={item.image}
                  tags={item.tags}
                />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 bg-blue-50 p-6 text-sm text-blue-800 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
            <p className="font-medium">Sugestão:</p>
            <p className="mt-2">Adicione mais peças à galeria quando houver amostras novas do laboratório. Este painel serve como demonstração de layout e estilo.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
