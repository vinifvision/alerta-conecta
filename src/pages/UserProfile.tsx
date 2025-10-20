import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type User = {
  name: string;
  role: string;
  battalion: string;
  registry: string;
  phone: string;
  email: string;
  avatarUrl: string;
  cpf: string;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para carregar os dados do localStorage
  useEffect(() => {

    // 1. Proteção de Rota
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }

    // 2. Buscar Dados do localStorage
    const userDataString = localStorage.getItem("usuario");
    if (!userDataString) {
      setError("Dados do usuário não encontrados no localStorage.");
      localStorage.removeItem("authToken");
      navigate("/");
      return;
    }

    // 3. Montar o Objeto User
    try {
      const data = JSON.parse(userDataString); // O JSON salvo pelo Login

      const profileUser: User = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        registry: data.registry,
        cpf: data.cpf,
        role: data.role, // <--- ATUALIZADO: Lendo o 'role' vindo do backend

        // (Valor Padrão caso o backend não mande)
        battalion: data.battalion || "1º Batalhão de Incêndio",
        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.split(' ')[0]}`,
      };

      setUser(profileUser);

    } catch (err) {
      console.error("Erro ao processar dados do usuário:", err);
      setError("Erro ao processar os dados do usuário.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("usuario");
      navigate("/");
    } finally {
      setIsLoading(false);
    }

  }, [navigate]);

  const handleResetPassword = () => {
    alert("Link de redefinição de senha enviado para o e-mail (Funcionalidade de backend a ser implementada).");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  // --- Condicionais de Carregamento e Erro ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F9F9F9] p-5">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="h-10 px-6 rounded-lg bg-[#1650A7] text-white font-medium"
        >
          Voltar para Login
        </button>
      </div>
    );
  }

  const currentUser = user as User;

  return (
    <div className="w-screen h-screen flex bg-[#F9F9F9] max-md:flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto px-[40px] pt-[30px] pb-[30px] max-md:p-5">
        <div className="flex items-center justify-between max-w-[640px] mx-auto mb-6">
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-black/5"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
          <h1 className="text-[#1650A7] text-xl font-semibold">Perfil do usuário</h1>
          <div className="w-9 h-9" />
        </div>

        {/* Informações do Usuário (usando os dados carregados do localStorage) */}
        <section className="max-w-[640px] mx-auto flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white shadow">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-3 text-[#000] font-semibold">{currentUser.name}</h2>
          {/* --- ATUALIZADO --- */}
          <p className="text-[#666] text-sm -mt-[2px]">{currentUser.role}</p>
        </section>

        {/* Formulário de Detalhes (usando os dados carregados do localStorage) */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-[640px] mx-auto space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            {/* --- ATUALIZADO --- */}
            <input
              value={currentUser.role}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Batalhão</label>
            <input
              value={currentUser.battalion}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Matrícula</label>
            <input
              value={currentUser.registry}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              value={currentUser.phone}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              value={currentUser.email}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResetPassword}
              className="h-10 w-full rounded-lg bg-white border border-[#1650A7] text-[#1650A7] font-medium hover:bg-[#1650A7] hover:text-white transition-colors"
            >
              Redefinir senha
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="h-10 w-full rounded-lg bg-[#ffe4e6] text-[#c2410c] border border-[#fecaca] font-medium hover:bg-[#fecaca] transition-colors"
            >
              Sair da Conta ↪
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserProfile;
