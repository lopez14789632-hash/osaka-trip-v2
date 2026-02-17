import React, { useState } from 'react';
import { BackupItem, ItineraryItem } from '../types';
import { GoogleGenAI } from "@google/genai";

// AI 旅遊助手組件
interface AiGuideProps {
  itinerary: ItineraryItem[];
  backup: BackupItem[];
}

const AiGuide: React.FC<AiGuideProps> = ({ itinerary, backup }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // 🤖 備用發電機：如果網路不通，吉伊卡哇會用這套邏輯回答 (不會跳紅字錯誤)
  const getBackupResponse = (text: string) => {
    const t = text.toLowerCase();
    if (t.includes("雨")) return "哎呀下雨了嗎？🌧️\n吉伊卡哇建議你們去口袋名單裡的「HEP FIVE 摩天輪」或是「梅田藍天大樓」喔！都在室內不用怕淋濕～";
    if (t.includes("吃") || t.includes("餓") || t.includes("餐廳")) return "肚子餓了嗎？😋\n口袋名單裡的「國產牛燒肉」或「一蘭拉麵」在呼喚你們！記得先確認有沒有預約喔～";
    if (t.includes("累") || t.includes("休息")) return "走累了嗎？🍵\n找間附近的咖啡廳坐坐吧！剛好可以整理一下剛剛拍的照片～";
    if (t.includes("買") || t.includes("逛")) return "想要大買特買嗎？🛍️\n心齋橋跟道頓堀絕對是首選！別忘了去藥妝店比價一下喔！";
    return "吉伊卡哇收到！✨\n建議你們可以打開「口袋名單」看看附近有沒有想去的店，或是直接回飯店休息一下再出發！(揮手)";
  };

  const handleAskAi = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse('');

    try {
      // 根據指南：使用 process.env.API_KEY 進行初始化
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const context = `
        你現在是大阪旅遊的貼身導遊（吉伊卡哇風格，語氣可愛、正向、使用顏文字）。
        【口袋名單】：${JSON.stringify(backup.slice(0, 20))}
        【目前行程】：${JSON.stringify(itinerary.slice(0, 10))}
        使用者問："${prompt}"
        請給出 2-3 個建議。如果建議是口袋名單裡的店，請強調。
        回答要簡短可愛。
      `;

      // 根據指南：使用 gemini-3-flash-preview 並調用 generateContent
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: context,
      });

      // 根據指南：直接透過 .text 屬性獲取生成內容
      const text = result.text;

      if (text) {
         setResponse(text);
      } else {
         throw new Error("無回應");
      }

    } catch (error) {
      console.warn("AI 連線失敗，切換至備用模式:", error);
      // 🔥 關鍵：發生任何錯誤，直接切換到「備用發電機」，不讓使用者看到紅字
      setResponse(getBackupResponse(prompt)); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-24 p-4 bg-[#FFF9FB]">
      <div className="text-center mb-6 mt-4">
        <div className="text-5xl mb-2 animate-bounce">🤖</div>
        <h2 className="text-2xl font-bold text-[#5D4037] font-['Zen_Maru_Gothic']">
          吉伊卡哇小導遊
        </h2>
        <p className="text-sm text-[#89CFF0] mt-1">遇到狀況了嗎？讓我來幫你！</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-white p-4 rounded-3xl border-4 border-[#FFB7C5] border-dashed shadow-sm">
          <p className="text-[#5D4037] text-sm mb-2 font-bold ml-1">請告訴我怎麼了：</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：現在在梅田下大雨了，有沒有室內備案？"
            className="w-full p-3 bg-[#F9F9F9] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB7C5] resize-none h-28 text-[#5D4037]"
          />
          <button
            onClick={handleAskAi}
            disabled={loading}
            className="w-full mt-3 bg-[#FFB7C5] text-white font-bold py-3 rounded-full hover:bg-[#FF8FAB] transition-colors flex items-center justify-center gap-2 shadow-md active:scale-95 transform transition-transform"
          >
            {loading ? '吉伊卡哇思考中...' : '發送求救訊號 ✨'}
          </button>
        </div>

        {response && (
          <div className="bg-white p-5 rounded-3xl border-4 border-[#89CFF0] shadow-md animate-fade-in relative">
            <div className="absolute -top-3 -left-2 text-2xl">💡</div>
            <div className="text-[#5D4037] whitespace-pre-wrap leading-relaxed font-['Zen_Maru_Gothic']">
              {response}
            </div>
          </div>
        )}
        
        <div className="text-center opacity-50 text-xs text-[#5D4037] mt-8">
            Powered by Google Gemini
        </div>
      </div>
    </div>
  );
};

export default AiGuide;