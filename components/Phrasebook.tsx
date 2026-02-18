import React, { useState } from 'react';
import { ChevronLeft, X, Maximize2 } from 'lucide-react';
import { TabType } from '../types';

interface Phrase {
  category: string;
  zh: string;
  jp: string;
  romaji: string;
}

interface PhrasebookProps {
  onSwitchTab: (tab: TabType) => void;
}

const PHRASES: Phrase[] = [
  // Dining (用餐)
  { category: '用餐', zh: "不好意思 / 請問", jp: "すみません", romaji: "Sumimasen" },
  { category: '用餐', zh: "有英文菜單嗎？", jp: "英語のメニューはありますか？", romaji: "Eigo no menyuu wa arimasu ka?" },
  { category: '用餐', zh: "2位，謝謝。", jp: "二人です、お願いします。", romaji: "Futari desu, onegaishimasu." },
  { category: '用餐', zh: "我是預約1點的 [名字]。", jp: "1時に予約した [Name] です。", romaji: "Ichiji ni yoyaku shita [Name] desu." },
  { category: '用餐', zh: "是的，我要點這個。", jp: "はい、これをお願いします。", romaji: "Hai, kore o onegaishimasu." },
  { category: '用餐', zh: "請給我水。", jp: "お水をお願いします。", romaji: "Omizu o onegaishimasu." },
  { category: '用餐', zh: "請不要加蔥。", jp: "ネギ抜きでお願いします。", romaji: "Negi nuki de onegaishimasu." },
  { category: '用餐', zh: "我要結帳。", jp: "お会計お願いします。", romaji: "Okaikei onegaishimasu." },
  { category: '用餐', zh: "請分開結帳。", jp: "別々でお願いします。", romaji: "Betsubetsu de onegaishimasu." },

  // Shopping (購物)
  { category: '購物', zh: "這個可以試穿嗎？", jp: "これ、試着できますか？", romaji: "Kore, shichaku dekimasu ka?" },
  { category: '購物', zh: "有其他尺寸嗎？", jp: "他のサイズがありますか？", romaji: "Hoka no saizu ga arimasu ka?" },
  { category: '購物', zh: "這可以免稅嗎？", jp: "這是免税になりますか？", romaji: "Kore wa menzei ni narimasu ka?" },
  { category: '購物', zh: "不用塑膠袋。", jp: "袋はいりません。", romaji: "Fukuro wa irimasen." },
  { category: '購物', zh: "可以用信用卡嗎？", jp: "クレジットカードが使えますか？", romaji: "Kurejitto kaado ga tsukaemasu ka?" },
  { category: '購物', zh: "我要買這個。", jp: "これをください。", romaji: "Kore o kudasai." },

  // Transportation (交通)
  { category: '交通', zh: "我要下車！(擁擠時)", jp: "降ります！", romaji: "Orimasu!" },
  { category: '交通', zh: "請載我到 [這裡]。(計程車)", jp: "[Place] までお願いします。", romaji: "[Place] made onegaishimasu." },
  { category: '交通', zh: "請在這裡停車。", jp: "ここで止めてください。", romaji: "Koko de tomete kudasai." },
  { category: '交通', zh: "去這裡的地圖在哪？", jp: "ここへの地図はどこですか？", romaji: "Koko e no chizu wa doko desu ka?" },

  // Emergency (緊急)
  { category: '緊急', zh: "請幫幫我！", jp: "助けてください！", romaji: "Tasukete kudasai!" },
  { category: '緊急', zh: "我不舒服。", jp: "気分が悪いです。", romaji: "Kibun ga warui desu." },
  { category: '緊急', zh: "東西不見了。", jp: "失くし物をしました。", romaji: "Nakushimono o shimashita." },
  { category: '緊急', zh: "警察局在哪？", jp: "交番はどこですか？", romaji: "Kouban wa doko desu ka?" },
];

const CATEGORIES = [
  { id: '用餐', label: '🍽️ 用餐', color: '#FFB7C5' },
  { id: '購物', label: '🛍️ 購物', color: '#FFD1DC' },
  { id: '交通', label: '🚃 交通', color: '#89CFF0' },
  { id: '緊急', label: '🆘 緊急', color: '#FFFFA1' },
];

const Phrasebook: React.FC<PhrasebookProps> = ({ onSwitchTab }) => {
  const [activeCat, setActiveCat] = useState('用餐');
  const [showModal, setShowModal] = useState<Phrase | null>(null);

  const filtered = PHRASES.filter(p => p.category === activeCat);

  return (
    <div className="min-h-screen bg-[#FFF9FB] pb-24 px-6 pt-10 font-['Zen_Maru_Gothic']" style={{ color: '#5D4037' }}>
      <header className="flex items-center justify-between mb-8">
        <button 
          onClick={() => onSwitchTab('tools')} 
          className="p-2 border-4 border-[#5D4037] rounded-xl active:translate-y-1 bg-white sticker-shadow" 
          style={{ borderStyle: 'solid' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-black">手指日語 📖</h2>
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Phrasebook</p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Category Tabs Interface */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className="border-4 border-[#5D4037] rounded-2xl p-3 flex flex-col items-center justify-center transition-all active:translate-y-1 sticker-shadow"
            style={{ 
              backgroundColor: activeCat === cat.id ? '#5D4037' : '#FFFFFF',
              color: activeCat === cat.id ? '#FFFFFF' : '#5D4037',
              borderStyle: 'solid'
            }}
          >
            <span className="text-xl mb-1">{cat.label.split(' ')[0]}</span>
            <span className="text-xs font-black">{cat.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Phrase Cards List */}
      <div className="space-y-4">
        {filtered.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setShowModal(p)}
            className="w-full bg-white border-4 border-[#5D4037] p-5 rounded-[2rem] sticker-shadow text-left flex items-center justify-between active:translate-y-1 group"
            style={{ borderStyle: 'solid' }}
          >
            <div className="min-w-0 flex-1">
              <p className="font-black text-lg leading-snug truncate">{p.zh}</p>
              <p className="text-[10px] font-bold opacity-30 mt-1 italic uppercase tracking-wider">{p.romaji}</p>
            </div>
            <div className="ml-4 p-2 bg-[#FFF9FB] rounded-full opacity-40 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      {/* Big Text Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#5D4037]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="bg-white border-8 border-[#5D4037] rounded-[3.5rem] w-full max-w-sm p-10 flex flex-col items-center text-center relative shadow-2xl overflow-hidden" 
            style={{ borderStyle: 'solid' }}
          >
            {/* Decorative backgrounds */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FFB7C5]/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#89CFF0]/20 rounded-full blur-2xl"></div>

            <button 
              onClick={() => setShowModal(null)}
              className="absolute top-6 right-6 p-2 bg-[#5D4037]/5 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-black text-[#5D4037]/40 uppercase tracking-[0.2em]">請看這裡 / Please Read</p>
              <div className="h-1.5 w-12 bg-[#FFB7C5] mx-auto rounded-full"></div>
            </div>
            
            <div className="my-10 w-full flex flex-col items-center gap-6">
              <h3 className="text-4xl md:text-5xl font-black leading-tight text-[#5D4037] break-words w-full">
                {showModal.jp}
              </h3>
            </div>
            
            <div className="w-full h-px bg-[#5D4037]/10 mb-8"></div>
            
            <div className="space-y-2">
              <p className="text-xl font-black text-[#5D4037]/70 leading-relaxed">{showModal.zh}</p>
              <p className="text-sm italic font-bold text-[#5D4037]/30">{showModal.romaji}</p>
            </div>
            
            <button 
              onClick={() => setShowModal(null)}
              className="mt-12 w-full bg-[#5D4037] text-white font-black py-5 rounded-[2rem] active:scale-95 transition-transform sticker-shadow"
            >
              了解！(OK)
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] font-bold opacity-20 pt-10">
        點擊卡片可以放大給店員看喔 🍡
      </p>
    </div>
  );
};

export default Phrasebook;