import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// --- Tipos (Mantidos) ---
type FilterOption = { value: string | number; label: string; };
type SubTypeMap = { [key: string]: FilterOption[]; };

type FormOptionsData = {
  types: FilterOption[];
  subTypes: SubTypeMap;
  priorities: FilterOption[];
};

type FormData = {
  tipo: string;
  subtipo: string;
  date: string;
  hora: string;
  envolvidos: string;
  prioridade: string;
  detalhes: string;
};

// const API_URL = import.meta.env.VITE_API_URL || "";
const REGISTER_OCCURRENCE_URL = `${API_URL}/occurrence/registry`;

const MOCK_FORM_OPTIONS: FormOptionsData = {
  types: [
    { value: "1", label: "Incêndio" },
    { value: "2", label: "Resgate" },
    { value: "3", label: "APH" },
    { value: "4", label: "Prevenção" },
    { value: "5", label: "Ocorrência Ambiental" },
    { value: "6", label: "Ocorrência Administrativa" },
    { value: "7", label: "Desastre Natural" },
  ],

  subTypes: {
    "1": [
      { value: "101", label: "Incêndio em Edificação Residencial" },
      { value: "102", label: "Incêndio em Edificação Comercial" },
      { value: "103", label: "Incêndio Florestal" },
      { value: "104", label: "Incêndio em Veículo" },
      { value: "105", label: "Incêndio Industrial" },
      { value: "106", label: "Princípio de Incêndio" },
      { value: "107", label: "Incêndio em Área Urbana / Lixo / Terreno Baldio" },
    ],

    "2": [
      { value: "201", label: "Resgate em Altura" },
      { value: "202", label: "Resgate Veicular" },
      { value: "203", label: "Resgate Aquático" },
      { value: "204", label: "Resgate em Espaço Confinado" },
      { value: "205", label: "Resgate de Animal" },
      { value: "206", label: "Resgate em Desabamento / Colapso Estrutural" },
    ],

    "3": [
      { value: "301", label: "Atendimento Clínico" },
      { value: "302", label: "Atendimento Traumático" },
      { value: "303", label: "Transporte Inter-Hospitalar" },
      { value: "304", label: "Suporte Avançado de Vida (SAV)" },
      { value: "305", label: "Suporte Básico de Vida (SBV)" },
      { value: "306", label: "Atendimento Obstétrico" },
      { value: "307", label: "Atendimento Psiquiátrico" },
    ],

    "4": [
      { value: "401", label: "Vistoria Técnica" },
      { value: "402", label: "Treinamento e Simulado" },
      { value: "403", label: "Inspeção de Equipamentos" },
      { value: "404", label: "Educação Comunitária" },
      { value: "405", label: "Análise de Projeto" },
      { value: "406", label: "Fiscalização de Evento Público" },
    ],

    "5": [
      { value: "501", label: "Derramamento de Produto Químico" },
      { value: "502", label: "Vazamento de Gás Tóxico" },
      { value: "503", label: "Contaminação de Curso D’água" },
      { value: "504", label: "Acidente com Substância Perigosa" },
      { value: "505", label: "Incidente com Fauna / Animal Silvestre" },
    ],

    "6": [
      { value: "601", label: "Ocorrência Interna" },
      { value: "602", label: "Falha Operacional" },
      { value: "603", label: "Avaria de Equipamento" },
      { value: "604", label: "Acidente de Serviço" },
      { value: "605", label: "Comunicação de Serviço" },
      { value: "606", label: "Ocorrência Disciplinar" },
    ],

    "7": [
      { value: "701", label: "Enchente / Inundação" },
      { value: "702", label: "Deslizamento de Terra" },
      { value: "703", label: "Vendaval / Ciclone" },
      { value: "704", label: "Terremoto / Tremor de Terra" },
      { value: "705", label: "Colapso de Barragem" },
      { value: "706", label: "Incêndio de Grandes Proporções" },
    ],
  },

  priorities: [
    { value: "Baixa", label: "Prioridade Baixa" },
    { value: "Media", label: "Prioridade Média" },
    { value: "Alta", label: "Prioridade Alta" },
    { value: "Critica", label: "Prioridade Crítica" },
  ],
};

const RegisterOccurrence: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    tipo: "",
    subtipo: "",
    date: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().substring(0, 5),
    envolvidos: "",
    prioridade: "Media",
    detalhes: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formOptions, setFormOptions] = useState<FormOptionsData>({
    types: [],
    subTypes: {},
    priorities: [],
  });
  const [currentSubTypes, setCurrentSubTypes] = useState<FilterOption[]>([]);


  // useEffect (SIMPLIFICADO)
  useEffect(() => {
    const loadMockOptions = () => {
      try {
        const options = MOCK_FORM_OPTIONS;
        setFormOptions(options);

        const defaultType = String(options.types[0]?.value || "");
        const defaultSubTypes = options.subTypes[defaultType] || [];

        setForm((prevForm) => ({
          ...prevForm,
          tipo: defaultType,
          subtipo: String(defaultSubTypes[0]?.value || ""),
          prioridade: "Media",
        }));

      } catch (err: any) {
        setPageError(err.message || "Erro ao carregar a página.");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    loadMockOptions();
  }, []);


  // --- useEffect (Filtro Dependente - Sem Alteração) ---
  useEffect(() => {
    const newSubTypes = formOptions.subTypes[form.tipo] || [];
    setCurrentSubTypes(newSubTypes);

    setForm(f => ({
      ...f,
      subtipo: String(newSubTypes[0]?.value || "")
    }));
  }, [form.tipo, formOptions.subTypes]);


  // (handleChange - sem alteração)
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // --- handleSubmit (CORRIGIDO) ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const token = localStorage.getItem("authToken");

    // --- Encontrar o 'title' (label) com base no 'subtipo' (value) ---
    const selectedSubtype = currentSubTypes.find(
      (sub) => String(sub.value) === form.subtipo
    );
    const title = selectedSubtype ? selectedSubtype.label : "Título não encontrado";

    // --- Construir o payload EXATO que o back-end espera ---
    const payload = {
      title: title,                        // Nome do Subtipo (Ex: "Incêndio em Edificação")
      timestamp: `${form.date}T${form.hora}`, // Data e Hora
      victims: form.envolvidos,             // Envolvidos
      details: form.detalhes,               // Detalhes
      priority: form.prioridade,           // Prioridade (Ex: "Media")

      // --- CORREÇÃO APLICADA AQUI ---
      type: Number(form.tipo),             // ID do Tipo Principal (Ex: 1 para "Incêndio")
      // ---------------------------------
    };
    // --------------------------------------------------------

    console.log("Enviando dados da ocorrência para o backend:", payload);

    try {
      const response = await fetch(REGISTER_OCCURRENCE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao registrar ocorrência.");
      }

      toast.success("Ocorrência registrada com sucesso!");
      navigate("/home"); // Te manda de volta para a Home

    } catch (err: any) {
      console.error("Erro no handleSubmit:", err);
      setSubmitError(err.message);
      toast.error("Erro ao registrar", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // (JSX de Loading e Erro - sem alteração)
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">
          Carregando formulário de registro...
        </p>
      </div>
    );
  }
  if (pageError) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F9F9F9] p-5 gap-4">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <p className="text-xl">{pageError}</p>
        </div>
        <Link to="/home" className="h-10 px-6 rounded-lg bg-[#1650A7] text-white font-medium">
          Voltar para Home
        </Link>
      </div>
    );
  }

  // --- JSX ATUALIZADO (Removidos campos 'local' e 'equipe') ---
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <main className="flex-1 overflow-y-auto px-[60px] pt-[40px] pb-[30px] max-md:p-5 max-sm:p-[15px]">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-black/5"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </Link>
          <h1 className="mx-auto text-[#1650A7] text-2xl font-semibold">
            Registrar Ocorrência
          </h1>
          <div className="w-9 h-9" />
        </div>
        <form onSubmit={handleSubmit} className="max-w-[680px] mx-auto space-y-5">
          {/* Tipo de ocorrência */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de ocorrência</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              {formOptions.types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* Sub-tipo (Grupo) */}
          <div>
            <label className="block text-sm font-medium mb-1">Sub-tipo (Este é o 'title')</label>
            <select
              name="subtipo"
              value={form.subtipo}
              onChange={handleChange}
              disabled={isSubmitting || currentSubTypes.length === 0}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              {currentSubTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Data, Hora, Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="h-12 px-4 w-full bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="h-12 px-4 w-full bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
                disabled={isSubmitting}
                required
                className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
              >
                {formOptions.priorities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Envolvidos (victims) */}
          <div>
            <label className="block text-sm font-medium mb-1">Envolvidos (Vítimas)</label>
            <input
              name="envolvidos"
              value={form.envolvidos}
              onChange={handleChange}
              placeholder="Ex: 2 vítimas, 1 veículo"
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            />
          </div>
          {/* Detalhes (details) */}
          <div>
            <label className="block text-sm font-medium mb-1">Detalhes (Opcional)</label>
            <textarea
              name="detalhes"
              value={form.detalhes}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva brevemente a situação..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm resize-y"
            />
          </div>

          {/* Feedback de Erro */}
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" />
              <p>{submitError}</p>
            </div>
          )}
          {/* Botão de Envio */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#1650A7] text-white rounded-lg font-medium transition-colors
                         hover:bg-[#0f3d7f]
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registrando..." : "Registrar Ocorrência"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterOccurrence;
