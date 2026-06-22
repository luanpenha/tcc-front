import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100 shadow-sm">
      <div className="flex h-full flex-col p-4 gap-4">
        <div>
          <div className="text-xl font-bold">SAI 3D</div>
          <div className="mt-3 rounded-2xl bg-gray-100 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {user ? (
              <div className="space-y-1">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email ?? 'Usuário logado'}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">Convidado</p>
            )}
          </div>
        </div>

        <div className="text-xl font-semibold">Navegação</div>
        <nav className="flex flex-col gap-2">
          <Link to="/home" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Home</Link>
          {user?.role !== 'admin' && (
            <>
              <Link to="/agendamento" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Agendamento</Link>
              <Link to="/pedidos" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Pedidos</Link>
              <Link to="/retirada" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Retirada</Link>
              <Link to="/galeria" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Galeria</Link>
            </>
          )}
        </nav>

        {user?.role === 'admin' && (
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-xl font-semibold mb-2">Administração</div>
            <nav className="flex flex-col gap-2">
              <Link to="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Dashboard</Link>
              <Link to="/admin/pedidos" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Pedidos</Link>
              <Link to="/admin/agendamentos" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Agendamentos</Link>
              <Link to="/admin/usuarios" className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800">Usuários</Link>
            </nav>
          </div>
        )}

        <div className="mt-auto">
          {user ? (
            <button type="button" onClick={handleLogout} className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
              Sair
            </button>
          ) : (
            <Link to="/" className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700">
              Fazer login
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
export default Navbar;
