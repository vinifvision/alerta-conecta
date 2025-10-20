import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

type Occurrence = {
  id: number;
  address: string;
  type: string;
  subtype?: string;
  status: string;
  notes?: string;
  created_at?: string;
  mediaUrl?: string;
  lat?: number;
  lng?: number;
};

type LocationState = {
  occurrence?: Occurrence;
  latest?: Occurrence[];
};

export default function OccurrenceDetails() {
  const { id } = useParams();
  const { state } = useLocation() as { state: LocationState | null };
  const navigate = useNavigate(); // <-- Adicionado

  // --- NOVOS ESTADOS ---
  // Começa com os dados da Home (se existirem), senão nulo
  const [occurrence, setOccurrence] = useState<Occurrence | null>(state?.occurrence || null);
  const [latest, setLatest] = useState<Occurrence[]>(state?.latest || []);

  // Só carrega se os dados NÃO vieram da Home
  const [isLoading, setIsLoading] = useState(!state?.occurrence);
  const [error, setError] = useState<string | null>(null);


  // --- NOVO: useEffect para Proteção e Busca (lógica 'onLoad' + 'fetch') ---
  useEffect(() => {
    // 1. Proteção de Rota (lógica do seu amigo)
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/"); // Volta para o login
      return;
    }

    // 2. Verifica se os dados já vieram da Home
    if (state?.occurrence) {
      // Dados já estão no estado, não precisa carregar
      return;
    }

    // 3. Se não vieram (F5), busca os dados (SIMULAÇÃO)
    // ----------------------------------------------------
    // LÓGICA DE BUSCA DA OCORRÊNCIA PELO ID (SIMULAÇÃO)
    //
    // OBS: Substitua isso pelo seu 'fetch' real
    // ex: fetch(`http://localhost:8080/api/occurrences/${id}`)
    // ----------------------------------------------------
    const fetchOccurrenceById = () => {
      console.warn(`Simulando busca (F5) pela ocorrência ID: ${id}`);

      // Mock de uma ocorrência (já que não temos o backend)
      const mockOccurrence: Occurrence = {
        id: Number(id),
        address: "Rua Fictícia (Carregada via F5), 123",
        type: "Tipo (Carregado via F5)",
        subtype: "Subtipo (Carregado via F5)",
        status: "active",
        notes: "Estes dados foram carregados pela 'API' simulada porque você atualizou a página (F5).",
        created_at: new Date().toISOString(),
        // --- Imagem "vinda do backend" ---
        mediaUrl: "https://images.unsplash.com/photo-1554483562-3c457d84572d?q=80&w=1200&auto=format&fit=crop",
        lat: -8.05123,
        lng: -34.88567
      };

      // Mock de 'últimas ocorrências' (você também precisará buscar isso)
      const mockLatest: Occurrence[] = [
        { id: 99, address: "Rua Mock 1 (F5)", type: "Outro Tipo 1", status: "active", id: 99, title: "Mock 1" },
        { id: 98, address: "Rua Mock 2 (F5)", type: "Outro Tipo 2", status: "completed", id: 98, title: "Mock 2" },
      ] as any; // Usando 'as any' para simplificar o mock

      // Simula o tempo de rede
      setTimeout(() => {
        setOccurrence(mockOccurrence);
        setLatest(mockLatest); // Define também as últimas
        setIsLoading(false);
      }, 700);
    };
    // ----------------------------------------------------

    fetchOccurrenceById();

  }, [id, state?.occurrence, navigate]); // Dependências


  // --- NOVOS: Estados de Carregamento e Erro ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">
          Carregando dados da ocorrência #{id}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F9F9F9] p-5">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button
          onClick={() => navigate("/home")}
          className="h-10 px-6 rounded-lg bg-[#1650A7] text-white font-medium"
        >
          Voltar para Home
        </button>
      </div>
    );
  }

  // --- ATUALIZADO: Checagem de 'occurrence' (do estado) ---
  if (!occurrence) {
    return (
      <div className="p-6">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          Não foi possível carregar os dados da ocorrência #{id}.
        </p>
      </div>
    );
  }

  // --- ATUALIZADO: Variáveis usam 'occurrence' (do estado) ---
  const lat = occurrence.lat ?? -8.04666;
  const lng = occurrence.lng ?? -34.8770;

  // ATUALIZADO: Imagem vem do estado (sem fallback para unsplash)
  const mediaUrl = occurrence.mediaUrl;

  const baixarAnexo = () => {
    if (!mediaUrl) return;
    const a = document.createElement("a");
    a.href = mediaUrl;
    a.download = `ocorrencia_${occurrence.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const baixarRelatorio = () => window.print();

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* coluna principal */}
        <div>
          {/* header (Link para /home) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/home" className="inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-muted">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">Ocorrência #{occurrence.id}</h1>
                <p className="text-sm text-muted-foreground">{occurrence.address}</p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 rounded bg-secondary uppercase">{occurrence.status}</span>
          </div>

          <div className="my-4 h-px bg-border" />

          <section className="space-y-3">
            <h2 className="text-base font-medium">Detalhes</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {occurrence.notes || "Sem observações adicionais no momento."}
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-base font-medium">Mídias</h2>
            <div className="overflow-hidden rounded-lg border">
              {/* ATUALIZADO: Checa se mediaUrl existe */}
              {mediaUrl ? (
                <img
                  src={mediaUrl}
                  alt={`Mídia da ocorrência ${occurrence.id}`}
                  className="w-full aspect-[16/9] object-cover"
                />
              ) : (
                <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Nenhuma mídia disponível</p>
                </div>
              )}
            </div>
            <button
              onClick={baixarAnexo}
              disabled={!mediaUrl}
              className="text-sm text-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={16} /> Baixar anexo
            </button>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-base font-medium">Localização</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>{occurrence.address}</span>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <iframe
                title="Mapa"
                className="w-full h-[280px]"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng +
                  0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
                style={{ border: 0 }}
              />
            </div>
          </section>

          <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Tipo de ocorrência</p>
              <p className="font-medium mt-1">
                {occurrence.type}
                {occurrence.subtype ? ` • ${occurrence.subtype}` : ""}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Envolvidos</p>
              <p className="font-medium mt-1">2 pessoas (exemplo)</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Data e hora</p>
              <p className="font-medium mt-1">
                {new Date(occurrence.created_at ?? new Date().toISOString()).toLocaleDateString()} •{" "}
                {new Date(occurrence.created_at ?? new Date().toISOString()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </section>
        </div>

        {/* ATUALIZADO: Usa o estado 'latest' */}
        {latest.length > 0 && (
          <aside className="space-y-4">
            <div className="p-4 rounded-lg border">
              <h3 className="text-sm font-medium mb-3">Últimas ocorrências</h3>
              <ul className="space-y-3">
                {latest.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link
                      to={`/occurrences/${o.id}`}
                      state={{ occurrence: o, latest: latest }} // <-- Passa o estado 'latest'
                      className="flex items-start gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <div className="h-10 w-10 rounded bg-muted shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">{o.subtype || o.type}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{o.address}</p>
                        <p className="text-[11px] text-primary mt-1">#{o.id}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                onClick={baixarRelatorio}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md h-9"
              >
                <FileText size={16} /> Baixar Relatório
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}