import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { Phone } from "lucide-react";

// --- Definição de Tipos ---
type Occurrence = {
  id: number;
  address: string;
  title: string;
  status: "active" | "in_progress" | "completed";
};

type User = {
  name: string;
  role: string;
  photoUrl: string;
};

// --- Tipos para os Filtros ---
type FilterOption = {
  value: string;
  label: string;
};

type HomeFilterOptionsData = {
  periods: FilterOption[];
  types: FilterOption[];
  regions: FilterOption[];
  statuses: FilterOption[];
};

type HomeFilterState = {
  period: string;
  type: string;
  region: string;
  status: string;
};

const Home = () => {
  // --- Estados para os Dados ---
  const [recentOccurrences, setRecentOccurrences] = useState<Occurrence[]>([]);
  const [inProgressOccurrences, setInProgressOccurrences] = useState<Occurrence[]>([]);
  const [completedOccurrences, setCompletedOccurrences] = useState<Occurrence[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // --- Estado de Carregamento ---
  const [isLoading, setIsLoading] = useState(true);

  // Estado para os filtros selecionados
  const [filters, setFilters] = useState<HomeFilterState>({
    period: "",
    type: "",
    region: "",
    status: "",
  });

  // --- Estado para as opções dos filtros ---
  const [filterOptions, setFilterOptions] = useState<HomeFilterOptionsData>({
    periods: [],
    types: [],
    regions: [],
    statuses: [],
  });

  const navigate = useNavigate();

  // --- useEffect para carregar TODOS os dados ---
  useEffect(() => {
    // ----------------------------------------------------
    // LÓGICA DE BUSCA DE DADOS (SIMULAÇÃO DE BACKEND)
    // ----------------------------------------------------
    const fetchHomePageData = () => {
      // 1. Mock do Usuário
      const mockUser: User = {
        name: "Roberto Silva",
        role: "Despachante",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
      };

      // 2. Mock das Ocorrências
      const mockOccurrences: Occurrence[] = [
        { id: 1, address: "Rua do Sossego, 123 - Centro", title: "Incêndio em Edificação", status: "active" },
        { id: 2, address: "Av. Boa Viagem, 456 - Zona Sul", title: "Acidente Veicular", status: "in_progress" },
        { id: 3, address: "Rua da Aurora, 789 - Centro", title: "APH - Atendimento Pré-Hospitalar", status: "completed" },
        { id: 4, address: "Praça da República, 321 - Centro", title: "Incêndio Florestal", status: "active" },
        { id: 5, address: "Rua da Concórdia, 100 - Zona Norte", title: "Resgate em Altura", status: "in_progress" },
        { id: 6, address: "Av. Norte, 200 - Zona Norte", title: "Salvamento Aquático", status: "completed" },
        { id: 7, address: "Rua do Sol, 300 - Zona Oeste", title: "Incêndio em Veículo", status: "active" },
        { id: 8, address: "Av. Recife, 400 - Zona Sul", title: "APH - Atendimento Pré-Hospitalar", status: "completed" },
      ];

      // 3. Mock das Opções de Filtro
      const mockFilterOptions: HomeFilterOptionsData = {
        periods: [
          { value: "today", label: "Hoje" },
          { value: "week", label: "Última semana" },
          { value: "month", label: "Último mês" },
          { value: "quarter", label: "Últimos 3 meses" },
          { value: "year", label: "Último ano" },
        ],
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
        regions: [
          { value: "centro", label: "Centro" },
          { value: "zona_sul", label: "Zona Sul" },
          { value: "zona_norte", label: "Zona Norte" },
          { value: "zona_oeste", label: "Zona Oeste" },
          { value: "regiao_metropolitana", label: "Região Metropolitana" },
        ],
        statuses: [
          { value: "active", label: "Aberta" },
          { value: "in_progress", label: "Em andamento" },
          { value: "completed", label: "Concluída" },
          { value: "cancelled", label: "Cancelada" },
        ],
      };

      // 4. Simula o tempo de uma requisição de rede
      setTimeout(() => {
        // Define o usuário
        setUser(mockUser);

        // Filtra e define as ocorrências
        const recent = mockOccurrences.filter((o) => o.status === "active");
        const inProgress = mockOccurrences.filter((o) => o.status === "in_progress");
        const completed = mockOccurrences.filter((o) => o.status === "completed");
        setRecentOccurrences(recent);
        setInProgressOccurrences(inProgress);
        setCompletedOccurrences(completed);

        // Define as opções de filtro
        setFilterOptions(mockFilterOptions);

        // Finaliza o carregamento
        setIsLoading(false);
      }, 500);
    };

    fetchHomePageData();
  }, [navigate]);

  // --- Estado de carregamento ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">Carregando dados da home...</p>
      </div>
    );
  }

  // --- Funções ---
  const applyFilters = () => {
    console.log('Filtros aplicados:', filters);
    alert('Filtros aplicados! (Funcionalidade será implementada)');
  };

  const clearFilters = () => {
    setFilters({
      period: '',
      type: '',
      region: '',
      status: ''
    });
  };

  const latestMapped = [
    ...recentOccurrences,
    ...inProgressOccurrences,
    ...completedOccurrences,
  ].map((o) => {
    return {
      id: o.id,
      address: o.address,
      type: o.title,
      subtype: o.title,
      status: o.status === "active" ? "ABERTA" : "FINALIZADA",
    };
  });

  // --- Componente de Card (AGORA COMPLETO) ---
  const OccurrenceCard = ({ title, address, id, status }: Occurrence) => {
    const occurrenceState = {
      id,
      address,
      type: title,
      subtype: title,
      status: status === "active" ? "ABERTA" : "FINALIZADA",
      notes: "Sem observações adicionais no momento.",
      mediaUrl:
        "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop",
      lat: -8.04666,
      lng: -34.877,
    };

    return (
      <div className="bg-white rounded-[15px] p-5 mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${status === "active" ? "bg-[#FF0000]" : "bg-[#FF0000]" // Ambas as cores estão vermelhas, mantive como no seu original
                }`}
            />
            <div>
              <h3 className="text-[#000000] text-lg font-semibold mb-1">{title}</h3>
              <p className="text-[#666666] text-sm mb-2">{address}</p>
              <p className="text-[#FF0000] text-sm font-medium">#{id}</p>
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

  // --- Renderização Principal ---
  // (user! garante ao TypeScript que 'user' não é nulo aqui)
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-[60px] pt-[65px] pb-[30px] max-md:p-5 max-sm:p-[15px]">
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
                src={user!.photoUrl}
                alt={user!.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

        <div className="flex gap-8 max-lg:flex-col">
          <div className="flex-1">
            <h2 className="text-[#1650A7] text-2xl font-semibold mb-6">
              Lista de Ocorrências - Recentes
            </h2>

            <section className="mb-8">
              {recentOccurrences.map((o, index) => (
                <OccurrenceCard key={index} {...o} />
              ))}
            </section>

            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">Em andamento</h3>
            <section className="mb-8">
              {inProgressOccurrences.map((o, index) => (
                <OccurrenceCard key={index} {...o} />
              ))}
            </section>

            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">Concluídas</h3>
            <section>
              {completedOccurrences.map((o, index) => (
                <OccurrenceCard key={index} {...o} />
              ))}
            </section>
          </div>

          <aside className="w-[320px] max-lg:w-full">
            <div className="bg-white rounded-[15px] p-6 mb-6">
              <h3 className="text-[#000000] text-xl font-semibold mb-6">
                Filtrar Ocorrências
              </h3>

              {/* --- Filtros Dinâmicos --- */}
              <div className="space-y-4">
                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.period}
                  onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                >
                  <option value="">Período</option>
                  {filterOptions.periods.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">Tipo de ocorrência</option>
                  {filterOptions.types.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                >
                  <option value="">Região</option>
                  {filterOptions.regions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">Status</option>
                  {filterOptions.statuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={applyFilters}
                    className="flex-1 h-12 bg-[#1650A7] text-white rounded-lg font-medium hover:bg-[#0f3d7f] transition-colors"
                  >
                    Filtrar
                  </button>
                  <button
                    onClick={clearFilters}
                    className="flex-1 h-12 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Limpar
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
