import React, { useState, useEffect } from 'react';
import { Navigation, Timer, ArrowLeftRight, Plane, Hotel, Star, CloudSun, Utensils, Map as MapIcon, Coffee, Sun, Moon, Cloud, ThermometerSun, Shirt } from 'lucide-react';
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
  
  const TRIP_START = new Date('2026-03-05T00:00:00');
  const TRIP_END = new Date('2026-03-12T23:59:59');
  const [tripStatus, setTripStatus] = useState({ label: '', value: '', sub: '' });

  useEffect(() => {
    // Current Weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=34.6937&longitude=135.5023&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min')
      .then(r => r.json()).then(d => {
        setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code });
      })
      .catch(() => {});

    // Trip Status & Countdown Logic
    const updateStatus = () => {
      const now = new Date();
      if (now < TRIP_START) {
        const diff = TRIP_START.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        setTripStatus({ 
          label: '冒險倒數計時', 
          value: `${days}`, 
          sub: 'DAYS TO GO' 
        });
      } else if (now >= TRIP_START && now <= TRIP_END) {
        const diff = now.getTime() - TRIP_START.getTime();
        const dayNum = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        setTripStatus({ 
          label: '大阪冒險展開中', 
          value: `第 ${dayNum} 天`, 
          sub: 'ADVENTURE DAY' 
        });
      } else {
        setTripStatus({ 
          label: '冒險已完成', 
          value: 'Mission Clear', 
          sub: 'TRIP COMPLETED' 
        });
      }
    };

    updateStatus();
    const statusTimer = setInterval(updateStatus, 60000);

    getGoogleSheetData().then(data => {
      const now = new Date();
      const futureEvents = data.itinerary.filter(item => item._timestamp && item._timestamp > now.getTime());
      if (futureEvents.length > 0) setNextActivity(futureEvents[0]);
    });

    const savedPrep = localStorage.getItem('osaka_prep_time');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
    
    return () => clearInterval(statusTimer);
  }, []);

  const getClothingAdvice = (temp: number) => {
    if (temp <= 8) return "超冷！羽絨衣+暖暖包不可少 ❄️";
    if (temp <= 15) return "溫差大，建議洋蔥式穿搭，帶件厚外套 🧥";
    if (temp <= 22) return "涼爽舒適，薄外套或長袖即可 👕";
    return "天氣熱，短袖加件防曬薄外套 ☀️";
  };

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
    <div className="px-6 py-10 space-y-8 min-w-0" style={{ color: '#5D4037' }}>
      <header className="text-center space-y-2 min-w-0">
        <h1 className="text-4xl font-black">大阪冒險地圖 🐹</h1>
        <p className="text-sm font-bold bg-secondary/30 border-2 border-dashed border-navy inline-block px-4 py-1 rounded-full">OSAKA ADVENTURE 2026</p>
      </header>

      {/* Dynamic Trip Status */}
      <section className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow relative overflow-hidden" style={{ borderStyle: 'solid' }}>
        <div className="absolute top-2 right-2 opacity-10"><Star className="w-16 h-12 fill-primary" /></div>
        <p className="text-xs font-black uppercase flex items-center gap-2 mb-1"><Timer className="w-4 h-4" /> {tripStatus.label}</p>
        <div className="flex items-baseline gap-2 font-black">
          <span className="text-5xl">{tripStatus.value}</span>
          <span className="text-sm opacity-40 tracking-tighter ml-1">{tripStatus.sub}</span>
        </div>
      </section>

      {/* Detailed Weather & Clothing Advice */}
      <section className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-secondary" />
            今日天氣預報
          </h3>
          <span className="text-2xl font-black">{weather?.temp ?? '--'}°C</span>
        </div>
        
        {/* Day Forecast Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-sakura/20 border-2 border-navy border-dashed p-3 rounded-2xl text-center">
            <Sun className="w-5 h-5 mx-auto mb-1 text-orange-400" />
            <p className="text-[9px] font-black opacity-40 uppercase">Morning</p>
            <p className="font-black text-sm">{(weather?.temp || 0) - 2}°C</p>
          </div>
          <div className="bg-accent/30 border-2 border-navy border-dashed p-3 rounded-2xl text-center">
            <ThermometerSun className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
            <p className="text-[9px] font-black opacity-40 uppercase">Afternoon</p>
            <p className="font-black text-sm">{(weather?.temp || 0) + 3}°C</p>
          </div>
          <div className="bg-secondary/20 border-2 border-navy border-dashed p-3 rounded-2xl text-center">
            <Moon className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
            <p className="text-[9px] font-black opacity-40 uppercase">Night</p>
            <p className="font-black text-sm">{(weather?.temp || 0) - 4}°C</p>
          </div>
        </div>

        {/* Clothing Advice Card */}
        <div className="bg-[#FFF9FB] border-4 border-navy border-double p-4 rounded-2xl flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
            <Shirt className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">穿搭建議 Advice</p>
            <p className="text-sm font-black mt-0.5 leading-tight">
              {weather ? getClothingAdvice(weather.temp) : "取得數據中..."}
            </p>
          </div>
        </div>
      </section>

      {/* Morning Suggestions */}
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

      {/* Currency Converter */}
      <section className="bg-accent border-4 border-navy p-5 rounded-[2.5rem] sticker-shadow">
        <p className="text-[10px] font-bold opacity-50 mb-2 flex items-center gap-1 uppercase tracking-widest">
          <ArrowLeftRight className="w-3 h-3" /> 匯率計算 (0.22)
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[9px] font-black opacity-30 mb-1 ml-1">JPY 日幣</p>
            <input 
              type="number" 
              value={jpy} 
              onChange={e => {setJpy(e.target.value); setTwd((Number(e.target.value)*0.22).toFixed(0))}} 
              className="bg-white rounded-xl py-2 font-black text-2xl w-full outline-none border-2 border-navy text-center" 
            />
          </div>
          <div className="text-2xl pt-4">➡️</div>
          <div className="flex-1">
            <p className="text-[9px] font-black opacity-30 mb-1 ml-1">TWD 台幣</p>
            <div className="bg-white/50 border-2 border-navy/10 rounded-xl py-2 font-black text-2xl w-full text-center">
              {twd}
            </div>
          </div>
        </div>
      </section>

      {/* Pocket Lists */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-navy/40 ml-4">口袋名單 Pocket Lists</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => window.open('https://maps.app.goo.gl/itnEoRUTGcwptQ5x9', '_blank')} className="bg-white border-4 border-navy p-5 rounded-[2.5rem] sticker-shadow flex flex-col items-center gap-2 active:translate-y-1">
            <div className="w-12 h-12 bg-sakura border-2 border-navy rounded-full flex items-center justify-center"><Utensils className="w-6 h-6" /></div>
            <span className="font-black text-sm">🇯🇵 美食地圖</span>
          </button>
          <button onClick={() => window.open('https://maps.app.goo.gl/kVX3K73s8bmBWZdu9', '_blank')} className="bg-white border-4 border-navy p-5 rounded-[2.5rem] sticker-shadow flex flex-col items-center gap-2 active:translate-y-1">
            <div className="w-12 h-12 bg-secondary border-2 border-navy rounded-full flex items-center justify-center"><MapIcon className="w-6 h-6" /></div>
            <span className="font-black text-sm">🎡 景點清單</span>
          </button>
        </div>
      </section>

      {/* Accommodation */}
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