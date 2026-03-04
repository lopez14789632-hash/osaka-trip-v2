import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Search, Train, Edit3, X, Check, Map as MapIcon, ExternalLink, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
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

// Full guide content data
const LOCATION_GUIDES: Record<string, { title: string, route: string, photos: string[], detail?: string }> = {
  "清水寺": {
    title: "清水寺 ＆ 二三年坂",
    route: "茶碗坂(上坡避開人潮) ➔ 清水寺仁王門 ➔ 買票進本堂 ➔ 清水舞台 ➔ 地主神社(目前整修中可跳過) ➔ 沿階梯往下到音羽瀑布 ➔ 順著路出寺 ➔ 松原通 ➔ 三年坂(產寧坂) ➔ 二年坂(二寧坂) ➔ 法觀寺(八坂之塔) ➔ 往祇園方向。",
    photos: [
      "進場：不要走熱鬧的「松原通」上山，會非常擁擠。建議走平行的「茶碗坂」上去，清幽很多。",
      "清水舞台：走過本堂後，會有一個突出的展望台（奧之院前），這裡是拍攝「清水舞台全景」的經典機位，視野極佳。",
      "音羽瀑布：有三道水流（學業、戀愛、長壽），PTT 鄉民提醒「只能選一道喝，而且只能喝一口」，太貪心願望會無法實現。",
      "二三年坂取景：走到二年坂時，把相機準備好，以「法觀寺（八坂之塔）」為背景由下往上拍，能帶出延伸感。"
    ]
  },
  "伏見稻荷": {
    title: "伏見稻荷大社",
    route: "樓門 ➔ 外拜殿與本殿 ➔ 千本鳥居入口 ➔ 奧社奉拜所（輕重石） ➔ 熊鷹社 ➔ 四辻（半山腰） ➔ 原路折返或走另一側下山。",
    photos: [
      "千本鳥居突圍：剛進鳥居入口時，大家都會停下來拍照，導致大塞車。千萬別在這裡卡位！請直接跟著人群往前走。",
      "奧社奉拜所(分水嶺)：走到這裡會看到「輕重石」（比想像中輕就會實現）。約 70% 的跟團遊客走到這裡就會折返。",
      "無人空景秘境：過了奧社繼續往「四辻」方向爬，鳥居依然密集但路人幾乎消失。走到「四辻」可以俯瞰京都市景。"
    ]
  },
  "嵐山": {
    title: "嵐山",
    route: "JR 嵯峨嵐山站 ➔ 竹林小徑（趁早去） ➔ 野宮神社 ➔ 天龍寺（北門進、正門出） ➔ 嵐山大街（吃小吃） ➔ 渡月橋 ➔ 嵐電或JR離開。",
    photos: [
      "直奔竹林：一到嵐山，什麼都別逛，先直衝「竹林小徑」。越晚人越多，相機很難避開人頭。",
      "天龍寺妙招：從竹林小徑走到底，直接從天龍寺的「北門」買票進入。順著走曹源池庭園，再從正門出來銜接大街。",
      "渡月橋：推薦在橋畔買杯 % Arabica 咖啡，坐在桂川的河堤邊。光線明亮開闊，適合拍風景特寫。"
    ]
  },
  "金閣寺": {
    title: "金閣寺",
    route: "總門 ➔ 買票（拿到符咒門票） ➔ 鏡湖池（拍金閣寺） ➔ 龍門瀑布 ➔ 白蛇之塚 ➔ 夕佳亭 ➔ 不動堂 ➔ 出口（單向通行）。",
    photos: [
      "第一排卡位：一進去馬上就會看到「鏡湖池」，這裡是唯一且最佳的拍攝點！下午時分陽光剛好順光打在金箔上。",
      "門票收好：門票本身就是一張很有質感的「家內安全・開運招福」保平安符，千萬別揉爛了，可以帶回家留念。"
    ]
  },
  "勝尾寺": {
    title: "勝尾寺",
    route: "入口山門 ➔ 弁天池（走過橋） ➔ 順著階梯往上 ➔ 本堂 ➔ 購買達摩/寫願望 ➔ 奉納棚（達摩牆） ➔ 紀念品店出園。",
    photos: [
      "沿路尋寶：沿途的石牆、燈籠、樹枝、甚至石縫中，到處都有前人留下的小達摩！可以拿著相機沿路尋寶特寫。",
      "本堂參拜與開眼：去購買一尊屬於自己的達摩。在底部寫下願望，畫上「右眼」。",
      "震撼大景：往下走會經過壯觀的「奉納棚」（滿滿還願達摩的牆面），紅通通的畫面非常震撼，全區最強打卡點。"
    ]
  },
  "祇園": {
    title: "散步：鴨川 & 祇園",
    detail: "傍晚時分的鴨川是最舒服的，四個人可以沿著河岸的「納涼床」旁散步。走進祇園的「白川巽橋」一帶，這裡有垂柳和石板路，極具傳統京都風情。",
    route: "四條大橋 ➔ 沿著鴨川河岸散步 ➔ 轉入白川筋（巽橋） ➔ 花見小路。",
    photos: [
      "鴨川：日落魔幻時刻(Magic Hour)光線柔和，適合錄製散步聊天的 B-roll。",
      "注意：目前祇園私人巷弄已嚴禁觀光客進入與拍照，請務必走在主要大馬路上。"
    ]
  },
  "東寺": {
    title: "東寺 (Toji Temple)",
    detail: "境內非常寬闊，建築宏偉。重點放在日本最高的木造塔「五重塔」。如果行程當天剛好是 21 號，境內會有「弘法市集」挖寶。",
    route: "慶賀門（東門）或南門進入 ➔ 購票 ➔ 金堂 ➔ 講堂 ➔ 五重塔 ➔ 瓢簞池。",
    photos: [
      "絕景機位：走到「瓢簞池（葫蘆池）」的正對面，這裡是捕捉「五重塔與水面倒影」的最佳機位。"
    ]
  },
  "因幡堂": {
    title: "因幡堂 (平等寺)",
    detail: "隱身在京都市中心住宅區的小巧寺廟，參拜完前往社務所，最出名的是保佑健康的「六貓無病守」以及文鳥、鸚鵡御守。",
    route: "從巷弄正門進入 ➔ 本堂參拜 ➔ 進入左側社務所 ➔ 挑選御守。",
    photos: [
      "拍攝點：這裡環境寧靜遊客不多，適合安靜地拍攝可愛寵物御守的特寫鏡頭。"
    ]
  },
  "美國村": {
    title: "御津八幡宮 & 美國村",
    detail: "隱藏在潮流中心「美國村」的迷你神社，也是知名的「毛小孩神社」。動線非常順，適合逛街途中轉換心情。",
    route: "逛美國村三角公園周邊古著店 ➔ 順著 Google Map 轉進巷弄 ➔ 御津八幡宮 ➔ 繼續前往心齋橋。",
    photos: [
      "拍攝點：美國村街頭充滿塗鴉與潮流青年，很棒的街拍素材；走進神社則有鬧中取靜的衝突美感。"
    ]
  },
  "梅田藍天": {
    title: "梅田藍天大樓 (空中庭園)",
    detail: "建議在「日落前一小時」抵達。39 樓有販售可以免費刻字的「心型鎖」，四個人可以各買一個刻上名字留念。",
    route: "抵達 3 樓搭乘電梯至 35 樓 ➔ 搭乘「懸空透明手扶梯」至 39 樓 ➔ 40 樓室內觀景台 ➔ 頂樓（RF）露天星空步道。",
    photos: [
      "頂樓無遮蔽：頂樓完全沒有玻璃遮蔽，拍攝夜景不會有玻璃反光，能拍出極高畫質的大片。",
      "視覺效果：頂樓地板夜晚會發出螢光點點，穿白色衣服來會有很酷的視覺效果。"
    ]
  },
  "環球影城": {
    title: "USJ 環球影城 (全日活動)",
    detail: "四個人同行的最大優勢是，如果不介意分開坐，可以直接排「單人通道 (Single Rider)」，通常能節省一半以上的時間！",
    route: "提早排隊 ➔ 開園抽任天堂整理券 ➔ 直衝設施 ➔ 照整理券時間進入任天堂世界 ➔ 下午哈利波特區。",
    photos: [
      "超級任天堂世界：色彩飽和度極高，非常適合錄影。記得買個星星爆米花桶當作拍照道具。"
    ]
  },
  "大鳥大社": {
    title: "大鳥大社 (堺市)",
    detail: "特色是全日本獨有的「大鳥造」古建築。參拜完務必去社務所抽取超高顏值的「透明強運御守（勝みくじ）」。",
    route: "JR 鳳站步行 ➔ 第一鳥居 ➔ 穿越兩側樹林的平坦參道 ➔ 本殿參拜 ➔ 左側社務所抽籤。",
    photos: [
      "特寫畫面：將抽到的透明籤詩拿在手上，讓陽光透過籤詩透射出來，能拍出極具質感的特寫。"
    ]
  },
  "異人館": {
    title: "北野異人館 & 北野天滿神社",
    detail: "這區充滿歐風建築，整個區域建在山坡上，需要爬不少坡。如果不想進去參觀，在廣場走走拍拍也很愜意。",
    route: "從三宮站走北野坂 ➔ 抵達廣場 ➔ 參觀風見雞館外觀 ➔ 爬上「北野天滿神社」階梯 ➔ 下山。",
    photos: [
      "神社觀景台：爬上一長串階梯後回頭看，可以將「風見雞館的屋頂十字架」與整個神戶市景、海港同框拍下。"
    ]
  },
  "南京町": {
    title: "南京町 & 美利堅公園",
    detail: "這是一條從熱鬧市集漸漸走向開闊海港的完美散步路線。抵達美利堅公園時剛好可以吹吹海風。",
    route: "下午在南京町吃點心 ➔ 傍晚往南走約 10-15 分鐘 ➔ 抵達美利堅公園 ➔ 神戶港塔 ➔ BE KOBE 紀念碑。",
    photos: [
      "大合照點：公園內巨大的「BE KOBE」地標前，適合架設腳架拍下四個人在日本的完整大合照。"
    ]
  }
};

const ItineraryCard = ({ item, onClick }: { item: ItineraryItem, onClick: () => void }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const links = parseLinks(item);
  const hasMultipleLinks = links.length > 1;

  // Find matching guide
  const guideKey = Object.keys(LOCATION_GUIDES).find(key => item.Activity.includes(key));
  const guide = guideKey ? LOCATION_GUIDES[guideKey] : null;

  const toggleGuide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGuideOpen(!isGuideOpen);
  };

  return (
    <div className={`mb-6 relative`}>
      <div onClick={onClick} className={`p-6 rounded-[2rem] border-4 border-navy sticker-shadow cursor-pointer active:translate-y-1 transition-all ${item.Type.includes('預約') ? 'bg-primary' : item.Type.includes('交通') ? 'bg-secondary' : 'bg-white'}`}>
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

        {/* Collapsible Guide Button */}
        {guide && (
          <div className="mt-4 pt-4 border-t-2 border-dashed border-navy/10">
            <button 
              onClick={toggleGuide}
              className="flex items-center gap-2 text-navy text-xs font-black uppercase tracking-wider bg-white/40 px-3 py-2 rounded-xl border border-navy/20 hover:bg-white/60 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> 
              📖 內行取景攻略 (點擊展開)
              {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {/* Guide Content */}
            {isGuideOpen && (
              <div 
                className="mt-4 p-5 text-sm space-y-4 hand-drawn-border sticker-shadow animate-in fade-in slide-in-from-top-2"
                style={{ backgroundColor: 'rgba(255, 209, 220, 0.4)' }}
              >
                <h5 className="font-black text-lg border-b-2 border-navy/20 pb-2">{guide.title}</h5>
                
                {guide.detail && (
                  <div className="space-y-1">
                    <p className="font-black text-xs opacity-40 uppercase">詳細攻略</p>
                    <p className="leading-relaxed">{guide.detail}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="font-black text-xs opacity-40 uppercase">強推順遊動線</p>
                  <p className="leading-relaxed"><b>{guide.route}</b></p>
                </div>

                <div className="space-y-1">
                  <p className="font-black text-xs opacity-40 uppercase">拍攝點</p>
                  <ul className="list-disc list-inside space-y-2 pl-1">
                    {guide.photos.map((tip, i) => (
                      <li key={i} className="leading-relaxed">
                        <span dangerouslySetInnerHTML={{ __html: tip.replace(/([^：]+)：/, '<b>$1：</b>') }}></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const parseLinks = (item: ItineraryItem): MapLink[] => {
  const rawLink = item.Link || '';
  const rawParts = rawLink.split(/[,\n]/).map(l => l.trim()).filter(Boolean);
  
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

  const activityParts = item.Activity.split(/[,&+/、 ]/).map(s => s.trim()).filter(Boolean);
  if (activityParts.length === rawParts.length && rawParts.length > 1) {
    return rawParts.map((url, i) => ({
      label: activityParts[i],
      url
    }));
  }

  return rawParts.map((url, i) => ({
    label: rawParts.length > 1 ? `地點 ${i + 1}` : '開啟地圖',
    url
  }));
};

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

  const handleCardClick = (item: ItineraryItem) => {
    const links = parseLinks(item);
    if (links.length === 0) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.Activity)}`, '_blank');
    } else if (links.length === 1) {
      window.open(links[0].url, '_blank');
    } else {
      setLinkSelection({ activity: item.Activity, links });
    }
  };

  if (sortedDates.length === 0) return <div className="p-10 text-center opacity-50">尚無行程資料 🍡</div>;

  return (
    <div className="px-6 py-10 min-w-0">
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

      <div className="space-y-6 relative ml-4">
        <div className="absolute left-6 top-0 bottom-0 w-1 border-l-4 border-dashed border-navy/10 -z-10"></div>
        <div className="ml-10 space-y-6">
          {dayItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.travelTime > 0 && (
                <div className="flex flex-col items-center -my-3">
                  <div className="px-4 py-1 rounded-full border-2 border-navy text-[10px] font-black bg-secondary/20 flex items-center gap-2"><Train className="w-3 h-3" /> <span>約 {item.travelTime} 分</span></div>
                </div>
              )}
              <ItineraryCard item={item} onClick={() => handleCardClick(item)} />
            </React.Fragment>
          ))}
        </div>
      </div>

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