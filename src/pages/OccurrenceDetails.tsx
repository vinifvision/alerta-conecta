import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, MapPin } from "lucide-react";

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
  const occ: Occurrence | undefined = state?.occurrence;

  if (!occ) {
    return (
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          Não encontrei dados da ocorrência #{id}. Abra esta página a partir da lista de ocorrências.
        </p>
      </div>
    );
  }

  const lat = occ.lat ?? -8.04666;
  const lng = occ.lng ?? -34.8770;
  const mediaUrl =
    occ.mediaUrl ??
    "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop";

  const baixarAnexo = () => {
    const a = document.createElement("a");
    a.href = mediaUrl;
    a.download = `ocorrencia_${occ.id}.jpg`;
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
          {/* header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-muted">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">Ocorrência #{occ.id}</h1>
                <p className="text-sm text-muted-foreground">{occ.address}</p>
              </div>
            </div>
            <span className="text-[11px] px-2 py-1 rounded bg-secondary uppercase">{occ.status}</span>
          </div>

          <div className="my-4 h-px bg-border" />

          <section className="space-y-3">
            <h2 className="text-base font-medium">Detalhes</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {occ.notes || "Sem observações adicionais no momento."}
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-base font-medium">Mídias</h2>
            <div className="overflow-hidden rounded-lg border">
              <img
                src={mediaUrl}
                alt={`Mídia da ocorrência ${occ.id}`}
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
            <button onClick={baixarAnexo} className="text-sm text-primary inline-flex items-center gap-2">
              <Download size={16} /> Baixar anexo
            </button>
          </section>

          <section className="mt-6 space-y-3">
            <h2 className="text-base font-medium">Localização</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>{occ.address}</span>
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
                {occ.type}
                {occ.subtype ? ` • ${occ.subtype}` : ""}
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Envolvidos</p>
              <p className="font-medium mt-1">2 pessoas (exemplo)</p>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-xs text-muted-foreground">Data e hora</p>
              <p className="font-medium mt-1">
                {new Date(occ.created_at ?? new Date().toISOString()).toLocaleDateString()} •{" "}
                {new Date(occ.created_at ?? new Date().toISOString()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </section>
        </div>

        {state?.latest && (
          <aside className="space-y-4">
            <div className="p-4 rounded-lg border">
              <h3 className="text-sm font-medium mb-3">Últimas ocorrências</h3>
              <ul className="space-y-3">
                {state.latest.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link
                      to={`/occurrences/${o.id}`}
                      state={{ occurrence: o, latest: state.latest }}
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
