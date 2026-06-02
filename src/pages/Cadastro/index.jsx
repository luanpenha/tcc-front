import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function Cadastro() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 8) {
      newErrors.password = "Senha deve ter no mínimo 8 caracteres";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    if (!agreeTerms) {
      newErrors.agreeTerms = "Você deve aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      login(name);
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Novo cadastro</p>
              <h1 className="mt-2 text-3xl font-bold">Crie sua conta</h1>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                Preencha os dados abaixo para acessar o sistema e gerenciar agendamentos e retiradas.
              </p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-5 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              <p className="font-semibold">Use o sistema com segurança</p>
              <p className="mt-2">Após criar sua conta, você poderá acessar todas as telas internas. O login de teste continua disponível na tela de acesso.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-2 w-full rounded-3xl border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800 dark:text-gray-100`}
                  placeholder="Seu nome"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-2 w-full rounded-3xl border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800 dark:text-gray-100`}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-2 w-full rounded-3xl border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800 dark:text-gray-100`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar senha</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-2 w-full rounded-3xl border px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800 dark:text-gray-100`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  Aceito os <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">termos</a> e a <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">política de privacidade</a>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-sm text-red-600 dark:text-red-400">{errors.agreeTerms}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Criar conta
              </button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Já tem conta? <Link to="/" className="text-blue-600 hover:underline dark:text-blue-400">Faça login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
