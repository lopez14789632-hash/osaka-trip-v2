
import React, { useState, useEffect } from 'react';
import { Navigation, Timer, ArrowLeftRight, Plane, Hotel, Star, CloudSun, Utensils, Map as MapIcon, Coffee, AlarmClock, Sun, Moon } from 'lucide-react';
import { WeatherData, ItineraryItem, TabType } from '../types';
import { getGoogleSheetData } from '../utils/csvParser';

interface HomeProps {
  onSwitchTab?: (tab: TabType) => void;
}

const Home: React.FC<HomeProps> = ({ onSwitchTab }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [jpy, setJpy] = useState<string>('1000');
  const [twd, setTwd] = useState<string>('220');
  const [prepTime, setPrepTime] = useState<number>(60);
  const [nextActivity, setNextActivity] = useState<ItineraryItem | null>(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0 });
  const TRIP_START = new Date('2026-03-05T10:20:00');

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=34.6937&longitude=135.5023&current=temperature_2m,weather_code')
      .then(r => r.json()).then(d => setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code }))
      .catch(() => {});

    const timer = setInterval(() => {
      const diff = TRIP_START.getTime() - new Date().getTime();
      if (diff > 0) setTimeLeft({ d: Math.floor(diff/(1000*60*60*24)), h: Math.floor((diff/(1000*60*60))%24), m: Math.floor((diff/60000)%60) });
    }, 1000);

    getGoogleSheetData().then(data => {
      const now = new Date();
      const futureEvents = data.itinerary.filter(item => item._timestamp && item._timestamp > now.getTime());
      if (futureEvents.length > 0) setNextActivity(futureEvents[0]);
    });

    const savedPrep = localStorage.getItem('osaka_prep_time');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
    return () => clearInterval(timer);
  }, []);

  const updatePrepTime = (val: number) => {
    const newTime = Math.max(0, val);
    setPrepTime(newTime);
    localStorage.setItem('osaka_prep_time', newTime.toString());
  };

  const morningInfo = (() => {
    if (!nextActivity || !nextActivity._timestamp) return null;
    const activityDate = new Date(nextActivity._timestamp);
    const departureTime = new Date(nextActivity._timestamp - (nextActivity.travelTime * 60000));
    const wakeUpTime = new Date(departureTime.getTime() - (prepTime * 60000));
    const formatTime = (date: Date) => date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false });
    return {
      wakeUp: formatTime(wakeUpTime),
      departure: formatTime(departureTime),
      activity: nextActivity.Activity,
      isTomorrow: activityDate.getDate() !== new Date().getDate()
    };
  })();

  return (
    <div className="px-6 py-10 space-y-8 min-w-0">
      <header className="text-center space-y-2 min-w-0">
        <h1 className="text-4xl font-black">大阪冒險地圖 🐹</h1>
        <p className="text-sm font-bold bg-secondary/30 border-2 border-dashed border-navy inline-block px-4 py-1 rounded-full">OSAKA ADVENTURE 2026</p>
      </header>

      {morningInfo && (
        <section className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg flex items-center gap-2">
              {morningInfo.isTomorrow ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
              {morningInfo.isTomorrow ? '明日行程建議' : '今日行程建議'}
            </h3>
            <div className="flex items-center gap-1 bg-navy/5 px-2 py-1 rounded-full text-[10px] font-black">
              <Coffee className="w-3 h-3" /> {prepTime}m
              <button onClick={() => updatePrepTime(prepTime - 10)} className="w-5 h-5 bg-white border border-navy rounded">-</button>
              <button onClick={() => updatePrepTime(prepTime + 10)} className="w-5 h-5 bg-white border border-navy rounded">+</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sakura/30 border-2 border-navy border-dashed p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black opacity-50 uppercase mb-1">建議起床</p>
              <p className="text-3xl font-black">{morningInfo.wakeUp}</p>
            </div>
            <div className="bg-secondary/20 border-2 border-navy border-dashed p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black opacity-50 uppercase mb-1">建議出門</p>
              <p className="text-3xl font-black">{morningInfo.departure}</p>
            </div>
          </div>
          <p className="text-center text-[10px] font-black opacity-40">首站：{morningInfo.activity}</p>
        </section>
      )}

      <section className="bg-white border-4 border-navy p-6 rounded-[2rem] sticker-shadow relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-20"><Star className="w-12 h-12 fill-primary" /></div>
        <p className="text-xs font-black uppercase flex items-center gap-2"><Timer className="w-4 h-4" /> 冒險開始倒數</p>
        <div className="flex items-end gap-2 font-black">
          <span className="text-5xl">{timeLeft.d}</span><span className="text-xl mb-1">天</span>
          <span className="text-4xl ml-2">{timeLeft.h}</span><span className="text-lg mb-1">時</span>
          <span className="text-3xl ml-2">{timeLeft.m}</span><span className="text-base mb-1">分</span>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-4 border-navy p-5 rounded-[2rem] sticker-shadow text-center">
          <CloudSun className="w-8 h-8 mx-auto mb-2 text-secondary" />
          <p className="text-[10px] font-bold opacity-50 uppercase">大阪天氣</p>
          <p className="text-2xl font-black">{weather?.temp ?? '--'}°C</p>
        </div>
        <div className="bg-accent border-4 border-navy p-4 rounded-[2rem] sticker-shadow">
          <p className="text-[10px] font-bold opacity-50 mb-1 flex items-center gap-1 uppercase"><ArrowLeftRight className="w-3 h-3" /> 匯率 (0.22)</p>
          <input type="number" value={jpy} onChange={e => {setJpy(e.target.value); setTwd((Number(e.target.value)*0.22).toFixed(0))}} className="bg-white/50 rounded-xl py-1 font-black text-xl w-full outline-none border-2 border-navy/10 text-center" />
          <p className="text-xs font-bold text-center mt-2">≈ {twd} TWD</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-navy/40 ml-4">口袋名單 Pocket Lists</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => window.open('https://maps.app.goo.gl/itnEoRUTGcwptQ5x9', '_blank')} className="bg-white border-4 border-navy p-5 rounded-[2rem] sticker-shadow flex flex-col items-center gap-2 active:translate-y-1">
            <div className="w-12 h-12 bg-sakura border-2 border-navy rounded-full flex items-center justify-center"><Utensils className="w-6 h-6" /></div>
            <span className="font-black text-sm">🇯🇵 美食地圖</span>
          </button>
          <button onClick={() => window.open('https://maps.app.goo.gl/kVX3K73s8bmBWZdu9', '_blank')} className="bg-white border-4 border-navy p-5 rounded-[2rem] sticker-shadow flex flex-col items-center gap-2 active:translate-y-1">
            <div className="w-12 h-12 bg-secondary border-2 border-navy rounded-full flex items-center justify-center"><MapIcon className="w-6 h-6" /></div>
            <span className="font-black text-sm">🎡 景點清單</span>
          </button>
        </div>
      </section>

      <section onClick={() => window.open('https://maps.app.goo.gl/LuChh3jX6nLGKv8P8', '_blank')} className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow cursor-pointer active:translate-y-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent border-2 border-navy rounded-2xl flex items-center justify-center"><Hotel className="w-8 h-8" /></div>
            <div>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">住宿地點</p>
              <h4 className="font-black text-xl truncate">地鐵小路站民宿</h4>
            </div>
          </div>
          <div className="p-3 bg-secondary border-2 border-navy rounded-full text-white sticker-shadow"><Navigation className="w-6 h-6" /></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
