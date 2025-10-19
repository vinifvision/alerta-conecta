import React from 'react';

const ChartSection = () => {
  return (
    <section className="w-[1215px] h-[430px] relative box-border bg-white px-[18px] py-[23px] rounded-[25px] max-md:w-full max-md:overflow-x-auto max-sm:h-[350px]">
      <div className="flex justify-between items-start mb-10">
        <h2 className="text-[#333B69] text-[25px] font-semibold max-sm:text-xl">
          Ocorrência por queimadas
        </h2>
        <div className="flex gap-10 items-center max-sm:flex-col max-sm:gap-[15px] max-sm:items-start">
          <div className="flex items-center gap-3">
            <div className="w-[27px] h-[27px] bg-[#FFBB38] rounded-sm max-sm:w-5 max-sm:h-5" />
            <span className="text-black text-lg font-medium max-sm:text-sm">
              Zona da Mata
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[27px] h-[27px] bg-[#3FDA7F] rounded-sm max-sm:w-5 max-sm:h-5" />
            <span className="text-black text-lg font-medium max-sm:text-sm">
              Região Metropolitana
            </span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[328px] relative">
        <svg 
          width="1172" 
          height="330" 
          viewBox="0 0 1172 330" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="1.00098" y="319.562">08/10</tspan>
          </text>
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="184.984" y="319.562">09/10</tspan>
          </text>
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="372.234" y="319.562">10/10</tspan>
          </text>
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="558.731" y="319.562">11/10</tspan>
          </text>
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="746.163" y="319.562">12/10</tspan>
          </text>
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="935.119" y="319.562">13/10</tspan>
          </text>
          <text fill="#707D8A" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="14" letterSpacing="0px">
            <tspan x="1117.42" y="319.562">14/10</tspan>
          </text>
          
          <path d="M1 252.823H1167.96" stroke="white" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 190.118H1167.96" stroke="white" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 127.412H1167.96" stroke="white" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 64.7058H1167.96" stroke="white" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 2H1167.96" stroke="white" strokeLinecap="round" strokeDasharray="3 4"/>
          
          <path d="M1 210.675L38.9499 199.344L66.057 111.531H113.494L133.825 188.957L177.196 163.463H213.79L230.055 145.523H269.36L296.467 229.559L316.797 172.905H365.59L422.515 104.921H464.531L518.745 145.523H553.984L586.513 19.9403L623.107 94.5344H669.189L707.139 60.5422H759.998L815.567 2L846.741 69.0402L884.69 123.805L942.971 103.032L989.053 125.694L1048.69 67.1518L1097.48 123.805L1167.96 63.3749" stroke="#4CE88D" strokeWidth="2"/>
          
          <path d="M1 252.823H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 190.118H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 127.412H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 64.7058H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1 2H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          
          <path d="M1 210.675L38.9499 199.344L66.057 111.531H113.494L133.825 188.957L177.196 163.463H213.79L230.055 145.523H269.36L296.467 229.559L316.797 172.905H365.59L422.515 104.921H464.531L518.745 145.523H553.984L586.513 19.9403L623.107 94.5344H669.189L707.139 60.5422H759.998L815.567 2L846.741 69.0402L884.69 123.805L942.971 103.032L989.053 125.694L1048.69 67.1518L1097.48 123.805L1167.96 63.3749" stroke="#4CE88D" strokeWidth="2"/>
          
          <path d="M1.00098 290.206H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1.00098 227.5H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1.00098 164.794H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1.00098 102.088H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          <path d="M1.00098 39.3823H1167.96" stroke="#DCE3EB" strokeLinecap="round" strokeDasharray="3 4"/>
          
          <path d="M1.00195 248.057L38.9519 236.726H89.131L113.496 148.913L133.827 226.34L176.501 265.485L213.792 200.845L230.057 182.905H269.362L296.54 110.529L316.799 210.288H365.592L422.517 142.303H464.533L518.747 182.905H553.986L586.76 195.544L623.109 131.917H669.191L724.273 214.838L786.572 210.288L812.403 131.917L862.545 186.5L884.692 161.188L942.973 140.415L989.055 163.076L1061.6 219.059L1097.48 161.188L1171 203.382" stroke="#FFBB38" strokeWidth="2"/>
        </svg>
      </div>
    </section>
  );
};

export default ChartSection;
