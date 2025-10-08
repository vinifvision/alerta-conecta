import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Phone } from 'lucide-react';

const Home = () => {
  const recentOccurrences = [
    {
      title: "Butijão de gás",
      address: "Rua 43, N 434, Casa Azul",
      id: "#123456",
      status: "active"
    },
    {
      title: "Sinistro de trânsito",
      address: "Av. Visconde de Suassuna, N 555",
      id: "#678910",
      status: "active"
    }
  ];

  const inProgressOccurrences = [
    {
      title: "Protesto",
      address: "Av. Agamenon Magalhães, N...",
      id: "#1212134",
      status: "active"
    }
  ];

  const completedOccurrences = [
    {
      title: "Incêndio em residência",
      address: "Rua do Quintal, N 647",
      id: "#242424",
      status: "completed"
    }
  ];

  const OccurrenceCard = ({ title, address, id, status }: any) => (
    <div className="bg-white rounded-[15px] p-5 mb-4 flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
            status === 'active' ? 'bg-[#FF0000]' : 'bg-[#FF0000]'
          }`} />
          <div>
            <h3 className="text-[#000000] text-lg font-semibold mb-1">{title}</h3>
            <p className="text-[#666666] text-sm mb-2">{address}</p>
            <p className="text-[#FF0000] text-sm font-medium">{id}</p>
          </div>
        </div>
      </div>
      <button className="text-[#1650A7] text-sm font-medium hover:underline">
        Visualizar
      </button>
    </div>
  );

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#F9F9F9] max-md:flex-col">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto px-[60px] pt-[65px] pb-[30px] max-md:p-5 max-sm:p-[15px]">
        <div className="flex items-start justify-between mb-10 max-md:flex-col max-md:gap-4">
          <div>
            <h1 className="text-[#1650A7] text-[32px] font-semibold mb-2 max-md:text-2xl max-sm:text-xl">
              Olá, Roberto Silva,
            </h1>
            <p className="text-[#1650A7] text-[32px] font-semibold max-md:text-2xl max-sm:text-xl">
              Acompanhe suas ocorrências
            </p>
          </div>
          
          <div className="flex items-center gap-4 max-md:self-end">
            <div className="text-right">
              <p className="text-[#000000] text-base font-semibold">Roberto Silva</p>
              <p className="text-[#666666] text-sm">Despachante</p>
            </div>
            <div className="w-[60px] h-[60px] rounded-full bg-[#D9D9D9] overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" 
                alt="Roberto Silva"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 max-lg:flex-col">
          <div className="flex-1">
            <h2 className="text-[#1650A7] text-2xl font-semibold mb-6">
              Lista de Ocorrências - Recentes
            </h2>

            <section className="mb-8">
              {recentOccurrences.map((occurrence, index) => (
                <OccurrenceCard key={index} {...occurrence} />
              ))}
            </section>

            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">
              Em andamento
            </h3>
            <section className="mb-8">
              {inProgressOccurrences.map((occurrence, index) => (
                <OccurrenceCard key={index} {...occurrence} />
              ))}
            </section>

            <h3 className="text-[#1650A7] text-xl font-semibold mb-4">
              Concluídas
            </h3>
            <section>
              {completedOccurrences.map((occurrence, index) => (
                <OccurrenceCard key={index} {...occurrence} />
              ))}
            </section>
          </div>

          <aside className="w-[320px] max-lg:w-full">
            <div className="bg-white rounded-[15px] p-6 mb-6">
              <h3 className="text-[#000000] text-xl font-semibold mb-6">
                Filtrar Ocorrências
              </h3>
              
              <div className="space-y-4">
                <select className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base">
                  <option>Período</option>
                </select>
                
                <select className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base">
                  <option>Tipo de ocorrência</option>
                </select>
                
                <select className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base">
                  <option>Região</option>
                </select>
                
                <select className="w-full h-12 px-4 bg-[#F6F6F6] border border-[rgba(0,0,0,0.14)] rounded-lg text-base">
                  <option>Status</option>
                </select>
                
                <button className="w-full h-12 bg-[#1650A7] text-white rounded-lg font-medium hover:bg-[#0f3d7f] transition-colors">
                  Filtrar
                </button>
              </div>
            </div>

            <button className="w-full h-14 bg-white border-2 border-[#FF4444] text-[#FF4444] rounded-lg font-medium hover:bg-[#FF4444] hover:text-white transition-colors flex items-center justify-center gap-3">
              <Phone className="w-5 h-5" />
              Registrar ocorrência
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
