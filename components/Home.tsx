import React, { useState, useEffect, useMemo } from 'react';
import { Navigation, Timer, ArrowLeftRight, Plane, Hotel, Star, CloudSun, Utensils, Map as MapIcon, Coffee, Sun, Moon, ThermometerSun, Shirt, Ticket as TicketIcon } from 'lucide-react';
import { WeatherData, ItineraryItem, TabType } from '../types';
import { getGoogleSheetData } from '../utils/csvParser';

interface HomeProps {
  onSwitchTab?: (tab: TabType) => void;
}

interface HourlyForecast {
  time: string;
  temp: number;
  code: number;
}

const FlightTicket = ({ 
  type, 
  flight, 
  from, 
  to, 
  fromTime, 
  toTime, 
  fromTerm, 
  toTerm, 
  date, 
  stubColor 
}: any) => (
  <div style={{
    display: 'flex',
    background: '#FFF9FB',
    border: '3px solid #5D4037',
    borderRadius: '12px',
    marginBottom: '16px',
    overflow: 'hidden',
    boxShadow: '4px 4px 0px 0px rgba(93, 64, 55, 0.2)',
    position: 'relative'
  }}>
    <div style={{ flex: 3, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: '900', color: '#5D4037', opacity: 0.6, letterSpacing: '0.05em' }}>
          {date}
        </span>
        <span style={{ 
          fontSize: '10px', 
          fontWeight: '900', 
          fontFamily: 'monospace', 
          background: '#5D4037', 
          color: 'white', 
          padding: '2px 8px', 
          borderRadius: '4px' 
        }}>
          {flight}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', lineHeight: 1, color: '#5D4037' }}>{from}</div>
          <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.5 }}>{fromTerm}</div>
        </div>
        <div style={{ fontSize: '24px', margin: '0 8px' }}>✈️</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', lineHeight: 1, color: '#5D4037' }}>{to}</div>
          <div style={{ fontSize: '10px', fontWeight: '700', opacity: 0.5 }}>{toTerm}</div>
        </div>
      </div>

      <div style={{ 
        borderTop: '2px dashed rgba(93, 64, 55, 0.1)', 
        marginTop: '8px', 
        paddingTop: '10px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '8px', fontWeight: '900', opacity: 0.3, textTransform: 'uppercase' }}>Departure</span>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#5D4037' }}>{fromTime}</span>
        </div>
        <div style={{ fontSize: '9px', fontWeight: '900', opacity: 0.3, letterSpacing: '2px' }}>STARLUX AIR</div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
          <span style={{ fontSize: '8px', fontWeight: '900', opacity: 0.3, textTransform: 'uppercase' }}>Arrival</span>
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#5D4037' }}>{toTime}</span>
        </div>
      </div>
    </div>
    
    <div style={{ borderLeft: '3px dashed #5D4037', margin: '0' }}></div>
    
    <div style={{
      flex: 1,
      background: stubColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '900',
      color: '#5D4037',
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      letterSpacing: '4px',
      fontSize: '13px',
      textTransform: 'uppercase',
      borderLeft: 'none'
    }}>
      {type}
    </div>
  </div>
);

const Home: React.FC<HomeProps> = ({ onSwitchTab }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [prepTime, setPrepTime] = useState<number>(60);
  const [nextActivity, setNextActivity] = useState<ItineraryItem | null>(null);

  useEffect(() => {
    // Current & Hourly Weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=34.6937&longitude=135.5023&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=Asia%2FTokyo')
      .then(r => r.json()).then(d => {
        setWeather({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code });
        
        // Pick specific hours: 08:00 to 22:00 (every 1 hour)
        const hoursToPick = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
        const pickedHourly: HourlyForecast[] = [];
        const today = new Date().toISOString().split('T')[0];
        
        d.hourly.time.forEach((t: string, i: number) => {
          const dateObj = new Date(t);
          if (t.startsWith(today) && hoursToPick.includes(dateObj.getHours())) {
            pickedHourly.push({
              time: dateObj.getHours().toString().padStart(2, '0') + ':00',
              temp: Math.round(d.hourly.temperature_2m[i]),
              code: d.hourly.weather_code[i]
            });
          }
        });
        setHourly(pickedHourly);
      })
      .catch(() => {});

    getGoogleSheetData().then(data => {
      const now = new Date();
      const futureEvents = data.itinerary.filter(item => item._timestamp && item._timestamp > now.getTime());
      if (futureEvents.length > 0) setNextActivity(futureEvents[0]);
    });

    const savedPrep = localStorage.getItem('osaka_prep_time');
    if (savedPrep) setPrepTime(parseInt(savedPrep));
  }, []);

  const getWeatherEmoji = (code: number) => {
    if (code <= 1) return '☀️';
    if (code <= 3) return '☁️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 86) return '❄️';
    return '⛅';
  };

  const polylinePoints = useMemo(() => {
    if (hourly.length === 0) return "";
    const temps = hourly.map(h => h.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = Math.max(maxTemp - minTemp, 1);
    const height = 40;
    const padding = 15;
    
    return hourly.map((h, i) => {
      const x = i * 70 + 35; 
      const y = padding + (height - ((h.temp - minTemp) / range) * height);
      return `${x},${y}`;
    }).join(" ");
  }, [hourly]);

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
        <div className="inline-block bg-secondary/30 border-2 border-dashed border-navy px-4 py-1 rounded-full">
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">Osaka Adventure 2026</p>
        </div>
      </header>

      {/* Digital Flight Tickets */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-navy/40 ml-4 flex items-center gap-2">
          <Plane className="w-3 h-3" /> 航班資訊 Boarding Pass
        </h3>
        
        <FlightTicket 
          type="Departure"
          flight="JX834"
          from="TPE"
          to="UKB"
          fromTime="07:00"
          toTime="10:30"
          fromTerm="桃園 T1"
          toTerm="神戶 T2"
          date="3/05 (Thu)"
          stubColor="#FFD1DC"
        />

        <FlightTicket 
          type="Return"
          flight="JX821"
          from="KIX"
          to="TPE"
          fromTime="12:20"
          toTime="14:35"
          fromTerm="關西 T1"
          toTerm="桃園 T1"
          date="3/12 (Thu)"
          stubColor="#89CFF0"
        />
      </section>

      {/* Hourly Weather Chart (1-hour intervals) */}
      <section className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-secondary" />
            今日天氣
          </h3>
          <span className="text-2xl font-black">{weather?.temp ?? '--'}°C</span>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="weather-scroll pb-2" style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth' }}>
            <div className="flex relative" style={{ width: `${hourly.length * 70}px`, height: '110px' }}>
              {/* Temperature Curve */}
              {hourly.length > 0 && (
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ height: '110px' }}>
                  <polyline
                    fill="none"
                    stroke="var(--secondary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                    style={{ opacity: 0.4 }}
                  />
                  {hourly.map((h, i) => {
                    const points = polylinePoints.split(" ");
                    if (!points[i]) return null;
                    const [x, y] = points[i].split(",");
                    return <circle key={i} cx={x} cy={y} r="3" fill="var(--secondary)" />;
                  })}
                </svg>
              )}
              
              {hourly.map((h, i) => (
                <div key={i} className="flex flex-col items-center justify-between" style={{ width: '70px', height: '100%', flexShrink: 0 }}>
                  <span className="text-[10px] font-black opacity-30">{h.time}</span>
                  <span className="text-2xl my-1">{getWeatherEmoji(h.code)}</span>
                  <span className="text-sm font-black">{h.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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

      {morningInfo && (
        <section className="bg-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg flex items-center gap-2">
              {morningInfo.isTomorrow ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
              {morningInfo.isTomorrow ? '明日行程建議' : '今日行程建議'}
            </h3>
            <div className="flex items-center gap-1 bg-navy/5 px-2 py-1 rounded-full text-[10px] font-black">
              <Coffee className="w-3 h-3" /> {prepTime}m
              <div className="flex gap-1 ml-1">
                <button onClick={() => updatePrepTime(prepTime - 10)} className="w-5 h-5 bg-white border border-navy rounded flex items-center justify-center">-</button>
                <button onClick={() => updatePrepTime(prepTime + 10)} className="w-5 h-5 bg-white border border-navy rounded flex items-center justify-center">+</button>
              </div>
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