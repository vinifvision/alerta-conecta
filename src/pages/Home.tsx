import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { Phone } from "lucide-react";

// --- Definição de Tipos ---
type Occurrence = {
  id: number;
  address: string;
  title: string;
  status: "active" | "in_progress" | "completed";
  region: string;
  type: string;
  timestamp: string;
};

type User = {
  name: string;
  role: string;
  photoUrl: string;
};

type FilterOption = {
  value: string;
  label: string;
};

type HomeFilterOptionsData = {
  periods: FilterOption[];
  types: FilterOption[];
  regions: FilterOption[];
  // statuses: FilterOption[]; // <--- REMOVIDO
};

type HomeFilterState = {
  period: string;
  type: string;
  region: string;
  // status: string; // <--- REMOVIDO
};

const Home = () => {
  // --- Estados para os Dados ---
  const [allOccurrences, setAllOccurrences] = useState<Occurrence[]>([]); // Lista Mestra
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para os filtros selecionados
  const [filters, setFilters] = useState<HomeFilterState>({
    period: "",
    type: "",
    region: "",
    // status: "", // <--- REMOVIDO
  });

  // --- Estado para as opções dos filtros ---
  const [filterOptions, setFilterOptions] = useState<HomeFilterOptionsData>({
    periods: [],
    types: [],
    regions: [],
    // statuses: [], // <--- REMOVIDO
  });

  const navigate = useNavigate();

  // --- useEffect para carregar TODOS os dados ---
  useEffect(() => {
    // 1. Proteção de Rota
    const authToken = localStorage.getItem("authToken");
    const userDataString = localStorage.getItem("usuario");

    if (!authToken || !userDataString) {
      navigate("/");
      return;
    }

    // 2. Carregar Dados da Página
    const fetchHomePageData = () => {

      const userData = JSON.parse(userDataString);
      const fetchedUser: User = {
        name: userData.name,
        role: userData.role,
        photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
      };

      // 3. Mock das Ocorrências (simulação)
      const now = new Date();
      const mockOccurrences: Occurrence[] = [
        { id: 1, address: "Rua do Sossego, 123 - Centro", title: "Incêndio em Edificação", status: "active", region: "centro", type: "incendio", timestamp: new Date().toISOString() },
        { id: 2, address: "Av. Boa Viagem, 456 - Zona Sul", title: "Acidente Veicular", status: "in_progress", region: "zona_sul", type: "acidente", timestamp: new Date(now.getTime() - 86400000 * 2).toISOString() },
        { id: 3, address: "Rua da Aurora, 789 - Centro", title: "APH - Atendimento Pré-Hospitalar", status: "completed", region: "centro", type: "aph", timestamp: new Date(now.getTime() - 86400000 * 8).toISOString() },
        { id: 4, address: "Praça da República, 321 - Centro", title: "Incêndio Florestal", status: "active", region: "centro", type: "incendio_florestal", timestamp: new Date(now.getTime() - 3600000).toISOString() },
        { id: 5, address: "Rua da Concórdia, 100 - Zona Norte", title: "Resgate em Altura", status: "in_progress", region: "zona_norte", type: "resgate", timestamp: new Date(now.getTime() - 86400000 * 3).toISOString() },
        { id: 6, address: "Av. Norte, 200 - Zona Norte", title: "Salvamento Aquático", status: "completed", region: "zona_norte", type: "salvamento", timestamp: new Date(now.getTime() - 86400000 * 30).toISOString() },
        { id: 7, address: "Rua do Sol, 300 - Zona Oeste", title: "Incêndio em Veículo", status: "active", region: "zona_oeste", type: "incendio_veiculo", timestamp: new Date(now.getTime() - 7200000).toISOString() },
        { id: 8, address: "Av. Recife, 400 - Zona Sul", title: "APH - Atendimento Pré-Hospitalar", status: "completed", region: "zona_sul", type: "aph", timestamp: new Date(now.getTime() - 86400000 * 40).toISOString() },
      ];

      // 4. Mock das Opções de Filtro (simulação)
      const mockFilterOptions: HomeFilterOptionsData = {
        periods: [
          { value: "today", label: "Hoje (Últimas 24h)" },
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
        // statuses: [], // <--- REMOVIDO
      };

      // 5. Simula o tempo de uma requisição de rede
      setTimeout(() => {
        setUser(fetchedUser);
        setAllOccurrences(mockOccurrences);
        setFilterOptions(mockFilterOptions);
        setIsLoading(false);
      }, 500);
    };

    fetchHomePageData();
  }, [navigate]);

  // --- Lógica de Filtro com useMemo (CORRIGIDO) ---
  const filteredOccurrences = useMemo(() => {
    let rows = [...allOccurrences];

    // 1. Filtro de Período
    if (filters.period) {
      const now = new Date().getTime();
      let daysToSubtract = 0;
      if (filters.period === 'today') daysToSubtract = 1;
      if (filters.period === 'week') daysToSubtract = 7;
      if (filters.period === 'month') daysToSubtract = 30;
      if (filters.period === 'quarter') daysToSubtract = 90;
      if (filters.period === 'year') daysToSubtract = 365;

      if (daysToSubtract > 0) {
        const cutoff = now - daysToSubtract * 86400000;
        rows = rows.filter(o => new Date(o.timestamp).getTime() >= cutoff);
      }
    }
    // 2. Filtro de Tipo
    if (filters.type) {
      rows = rows.filter(o => o.type === filters.type);
    }
    // 3. Filtro de Região
    if (filters.region) {
      rows = rows.filter(o => o.region === filters.region);
    }

    // 4. FILTRO DE STATUS FOI REMOVIDO DAQUI (ESSA ERA A CAUSA DO BUG)
    // if (filters.status) { ... } 

    return rows;
  }, [allOccurrences, filters]); // Depende da lista mestra E dos filtros

  // --- Listas de exibição (Agora filtram a lista 'filteredOccurrences' por status) ---
  const recentOccurrences = useMemo(() =>
    filteredOccurrences.filter((o) => o.status === "active"),
    [filteredOccurrences]
  );

  const inProgressOccurrences = useMemo(() =>
    filteredOccurrences.filter((o) => o.status === "in_progress"),
    [filteredOccurrences]
  );

  const completedOccurrences = useMemo(() =>
    filteredOccurrences.filter((o) => o.status === "completed"),
    [filteredOccurrences]
  );

  // --- Estado de carregamento ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">Carregando dados da home...</p>
      </div>
    );
  }

  // --- Handlers dos Filtros ---
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    filterName: keyof HomeFilterState
  ) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: e.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      period: '',
      type: '',
      region: '',
      // status: '' // <--- REMOVIDO
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

  // --- Componente de Card ---
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
      lng: -34.877, // Corrigi o meu typo anterior
    };

    return (
      <div className="bg-white rounded-[15px] p-5 mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div
              className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${status === "active" ? "bg-[#FF0000]" : "bg-[#FF0000]"
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
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-[60px] pt-[65px] pb-[30px] max-md:p-5 max-sm:p-[15px]">
        {/* (Header não muda) */}
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
            {/* (Listas de Ocorrências não mudam) */}
            <h2 className="text-[#1650A7] text-2xl font-semibold mb-6">
              Lista de Ocorrências - Recentes
            </h2>
            <section className="mb-8">
              {recentOccurrences.length > 0 ? (
                recentOccurrences.map((o, index) => <OccurrenceCard key={index} {...o} />)
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma ocorrência recente encontrada com os filtros atuais.</p>
              )}
            </section>
            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">Em andamento</h3>
            <section className="mb-8">
              {inProgressOccurrences.length > 0 ? (
                inProgressOccurrences.map((o, index) => <OccurrenceCard key={index} {...o} />)
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma ocorrência em andamento encontrada com os filtros atuais.</p>
              )}
            </section>
            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">Concluídas</h3>
            <section>
              {completedOccurrences.length > 0 ? (
                completedOccurrences.map((o, index) => <OccurrenceCard key={index} {...o} />)
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma ocorrência concluída encontrada com os filtros atuais.</p>
              )}
            </section>
          </div>

          <aside className="w-[320px] max-lg:w-full">
            <div className="bg-white rounded-[15px] p-6 mb-6">
              <h3 className="text-[#000000] text-xl font-semibold mb-6">
                Filtrar Ocorrências
              </h3>

              {/* --- Filtros (Status removido) --- */}
              <div className="space-y-4">
                <select
                  className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base"
                  value={filters.period}
                  onChange={(e) => handleFilterChange(e, "period")}
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
                  onChange={(e) => handleFilterChange(e, "type")}
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
                  onChange={(e) => handleFilterChange(e, "region")}
                >
                  <option value="">Região</option>
                  {filterOptions.regions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* --- Select de Status foi REMOVIDO --- */}

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
