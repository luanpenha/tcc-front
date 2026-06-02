import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home/";
import Agendamento from "./pages/Agendamento";
import Galeria from "./pages/Galeria";
import Retirada from "./pages/Retirada";
import MarcarRetirada from "./pages/Retirada/MarcarRetirada";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import AdminDashboard from "./pages/Admin/dashboard";
import AdminPedidos from "./pages/Admin/pedidos";
import AdminUsuarios from "./pages/Admin/usuarios";
import AdminAgendamentos from "./pages/Admin/Agendamentos";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/retirada" element={<Retirada />} />
        <Route path="/retirada/marcar" element={<MarcarRetirada />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/admin/agendamentos" element={<AdminAgendamentos />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;