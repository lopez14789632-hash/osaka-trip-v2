
import React from 'react';
import { 
  MessageCircle, 
  Package, 
  Phone, 
  Hospital, 
  ShieldAlert, 
  Languages,
  ExternalLink,
  Info,
  BookOpen
} from 'lucide-react';
import { TabType } from '../types';

interface ToolsProps {
  onSwitchTab: (tab: TabType) => void;
}

const Tools: React.FC<ToolsProps> = ({ onSwitchTab }) => {
  return (
    <div className="px-6 py-10 space-y-8 min-w-0">
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
              <p>🚨 緊急救助(非急難請勿撥打)：+81-90-8794-4568</p>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] font-bold opacity-20 pt-4">吉伊卡哇祝你旅途平安順利！🍮</p>
    </div>
  );
};

export default Tools;
