
import React, { useState } from 'react';
import { ChevronLeft, X, Utensils, ShoppingBag, Train, Home, Maximize2, MessageCircle } from 'lucide-react';
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
  // Dining (餐廳)
  { category: '餐廳', zh: "不好意思 / 請問", jp: "すみません", romaji: "Sumimasen" },
  { category: '餐廳', zh: "有英文菜單嗎？", jp: "英語のメニューはありますか？", romaji: "Eigo no menyuu wa arimasu ka?" },
  { category: '餐廳', zh: "沒有預約，2位可以嗎？", jp: "予約していないんですが、2人いいですか？", romaji: "Yoyaku shite inai n desu ga, futari ii desu ka?" },
  { category: '餐廳', zh: "我是預約1點的 [名字]。", jp: "1時に予約した [Name] です。", romaji: "Ichiji ni yoyaku shita [Name] desu." },
  { category: '餐廳', zh: "(對應:準備好點餐了嗎？) 是的，我要這個。", jp: "はい、これをお願いします。", romaji: "Hai, kore o onegaishimasu." },
  { category: '餐廳', zh: "請給我一個這個。", jp: "これ、ひとつお願いします。", romaji: "Kore, hitotsu onegaishimasu." },
  { category: '餐廳', zh: "請給我筷子。(兩雙)", jp: "お箸をお願いします。(二膳)", romaji: "Ohashi o onegaishimasu. (Nizen)" },
  { category: '餐廳', zh: "請給我水。", jp: "お水をお願いします。", romaji: "Omizu o onegaishimasu." },
  { category: '餐廳', zh: "請不要加蔥。", jp: "ネギ抜きでお願いします。", romaji: "Negi nuki de onegaishimasu." },
  { category: '餐廳', zh: "我要結帳。", jp: "お会計お願いします。", romaji: "Okaikei onegaishimasu." },
  { category: '餐廳', zh: "請分開結帳。", jp: "別々でお願いします。", romaji: "Betsubetsu de onegaishimasu." },

  // Shopping (購物)
  { category: '購物', zh: "這個可以試穿嗎？", jp: "これ、試着できますか？", romaji: "Kore, shichaku dekimasu ka?" },
  { category: '購物', zh: "有其他尺寸嗎？", jp: "他のサイズがありますか？", romaji: "Hoka no saizu ga arimasu ka?" },
  { category: '購物', zh: "這可以免稅嗎？", jp: "これは免税になりますか？", romaji: "Kore wa menzei ni narimasu ka?" },
  { category: '購物', zh: "不用塑膠袋。", jp: "袋はいりません。", romaji: "Fukuro wa irimasen." },
  { category: '購物', zh: "可以用信用卡嗎？", jp: "クレジットカードが使えますか？", romaji: "Kurejitto kaado ga tsukaemasu ka?" },
  { category: '購物', zh: "這些是全部的菜單嗎？(問更多選項)", jp: "メニューはこれで全部ですか？", romaji: "Menyuu wa kore de zenbu desu ka?" },
  { category: '購物', zh: "我要這個。", jp: "これをください。", romaji: "Kore o kudasai." },

  // Transport (交通)
  { category: '交通', zh: "我要下車！(擁擠電車時)", jp: "降ります！", romaji: "Orimasu!" },
  { category: '交通', zh: "請載我到 [這裡]。(計程車)", jp: "[Place] までお願いします。", romaji: "[Place] made onegaishimasu." },
  { category: '交通', zh: "請在這裡停車。", jp: "ここで止めてください。", romaji: "Koko de tomete kudasai." },
  { category: '交通', zh: "我要搭下一班。(電梯/電車過擠)", jp: "つぎにします。", romaji: "Tsugi ni shimasu." },
  { category: '交通', zh: "請按5樓。", jp: "5階 おねがいします。", romaji: "Gokai onegaishimasu." },

  // Hotel/Daily (住宿/日常)
  { category: '住宿/日常', zh: "我要辦理入住。", jp: "チェックインお願いします。", romaji: "Chekkuin onegaishimasu." },
  { category: '住宿/日常', zh: "可以寄放行李嗎？", jp: "荷物を預かってもらえますか？", romaji: "Nimotsu o azukatte moraemasu ka?" },
  { category: '住宿/日常', zh: "Wi-Fi 密碼是什麼？", jp: "Wi-Fiのパスワードは何ですか？", romaji: "Waifai no pasuwaado wa nan desu ka?" },
  { category: '住宿/日常', zh: "廁所在哪裡？", jp: "トイレはどこですか？", romaji: "Toire wa doko desu ka?" },
];

const CATEGORIES = [
  { id: 'all', name: '全部', icon: MessageCircle, color: 'bg-gray-100' },
  { id: '餐廳', name: '餐廳', icon: Utensils, color: 'bg-orange-100' },
  { id: '購物', name: '購物', icon: ShoppingBag, color: 'bg-pink-100' },
  { id: '交通', name: '交通', icon: Train, color: 'bg-blue-100' },
  { id: '住宿/日常', name: '住宿/日常', icon: Home, color: 'bg-green-100' },
];

const Phrasebook: React.FC<PhrasebookProps> = ({ onSwitchTab }) => {
  const [activeCat, setActiveCat] = useState('all');
  const [showModal, setShowModal] = useState<Phrase | null>(null);

  const filtered = activeCat === 'all' 
    ? PHRASES 
    : PHRASES.filter(p => p.category === activeCat);

  const getCategoryStyles = (catId: string) => {
    const found = CATEGORIES.find(c => c.id === catId);
    return found || CATEGORIES[0];
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-10 min-w-0 font-['Zen_Maru_Gothic']">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => onSwitchTab('tools')} className="p-2 border-2 border-navy rounded-xl active:translate-y-1 bg-white sticker-shadow">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-black">手指日語全集 📖</h2>
          <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">Survival Phrasebook</p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Categories Tabs */}
      <div className="flex overflow-x-auto gap-3 mb-8 pb-3 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full border-2 border-navy font-black text-xs flex items-center gap-2 transition-all ${
              activeCat === cat.id ? 'bg-accent sticker-shadow scale-105' : 'bg-white opacity-60'
            }`}
          >
            {cat.icon && <cat.icon className="w-4 h-4" />}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((p, idx) => {
          const styles = getCategoryStyles(p.category);
          return (
            <button
              key={idx}
              onClick={() => setShowModal(p)}
              className={`${styles.color} border-4 border-navy p-5 rounded-[2rem] sticker-shadow text-left flex flex-col justify-between active:translate-y-1 transition-transform group`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border-2 border-navy bg-white`}>
                  {p.category}
                </span>
                <Maximize2 className="w-5 h-5 text-navy opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-4">
                <p className="font-black text-lg leading-snug">{p.zh}</p>
                <p className="text-xs font-bold opacity-40 mt-1 italic">{p.romaji}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Staff Modal - Huge Text */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-navy/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border-8 border-navy rounded-[3.5rem] w-full max-w-sm p-10 flex flex-col items-center text-center relative shadow-2xl overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>

            <button 
              onClick={() => setShowModal(null)}
              className="absolute top-6 right-6 p-2 bg-navy/5 rounded-full hover:bg-navy/10 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">請看這裡 / Please Read</p>
              <div className="h-1 w-12 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="my-12 w-full flex flex-col items-center gap-6">
              <h3 className="text-4xl md:text-5xl font-black leading-tight text-navy break-words w-full">
                {showModal.jp}
              </h3>
            </div>
            
            <div className="w-full h-px bg-navy/10 mb-8"></div>
            
            <div className="space-y-2">
              <p className="text-xl font-black text-navy/70">{showModal.zh}</p>
              <p className="text-sm italic font-bold text-navy/30">{showModal.romaji}</p>
            </div>
            
            <button 
              onClick={() => setShowModal(null)}
              className="mt-12 w-full bg-navy text-white font-black py-5 rounded-[2rem] active:scale-95 transition-transform sticker-shadow shadow-navy/20"
            >
              了解！(OK)
            </button>
          </div>
        </div>
      )}

      <p className="text-center text-[10px] font-bold opacity-20 pt-10">點擊小卡片可以放大給店員看喔 🍡</p>
    </div>
  );
};

export default Phrasebook;
