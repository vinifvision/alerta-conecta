// src/pages/OccurrenceDetails.tsx (Corrigido para receber state da Home)

import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, MapPin, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

// Mapeamento dos tipos de ocorrência (mesmo da Home)
const OCCURRENCE_TYPES: Record<number, string> = {
  1: "Incêndio",
  2: "Resgate",
  3: "APH",
  4: "Prevenção",
  5: "Ocorrência Ambiental",
  6: "Ocorrência Administrativa",
  7: "Desastre Natural",
};

// 1. TIPO ATUALIZADO (para bater com o objeto 'state.occurrence' enviado pela Home)
type Occurrence = {
  // Campos reais da API mapeados para nomes que Details usava
  id_ocorrencia: number;
  titulo: string | null; // Pode ser null
  data_hora: string;
  envolvidos: string | null;
  detalhes: string | null;
  status_atual: "Em_andamento" | "Encerrada" | "Cancelada"; // Status real
  prioridade: "Baixa" | "Media" | "Alta";
  id_tipo_ocorrencia: number; // ID do tipo
  nome_tipo: string; // Nome do tipo
  descricao_tipo: string; // Descrição do tipo

  // Campos duplicados/mapeados que Details também usa internamente
  id: number;
  title: string; // Vem do mapeamento (titulo ou fallback)
  subtype?: string; // Vem do mapeamento (titulo ou fallback)
  address: string; // Vem do mapeamento (placeholder)
  type: string; // Vem do mapeamento (placeholder)
  status: string; // Status amigável (EM ANDAMENTO, etc.)

  // Campos Opcionais que Details usa (ainda não vêm da API)
  lat?: number;
  lng?: number;
};

// (LocationState - sem alteração)
type LocationState = {
  occurrence?: Occurrence;
  latest?: Occurrence[]; // A lista 'latest' agora também contém objetos Occurrence mapeados
};

const API_URL = import.meta.env.VITE_API_URL || "https://alerta-conecta-backend-production.up.railway.app/";

export default function OccurrenceDetails() {
  const { id } = useParams(); // Pega o ID da URL (que é o 'id' simples)
  const { state } = useLocation() as { state: LocationState | null };
  const navigate = useNavigate();

  // Usa o objeto 'occurrence' mapeado que veio do state da Home
  const [occurrence, setOccurrence] = useState<Occurrence | null>(state?.occurrence || null);
  // Usa a lista 'latest' mapeada que veio do state da Home
  const [latest, setLatest] = useState<Occurrence[]>(state?.latest || []);

  // Só carrega se os dados NÃO vieram da Home (F5)
  const [isLoading, setIsLoading] = useState(!state?.occurrence);
  const [error, setError] = useState<string | null>(null);

  // --- useEffect para Busca (F5) ---
  useEffect(() => {
    // Se os dados vieram da Home, não faz nada
    if (state?.occurrence) {
      console.log("OccurrenceDetails: Dados recebidos via state, sem fetch.");
      return;
    }

    // Se não vieram (F5), busca os dados da API
    const fetchOccurrenceById = async () => {
      console.warn(`OccurrenceDetails: F5 detectado. Buscando API para ID: ${id}`);
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");

      try {
        // Busca os dados da ocorrência específica E as últimas
        // ATENÇÃO: Verifique se esses endpoints existem e retornam o esperado
        const [occurrenceRes, latestRes] = await Promise.all([
          // Assumindo que este endpoint retorna um objeto igual ao de /getall
          fetch(`${API_URL}/occurrence/${id}`, { // Endpoint precisa existir
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Assumindo que este endpoint retorna um array igual ao de /getall
          fetch(`${API_URL}/occurrence/latest`, { // Endpoint precisa existir
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!occurrenceRes.ok) {
          throw new Error(`Não foi possível encontrar a ocorrência #${id}.`);
        }
        if (!latestRes.ok) {
          console.warn("Falha ao buscar últimas ocorrências (endpoint /latest pode não existir).");
          // throw new Error("Não foi possível carregar as últimas ocorrências."); // Não quebra se 'latest' falhar
        }

        // 2. MAPEAMENTO CORRIGIDO (quando F5)
        // Assume que a API /occurrence/${id} retorna o mesmo formato que /getall
        const rawOccurrenceData = await occurrenceRes.json();
        const rawLatestData = latestRes.ok ? await latestRes.json() : [];

        // Mapeia os dados crus para o formato que o componente espera (igual ao latestMapped da Home)
        const mapApiData = (o: Record<string, unknown>): Occurrence => {
          const typeName = OCCURRENCE_TYPES[o.type as number] || `Tipo ${o.type}`;

          return {
            id_ocorrencia: o.id as number,
            titulo: (o.titule as string) || `Ocorrência #${o.id}`,
            data_hora: o.date as string,
            envolvidos: o.victims as string | null,
            detalhes: o.details as string | null,
            status_atual: o.status as "Em_andamento" | "Encerrada" | "Cancelada",
            prioridade: o.priority as "Baixa" | "Media" | "Alta",
            id_tipo_ocorrencia: o.type as number,
            nome_tipo: typeName,
            descricao_tipo: (o.descricao_tipo as string) || "Sem descrição",
            id: o.id as number,
            title: (o.titule as string) || `Ocorrência #${o.id}`,
            subtype: (o.titule as string) || `Ocorrência #${o.id}`,
            address: `Tipo: ${typeName}`, // Placeholder melhorado
            type: typeName, // Usa o nome correto do tipo
            status: o.status === "Em_andamento" ? "EM ANDAMENTO" : o.status === "Encerrada" ? "FINALIZADA" : "CANCELADA",
            // lat/lng precisam vir da API
          };
        };

        const occurrenceData: Occurrence = mapApiData(rawOccurrenceData);
        const latestMappedData: Occurrence[] = (rawLatestData || []).map(mapApiData);

        setOccurrence(occurrenceData);
        setLatest(latestMappedData);

      } catch (err: unknown) {
        console.error("Erro ao buscar dados da ocorrência (F5):", err);
        setError((err as Error).message || "Erro desconhecido ao buscar dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccurrenceById();

  }, [id, state?.occurrence, navigate]); // Dependências


  // --- Estados de Carregamento e Erro (sem alteração) ---
  if (isLoading) { /* Loading */ }
  if (error) { /* Erro */ }
  if (!occurrence) { /* Não encontrado */ }

  // --- Variáveis de Exibição (sem alteração) ---
  const lat = occurrence.lat ?? -8.04666;
  const lng = occurrence.lng ?? -34.8770;
  const baixarRelatorio = () => window.print();

  // --- JSX CORRIGIDO (usa nomes do objeto mapeado) ---
  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* coluna principal */}
        <div>
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/home" className="inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-muted">
                <ArrowLeft size={18} />
              </Link>
              <div>
                {/* Usa id_ocorrencia */}
                <h1 className="text-xl sm:text-2xl font-semibold">Ocorrência #{occurrence.id_ocorrencia}</h1>
                {/* Usa address (placeholder) */}
                <p className="text-sm text-muted-foreground">{occurrence.address}</p>
              </div>
            </div>
            {/* Usa status (mapeado) */}
            <span className="text-[11px] px-2 py-1 rounded bg-secondary uppercase">{occurrence.status}</span>
          </div>

          <div className="my-4 h-px bg-border" />

          <section className="space-y-3">
            <h2 className="text-base font-medium">Detalhes</h2>
            {/* Usa detalhes */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {occurrence.detalhes || "Sem observações adicionais no momento."}
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-base font-medium">Localização</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              {/* Usa address (placeholder) */}
              <span>{occurrence.address}</span>
            </div>
            <div className="rounded-lg overflow-hidden border">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31603.91221441986!2d-34.8899925!3d-8.05149525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1761140638731!5m2!1spt-BR!2sbr=${lat},${lng}&zoom=15`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          <section className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Tipo de ocorrência</p>
              {/* Usa o mapeamento correto */}
              <p className="font-medium mt-1">
                {(() => {
                  const typeId = Number(occurrence.id_tipo_ocorrencia);
                  return OCCURRENCE_TYPES[typeId] || `Tipo ${typeId}`;
                })()}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Envolvidos</p>
              {/* Usa envolvidos */}
              <p className="font-medium mt-1">{occurrence.envolvidos || "Não informado"}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Prioridade</p>
              {/* Usa prioridade */}
              <p className="font-medium mt-1">{occurrence.prioridade}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Data e hora</p>
              {/* Usa data_hora com formatação correta */}
              <p className="font-medium mt-1">
                {(() => {
                  try {
                    const date = new Date(occurrence.data_hora);
                    if (isNaN(date.getTime())) {
                      return occurrence.data_hora; // Se não conseguir fazer parse, mostra o valor original
                    }
                    return date.toLocaleDateString('pt-BR') + ' • ' +
                      date.toLocaleTimeString('pt-BR', { hour: "2-digit", minute: "2-digit" });
                  } catch (error) {
                    return occurrence.data_hora; // Fallback para o valor original
                  }
                })()}
              </p>
            </div>
          </section>
        </div>

        {/* --- Sidebar de Últimas Ocorrências (CORRIGIDO) --- */}
        {latest.length > 0 && (
          <aside className="space-y-4">
            <div className="p-4 rounded-lg border">
              <h3 className="text-sm font-medium mb-3">Últimas ocorrências</h3>
              <ul className="space-y-3">
                {latest.slice(0, 5).map((o) => (
                  // Usa id_ocorrencia como key e no link
                  <li key={o.id_ocorrencia}>
                    <Link
                      to={`/occurrences/${o.id_ocorrencia}`}
                      state={{ occurrence: o, latest: latest }} // Passa o objeto 'o' mapeado
                      className="flex items-start gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <div className="h-10 w-10 rounded bg-muted shrink-0" />
                      <div className="flex-1">
                        {/* Usa nome_tipo e address (placeholder) */}
                        <p className="text-sm font-medium leading-tight">{o.nome_tipo}</p>
                        <p className="text-xs text-muted-foreground leading-tight">{o.address}</p>
                        <p className="text-[11px] text-primary mt-1">#{o.id_ocorrencia}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={baixarRelatorio} /* ... */ >
                <FileText size={16} /> Baixar Relatório
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
