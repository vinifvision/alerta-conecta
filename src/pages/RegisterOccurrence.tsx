import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Tipos auxiliares
type FilterOption = { value: string | number; label: string };
type SubTypeMap = { [key: string]: FilterOption[] };

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
  rua: string;
  numero: string;
  complemento: string;
  id_bairro: string;
};

const REGISTER_OCCURRENCE_URL = `http://26.9.167.9:3308/database/occurrence/registry`;

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
    date: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().substring(0, 5),
    envolvidos: "",
    prioridade: "Media",
    detalhes: "",
    rua: "",
    numero: "",
    complemento: "",
    id_bairro: "",
  });

  const [tipoIndex, setTipoIndex] = useState<number>(-1);

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

  useEffect(() => {
    try {
      const options = MOCK_FORM_OPTIONS;
      setFormOptions(options);

      const defaultType = String(options.types[0]?.value || "");
      const defaultSubTypes = options.subTypes[defaultType] || [];

      setForm((prevForm) => ({
        ...prevForm,
        tipo: defaultType,
        subtipo: String(defaultSubTypes[0]?.value || ""),
      }));

      setTipoIndex(0);
    } catch (err: any) {
      setPageError(err.message || "Erro ao carregar opções.");
    } finally {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, []);

  useEffect(() => {
    const newSubTypes = formOptions.subTypes[form.tipo] || [];
    setCurrentSubTypes(newSubTypes);
    setForm((f) => ({
      ...f,
      subtipo: String(newSubTypes[0]?.value || ""),
    }));
  }, [form.tipo, formOptions.subTypes]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === "tipo") {
      const select = e.target as HTMLSelectElement;
      setTipoIndex(select.selectedIndex);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem("authToken") || "";

    const selectedSubtype = currentSubTypes.find(
      (sub) => String(sub.value) === form.subtipo
    );
    const title = selectedSubtype ? selectedSubtype.label : "Título não encontrado";

    if (!form.rua.trim()) return setSubmitError("Informe a rua.");
    if (!form.numero.trim()) return setSubmitError("Informe o número.");
    if (!form.id_bairro.trim()) return setSubmitError("Informe o ID do bairro.");

    const typeName =
      formOptions.types[tipoIndex]?.label ||
      formOptions.types.find((o) => String(o.value) === form.tipo)?.label ||
      "";

    const payload = {
      title,
      timestamp: `${form.date}T${form.hora}`,
      victims: form.envolvidos,
      details: form.detalhes,
      priority: form.prioridade,
      type: {
        id: Number(form.tipo),
        index: tipoIndex,
        name: typeName,
      },
      address: {
        street: form.rua.trim(),
        number: form.numero.trim(),
        complement: form.complemento.trim(),
        idDistrict: Number(form.id_bairro),
      },
    };

    console.log("Payload final:", payload);

    try {
      const response = await fetch(REGISTER_OCCURRENCE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao registrar ocorrência.");

      toast.success("Ocorrência registrada com sucesso!");
      navigate("/home");
    } catch (err: any) {
      toast.error("Erro ao registrar", { description: err.message });
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#F9F9F9]">
        <p className="text-[#1650A7] text-xl">Carregando formulário...</p>
      </div>
    );

  if (pageError)
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F9F9F9]">
        <p className="text-red-600 text-lg">{pageError}</p>
        <Link
          to="/home"
          className="mt-3 px-4 py-2 rounded-lg bg-[#1650A7] text-white"
        >
          Voltar
        </Link>
      </div>
    );

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <main className="flex-1 overflow-y-auto px-[60px] pt-[40px] pb-[30px] max-md:p-5">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-full w-9 h-9 hover:bg-black/5"
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
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            >
              {formOptions.types.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-tipo */}
          <div>
            <label className="block text-sm font-medium mb-1">Subtipo</label>
            <select
              name="subtipo"
              value={form.subtipo}
              onChange={handleChange}
              disabled={isSubmitting || currentSubTypes.length === 0}
              className="w-full h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            >
              {currentSubTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campos de data/hora/prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            />
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            />
            <select
              name="prioridade"
              value={form.prioridade}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            >
              {formOptions.priorities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Envolvidos */}
          <input
            name="envolvidos"
            value={form.envolvidos}
            onChange={handleChange}
            placeholder="Ex: 2 vítimas, 1 veículo"
            className="w-full h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
          />

          {/* Detalhes */}
          <textarea
            name="detalhes"
            value={form.detalhes}
            onChange={handleChange}
            rows={4}
            placeholder="Descreva a ocorrência..."
            className="w-full px-4 py-3 bg-[#F6F6F6] border rounded-lg text-sm resize-y"
          />

          {/* Endereço */}
          <h2 className="text-[#1650A7] font-semibold mt-6 mb-3">Endereço</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="rua"
              value={form.rua}
              onChange={handleChange}
              placeholder="Rua"
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            />
            <input
              name="numero"
              value={form.numero}
              onChange={handleChange}
              placeholder="Número"
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            />
            <input
              name="complemento"
              value={form.complemento}
              onChange={handleChange}
              placeholder="Complemento (opcional)"
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            />
            <input
              name="id_bairro"
              type="number"
              value={form.id_bairro}
              onChange={handleChange}
              placeholder="ID do bairro"
              className="h-12 px-4 bg-[#F6F6F6] border rounded-lg text-sm"
            />
          </div>

          {submitError && (
            <div className="text-red-600 text-sm text-center">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#1650A7] text-white rounded-lg font-medium hover:bg-[#0f3d7f]"
          >
            {isSubmitting ? "Registrando..." : "Registrar Ocorrência"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default RegisterOccurrence;
