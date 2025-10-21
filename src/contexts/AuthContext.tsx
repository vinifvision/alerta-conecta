// src/contexts/AuthContext.tsx (Corrigido)

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://26.9.167.9:3308/database";
const LOGIN_API_URL = `${API_URL}/user/login`;

export interface User {
    status: string;
    name: string;
    email: string;
    role: string; // <-- O 'role' aqui vai receber "Gerente", etc.
    cpf: string;
}

// 1. ATUALIZADO: O usuário mock agora é um "Gerente"
const MOCK_USER: User = {
    status: "sucesso (mock)",
    name: "Desenvolvedor Gerente (Mock)",
    email: "dev@mock.com",
    role: "Gerente", // <-- ATUALIZADO DE "admin"
    cpf: "000.000.000-00",
};

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (cpf: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const isMockMode = import.meta.env.VITE_MOCK_MODE === "true";

        if (isMockMode) {
            // MODO DEV
            console.warn("*************************");
            console.warn("!!! MODO MOCK ATIVADO !!!");
            console.warn("Carregando usuário 'Gerente' mock..."); // (Mensagem atualizada)
            console.warn("*************************");
            setUser(MOCK_USER);
            setLoading(false);
        } else {
            // MODO REAL
            console.log("Modo de Produção (Back-end Real).");
            try {
                const storedUser = localStorage.getItem("usuario");
                const token = localStorage.getItem("authToken");

                if (storedUser && token) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Falha ao carregar usuário do localStorage", error);
                localStorage.clear();
            }
            setLoading(false);
        }
    }, []);

    // (Função de login - sem alteração, ela já pega o 'role' do back-end)
    const login = async (cpf: string, pass: string) => {
        try {
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cpf, pass }),
            });

            const data = await response.json();

            if (response.ok && data.status === "sucesso") {
                // 'data.role' agora virá como "Gerente", etc.
                localStorage.setItem("usuario", JSON.stringify(data));
                const token = data.token || "simulated_token_for_dev_12345";
                localStorage.setItem("authToken", token);
                setUser(data);
                navigate("/home");
            } else {
                throw new Error(data.message || "CPF ou senha incorretos.");
            }
        } catch (err: any) {
            console.error("Erro no login:", err);
            throw new Error(
                err.message || "Não foi possível conectar ao servidor."
            );
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("authToken");
        navigate("/");
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
};
