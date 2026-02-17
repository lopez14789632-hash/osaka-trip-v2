import React, { useState, useEffect, useMemo } from 'react';
import { Check, Trash2, Heart, Circle } from 'lucide-react';
import { PackingItem, GroupedPacking } from '../types';

interface PackingListProps {
  items: PackingItem[];
}

const PackingList: React.FC<PackingListProps> = ({ items }) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('osaka_pax_state');
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('osaka_pax_state', JSON.stringify(checked));
  }, [checked]);

  const toggle = (cat: string, item: string) => {
    const key = `${cat}-${item}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const grouped = useMemo(() => {
    return items.reduce((acc: GroupedPacking, item) => {
      const c = item.Category || '其他小物';
      if (!acc[c]) acc[c] = [];
      acc[c].push(item);
      return acc;
    }, {});
  }, [items]);

  const total = items.length;
  const packed = Object.values(checked).filter(Boolean).length;

  return (
    <div className="px-6 py-10 space-y-10 min-w-0">
      <header className="flex justify-between items-center min-w-0">
        <div className="min-w-0">
          <h2 className="text-4xl font-black break-words">準備清單</h2>
          <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Ready for Osaka?</p>
        </div>
        <button onClick={() => {if(confirm('重置所有勾選嗎？')) setChecked({})}} className="p-4 bg-white border-4 border-navy rounded-[1.5rem] sticker-shadow active:translate-y-1"><Trash2 className="w-6 h-6" /></button>
      </header>

      {/* Progress */}
      <div className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow space-y-4 min-w-0">
        <div className="flex justify-between items-end px-2">
          <span className="text-xs font-black opacity-50 uppercase tracking-widest">打包進度</span>
          <span className="text-3xl font-black">{packed} <span className="text-lg opacity-20">/ {total}</span></span>
        </div>
        <div className="h-4 bg-navy/5 rounded-full p-1 border-2 border-navy overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${total > 0 ? (packed/total)*100 : 0}%` }}></div>
        </div>
      </div>

      <div className="space-y-12 min-w-0">
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="space-y-6 min-w-0">
            <h3 className="text-lg font-black flex items-center gap-3 min-w-0">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span className="truncate">{category}</span>
              <div className="flex-1 h-0.5 bg-navy/10 rounded-full"></div>
            </h3>
            <div className="space-y-4 min-w-0">
              {catItems.map((item, idx) => {
                const isChecked = !!checked[`${category}-${item.Item}`];
                return (
                  <button key={idx} onClick={() => toggle(category, item.Item)}
                    className={`w-full text-left p-5 rounded-[2rem] border-4 border-navy flex items-center gap-4 transition-all active:translate-y-1 sticker-shadow min-w-0 ${isChecked ? 'bg-navy/5 opacity-50' : 'bg-white'}`}>
                    <div className="flex-shrink-0">
                      {isChecked ? <div className="w-8 h-8 bg-navy rounded-xl flex items-center justify-center text-white"><Check className="w-5 h-5 stroke-[4px]" /></div> : <div className="w-8 h-8 border-4 border-navy/10 rounded-xl" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xl font-black break-words leading-tight ${isChecked ? 'line-through' : ''}`}>{item.Item}</p>
                      {item.Note && <p className="text-xs font-bold opacity-40 mt-1 break-words">{item.Note}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingList;