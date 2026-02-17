import React, { useState } from 'react';
import { 
  MessageCircle, 
  Package, 
  Phone, 
  Hospital, 
  ShieldAlert, 
  Languages,
  ExternalLink,
  Info,
  BookOpen,
  Map as MapIcon,
  Train,
  X,
  ChevronRight
} from 'lucide-react';
import { TabType } from '../types';

interface ToolsProps {
  onSwitchTab: (tab: TabType) => void;
}

const SUBWAY_ROUTES = [
  { dest: "心齋橋 (M19)", time: "15分", route: "S22 -> 難波 (S16/M20) -> M19", color: "bg-red-500" },
  { dest: "難波 (S16)", time: "10分", route: "千日前線 (S22 -> S16) 直達", color: "bg-pink-500" },
  { dest: "日本橋 (S17)", time: "8分", route: "千日前線 (S22 -> S17) 直達", color: "bg-pink-500" },
  { dest: "鶴橋 (S19)", time: "5分", route: "千日前線 (S22 -> S19) 直達", color: "bg-pink-500" },
  { dest: "大阪梅田", time: "25分", route: "S22 -> 鶴橋 -> JR 環狀線", color: "bg-gray-500" },
  { dest: "天王寺", time: "15分", route: "S22 -> 鶴橋 -> JR 環狀線", color: "bg-orange-500" },
];

const Tools: React.FC<ToolsProps> = ({ onSwitchTab }) => {
  const [showSubway, setShowSubway] = useState(false);

  return (
    <div className="px-6 py-10 space-y-8 min-w-0 font-['Zen_Maru_Gothic']">
      <header className="text-center space-y-1">
        <h2 className="text-4xl font-black">小幫手工具 🛠️</h2>
        <p className="text-xs font-bold opacity-30 uppercase tracking-widest">Travel Toolbox</p>
      </header>

      {/* Quick Access Buttons */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => window.open('https://liff.line.me/1655320992-Y8GowEpw/g/oA91jTLYgZWSaUCaQrdagq', '_blank')}
          className="bg-[#06C755] text-white border-4 border-navy p-5 rounded-[2rem] sticker-shadow flex flex-col items-center gap-2 active:translate-y-1"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="font-black text-sm">LINE 分帳</span>
        </button>
        <button 
          onClick={() => onSwitchTab('packing')}
          className="bg-accent text-navy border-4 border-navy p-5 rounded-[2rem] sticker-shadow flex flex-col items-center gap-2 active:translate-y-1"
        >
          <Package className="w-8 h-8" />
          <span className="font-black text-sm">打包清單</span>
        </button>
      </section>

      {/* Subway Cheat Sheet Toggle */}
      <section>
        <button 
          onClick={() => setShowSubway(true)}
          className="w-full bg-secondary text-white border-4 border-navy p-6 rounded-[2.5rem] sticker-shadow flex items-center justify-between active:translate-y-1"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl"><Train className="w-8 h-8" /></div>
            <div className="text-left">
              <p className="font-black text-xl">🚇 Subway Cheat Sheet</p>
              <p className="text-xs font-bold opacity-60">小路站 (S22) 出發路線</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-40" />
        </button>
      </section>

      {/* Phrasebook Launcher */}
      <section className="space-y-4">
        <h3 className="text-sm font-black flex items-center gap-2 text-navy/60 px-2 uppercase tracking-widest">
          <Languages className="w-4 h-4" /> 語言翻譯
        </h3>
        <button 
          onClick={() => onSwitchTab('phrasebook')}
          className="w-full bg-white border-4 border-navy p-8 rounded-[2.5rem] sticker-shadow flex flex-col items-center gap-3 active:translate-y-1 group"
        >
          <div className="w-16 h-16 bg-primary/20 border-2 border-navy rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8 text-navy" />
          </div>
          <div className="text-center">
            <p className="font-black text-xl">手指日語全集</p>
            <p className="text-xs font-bold opacity-40">點擊查看 20+ 個常用對話</p>
          </div>
        </button>
      </section>

      {/* Emergency SOS */}
      <section className="space-y-4">
        <h3 className="text-sm font-black flex items-center gap-2 text-primary px-2 uppercase tracking-widest">
          <ShieldAlert className="w-4 h-4" /> 緊急救援 (SOS)
        </h3>
        <div className="space-y-3">
          <button 
            onClick={() => window.open('https://oh-doctor.com/', '_blank')}
            className="w-full bg-white border-4 border-primary/30 p-4 rounded-[1.5rem] flex items-center justify-between group active:translate-y-1 sticker-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 p-2 rounded-xl text-primary"><Hospital className="w-6 h-6" /></div>
              <div className="text-left">
                <p className="font-black text-sm">Oh-Doctor 視訊醫療</p>
                <p className="text-[10px] font-bold opacity-40">24H 繁體中文醫師諮詢</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-20" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-navy p-3 rounded-2xl flex items-center gap-3">
              <Phone className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-[10px] font-black opacity-40">警察局</p>
                <p className="font-black">110</p>
              </div>
            </div>
            <div className="bg-white border-2 border-navy p-3 rounded-2xl flex items-center gap-3">
              <Phone className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-[10px] font-black opacity-40">救護車</p>
                <p className="font-black">119</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-navy p-4 rounded-[2rem] sticker-shadow space-y-3">
            <div className="flex items-center gap-2 font-black text-sm">
              <Info className="w-4 h-4 text-secondary" />
              台北駐大阪經濟文化辦事處
            </div>
            <div className="text-[10px] font-bold space-y-1 opacity-60">
              <p>📍 大阪市西區土佐堀1-4-8 日土地肥後橋大樓2F</p>
              <p>📞 代表電話：+81-6-6443-8481</p>
              <p>🚨 緊急救助：+81-90-8794-4568</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subway Modal */}
      {showSubway && (
        <div className="fixed inset-0 z-[110] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white border-4 border-navy rounded-[2.5rem] w-full max-w-sm p-8 sticker-shadow space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
            <div className="text-center sticky top-0 bg-white pb-4 z-10">
              <div className="flex justify-between items-center mb-2">
                <Train className="w-6 h-6 text-secondary" />
                <button onClick={() => setShowSubway(false)} className="p-2 bg-navy/5 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <h4 className="font-black text-2xl">地鐵指南</h4>
              <p className="text-xs font-bold opacity-40">Shoji Station (S22)</p>
            </div>
            
            <div className="space-y-4">
              {SUBWAY_ROUTES.map((route, i) => (
                <div key={i} className="bg-background border-2 border-navy/10 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded ${route.color}`}>{route.dest}</span>
                    <span className="text-xs font-black opacity-40">~{route.time}</span>
                  </div>
                  <p className="text-sm font-bold text-navy/70">{route.route}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold text-center opacity-30">💡 時間僅供參考，請以 Google Maps 為主</p>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] font-bold opacity-20 pt-4">吉伊卡哇祝你旅途平安順利！🍮</p>
    </div>
  );
};

export default Tools;