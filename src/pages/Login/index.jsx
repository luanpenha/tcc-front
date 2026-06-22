import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function Login() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      navigate('/home');
      return;
    }
    setErrorMessage(result.message);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleForgotPassword = (event) => {
    event.preventDefault();
    setResetSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetEmail("");
      setResetSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Bem-vindo ao SAI 3D</p>
              <h1 className="mt-4 text-4xl font-bold">Faça login para continuar</h1>
              <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-400">
                Acesse todas as funcionalidades do sistema: agendamento de laboratórios, galeria de peças e retirada de impressões.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-blue-50 p-5 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                <p className="font-semibold mb-3">👤 Usuário comum</p>
                <p className="text-xs mb-1">teste@teste.com</p>
                <p className="text-xs">Senha: Senha123</p>
              </div>
              <div className="rounded-3xl bg-purple-50 p-5 text-sm text-purple-700 dark:bg-purple-950/40 dark:text-purple-200">
                <p className="font-semibold mb-3">🔐 Administrador</p>
                <p className="text-xs mb-1">admin@teste.com</p>
                <p className="text-xs">Senha: Admin123</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          {user ? (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gray-50 p-5 dark:bg-gray-900">
                <p className="text-sm text-gray-500 dark:text-gray-400">Você está conectado como</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Desconectar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-300">
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Esqueci a senha
                </button>
                <Link to="/cadastro" className="text-blue-600 hover:underline dark:text-blue-400">
                  Cadastrar
                </Link>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Entrar
              </button>
            </form>
          )}
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recuperar senha</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Digite seu e-mail para receber um link de recuperação.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-full bg-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Fechar
              </button>
            </div>

            {resetSubmitted ? (
              <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-700 dark:bg-green-950/30 dark:text-green-200">
                ✓ E-mail enviado com sucesso! Verifique sua caixa de entrada.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    placeholder="seu@email.com"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setResetEmail("");
                    }}
                    className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
