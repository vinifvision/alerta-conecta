import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { ArrowLeft } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard: React.FC = () => {
  // Dados de exemplo (gráfico de queimadas)
  const data = [
    { mes: "Jan", queimadas: 400 },
    { mes: "Fev", queimadas: 300 },
    { mes: "Mar", queimadas: 600 },
    { mes: "Abr", queimadas: 200 },
    { mes: "Mai", queimadas: 450 },
    { mes: "Jun", queimadas: 380 },
    { mes: "Jul", queimadas: 520 },
    { mes: "Ago", queimadas: 610 },
    { mes: "Set", queimadas: 700 },
    { mes: "Out", queimadas: 480 },
    { mes: "Nov", queimadas: 350 },
    { mes: "Dez", queimadas: 400 },
  ];

  return (
    <div className="w-screen h-screen flex bg-[#F9F9F9] max-md:flex-col overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-[40px] pt-[40px] pb-[30px] max-md:p-5 max-sm:p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-black/5"
          >
            <ArrowLeft className="w-5 h-5 text-[#1650A7]" />
          </button>
          <h1 className="text-[#1650A7] text-2xl font-semibold">
            Dashboard Operacional
          </h1>
        </div>

        {/* MÉTRICAS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total de Ocorrências", value: "15.132" },
            { label: "Ocorrências Atendidas", value: "12.612" },
            { label: "Ocorrências Não atendidas", value: "2.197" },
            { label: "Bombeiro em Serviço", value: "3.125" },
            { label: "Taxa de eficiência", value: "83,6%" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-center"
            >
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className="text-[#1650A7] text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* FILTROS */}
        <section className="flex flex-wrap gap-3 mb-8">
          {["Tipo de ocorrência", "Turno", "Região", "Grupamento", "Período"].map(
            (filtro, i) => (
              <select
                key={i}
                className="h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#1650A7] focus:outline-none focus:ring-2 focus:ring-[#1650A7]/30"
              >
                <option>{filtro}</option>
              </select>
            )
          )}
        </section>

        {/* GRÁFICO REAL */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-[#1650A7] text-lg font-semibold mb-4">
            Ocorrências por Queimadas
          </h3>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#1650A7" />
                <YAxis stroke="#1650A7" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="queimadas"
                  stroke="#FF4444"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
