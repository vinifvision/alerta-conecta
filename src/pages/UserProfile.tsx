import React, { useState } from "react";
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
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();

  const [user] = useState<User>({
    name: "Roberto Silva",
    role: "Despachante",
    battalion: "5 Batalhão",
    registry: "234567890",
    phone: "(81) 91234-5678",
    email: "emaildousuario@gmail.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?q=80&w=400&auto=format&fit=crop",
  });

  const handleResetPassword = () => {
    alert("Link de redefinição de senha enviado para o e-mail.");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/"); 
  };

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

 
        <section className="max-w-[640px] mx-auto flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white shadow">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="mt-3 text-[#000] font-semibold">{user.name}</h2>
          <p className="text-[#666] text-sm -mt-[2px]">{user.role}</p>
        </section>

    
        <form
          onSubmit={(e) => e.preventDefault()}
          className="max-w-[640px] mx-auto space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <input
              value={user.role}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Batalhão</label>
            <input
              value={user.battalion}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Matrícula</label>
            <input
              value={user.registry}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              value={user.phone}
              readOnly
              className="w-full h-11 px-4 bg-[#F6F6F6] border border-black/10 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input
              value={user.email}
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
