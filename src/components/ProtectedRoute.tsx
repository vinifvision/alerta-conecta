// src/components/ProtectedRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <div>Verificando autenticação...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        console.warn(
            `ACESSO NEGADO: Rota requer [${allowedRoles.join(
                ", "
            )}], mas usuário é '${user?.role}'.`
        );

        // AQUI ESTÁ A MUDANÇA:
        // Adicionamos o 'state' ao <Navigate>
        // Isso envia uma "mensagem" para a rota /home
        return <Navigate to="/home" replace state={{ unauthorized: true }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
