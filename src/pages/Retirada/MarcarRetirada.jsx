import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import ThreeViewer from "../../components/ThreeViewer/ThreeViewer";

const retiradaItems = [
  {
    id: 1,
    title: "Peça 1 - Suporte de Celular",
    summary: "Suporte em PLA pronto para retirada.",
    status: "Disponível",
    model: { type: "box", color: "#2563eb", dimensions: { x: 1.2, y: 0.5, z: 0.9 } },
  },
  {
    id: 2,
    title: "Peça 2 - Engrenagem Modular",
    summary: "Engrenagem produzida para projeto mecânico.",
    status: "Em preparo",
    model: { type: "cylinder", color: "#0ea5e9", radiusTop: 0.55, radiusBottom: 0.55, height: 1.2 },
  },
  {
    id: 3,
    title: "Peça 3 - Prototipo Educacional",
    summary: "Modelo para protótipos didáticos.",
    status: "Retirada pendente",
    model: { type: "sphere", color: "#ec4899", radius: 0.85 },
  },
];

export default function MarcarRetirada() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedId = location.state?.selectedId || retiradaItems[0].id;
  const selectedItem = useMemo(
    () => retiradaItems.find((item) => item.id === selectedId) || retiradaItems[0],
    [selectedId]
  );

  const { user } = useAuth();
  const isAvailable = ["Disponível", "Retirada pendente"].includes(selectedItem.status);
  const LAB_OPEN_TIME = "09:00";
  const LAB_CLOSE_TIME = "17:00";

  const [form, setForm] = useState({
    itemId: selectedItem.id,
    pickupDate: "",
    pickupTime: "",
    contactName: user?.name ?? "",
    notes: "",
  });
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      itemId: selectedItem.id,
      contactName: user?.name ?? current.contactName,
    }));
  }, [selectedItem.id, user]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "pickupTime") {
      setTimeError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isAvailable) return;
    if (form.pickupTime < LAB_OPEN_TIME || form.pickupTime > LAB_CLOSE_TIME) {
      setTimeError(`O laboratório funciona entre ${LAB_OPEN_TIME} e ${LAB_CLOSE_TIME}. Escolha um horário dentro desse intervalo.`);
      return;
    }
    setSubmitted(true);
  };

  const handleBack = () => navigate("/retirada");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Retirada de Peças</p>
              <h1 className="mt-2 text-3xl font-bold">Marcar Retirada</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Escolha um item e informe a data e horário desejados para retirar sua peça no laboratório.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Voltar para itens
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
            <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold">Item selecionado</h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{selectedItem.summary}</p>
              <div className="mt-4 h-80 min-h-[20rem] rounded-3xl border border-gray-200 bg-black/90 dark:border-gray-700">
                <ThreeViewer model={selectedItem.model} />
              </div>
              <div className="mt-5 rounded-3xl bg-white p-4 text-sm text-gray-700 shadow-sm dark:bg-gray-950 dark:text-gray-200">
                <p className="font-semibold">Status do item</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{selectedItem.status}</p>
              </div>
            </aside>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-950">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Item selecionado
                  </label>
                  <div className="mt-3 rounded-3xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100">
                    {selectedItem.title}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pickupDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Data</label>
                    <input
                      id="pickupDate"
                      name="pickupDate"
                      type="date"
                      value={form.pickupDate}
                      onChange={handleChange}
                      className="mt-3 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="pickupTime" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Horário</label>
                    <input
                      id="pickupTime"
                      name="pickupTime"
                      type="time"
                      min={LAB_OPEN_TIME}
                      max={LAB_CLOSE_TIME}
                      value={form.pickupTime}
                      onChange={handleChange}
                      className="mt-3 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Horários disponíveis entre {LAB_OPEN_TIME} e {LAB_CLOSE_TIME}.</p>
                    {timeError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{timeError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Nome para contato</label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    value={form.contactName}
                    className="mt-3 w-full rounded-3xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Observações</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="4"
                    placeholder="Digite informações adicionais"
                    value={form.notes}
                    onChange={handleChange}
                    className="mt-3 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={!isAvailable}
                    className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-400'}`}
                  >
                    Confirmar retirada
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Após enviar, o sistema confirmará a coleta no horário escolhido.</p>
                </div>
                {!isAvailable && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                    <p className="font-semibold">Não é possível marcar retirada</p>
                    <p className="mt-2">Esta peça não está disponível para retirada no momento. Escolha outra peça ou aguarde até que ela esteja disponível.</p>
                  </div>
                )}
              </form>

              {submitted && (
                <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-5 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                  <p className="font-semibold">Pedido de retirada enviado!</p>
                  <p className="mt-2">Sua solicitação foi registrada para <strong>{form.pickupDate}</strong> às <strong>{form.pickupTime}</strong>.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
