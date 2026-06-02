import { useState } from 'react';
import { useAuth } from '../../AuthContext';

import Navbar from "../../components/Navbar/Navbar";

function Agendamento() {
  const { user } = useAuth();
  const [selectedLab, setSelectedLab] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const labs = [
    { id: 1, name: 'LEMA', location: 'Bloco B', capacity: 20, resources: ['Impressora 3D', 'Máquina de corte laser', 'Notebooks'] },
    { id: 2, name: 'Espaço 4.0', location: 'Bloco B', capacity: 15, resources: ['Notebooks', 'Scanner 3D'] }
  ];

  const schedules = [
    { id: 1, start: '08:00', end: '10:00', status: 'available', responsible: 'Prof. Alex' },
    { id: 2, start: '10:00', end: '12:00', status: 'occupied', responsible: 'Prof. Alex' },
    { id: 3, start: '14:00', end: '16:00', status: 'available', responsible: 'Prof. Felipe' },
    { id: 4, start: '16:00', end: '18:00', status: 'maintenance', responsible: '' }
  ];

  const filteredSchedules = schedules;

  const handleBook = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleConfirm = () => {
    alert('Agendamento realizado com sucesso');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Agendamento</p>
              <h1 className="mt-2 text-3xl font-bold">Agendar laboratório</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Selecione um horário disponível e confirme seu agendamento com as informações de retirada.
              </p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              <p className="font-semibold">Usuário</p>
              <p className="mt-2">{user?.name ?? 'Convidado'}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
              <h2 className="text-lg font-semibold">Filtros de pesquisa</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laboratório</label>
                  <select
                    className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    value={selectedLab?.id || ''}
                    onChange={(e) => setSelectedLab(labs.find((lab) => lab.id === Number(e.target.value)))}
                  >
                    <option value="">Selecione</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>{lab.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {selectedLab && (
                  <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300">
                    <p className="font-semibold">Laboratório selecionado</p>
                    <p className="mt-2">{selectedLab.name}</p>
                    <p className="mt-1">Localização: {selectedLab.location}</p>
                    <p className="mt-1">Capacidade: {selectedLab.capacity} pessoas</p>
                  </div>
                )}
              </div>
            </aside>

            <section className="rounded-3xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Horários</p>
                  <h2 className="mt-2 text-2xl font-bold">Disponibilidade</h2>
                </div>
                <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  {filteredSchedules.filter((slot) => slot.status === 'available').length} horários livres
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {filteredSchedules.map((slot) => (
                  <div
                    key={slot.id}
                    className={`rounded-3xl border p-4 transition ${
                      slot.status === 'available'
                        ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-200'
                        : slot.status === 'occupied'
                        ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950 dark:text-red-200'
                        : 'border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-lg">{slot.start} - {slot.end}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Responsável: {slot.responsible || 'N/A'}</p>
                      </div>
                      {slot.status === 'available' ? (
                        <button
                          type="button"
                          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          onClick={() => handleBook(slot)}
                        >
                          Agendar
                        </button>
                      ) : (
                        <span className="rounded-full border border-current px-3 py-1 text-sm font-semibold uppercase">
                          {slot.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agendar horário</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Revise seus dados antes de confirmar a reserva.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full bg-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Laboratório</p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedLab?.name || 'Não selecionado'}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{selectedLab?.location || '—'}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Horário</p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedSlot?.start} - {selectedSlot?.end}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Data: {selectedDate}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsável</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  defaultValue="João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso / Turma</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                <textarea
                  className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Confirmar agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Agendamento;
