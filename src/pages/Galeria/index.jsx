import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Card from '../../components/card/Card';
import { apiFetch, API_BASE } from '../../services/api';

function normalizeImageUrl(path) {
  if (!path) {
    return null;
  }
  if (path.startsWith('http')) {
    return path;
  }
  const cleaned = path.replaceAll('\\', '/').replace(/.*uploads\//, 'uploads/');
  return `${API_BASE}/${cleaned}`;
}

export default function Galeria() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await apiFetch('/api/gallery');
        const items = response.data.gallery.map((item) => ({
          id: item._id,
          title: item.title,
          subtitle: item.author?.name || 'Peça 3D',
          description: item.description,
          image: normalizeImageUrl(item.images?.[0]),
          tags: item.tags || [],
          author: item.author?.name || 'Equipe SAI 3D',
          createdAt: item.createdAt,
        }));
        setGalleryItems(items);
        setSelectedItem(items[0] || null);
      } catch (fetchError) {
        setError(fetchError.message || 'Falha ao carregar a galeria');
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

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

          {error && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              Carregando galeria...
            </div>
          ) : (
            <>
              <div className="mb-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Visualização do item</p>
                    <h2 className="mt-2 text-2xl font-bold">{selectedItem?.title || 'Nenhuma peça encontrada'}</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{selectedItem?.description || 'Selecione um item para ver os detalhes da galeria.'}</p>
                  </div>
                </div>
                <div className="mt-6 h-80 min-h-[20rem] overflow-hidden rounded-3xl border border-gray-200 bg-black/90 dark:border-gray-700">
                  {selectedItem?.image ? (
                    <img src={selectedItem.image} alt={selectedItem.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-gray-400 dark:text-gray-500">Imagem não disponível</div>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {galleryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`text-left rounded-3xl border p-0 transition ${selectedItem?.id === item.id ? 'shadow-lg ring-2 ring-blue-500' : 'border-transparent'} `}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
