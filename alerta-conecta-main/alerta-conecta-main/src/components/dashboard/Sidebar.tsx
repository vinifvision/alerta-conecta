import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  FileText,
  Settings,
  PlusCircle,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const items = [
    { to: "/home", icon: <Home className="w-6 h-6" />, label: "Início" },
    { to: "/dashboard", icon: <BarChart3 className="w-6 h-6" />, label: "Dashboard" },
    { to: "/occurrences/new", icon: <PlusCircle className="w-6 h-6" />, label: "Registrar Ocorrência" },
    { to: "/audit", icon: <FileText className="w-6 h-6" />, label: "Auditoria e Logs" },
  ];

  return ( 
    <TooltipProvider>
      <nav className="w-[115px] h-screen relative shrink-0 bg-[#1650A7] ml-[33px] my-[30px] rounded-[31px] flex flex-col items-center py-8">
        <div className="mb-8">
          <img
            src="LogoBranca.svg"
            alt="Alerta Conecta Logo"
            className="w-[65px] h-auto mx-auto"
          />
        </div>

        <div className="w-[70%] h-px bg-[#D9D9D9] mb-10" />

        <div className="flex flex-col items-center gap-8 flex-1">
          {items.map((item, index) => {
            const active = path === item.to;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    className={`w-[55px] h-[55px] flex items-center justify-center rounded-[12px] transition-all ${
                      active
                        ? "bg-[rgba(255,255,255,0.25)]"
                        : "hover:bg-[rgba(255,255,255,0.15)]"
                    }`}
                    aria-label={item.label}
                  >
                    <span className="text-white">{item.icon}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white text-xs rounded-md py-1 px-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-auto mb-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-[55px] h-[55px] flex items-center justify-center rounded-[12px] hover:bg-[rgba(255,255,255,0.15)]"
                aria-label="Configurações"
              >
                <Settings className="w-6 h-6 text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black text-white text-xs rounded-md py-1 px-2">
              Configurações
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default Sidebar;
