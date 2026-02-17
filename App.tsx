
import React, { useState, useEffect } from 'react';
import { getGoogleSheetData, normalizeDate, calculateTimestamp } from './utils/csvParser';
import Home from './components/Home';
import Itinerary from './components/Itinerary';
import DayView from './components/DayView';
import PackingList from './components/PackingList';
import Tools from './components/Tools';
import Phrasebook from './components/Phrasebook';
import { ItineraryItem, PackingItem, TabType } from './types';
import { Map, Calendar, Package, Clock, Wrench } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [data, setData] = useState<{
    itinerary: ItineraryItem[];
    packing: PackingItem[];
  }>({ itinerary: [], packing: [] });
  const [loading, setLoading] = useState(true);

  const sortItinerary = (items: ItineraryItem[]) => {
    return [...items].sort((a, b) => {
      const timeA = calculateTimestamp(a.Date, a.Time);
      const timeB = calculateTimestamp(b.Date, b.Time);
      return timeA - timeB;
    });
  };

  const loadData = async () => {
    const fetched = await getGoogleSheetData();
    const overridesRaw = localStorage.getItem('osaka_itinerary_overrides');
    const overrides = overridesRaw ? JSON.parse(overridesRaw) : {};
    
    // Merge fetched with overrides
    // Overrides is grouped by date: { "3/5": [items], ... }
    let finalItinerary = [...fetched.itinerary];
    
    // If we have overrides, we replace the whole day's data
    Object.keys(overrides).forEach(date => {
      finalItinerary = finalItinerary.filter(item => item.Date !== date);
      finalItinerary = [...finalItinerary, ...overrides[date]];
    });

    setData({
      itinerary: sortItinerary(finalItinerary),
      packing: fetched.packing
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateDayData = (date: string, newDayItems: ItineraryItem[]) => {
    const overridesRaw = localStorage.getItem('osaka_itinerary_overrides');
    const overrides = overridesRaw ? JSON.parse(overridesRaw) : {};
    
    overrides[date] = newDayItems.map(item => ({
      ...item,
      Date: date, // Ensure date matches
      _timestamp: calculateTimestamp(date, item.Time)
    }));

    localStorage.setItem('osaka_itinerary_overrides', JSON.stringify(overrides));
    loadData(); // Re-trigger load to refresh state
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9FB]">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-4">🍡</div>
          <p className="font-bold text-navy opacity-60">載入大阪冒險中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FB] font-sans pb-24 text-[#5D4037]">
      <main className="max-w-md mx-auto min-h-screen bg-white/50 shadow-2xl overflow-hidden relative border-x-4 border-navy/5">
        {activeTab === 'home' && <Home onSwitchTab={(tab: TabType) => setActiveTab(tab)} />}
        {activeTab === 'day' && (
          <DayView 
            items={data.itinerary} 
            onUpdateDay={handleUpdateDayData}
          />
        )}
        {activeTab === 'all' && <Itinerary items={data.itinerary} />}
        {activeTab === 'packing' && <PackingList items={data.packing} />}
        {activeTab === 'tools' && <Tools onSwitchTab={(tab: TabType) => setActiveTab(tab)} />}
        {activeTab === 'phrasebook' && <Phrasebook onSwitchTab={(tab: TabType) => setActiveTab(tab)} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t-4 border-primary border-dashed z-50 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-3 pb-6">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={Map} label="首頁" />
          <NavButton active={activeTab === 'day'} onClick={() => setActiveTab('day')} icon={Clock} label="每日" />
          <NavButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} icon={Calendar} label="總覽" />
          <NavButton active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} icon={Wrench} label="工具" />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 transition-all w-16 ${active ? '-translate-y-2' : ''}`}>
    <div className={`p-3 rounded-2xl transition-all shadow-sm ${active ? 'bg-primary text-white rotate-3 shadow-lg scale-110' : 'bg-navy/5 text-navy/40'}`}>
      <Icon className="w-5 h-5" strokeWidth={2.5} />
    </div>
    <span className={`text-[10px] font-black ${active ? 'text-primary' : 'text-navy/30'}`}>{label}</span>
  </button>
);

export default App;
