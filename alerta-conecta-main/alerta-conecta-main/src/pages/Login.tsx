import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// URL do endpoint de login do seu Spring Boot. Adapte conforme necessário.
const LOGIN_API_URL = "http://localhost:8080/api/auth/login";

// CREDENCIAIS PROVISÓRIAS PARA TESTE
const FALLBACK_CPF = "12345678900"; // CPF de teste (apenas números)
const FALLBACK_PASSWORD = "senha_teste"; // Senha de teste

const Login = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores
    setIsLoading(true); // Inicia o estado de carregamento

    // ----------------------------------------------------
    // 1. TENTATIVA DE LOGIN REAL COM BACKEND SPRING BOOT
    // ----------------------------------------------------
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia o CPF e a senha no corpo da requisição
        body: JSON.stringify({ cpf, password }),
      });

      // Se a resposta for OK (sucesso na API real)
      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;

        if (authToken) {
          localStorage.setItem("authToken", authToken);
          navigate("/home");
          return; // Sai da função após o sucesso real
        } else {
          // Se o backend retornou 200, mas sem token, indica erro de implementação
          throw new Error("Sucesso no login, mas token de autenticação não foi recebido.");
        }
      }

      // Se a resposta NÃO for OK (Erro 400/401 do Backend)
      const errorData = await response.json();
      const errorMessage = errorData.message || "CPF ou senha incorretos.";

      setError(errorMessage);

    } catch (fetchError) {
      // -------------------------------------------------------------------------
      // 2. FALLBACK PARA LOGIN PROVISÓRIO (AQUI OCORRE EM CASO DE ERRO DE REDE/CORS)
      // -------------------------------------------------------------------------
      console.warn("Falha na conexão com a API de Login. Usando credenciais provisórias.");

      if (cpf === FALLBACK_CPF && password === FALLBACK_PASSWORD) {
        // Simula o login bem-sucedido e salva um token fictício
        localStorage.setItem("authToken", "simulated_token_for_dev_12345");
        navigate("/home");
      } else {
        // Se as credenciais provisórias falharem
        setError("Não foi possível conectar ao servidor. As credenciais provisórias falharam.");
      }
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
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
          {/* Mensagem de alerta sobre o modo provisório */}
          <p className="text-xs text-yellow-600 mb-4 p-2 bg-yellow-100 rounded">
            Modo DEV: CPF: **{FALLBACK_CPF}** | Senha: **{FALLBACK_PASSWORD}**
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
                value={password}
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
