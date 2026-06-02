import { useState } from 'react';
import Navbar from "../../../components/Navbar/Navbar";
import { useAuth } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminAgendamentos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      usuario: 'João Silva',
      email: 'joao@example.com',
      laboratorio: 'Lab 3D - Prédio A',
      tipo: 'Prototipagem',
      material: 'PLA',
      dataAgendamento: '25/05/2026',
      horaInicio: '14:00',
      horaFim: '16:30',
      status: 'Confirmado',
      observacoes: 'Impressão de protótipo de carcaça eletrônica',
      retirada: '26/05/2026',
    },
    {
      id: 2,
      usuario: 'Maria Santos',
      email: 'maria@example.com',
      laboratorio: 'Lab 3D - Prédio B',
      tipo: 'Educacional',
      material: 'ABS',
      dataAgendamento: '24/05/2026',
      horaInicio: '10:00',
      horaFim: '12:00',
      status: 'Concluído',
      observacoes: 'Modelo didático para aula de engenharia',
      retirada: '24/05/2026',
    },
    {
      id: 3,
      usuario: 'Pedro Costa',
      email: 'pedro@example.com',
      laboratorio: 'Lab 3D - Prédio A',
      tipo: 'Manutenção',
      material: 'PETG',
      dataAgendamento: '27/05/2026',
      horaInicio: '09:00',
      horaFim: '11:00',
      status: 'Pendente',
      observacoes: 'Peças de reposição para equipamento',
      retirada: '27/05/2026',
    },
    {
      id: 4,
      usuario: 'Ana Paula',
      email: 'ana@example.com',
      laboratorio: 'Lab 3D - Prédio C',
      tipo: 'Prototipagem',
      material: 'PLA',
      dataAgendamento: '28/05/2026',
      horaInicio: '15:00',
      horaFim: '17:00',
      status: 'Confirmado',
      observacoes: 'Impressão de peças para projeto de conclusão',
      retirada: '28/05/2026',
    },
    {
      id: 5,
      usuario: 'Carlos Mendes',
      email: 'carlos@example.com',
      laboratorio: 'Lab 3D - Prédio B',
      tipo: 'Pesquisa',
      material: 'Resina',
      dataAgendamento: '23/05/2026',
      horaInicio: '08:00',
      horaFim: '10:30',
      status: 'Cancelado',
      observacoes: 'Impressão de amostra de pesquisa',
      retirada: '-',
    },
    {
      id: 6,
      usuario: 'Fernanda Lima',
      email: 'fernanda@example.com',
      laboratorio: 'Lab 3D - Prédio A',
      tipo: 'Prototipagem',
      material: 'TPU',
      dataAgendamento: '29/05/2026',
      horaInicio: '13:00',
      horaFim: '15:00',
      status: 'Confirmado',
      observacoes: 'Peça flexível para teste de usabilidade',
      retirada: '29/05/2026',
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    laboratorio: '',
    tipo: '',
    material: '',
    dataAgendamento: '',
    horaInicio: '',
    horaFim: '',
    status: 'Confirmado',
    observacoes: '',
    retirada: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);

  const openModal = (existingAgendamento = null) => {
    if (existingAgendamento) {
      setEditingAgendamento(existingAgendamento);
      setFormData(existingAgendamento);
    } else {
      setEditingAgendamento(null);
      setFormData({
        usuario: '',
        email: '',
        laboratorio: '',
        tipo: '',
        material: '',
        dataAgendamento: '',
        horaInicio: '',
        horaFim: '',
        status: 'Confirmado',
        observacoes: '',
        retirada: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAgendamento(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAgendamento) {
      setAgendamentos(agendamentos.map(a => a.id === editingAgendamento.id ? { ...editingAgendamento, ...formData } : a));
    } else {
      setAgendamentos([...agendamentos, { id: agendamentos.length + 1, ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este agendamento?')) {
      setAgendamentos(agendamentos.filter(a => a.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'Concluído':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'Cancelado':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const filteredAgendamentos = filterStatus === 'Todos'
    ? agendamentos
    : agendamentos.filter(a => a.status === filterStatus);

  const stats = [
    {
      label: 'Total de Agendamentos',
      value: agendamentos.length,
      icon: '📅',
      color: 'blue',
    },
    {
      label: 'Confirmados',
      value: agendamentos.filter(a => a.status === 'Confirmado').length,
      icon: '✓',
      color: 'green',
    },
    {
      label: 'Pendentes',
      value: agendamentos.filter(a => a.status === 'Pendente').length,
      icon: '⏳',
      color: 'yellow',
    },
    {
      label: 'Concluídos',
      value: agendamentos.filter(a => a.status === 'Concluído').length,
      icon: '✔️',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="ml-64 p-6">
        {/* Header */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Gerenciamento</p>
              <h1 className="mt-2 text-3xl font-bold">Agendamentos do sistema</h1>
              <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
                Visualize, edite e gerencie todos os agendamentos de impressão 3D do sistema.
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Novo agendamento
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Filters and Table Section */}
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Lista detalhada</p>
              <h2 className="mt-2 text-2xl font-bold">Todos os agendamentos</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Todos', 'Confirmado', 'Pendente', 'Concluído', 'Cancelado'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Usuário</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Laboratório</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Tipo / Material</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Data & Hora</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Ações</th>
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
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(agendamento)}
                          className="rounded-lg bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200 transition dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(agendamento.id)}
                          className="rounded-lg bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200 transition dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAgendamentos.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">Nenhum agendamento encontrado para este filtro.</p>
            </div>
          )}
        </section>

        {/* Expanded Details Cards */}
        {filteredAgendamentos.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Visualização detalhada</p>
              <h2 className="mt-2 text-2xl font-bold">Informações completas dos agendamentos</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredAgendamentos.map((agendamento) => (
                <div key={agendamento.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{agendamento.usuario}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{agendamento.email}</p>
                    </div>
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(agendamento.status)}`}>
                      {agendamento.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400">Laboratório</p>
                      <p className="text-gray-900 dark:text-gray-100">{agendamento.laboratorio}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">Tipo de Impressão</p>
                        <p className="text-gray-900 dark:text-gray-100">{agendamento.tipo}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">Material</p>
                        <p className="text-gray-900 dark:text-gray-100">{agendamento.material}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">Data</p>
                        <p className="text-gray-900 dark:text-gray-100">{agendamento.dataAgendamento}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 dark:text-gray-400">Horário</p>
                        <p className="text-gray-900 dark:text-gray-100">{agendamento.horaInicio} - {agendamento.horaFim}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400">Retirada</p>
                      <p className="text-gray-900 dark:text-gray-100">{agendamento.retirada}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600 dark:text-gray-400">Observações</p>
                      <p className="text-gray-900 dark:text-gray-100">{agendamento.observacoes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 dark:bg-gray-950">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuário *</label>
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laboratório *</label>
                <input
                  type="text"
                  name="laboratorio"
                  value={formData.laboratorio}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Impressão *</label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Material *</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data *</label>
                  <input
                    type="text"
                    name="dataAgendamento"
                    value={formData.dataAgendamento}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora Início *</label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hora Fim *</label>
                  <input
                    type="time"
                    name="horaFim"
                    value={formData.horaFim}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Retirada *</label>
                  <input
                    type="text"
                    name="retirada"
                    value={formData.retirada}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                >
                  {editingAgendamento ? 'Atualizar' : 'Criar'} Agendamento
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-900 transition hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
