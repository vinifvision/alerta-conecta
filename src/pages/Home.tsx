// src/pages/Home.tsx (Corrigido para Match API Response e Completo)

import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { Phone, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// --- Tipos (Conforme a API envia) ---
type Occurrence = {
  id: number;
  status: "Em_andamento" | "Encerrada" | "Cancelada"; // API envia 'status' com underscore
  type: number;
  priority: "Baixa" | "Media" | "Alta";
  date: string;
  titule: string | null;
  victims: string | null;
  details: string | null;
  // Assumindo que o JOIN trará esses (ajuste se necessário)
  nome_tipo?: string;
  descricao_tipo?: string;
};

// (Tipos FilterOption, etc. - sem alteração)
type FilterOption = { value: string; label: string; };
type HomeFilterOptionsData = { periods: FilterOption[]; types: FilterOption[]; };
type HomeFilterState = { period: string; type: string; };

// const API_URL = import.meta.env.VITE_API_URL || "";
const GET_OCCURRENCES_URL = `${API_URL}/occurrence/getall`;

const Home = () => {
  // --- Hooks ---
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [allOccurrences, setAllOccurrences] = useState<Occurrence[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HomeFilterState>({ period: "", type: "" });
  const [filterOptions, setFilterOptions] = useState<HomeFilterOptionsData>({ periods: [], types: [] });

  // (useEffect de Aviso - sem alteração)
  useEffect(() => {
    if (location.state?.unauthorized === true) {
      toast.error("Acesso Negado", { /* ... */ });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // (useEffect de Fetch - busca apenas /getall)
  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsPageLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      try {
        const occurrencesRes = await fetch(GET_OCCURRENCES_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!occurrencesRes.ok) {
          let errorBody = await occurrencesRes.text().catch(() => "Erro desconhecido");
          throw new Error(`Falha ao buscar ocorrências: ${occurrencesRes.status}. Corpo: ${errorBody}`);
        }

        const occurrencesData: Occurrence[] | null = await occurrencesRes.json();
        setAllOccurrences(occurrencesData || []);

      } catch (err: any) {
        console.error("Home.tsx: Erro no fetch:", err);
        setError(err.message || "Não foi possível carregar os dados.");
      } finally {
        setIsPageLoading(false);
      }
    };

    if (!authLoading) {
      fetchHomePageData();
    }
  }, [authLoading]);

  // --- Hooks useMemo CORRIGIDOS ---
  const filteredOccurrences = useMemo(() => {
    let rows = [...allOccurrences];
    // (Filtros desabilitados por enquanto)
    return rows;
  }, [allOccurrences]);

  const recentOccurrences = useMemo(() => {
    // CORRIGIDO: Usa 'status' e o valor com underscore
    return filteredOccurrences.filter((o) => o.status === "Em_andamento");
  }, [filteredOccurrences]);

  const completedOccurrences = useMemo(() => {
    // CORRIGIDO: Assume 'Encerrada' vem da API (ajuste se for diferente)
    return filteredOccurrences.filter((o) => o.status === "Encerrada");
  }, [filteredOccurrences]);

  const cancelledOccurrences = useMemo(() => {
    // CORRIGIDO: Assume 'Cancelada' vem da API (ajuste se for diferente)
    return filteredOccurrences.filter((o) => o.status === "Cancelada");
  }, [filteredOccurrences]);

  // --- latestMapped CORRIGIDO (Usa campos da API) ---
  const latestMapped = useMemo(() => [
    ...recentOccurrences,
    ...completedOccurrences,
    ...cancelledOccurrences,
  ].map((o) => {
    // Cria o objeto que a página OccurrenceDetails espera
    return {
      // Passa os campos reais da API mapeados para os nomes esperados
      id_ocorrencia: o.id,
      titulo: o.titule || `Ocorrência #${o.id}`,
      data_hora: o.date,
      envolvidos: o.victims,
      detalhes: o.details,
      status_atual: o.status, // Passa o status real com underscore
      prioridade: o.priority,
      id_tipo_ocorrencia: o.type, // Mapeia 'type' (ID)
      nome_tipo: o.nome_tipo || `Tipo ${o.type}`, // Usa nome_tipo ou fallback
      descricao_tipo: o.descricao_tipo || "Sem descrição", // Usa descricao_tipo ou fallback

      // Campos duplicados/mapeados que Details também usa
      id: o.id,
      title: o.titule || `Ocorrência #${o.id}`,
      subtype: o.titule || `Ocorrência #${o.id}`,
      address: `Tipo: ${o.nome_tipo || o.type}`, // Placeholder melhorado
      type: `Tipo ${o.type}`, // Placeholder
      status: o.status === "Em_andamento" ? "EM ANDAMENTO" : o.status === "Encerrada" ? "FINALIZADA" : "CANCELADA",
    };
  }), [recentOccurrences, completedOccurrences, cancelledOccurrences]);
  // --- FIM DOS HOOKS ---


  // --- Retornos Condicionais ---
  if (authLoading || isPageLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">Carregando...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            <p><strong>Erro ao carregar ocorrências:</strong> {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </main>
      </div>
    );
  }

  // --- Handlers e Componentes Internos ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof HomeFilterState) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const clearFilters = () => {
    setFilters({ period: "", type: "" });
  };

  // --- OccurrenceCard CORRIGIDO ---
  const OccurrenceCard = (occurrence: Occurrence) => {
    // Pega os campos corretos da API
    const { id, titule, status, priority, type, nome_tipo } = occurrence;

    const dotColor =
      status === "Em_andamento" ? "bg-[#FF0000]" :
        status === "Encerrada" ? "bg-green-500" :
          "bg-gray-500";

    // Encontra o objeto mapeado correspondente para passar para o state
    const occurrenceState = latestMapped.find(m => m.id === id);

    return (
      <div className="bg-white rounded-[15px] p-5 mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
            <div>
              {/* === CORREÇÃO AQUI === */}
              {/* Título Principal: Usa 'titule' (nome específico) ou fallback */}
              <h3 className="text-[#000000] text-lg font-semibold mb-1">{titule || `Ocorrência #${id}`}</h3>
              {/* Subtítulo: Usa 'nome_tipo' (categoria geral) ou fallback */}
              <p className="text-[#666666] text-sm mb-2">{nome_tipo || `Tipo ID: ${type}`}</p>
              {/* ===================== */}
              <div className="flex items-center gap-4">
                <p className="text-[#FF0000] text-sm font-medium">#{id}</p>
                <p className="text-gray-700 text-sm font-medium">Prioridade: {priority}</p>
              </div>
            </div>
          </div>
        </div>
        <Link
          to={`/occurrences/${id}`}
          state={{ occurrence: occurrenceState, latest: latestMapped }}
          className="text-[#1650A7] text-sm font-medium hover:underline"
          title="Visualizar detalhes da ocorrência"
        >
          Visualizar
        </Link>
      </div>
    );
  };

  // --- RETORNO PRINCIPAL (JSX) ---
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-[60px] pt-[65px] pb-[30px] max-md:p-5 max-sm:p-[15px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 max-md:flex-col max-md:gap-4">
          <div>
            <h1 className="text-[#1650A7] text-[32px] font-semibold mb-2 max-md:text-2xl max-sm:text-xl">
              Olá, {user!.name},
            </h1>
            <p className="text-[#1650A7] text-[32px] font-semibold max-md:text-2xl max-sm:text-xl">
              Acompanhe suas ocorrências
            </p>
          </div>
          <Link to="/profile" className="flex items-center gap-4 max-md:self-end">
            <div className="text-right">
              <p className="text-[#000000] text-base font-semibold">{user!.name}</p>
              <p className="text-[#666666] text-sm">{user!.role}</p>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-[#D9D9D9] overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user!.name}`}
                alt={user!.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
        {/* Container Principal */}
        <div className="flex gap-8 max-lg:flex-col">
          {/* Coluna de Ocorrências */}
          <div className="flex-1">
            <h2 className="text-[#1650A7] text-2xl font-semibold mb-6">
              Em andamento
            </h2>
            <section className="mb-8">
              {recentOccurrences.length > 0 ? (
                // Usa 'id' como key
                recentOccurrences.map((o) => <OccurrenceCard key={o.id} {...o} />)
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma ocorrência "Em andamento" encontrada.</p>
              )}
            </section>
            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">Encerradas</h3>
            <section className="mb-8">
              {completedOccurrences.length > 0 ? (
                // Usa 'id' como key
                completedOccurrences.map((o) => <OccurrenceCard key={o.id} {...o} />)
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma ocorrência "Encerrada" encontrada.</p>
              )}
            </section>
            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">Canceladas</h3>
            <section>
              {cancelledOccurrences.length > 0 ? (
                // Usa 'id' como key
                cancelledOccurrences.map((o) => <OccurrenceCard key={o.id} {...o} />)
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma ocorrência "Cancelada" encontrada.</p>
              )}
            </section>
          </div>
          {/* Sidebar de Filtros (Desabilitado) */}
          <aside className="w-[320px] max-lg:w-full">
            <div className="bg-white rounded-[15px] p-6 mb-6">
              <h3 className="text-[#000000] text-xl font-semibold mb-6">
                Filtrar Ocorrências
              </h3>
              <div className="space-y-4">
                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.period}
                  onChange={(e) => handleFilterChange(e, "period")}
                  disabled={true}
                >
                  <option value="">Período (desabilitado)</option>
                </select>
                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.type}
                  onChange={(e) => handleFilterChange(e, "type")}
                  disabled={true}
                >
                  <option value="">Tipo (desabilitado)</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 h-12 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
            <Link
              to="/occurrences/new"
              className="w-full h-14 bg-white border-2 border-[#FF4444] text-[#FF4444] rounded-lg font-medium hover:bg-[#FF4444] hover:text-white transition-colors flex items-center justify-center gap-3"
              title="Registrar nova ocorrência"
            >
              <Phone className="w-5 h-5" />
              Registrar ocorrência
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
