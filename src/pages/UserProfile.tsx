import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// URL do endpoint do Spring Boot para buscar o perfil do usuário
const PROFILE_API_URL = "http://localhost:8080/api/profile";

type User = {
  name: string;
  role: string;
  battalion: string;
  registry: string;
  phone: string;
  email: string;
  avatarUrl: string;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();

  // Estado inicial é null para indicar que os dados ainda não foram carregados
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os dados do usuário
  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        // Se não houver token, redireciona para o login
        navigate("/");
        return;
      }

      try {
        const response = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Envia o Token JWT para o Spring Security validar
            "Authorization": `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          // Se o token for inválido (401) ou outros erros
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha ao carregar o perfil. Autenticação inválida.");
        }

        const data = await response.json();

        // Mapeia os dados recebidos do Spring Boot para o tipo User do React
        const fetchedUser: User = {
          name: data.fullName,      // 💡 Adapte o nome do campo se necessário (ex: data.nomeCompleto)
          role: data.role,          // 💡 Adapte o nome do campo se necessário
          battalion: data.battalion,// 💡 Adapte o nome do campo se necessário
          registry: data.registry,  // 💡 Adapte o nome do campo se necessário
          phone: data.phone,        // 💡 Adapte o nome do campo se necessário
          email: data.email,        // 💡 Adapte o nome do campo se necessário
          // O Spring Boot pode retornar a URL, ou você a gera no front.
          avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName.split(' ')[0]}`,
        };

        setUser(fetchedUser);

      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError("Não foi possível carregar os dados do perfil.");
        // Opcional: Em caso de erro grave, desloga
        localStorage.removeItem("authToken");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // Dependência em navigate para o linter

  const handleResetPassword = () => {
    // Aqui seria uma chamada API para o Spring Boot solicitar a redefinição de senha por e-mail
    alert("Link de redefinição de senha enviado para o e-mail (Funcionalidade de backend a ser implementada).");
  };

  const handleLogout = () => {
    // Remove o token de autenticação e redireciona
    localStorage.removeItem("authToken");
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

  // user é garantidamente não-null neste ponto
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

        {/* Informações do Usuário (usando os dados carregados) */}
        <section className="max-w-[640px] mx-auto flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white shadow">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-3 text-[#000] font-semibold">{currentUser.name}</h2>
          <p className="text-[#666] text-sm -mt-[2px]">{currentUser.role}</p>
        </section>

        {/* Formulário de Detalhes (usando os dados carregados) */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-[640px] mx-auto space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
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
