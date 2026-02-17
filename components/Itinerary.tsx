
import React, { useMemo } from 'react';
import { ItineraryItem } from '../types';

interface ItineraryProps {
  items: ItineraryItem[];
}

const Itinerary: React.FC<ItineraryProps> = ({ items }) => {
  return (
    <div className="px-4 py-10 min-w-0">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-black">全行程總覽 🍡</h2>
        <p className="text-[10px] font-bold opacity-30 mt-1 uppercase tracking-widest">Master Schedule</p>
      </header>

      <div className="bg-white border-4 border-navy rounded-[2rem] sticker-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="bg-navy/5 border-b-4 border-navy">
                <th className="p-3 text-[10px] font-black opacity-50 uppercase">日期</th>
                <th className="p-3 text-[10px] font-black opacity-50 uppercase">時間</th>
                <th className="p-3 text-[10px] font-black opacity-50 uppercase">活動</th>
                <th className="p-3 text-[10px] font-black opacity-50 uppercase">類型</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-navy/5">
              {items.map((item, idx) => {
                const isReservation = item.Type?.includes('預約');
                return (
                  <tr key={idx} className={`hover:bg-navy/5 transition-colors ${isReservation ? 'bg-primary/10' : ''}`}>
                    <td className="p-3 text-xs font-black whitespace-nowrap">{item.Date}</td>
                    <td className="p-3 text-xs font-bold opacity-60 whitespace-nowrap">{item.Time}</td>
                    <td className="p-3 text-sm font-black leading-tight">{item.Activity}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border border-navy/10 ${isReservation ? 'bg-primary' : 'bg-navy/5'}`}>
                        {item.Type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-center text-[10px] font-bold opacity-20 mt-8">💡 詳細地圖與備註請至「每日」頁面查看</p>
    </div>
  );
};

export default Itinerary;
