import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// A URL da sua API de login
// const LOGIN_API_URL = "";

const Login = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [pass, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf, pass }),
      });

      // Se a resposta for OK (sucesso na API real)
      if (response.ok) {
        const data = await response.json(); // Objeto com status, name, email, etc.

        // 1. Verificamos o 'status' que o backend enviou
        if (data.status === "sucesso") {

          // 2. Salvamos os dados do usuário
          localStorage.setItem("usuario", JSON.stringify(data));

          // 3. Salvamos um token (CRUCIAL para as outras páginas)
          // Se o backend enviar um token real (data.token), usamos ele.
          // Se não, usamos um token falso para o app não quebrar.
          const tokenParaSalvar = data.token || "simulated_token_for_dev_12345";
          localStorage.setItem("authToken", tokenParaSalvar);

          // 4. Redirecionamos para a Home
          navigate("/home");
          return;

        } else {
          // Caso o backend retorne 200 OK, mas com uma mensagem de erro
          setError(data.message || "O backend retornou um erro desconhecido.");
        }
      }

      // Se a resposta NÃO for OK (Erro 400/401 do Backend)
      const errorData = await response.json();
      const errorMessage = errorData.message || "CPF ou senha incorretos.";

      setError(errorMessage);

    } catch (fetchError) {
      // O "fallback" foi removido.
      // Este 'catch' agora só trata erros de rede (ex: API offline ou CORS)
      console.error("Erro de conexão com a API:", fetchError);
      setError("Não foi possível conectar ao servidor. Verifique a rede ou o CORS.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-white">

      <div className="w-1/2 bg-[#1650A7]/90 flex items-center justify-center relative overflow-hidden max-md:hidden">
        <img
          src="AlertaConectaLogo (1).svg"
          alt="Alerta Conecta Logo"
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
                placeholder="CPF (apenas números)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={pass}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1650A7]"
                required
                disabled={isLoading}
              />
            </div>

            {/* Exibe a mensagem de erro se houver */}
            {error && (
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            )}

            <div className="text-right text-sm">
              <a href="#" className="text-[#1650A7] hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#1650A7] text-white rounded-full font-medium hover:bg-[#0f3d7f] transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
