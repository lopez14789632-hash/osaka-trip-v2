
export interface ItineraryItem {
  Date: string;
  Time: string;
  Activity: string;
  Type: string;
  Note: string;
  Link: string;       // 對應 CSV 的 GoogleMap 欄位
  imageUrl?: string;  // 預留欄位 (目前可能沒用到)
  _timestamp?: number; // 用於排序與倒數計時
  travelTime: number; // 交通時間 (分鐘)
}

export interface PackingItem {
  id?: string;        // 讓它是可選的，方便處理
  Category: string;
  Item: string;
  Note: string;
  completed?: boolean; // 用於勾選狀態
}

// BackupItem 用於 AI 導遊提供建議時的參考資料
export interface BackupItem {
  Activity: string;
  Type: string;
  Note: string;
  Link: string;
}

// 👇 關鍵修正：這裡必須跟 App.tsx 的 setActiveTab 對應
export type TabType = 'home' | 'day' | 'all' | 'packing' | 'tools' | 'phrasebook';

export interface GroupedItinerary {
  [date: string]: ItineraryItem[];
}

export interface GroupedPacking {
  [category: string]: PackingItem[];
}

export interface WeatherData {
  temp: number;
  code: number;
}
