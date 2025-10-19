import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "1234") {
      navigate("/home");
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="flex w-screen h-screen bg-white">
    
      <div className="w-1/2 bg-[#1650A7]/90 flex items-center justify-center relative overflow-hidden max-md:hidden">
        <img
          src="AlertaConectaLogo (1).svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover "
        />
        <div className="relative z-10 flex flex-col items-center text-center px-10">
  
          <h1 className="text-white text-4xl font-bold"></h1>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center px-12 max-md:w-full">
        <div className="w-full max-w-sm">
          <h2 className="text-[#1650A7] text-2xl font-bold mb-2">Fazer login</h2>
          <p className="text-[#666] text-sm mb-8">
            Conecte-se com uma conta
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]"
                required
              />
            </div>

            <div className="text-right text-sm">
              <a href="#" className="text-[#1650A7] hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1650A7] text-white rounded-full font-medium hover:bg-[#0f3d7f] transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
