import React, { useMemo, useState, useEffect } from "react"; // <-- Imports adicionados
import Sidebar from "@/components/dashboard/Sidebar";
import {
  ArrowLeft,
  Download,
  Info,
  Search,
  X,
  KeyRound,
  Edit3,
  Trash2,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // <-- Import adicionado

type LogItem = {
  id: string;
  timestamp: string; // ISO
  user: string;
  action: "Login" | "Logout" | "Editou" | "Excluiu" | "Criou";
  module: "Sistema" | "Ocorrências" | "Dashboard" | "Usuários";
  description: string;
  ip: string;
};

// (MOCK_LOGS foi removido daqui)

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const toCSV = (rows: LogItem[]) => {
  // ... (função igual à anterior)
  const header = ["Data/Hora", "Usuário", "Ação", "Módulo", "Descrição", "IP/Origem"];
  const body = rows.map((r) =>
    [
      fmt(r.timestamp),
      r.user,
      r.action,
      r.module,
      r.description.replace(/;/g, ",").replace(/"/g, '""'),
      r.ip,
    ]
      .map((v) => `"${String(v)}"`)
      .join(";")
  );
  return [header.join(";"), ...body].join("\n");
};

const AuditLogs: React.FC = () => {
  // --- NOVOS Estados para dados e carregamento ---
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- Estados dos Filtros (como antes) ---
  const [user, setUser] = useState<string>("Todos");
  const [action, setAction] = useState<string>("Todas");
  const [module, setModule] = useState<string>("Todos");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [q, setQ] = useState<string>("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [selected, setSelected] = useState<LogItem | null>(null);

  // --- NOVO: useEffect para buscar dados (Simulação) ---
  useEffect(() => {
    // ----------------------------------------------------
    // LÓGICA DE BUSCA DE LOGS (SIMULAÇÃO)
    // ----------------------------------------------------
    const fetchLogs = () => {
      // (Aqui você fará a chamada 'fetch' real para a API)
      try {
        // 1. Geração dos dados mock (movido para cá)
        const MOCK_LOGS: LogItem[] = Array.from({ length: 120 }).map((_, i) => {
          const base = new Date();
          base.setMinutes(base.getMinutes() - i * 7);
          const users = ["João Silva", "Maria Alves", "Roberto Silva", "Ana Beatriz"];
          const actions: LogItem["action"][] = ["Login", "Logout", "Editou", "Excluiu", "Criou"];
          const modules: LogItem["module"][] = ["Sistema", "Ocorrências", "Dashboard", "Usuários"];
          return {
            id: String(i + 1),
            timestamp: base.toISOString(),
            user: users[i % users.length],
            action: actions[i % actions.length],
            module: modules[i % modules.length],
            description:
              i % 5 === 0
                ? "Alterou status para 'Atendida'"
                : i % 3 === 0
                  ? "Incluiu novo registro"
                  : "Acesso ao painel operacional",
            ip: `10.0.${Math.floor(i / 10)}.${(i % 10) + 10}`,
          };
        });

        // 2. Simula o tempo de uma requisição de rede
        setTimeout(() => {
          setLogs(MOCK_LOGS);
          setIsLoading(false);
        }, 700); // 700ms de delay
      } catch (err) {
        console.error(err);
        setError("Falha ao carregar os logs de auditoria.");
        setIsLoading(false);
      }
    };
    // ----------------------------------------------------

    fetchLogs();
  }, [navigate]); // Dependência adicionada

  // --- useMemo ATUALIZADO (agora depende do estado 'logs') ---
  const users = useMemo(() => ["Todos", ...Array.from(new Set(logs.map((l) => l.user)))], [logs]);
  const actions = ["Todas", "Login", "Logout", "Editou", "Excluiu", "Criou"];
  const modules = ["Todos", "Sistema", "Ocorrências", "Dashboard", "Usuários"];

  const filtered = useMemo(() => {
    let rows = [...logs]; // <-- USA O ESTADO 'logs'

    if (user !== "Todos") rows = rows.filter((r) => r.user === user);
    if (action !== "Todas") rows = rows.filter((r) => r.action === action);
    if (module !== "Todos") rows = rows.filter((r) => r.module === module);
    if (dateFrom) rows = rows.filter((r) => new Date(r.timestamp) >= new Date(dateFrom));
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      rows = rows.filter((r) => new Date(r.timestamp) <= end);
    }
    if (q.trim()) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.user.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s) ||
          r.module.toLowerCase().includes(s) ||
          r.ip.includes(s)
      );
    }
    return rows;
  }, [user, action, module, dateFrom, dateTo, q, logs]); // <-- 'logs' ADICIONADO

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const metrics = useMemo(() => {
    const logins = filtered.filter((r) => r.action === "Login").length;
    const edits = filtered.filter((r) => r.action === "Editou").length;
    const deletes = filtered.filter((r) => r.action === "Excluiu").length;
    const activeUsers = new Set(
      filtered
        .filter((r) => new Date(r.timestamp).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24)
        .map((r) => r.user)
    ).size;
    return { logins, edits, deletes, activeUsers };
  }, [filtered]);

  const exportCSV = () => {
    // ... (função igual, já depende de 'filtered')
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- NOVOS Blocos de Carregamento e Erro ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex bg-[#F9F9F9] max-md:flex-col overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 pt-8 pb-8 flex items-center justify-center">
          <p className="text-[#1650A7] text-xl">
            Carregando logs de auditoria...
          </p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex bg-[#F9F9F9] max-md:flex-col overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 pt-8 pb-8 flex flex-col items-center justify-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="h-10 px-6 rounded-lg bg-[#1650A7] text-white font-medium"
          >
            Voltar para Home
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-[#F9F9F9] max-md:flex-col overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-6 lg:px-12 pt-8 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-black/5"
              title="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-[#1650A7]" />
            </Link>
            <h1 className="text-2xl font-semibold text-[#0b2561]">Auditoria e Logs</h1>
          </div>
          <button
            onClick={exportCSV}
            className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
            title="Exportar CSV"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <select value={user} onChange={(e) => { setUser(e.target.value); setPage(1); }} className="h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm">
              {users.map((u) => (<option key={u}>{u}</option>))}
            </select>
            {/* ... (resto dos filtros como antes) ... */}
            <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm">
              {actions.map((a) => (<option key={a}>{a}</option>))}
            </select>
            <select value={module} onChange={(e) => { setModule(e.target.value); setPage(1); }} className="h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm">
              {modules.map((m) => (<option key={m}>{m}</option>))}
            </select>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm" />
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                className="h-11 pl-9 pr-3 w-full bg-white border border-gray-300 rounded-lg text-sm"
                placeholder="Buscar"
              />
            </div>
          </div>
        </div>

        {/* Métricas */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Logins realizados</p>
              <p className="text-2xl font-bold text-[#0b2561] mt-1">{metrics.logins}</p>
            </div>
            <KeyRound className="w-8 h-8 text-[#1650A7]" />
          </div>
          {/* ... (resto das métricas como antes) ... */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Edições feitas</p>
              <p className="text-2xl font-bold text-[#0b2561] mt-1">{metrics.edits}</p>
            </div>
            <Edit3 className="w-8 h-8 text-[#1650A7]" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Exclusões</p>
              <p className="text-2xl font-bold text-[#0b2561] mt-1">{metrics.deletes}</p>
            </div>
            <Trash2 className="w-8 h-8 text-[#1650A7]" />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Usuários ativos (24h)</p>
              <p className="text-2xl font-bold text-[#0b2561] mt-1">{metrics.activeUsers}</p>
            </div>
            <Users className="w-8 h-8 text-[#1650A7]" />
          </div>
        </section>

        {/* Tabela */}
        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr className="text-sm">
                  {/* ... (headers como antes) ... */}
                  <th className="px-4 py-3 font-semibold">Data/Hora</th>
                  <th className="px-4 py-3 font-semibold">Usuário</th>
                  <th className="px-4 py-3 font-semibold">Ação</th>
                  <th className="px-4 py-3 font-semibold">Módulo</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 font-semibold">IP/Origem</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((r) => (
                  <tr key={r.id} className="border-t text-sm hover:bg-gray-50">
                    {/* ... (células como antes) ... */}
                    <td className="px-4 py-3 whitespace-nowrap">{fmt(r.timestamp)}</td>
                    <td className="px-4 py-3">{r.user}</td>
                    <td className="px-4 py-3">{r.action}</td>
                    <td className="px-4 py-3">{r.module}</td>
                    <td className="px-4 py-3">{r.description}</td>
                    <td className="px-4 py-3">{r.ip}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(r)}
                        className="inline-flex items-center gap-1 h-8 px-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                        title="Ver detalhes"
                      >
                        <Info className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                      Nenhum registro encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
            <span>
              Mostrando {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filtered.length)} de {filtered.length} registros
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-9 px-3 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Anterior
              </button>
              <span>
                pág. <b>{page}</b>/<b>{totalPages}</b>
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-9 px-3 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </section>

        <p className="mt-3 text-xs text-gray-500">
          Última atualização: {fmt(new Date().toISOString())}
        </p>
      </main>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          {/* ... (conteúdo do modal como antes) ... */}
          <div
            className="bg-white w-[90%] max-w-xl rounded-2xl shadow-xl border border-gray-200 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-[#0b2561] mb-4">Detalhes do Log</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Data/Hora</p>
                <p className="font-medium">{fmt(selected.timestamp)}</p>
              </div>
              <div>
                <p className="text-gray-500">Usuário</p>
                <p className="font-medium">{selected.user}</p>
              </div>
              <div>
                <p className="text-gray-500">Ação</p>
                <p className="font-medium">{selected.action}</p>
              </div>
              <div>
                <p className="text-gray-500">Módulo</p>
                <p className="font-medium">{selected.module}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Descrição</p>
                <p className="font-medium">{selected.description}</p>
              </div>
              <div>
                <p className="text-gray-500">IP/Origem</p>
                <p className="font-medium">{selected.ip}</p>
              </div>
              <div>
                <p className="text-gray-500">ID do registro</p>
                <p className="font-medium">#{selected.id}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="h-10 px-4 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const csv = toCSV([selected]);
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `log_${selected.id}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="h-10 px-4 rounded-lg bg-[#1650A7] text-white hover:bg-[#0f3d7f]"
              >
                Exportar este
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
