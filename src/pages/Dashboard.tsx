import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KPICard from '@/components/dashboard/KPICard';
import FilterDropdown from '@/components/dashboard/FilterDropdown';
import ChartSection from '@/components/dashboard/ChartSection';

const Index = () => {
  const kpiData = [
    { title: "Total de Ocorrências", value: "15.132" },
    { title: "Ocorrências Atendidas", value: "12.612" },
    { title: "Ocorrências Não atentidas", value: "2.197" },
    { title: "Bombeiro em Serviço", value: "3.125" },
    { title: "Taxa de eficiência", value: "83,6%" }
  ];

  const filterOptions = {
    tipo: ["Incêndio", "Resgate", "Acidente", "Emergência Médica"],
    turno: ["Manhã", "Tarde", "Noite", "Madrugada"],
    regiao: ["Zona da Mata", "Região Metropolitana", "Norte", "Sul"],
    grupamento: ["1º GB", "2º GB", "3º GB", "4º GB"],
    periodo: ["Última semana", "Último mês", "Últimos 3 meses", "Último ano"]
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pl-[42px] pr-[175px] pt-[65px] pb-0 max-md:p-5 max-sm:p-[15px]">
        <DashboardHeader />

        <section className="grid grid-cols-[repeat(5,222px)] gap-[25px] mb-6 max-md:grid-cols-[repeat(2,1fr)] max-md:gap-[15px] max-sm:grid-cols-[1fr]">
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
            />
          ))}
        </section>

        <section className="flex gap-5 items-center mb-[30px] max-md:flex-wrap max-md:gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <FilterDropdown
            label="Tipo de ocorrência"
            options={filterOptions.tipo}
          />
          <FilterDropdown
            label="Turno"
            options={filterOptions.turno}
          />
          <FilterDropdown
            label="Região"
            options={filterOptions.regiao}
          />
          <FilterDropdown
            label="Grupamento"
            options={filterOptions.grupamento}
          />
          <FilterDropdown
            label="Período"
            options={filterOptions.periodo}
          />
        </section>

        <ChartSection />
      </main>
    </div>
  );
};

export default Index;
