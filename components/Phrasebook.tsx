import React, { useState } from 'react';
import { ChevronLeft, X, Maximize2 } from 'lucide-react';
import { TabType } from '../types';

interface Phrase {
  tw: string;
  jp: string;
  romaji: string;
}

interface PhrasebookProps {
  onSwitchTab: (tab: TabType) => void;
}

const phrasesData: Record<string, Phrase[]> = {
  dining: [
    { tw: "不好意思 (呼叫店員)", jp: "すみません", romaji: "Sumimasen" },
    { tw: "我們有 4 位", jp: "4人です", romaji: "Yonin desu" },
    { tw: "我們有 2 位", jp: "2人です", romaji: "Futari desu" },
    { tw: "請問有英文菜單嗎？", jp: "英語のメニューはありますか？", romaji: "Eigo no menyū wa arimasu ka?" },
    { tw: "我要點這個 (指著菜單)", jp: "これをお願いします", romaji: "Kore o onegaishimasu" },
    { tw: "請給我冰水", jp: "お水をお願いします", romaji: "Omizu o onegaishimasu" },
    { tw: "請結帳", jp: "お会計をお願いします", romaji: "Okaikei o onegaishimasu" },
    { tw: "可以分開結帳嗎？", jp: "別々にできますか？", romaji: "Betsubetsu ni dekimasu ka?" }
  ],
  shopping: [
    { tw: "這個多少錢？", jp: "いくらですか？", romaji: "Ikura desu ka?" },
    { tw: "可以免稅嗎？", jp: "免税できますか？", romaji: "Menzei dekimasu ka?" },
    { tw: "可以使用信用卡嗎？", jp: "クレジットカードは使えますか？", romaji: "Kurejitto kādo wa tsukaemasu ka?" },
    { tw: "有其他顏色或尺寸嗎？", jp: "他の色やサイズはありますか？", romaji: "Hoka no iro ya saizu wa arimasu ka?" },
    { tw: "可以試穿嗎？", jp: "試着できますか？", romaji: "Shichaku dekimasu ka?" },
    { tw: "不用塑膠袋", jp: "袋はいりません", romaji: "Fukuro wa irimasen" },
    { tw: "我要買這個", jp: "これをください", romaji: "Kore o kudasai" }
  ],
  transport: [
    { tw: "我要下車 (擁擠時)", jp: "降ります！", romaji: "Orimasu!" },
    { tw: "請問車站怎麼走？", jp: "駅はどこですか？", romaji: "Eki wa doko desu ka?" },
    { tw: "請載我到這裡 (地圖)", jp: "ここまでお願いします", romaji: "Koko made onegaishimasu" },
    { tw: "這班車會到大阪嗎？", jp: "これは大阪に行きますか？", romaji: "Kore wa Osaka ni ikimasu ka?" },
    { tw: "請在這裡停車", jp: "ここで止めてください", romaji: "Koko de tomete kudasai" }
  ],
  emergency: [
    { tw: "請幫幫我！", jp: "助けてください！", romaji: "Tasukete kudasai!" },
    { tw: "我不舒服", jp: "気分が悪いです", romaji: "Kibun ga warui desu" },
    { tw: "我的東西掉了", jp: "忘れ物をしました", romaji: "Wasuremono o shimashita" },
    { tw: "哪裡有醫院？", jp: "病院はどこですか？", romaji: "Byōin wa doko desu ka?" },
    { tw: "警察局在哪裡？", jp: "交番はどこですか？", romaji: "Kōban wa doko desu ka?" }
  ]
};

const CATEGORIES = [
  { id: 'dining', label: '🍽️ 用餐' },
  { id: 'shopping', label: '🛍️ 購物' },
  { id: 'transport', label: '🚃 交通' },
  { id: 'emergency', label: '🆘 緊急' },
];

const Phrasebook: React.FC<PhrasebookProps> = ({ onSwitchTab }) => {
  const [activeCategory, setActiveCategory] = useState<string>('dining');
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);

  const activePhrases = phrasesData[activeCategory] || [];

  return (
    <div className="min-h-screen pb-24 px-6 pt-10" style={{ backgroundColor: '#FFF9FB', color: '#5D4037', fontFamily: '"Zen Maru Gothic", sans-serif' }}>
      <header className="flex items-center justify-between mb-8">
        <button 
          onClick={() => onSwitchTab('tools')} 
          className="p-2 bg-white border-4 border-[#5D4037] rounded-xl active:translate-y-1 sticker-shadow"
          style={{ borderStyle: 'solid' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-black">手指日語全集 📖</h2>
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Survival Phrases</p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Category Tabs Interface */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="p-4 border-4 rounded-2xl flex flex-col items-center justify-center transition-all active:translate-y-1 sticker-shadow"
            style={{ 
              backgroundColor: activeCategory === cat.id ? '#FFD1DC' : '#FFFFFF',
              borderColor: '#5D4037',
              borderStyle: 'solid',
              color: '#5D4037'
            }}
          >
            <span className="text-xl mb-1">{cat.label.split(' ')[0]}</span>
            <span className="text-xs font-black">{cat.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Phrase Cards List */}
      <div className="space-y-4">
        {activePhrases.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPhrase(phrase)}
            className="w-full bg-white border-4 border-[#5D4037] p-5 rounded-[2rem] sticker-shadow text-left flex items-center justify-between active:translate-y-1 group"
            style={{ borderStyle: 'solid' }}
          >
            <div className="min-w-0 flex-1">
              <p className="font-black text-lg leading-snug truncate">{phrase.tw}</p>
              <p className="text-[10px] font-bold opacity-30 mt-1 italic uppercase tracking-wider">{phrase.romaji}</p>
            </div>
            <div className="ml-4 p-2 bg-[#FFF9FB] rounded-full opacity-40 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      {/* Big Text Modal */}
      {selectedPhrase && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
          style={{ backgroundColor: 'rgba(93, 64, 55, 0.9)', backdropFilter: 'blur(8px)' }}
        >
          <div 
            className="bg-white border-8 border-[#5D4037] rounded-[3.5rem] w-full max-w-sm p-10 flex flex-col items-center text-center relative shadow-2xl overflow-hidden" 
            style={{ borderStyle: 'solid' }}
          >
            {/* Decorative background blurs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FFB7C5]/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#89CFF0]/20 rounded-full blur-2xl"></div>

            <button 
              onClick={() => setSelectedPhrase(null)}
              className="absolute top-6 right-6 p-2 bg-[#5D4037]/5 rounded-full"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-black text-[#5D4037]/40 uppercase tracking-[0.2em]">請給店員看 / SHOW STAFF</p>
              <div className="h-1.5 w-12 bg-[#FFB7C5] mx-auto rounded-full"></div>
            </div>
            
            <div className="my-10 w-full flex flex-col items-center gap-6">
              <h3 className="text-4xl md:text-5xl font-black leading-tight text-[#5D4037] break-words w-full">
                {selectedPhrase.jp}
              </h3>
            </div>
            
            <div className="w-full h-px bg-[#5D4037]/10 mb-8"></div>
            
            <div className="space-y-2">
              <p className="text-xl font-black text-[#5D4037]/70 leading-relaxed">{selectedPhrase.tw}</p>
              <p className="text-sm italic font-bold text-[#5D4037]/30">{selectedPhrase.romaji}</p>
            </div>
            
            <button 
              onClick={() => setSelectedPhrase(null)}
              className="mt-12 w-full bg-[#5D4037] text-white font-black py-5 rounded-[2rem] active:scale-95 transition-transform sticker-shadow"
            >
              關閉 (CLOSE)
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