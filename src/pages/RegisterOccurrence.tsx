import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// --- Tipos Atualizados ---
type FilterOption = {
  value: string;
  label: string;
};

// Mapeia um "Tipo" (ex: 'incendio') para uma lista de "Sub-tipos"
type SubTypeMap = {
  [key: string]: FilterOption[];
};

type FormOptionsData = {
  types: FilterOption[];
  subTypes: SubTypeMap; // <-- Atualizado
  teams: FilterOption[];
  regions: FilterOption[];    // <-- NOVO
  priorities: FilterOption[]; // <-- NOVO
};

type FormData = {
  tipo: string;
  subtipo: string; // <-- Renomeado de 'grupo'
  regiao: string;  // <-- NOVO
  local: string;
  data: string;
  hora: string;
  envolvidos: string;
  prioridade: string; // <-- NOVO
  detalhes: string;
  equipe: string;
};

const RegisterOccurrence: React.FC = () => {
  const navigate = useNavigate();

  // --- Estado do Formulário ---
  const [form, setForm] = useState<FormData>({
    tipo: "",
    subtipo: "",
    regiao: "", // <-- NOVO
    local: "",
    data: "",
    hora: "",
    envolvidos: "",
    prioridade: "media", // <-- NOVO (padrão)
    detalhes: "",
    equipe: "",
  });

  // --- Estados de Carregamento e Opções ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptionsData>({
    types: [],
    subTypes: {},
    teams: [],
    regions: [],
    priorities: [],
  });

  // --- NOVO: Estado para o filtro dependente ---
  const [currentSubTypes, setCurrentSubTypes] = useState<FilterOption[]>([]);

  // --- useEffect para Proteção e Carregamento de Opções ---
  useEffect(() => {
    // 1. Proteção de Rota
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/");
      return;
    }

    // 2. Carregar Opções dos Filtros (Simulação GET)
    const fetchFormOptions = () => {

      // --- Listas de Opções Mais Profissionais ---
      const mockOptions: FormOptionsData = {
        // (Baseado no Home.tsx)
        types: [
          { value: "incendio", label: "Incêndio" },
          { value: "aph", label: "APH - Atendimento Pré-Hospitalar" },
          { value: "acidente", label: "Acidente Veicular" },
          { value: "resgate", label: "Resgate" },
          { value: "salvamento", label: "Salvamento" },
          { value: "outros", label: "Outros" },
        ],
        // (Baseado no Dashboard.tsx e Home.tsx)
        regions: [
          { value: "centro", label: "Centro" },
          { value: "zona_sul", label: "Zona Sul" },
          { value: "zona_norte", label: "Zona Norte" },
          { value: "zona_oeste", label: "Zona Oeste" },
          { value: "rmr", label: "Região Metropolitana" },
        ],
        // (Baseado no Dashboard.tsx)
        teams: [
          { value: "gbi", label: "GBI (Grup. de Bombeiros de Incêndio)" },
          { value: "gbs", label: "GBS (Grup. de Busca e Salvamento)" },
          { value: "aph", label: "APH (Atend. Pré-Hospitalar)" },
          { value: "gmar", label: "GMAR (Grup. Marítimo)" },
          { value: "1gbm", label: "1º GBM (Recife - Centro)" },
          { value: "2gbm", label: "2º GBM (Jaboatão)" },
        ],
        // (NOVO)
        priorities: [
          { value: "baixa", label: "Prioridade Baixa" },
          { value: "media", label: "Prioridade Média" },
          { value: "alta", label: "Prioridade Alta" },
          { value: "urgente", label: "Urgente (Risco Imediato)" },
        ],
        // --- NOVO: Mapeamento de Sub-tipos ---
        subTypes: {
          incendio: [
            { value: "edificacao", label: "Incêndio em Edificação" },
            { value: "florestal", label: "Incêndio Florestal" },
            { value: "veiculo", label: "Incêndio em Veículo" },
          ],
          aph: [
            { value: "mal_subito", label: "Mal Súbito / Emergência Médica" },
            { value: "trauma", label: "Trauma (Queda, Agressão, etc.)" },
            { value: "obstetrica", label: "Emergência Obstétrica" },
          ],
          acidente: [
            { value: "colisao", label: "Colisão Veicular" },
            { value: "atropelamento", label: "Atropelamento" },
            { value: "capotamento", label: "Capotamento / Deslizamento" },
          ],
          resgate: [
            { value: "altura", label: "Resgate em Altura" },
            { value: "confinado", label: "Resgate em Espaço Confinado" },
            { value: "animal", label: "Resgate de Animal" },
          ],
          salvamento: [
            { value: "aquatico", label: "Salvamento Aquático (Afogamento)" },
            { value: "deslizamento", label: "Soterramento / Deslizamento" },
          ],
          outros: [
            { value: "outros", label: "Outros" },
          ]
        },
      };

      setTimeout(() => {
        setFormOptions(mockOptions);

        // Pré-seleciona a primeira opção de cada
        const defaultType = mockOptions.types[0]?.value || "";
        const defaultSubTypes = mockOptions.subTypes[defaultType] || [];

        setForm((prevForm) => ({
          ...prevForm,
          tipo: defaultType,
          subtipo: defaultSubTypes[0]?.value || "",
          regiao: mockOptions.regions[0]?.value || "",
          prioridade: "media",
          equipe: mockOptions.teams[0]?.value || "",
        }));

        setIsLoading(false);
      }, 400);
    };

    fetchFormOptions();
  }, [navigate]);

  // --- NOVO: useEffect para o filtro dependente ---
  // Atualiza os Sub-tipos quando o Tipo muda
  useEffect(() => {
    const newSubTypes = formOptions.subTypes[form.tipo] || [];
    setCurrentSubTypes(newSubTypes);

    // Reseta o sub-tipo selecionado para o primeiro da nova lista
    setForm(f => ({
      ...f,
      subtipo: newSubTypes[0]?.value || ""
    }));
  }, [form.tipo, formOptions.subTypes]); // Assiste a mudança do 'tipo'


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // (Simulação POST sem alteração)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Enviando dados da ocorrência para o backend:", form);
    const authToken = localStorage.getItem("authToken");
    console.log("Enviando com o token:", authToken);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Ocorrência registrada com sucesso (simulação)!");

    setIsSubmitting(false);
    navigate("/home");
  }

  // --- Estado de Carregamento ---
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">
          Carregando formulário de registro...
        </p>
      </div>
    );
  }

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

          {/* --- Selects dinâmicos --- */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de ocorrência</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange} // <-- A mágica acontece aqui
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

          {/* --- NOVO: Select Dependente --- */}
          <div>
            <label className="block text-sm font-medium mb-1">Sub-tipo (Grupo)</label>
            <select
              name="subtipo" // <-- Renomeado
              value={form.subtipo}
              onChange={handleChange}
              disabled={isSubmitting || currentSubTypes.length === 0} // Desabilita se não houver opções
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              {currentSubTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* --- NOVO: Select de Região --- */}
          <div>
            <label className="block text-sm font-medium mb-1">Região</label>
            <select
              name="regiao"
              value={form.regiao}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              {formOptions.regions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Localização (Endereço)</label>
            <input
              name="local"
              value={form.local}
              onChange={handleChange}
              placeholder="Ex: Rua do Sossego, Nº 343, Bairro: Boa Vista"
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                disabled={isSubmitting}
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
                className="h-12 px-4 w-full bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
              />
            </div>
            {/* --- NOVO: Select de Prioridade --- */}
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
                disabled={isSubmitting}
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


          <div>
            <label className="block text-sm font-medium mb-1">Envolvidos</label>
            <input
              name="envolvidos"
              value={form.envolvidos}
              onChange={handleChange}
              placeholder="Ex: 2 vítimas, 1 veículo"
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1">Equipe Designada</label>
            <select
              name="equipe"
              value={form.equipe}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              {formOptions.teams.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
