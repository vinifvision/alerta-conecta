// src/main.tsx (VERSÃO CORRETA)

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 1. Importe o BrowserRouter AQUI
import { BrowserRouter } from "react-router-dom";

// 2. Importe o AuthProvider do NOVO arquivo .tsx
import { AuthProvider } from "./contexts/AuthContext.tsx";

// 3. Garanta que o <React.StrictMode> (se você usar) esteja por fora de tudo
createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* 4. O BrowserRouter DEVE vir por fora do AuthProvider */}
        <BrowserRouter>
            {/* 5. O AuthProvider DEVE vir por fora do App */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
