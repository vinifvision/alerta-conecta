import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type FormData = {
  tipo: string;
  grupo: string;
  local: string;
  data: string;
  hora: string;
  envolvidos: string;
  detalhes: string;
  equipe: string;
};

const RegisterOccurrence: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    tipo: "Incêndio",
    grupo: "Incêndio em Edificação",
    local: "",
    data: "",
    hora: "",
    envolvidos: "",
    detalhes: "",
    equipe: "2 GBM",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

   
    navigate("/home");
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
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de ocorrência</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              <option>Incêndio</option>
              <option>APH</option>
              <option>Acidente</option>
              <option>Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Grupo de ocorrência</label>
            <select
              name="grupo"
              value={form.grupo}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              <option>Incêndio em Edificação</option>
              <option>Incêndio Florestal</option>
              <option>Acidente Veicular</option>
              <option>Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Localização</label>
            <input
              name="local"
              value={form.local}
              onChange={handleChange}
              placeholder="Rua do Sossego N 343, 51000 200"
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data e hora</label>
            <div className="grid grid-cols-[1fr_120px] gap-3">
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
              />
              <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                className="h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Envolvidos</label>
            <input
              name="envolvidos"
              value={form.envolvidos}
              onChange={handleChange}
              placeholder="1 envolvido jovem"
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Detalhes</label>
            <textarea
              name="detalhes"
              value={form.detalhes}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva brevemente a situação..."
              className="w-full px-4 py-3 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Equipe</label>
            <select
              name="equipe"
              value={form.equipe}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-sm"
            >
              <option>2 GBM</option>
              <option>1 GBM</option>
              <option>3 GBM</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-[#1650A7] text-white rounded-lg font-medium hover:bg-[#0f3d7f] transition-colors"
            >
              Registrar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegisterOccurrence;
