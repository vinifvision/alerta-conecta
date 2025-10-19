import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value }) => {
  return (
    <article className="w-[222px] h-[157px] border flex flex-col items-center justify-center text-center box-border bg-white p-5 rounded-[25px] border-solid border-[rgba(0,0,0,0.14)] max-md:w-full">
      <h3 className="text-[#333B69] text-[22px] font-semibold leading-[27px] w-[132px] mb-5">
        {title}
      </h3>
      <div className="text-[32px] font-extrabold">
        {value}
      </div>
    </article>
  );
};

export default KPICard;
