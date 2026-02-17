import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Search, Train, Edit3, X, Check, Map as MapIcon, ExternalLink } from 'lucide-react';
import { ItineraryItem, GroupedItinerary } from '../types';
import { normalizeDate } from '../utils/csvParser';

interface DayViewProps {
  items: ItineraryItem[];
  onUpdateDay: (date: string, newItems: ItineraryItem[]) => void;
}

interface MapLink {
  label: string;
  url: string;
}

const DayView: React.FC<DayViewProps> = ({ items, onUpdateDay }) => {
  const grouped = useMemo(() => {
    return items.reduce((acc: GroupedItinerary, item) => {
      const d = item.Date || '未定日期';
      if (!acc[d]) acc[d] = [];
      acc[d].push(item);
      return acc;
    }, {});
  }, [items]);

  const sortedDates = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      return normalizeDate(a).getTime() - normalizeDate(b).getTime();
    });
  }, [grouped]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [linkSelection, setLinkSelection] = useState<{ activity: string; links: MapLink[] } | null>(null);

  const currentDate = sortedDates[currentIdx];
  const dayItems = grouped[currentDate] || [];

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed)) {
        onUpdateDay(currentDate, parsed);
        setIsImporting(false);
        setImportText('');
        alert('行程已更新！✨');
      } else {
        alert('格式不正確，請輸入 JSON 陣列');
      }
    } catch (e) {
      alert('JSON 解析失敗，請檢查內容');
    }
  };

  const parseLinks = (item: ItineraryItem): MapLink[] => {
    const rawLink = item.Link || '';
    const rawParts = rawLink.split(/[,\n]/).map(l => l.trim()).filter(Boolean);
    
    // 1. Check for explicit naming with pipe |
    const hasPipes = rawParts.some(p => p.includes('|'));
    if (hasPipes) {
      return rawParts.map((p, i) => {
        const [label, url] = p.split('|').map(s => s.trim());
        return { 
          label: url ? label : `地點 ${i + 1}`, 
          url: url || label 
        };
      });
    }

    // 2. Auto-Guessing from Activity
    // Separators: , & + / 、 (space)
    const activityParts = item.Activity.split(/[,&+/、 ]/).map(s => s.trim()).filter(Boolean);
    if (activityParts.length === rawParts.length && rawParts.length > 1) {
      return rawParts.map((url, i) => ({
        label: activityParts[i],
        url
      }));
    }

    // 3. Fallback
    return rawParts.map((url, i) => ({
      label: rawParts.length > 1 ? `地點 ${i + 1}` : '開啟地圖',
      url
    }));
  };

  const handleCardClick = (item: ItineraryItem) => {
    const links = parseLinks(item);

    if (links.length === 0) {
      // No link, fallback to search
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.Activity)}`, '_blank');
    } else if (links.length === 1) {
      // Single link, open directly
      window.open(links[0].url, '_blank');
    } else {
      // Multiple links, show selection
      setLinkSelection({ activity: item.Activity, links });
    }
  };

  if (sortedDates.length === 0) return <div className="p-10 text-center opacity-50">尚無行程資料 🍡</div>;

  return (
    <div className="px-6 py-10 min-w-0">
      {/* Date Navigation & Import Toggle */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between bg-white border-4 border-navy rounded-[2rem] p-4 sticker-shadow">
          <button onClick={() => setCurrentIdx(p => Math.max(0, p - 1))} disabled={currentIdx === 0} className={`p-2 rounded-xl border-2 border-navy ${currentIdx === 0 ? 'opacity-20' : 'active:translate-y-1 bg-accent'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black opacity-40 uppercase">DAY {currentIdx + 1}</p>
            <h3 className="text-xl font-black">{currentDate}</h3>
          </div>
          <button onClick={() => setCurrentIdx(p => Math.min(sortedDates.length - 1, p + 1))} disabled={currentIdx === sortedDates.length - 1} className={`p-2 rounded-xl border-2 border-navy ${currentIdx === sortedDates.length - 1 ? 'opacity-20' : 'active:translate-y-1 bg-accent'}`}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-end">
          <button onClick={() => setIsImporting(!isImporting)} className="bg-white border-2 border-navy px-4 py-2 rounded-full font-black text-xs flex items-center gap-2 sticker-shadow active:translate-y-1">
            <Edit3 className="w-4 h-4" /> 匯入行程
          </button>
        </div>
      </div>

      {/* Import Panel */}
      {isImporting && (
        <div className="mb-8 bg-white border-4 border-navy rounded-[2rem] p-6 sticker-shadow space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center">
            <h4 className="font-black">貼上 JSON 行程</h4>
            <button onClick={() => setIsImporting(false)}><X className="w-5 h-5" /></button>
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='[{"Time":"10:00","Activity":"黑門市場","Type":"美食","Note":"吃牛肉"}]'
            className="w-full h-32 p-3 border-2 border-navy rounded-2xl text-xs font-mono outline-none bg-accent/10"
          />
          <button onClick={handleImport} className="w-full bg-navy text-white font-black py-3 rounded-full flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> 更新此日行程
          </button>
        </div>
      )}

      {/* Day List */}
      <div className="space-y-6 relative ml-4">
        <div className="absolute left-6 top-0 bottom-0 w-1 border-l-4 border-dashed border-navy/10 -z-10"></div>
        <div className="ml-10 space-y-6">
          {dayItems.map((item, idx) => {
            const links = parseLinks(item);
            const hasMultipleLinks = links.length > 1;

            return (
              <React.Fragment key={idx}>
                {item.travelTime > 0 && (
                  <div className="flex flex-col items-center -my-3">
                    <div className="px-4 py-1 rounded-full border-2 border-navy text-[10px] font-black bg-secondary/20 flex items-center gap-2"><Train className="w-3 h-3" /> <span>約 {item.travelTime} 分</span></div>
                  </div>
                )}
                <div onClick={() => handleCardClick(item)} className={`p-6 rounded-[2rem] border-4 border-navy sticker-shadow cursor-pointer active:translate-y-1 ${item.Type.includes('預約') ? 'bg-primary' : item.Type.includes('交通') ? 'bg-secondary' : 'bg-white'}`}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-navy/60 font-black text-xs"><Clock className="w-3.5 h-3.5" /> {item.Time || '--:--'}</div>
                    <span className="bg-white/50 px-3 py-0.5 rounded-full text-[10px] font-black">{item.Type}</span>
                  </div>
                  <h4 className="font-black text-xl flex flex-wrap items-center gap-2">
                    {item.Activity} 
                    {hasMultipleLinks ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/40 border border-navy/20 rounded-lg">
                        <MapIcon className="w-4 h-4 text-navy" />
                        <span className="text-[10px] font-black">多個地點</span>
                      </div>
                    ) : links.length === 1 ? (
                      <MapPin className="w-4 h-4 opacity-40" />
                    ) : (
                      <Search className="w-4 h-4 opacity-20" />
                    )}
                  </h4>
                  {item.Note && <p className="text-sm font-bold opacity-70 mt-3 bg-white/30 p-3 rounded-2xl border-2 border-dashed border-navy/10">{item.Note}</p>}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Link Selection Modal */}
      {linkSelection && (
        <div className="fixed inset-0 z-[110] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white border-4 border-navy rounded-[2.5rem] w-full max-w-sm p-8 sticker-shadow space-y-6">
            <div className="text-center">
              <h4 className="font-black text-xl leading-tight">{linkSelection.activity}</h4>
              <p className="text-xs font-bold opacity-40 mt-1">請選擇要前往的地點</p>
            </div>
            <div className="space-y-3">
              {linkSelection.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => {
                    window.open(link.url, '_blank');
                    setLinkSelection(null);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-navy/5 border-2 border-navy/10 rounded-2xl hover:bg-primary/20 transition-colors font-black text-sm text-left"
                >
                  <span className="truncate flex-1 mr-2">{link.label}</span>
                  <ExternalLink className="w-4 h-4 opacity-40 flex-shrink-0" />
                </button>
              ))}
            </div>
            <button 
              onClick={() => setLinkSelection(null)}
              className="w-full bg-navy text-white font-black py-4 rounded-full active:scale-95 transition-transform"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView;