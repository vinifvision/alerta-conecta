import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

// --- Definição de Tipos ---
type DashboardMetric = {
  label: string;
  value: string;
};

type ChartDataPoint = {
  mes: string;
  queimadas: number;
};

type FilterOption = {
  value: string;
  label: string;
};

type FilterOptionsData = {
  types: FilterOption[];
  shifts: FilterOption[];
  regions: FilterOption[];
  groupings: FilterOption[];
  periods: FilterOption[];
};

type FilterState = {
  type: string;
  shift: string;
  region: string;
  grouping: string;
  period: string;
};

const Dashboard: React.FC = () => {
  // --- Estados para os Dados ---
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para os filtros selecionados
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    shift: "",
    region: "",
    grouping: "",
    period: "",
  });

  // --- Estado para as opções dos filtros ---
  const [filterOptions, setFilterOptions] = useState<FilterOptionsData>({
    types: [],
    shifts: [],
    regions: [],
    groupings: [],
    periods: [],
  });

  const navigate = useNavigate();

  // --- Lógica de Busca de Dados (Simulação) ---
  useEffect(() => {
    const fetchDashboardData = () => {
      // 1. Dados mock para as métricas (AGORA COMPLETOS)
      const mockMetrics: DashboardMetric[] = [
        { label: "Total de Ocorrências", value: "15.132" },
        { label: "Ocorrências Atendidas", value: "12.612" },
        { label: "Ocorrências Não atendidas", value: "2.197" },
        { label: "Bombeiro em Serviço", value: "3.125" },
        { label: "Taxa de eficiência", value: "83,6%" },
      ];

      // 2. Dados mock para o gráfico (AGORA COMPLETOS)
      const mockChartData: ChartDataPoint[] = [
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

      // 3. Dados mock para as opções dos filtros (AGORA COMPLETOS)
      const mockFilterOptions: FilterOptionsData = {
        types: [
          { value: "incendio", label: "Incêndio" },
          { value: "acidente", label: "Acidente Veicular" },
          { value: "aph", label: "APH - Atendimento Pré-Hospitalar" },
          { value: "resgate", label: "Resgate em Altura" },
          { value: "salvamento", label: "Salvamento Aquático" },
          { value: "incendio_veiculo", label: "Incêndio em Veículo" },
          { value: "incendio_florestal", label: "Incêndio Florestal" },
          { value: "outros", label: "Outros" },
        ],
        shifts: [
          { value: "manha", label: "Manhã (06h-18h)" },
          { value: "noite", label: "Noite (18h-06h)" },
        ],
        regions: [
          { value: "centro", label: "Centro" },
          { value: "zona_sul", label: "Zona Sul" },
          { value: "zona_norte", label: "Zona Norte" },
          { value: "zona_oeste", label: "Zona Oeste" },
          { value: "rmr", label: "Região Metropolitana" },
        ],
        groupings: [
          { value: "gbi", label: "GBI (Grup. de Bombeiros de Incêndio)" },
          { value: "gbs", label: "GBS (Grup. de Busca e Salvamento)" },
          { value: "aph", label: "APH (Atend. Pré-Hospitalar)" },
          { value: "gmar", label: "GMAR (Grup. Marítimo)" },
        ],
        periods: [
          { value: "today", label: "Hoje" },
          { value: "week", label: "Última semana" },
          { value: "month", label: "Último mês" },
          { value: "quarter", label: "Últimos 3 meses" },
          { value: "year", label: "Último ano" },
        ],
      };

      // 4. Simula o tempo de uma requisição de rede
      setTimeout(() => {
        setMetrics(mockMetrics);
        setChartData(mockChartData);
        setFilterOptions(mockFilterOptions);
        setIsLoading(false);
      }, 500);
    };

    fetchDashboardData();
  }, [navigate]);

  // --- Estado de Carregamento ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">
          Carregando dados do dashboard...
        </p>
      </div>
    );
  }

  // --- Handlers dos Filtros ---
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filterName: keyof FilterState
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: e.target.value,
    }));
  };

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

        {/* MÉTRICAS (AGORA COMPLETAS) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {metrics.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center text-center"
            >
              <p className="text-sm text-gray-600 mb-1">{item.label}</p>
              <p className="text-[#1650A7] text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* --- FILTROS (Dinâmicos) --- */}
        <section className="flex flex-wrap gap-3 mb-8">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange(e, "type")}
            className="h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#1650A7] focus:outline-none focus:ring-2 focus:ring-[#1650A7]/30"
          >
            <option value="">Tipo de ocorrência</option>
            {filterOptions.types.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.shift}
            onChange={(e) => handleFilterChange(e, "shift")}
            className="h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#1650A7] focus:outline-none focus:ring-2 focus:ring-[#1650A7]/30"
          >
            <option value="">Turno</option>
            {filterOptions.shifts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.region}
            onChange={(e) => handleFilterChange(e, "region")}
            className="h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#1650A7] focus:outline-none focus:ring-2 focus:ring-[#1650A7]/30"
          >
            <option value="">Região</option>
            {filterOptions.regions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.grouping}
            onChange={(e) => handleFilterChange(e, "grouping")}
            className="h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#1650A7] focus:outline-none focus:ring-2 focus:ring-[#1650A7]/30"
          >
            <option value="">Grupamento</option>
            {filterOptions.groupings.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.period}
            onChange={(e) => handleFilterChange(e, "period")}
            className="h-12 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-[#1650A7] focus:outline-none focus:ring-2 focus:ring-[#1650A7]/30"
          >
            <option value="">Período</option>
            {filterOptions.periods.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        {/* GRÁFICO REAL */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-[#1650A7] text-lg font-semibold mb-4">
            Ocorrências por Queimadas
          </h3>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
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
