
import Papa from 'papaparse';
import { ItineraryItem, PackingItem } from '../types';

const ITINERARY_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTaKs1HDt0BLIkLSjs7XBhJohWzu1KGyH-rIDWscT-6vG5AE4XTqCEJfIaSZurURlHMZkBeTW4teySq/pub?gid=207150597&single=true&output=csv";
const PACKING_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTaKs1HDt0BLIkLSjs7XBhJohWzu1KGyH-rIDWscT-6vG5AE4XTqCEJfIaSZurURlHMZkBeTW4teySq/pub?gid=1273873651&single=true&output=csv";

export function normalizeDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  // Handle M/D or YYYY/M/D formats
  const parts = dateStr.split('/');
  if (parts.length === 2) {
    // Assume year 2026
    return new Date(2026, parseInt(parts[0]) - 1, parseInt(parts[1]));
  } else if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  return new Date(dateStr);
}

export function calculateTimestamp(dateStr: string, timeStr: string): number {
  const d = normalizeDate(dateStr);
  if (timeStr && timeStr.includes(':')) {
    const [h, m] = timeStr.split(':');
    d.setHours(parseInt(h), parseInt(m));
  }
  return d.getTime();
}

export async function getGoogleSheetData() {
  try {
    const [itineraryData, packingData] = await Promise.all([
      fetchCsvData(ITINERARY_URL),
      fetchCsvData(PACKING_URL),
    ]);

    const itinerary: ItineraryItem[] = (itineraryData as any[]).map((row: any) => ({
      Date: row.Date || '',
      Time: row.Time || '',
      Activity: row.Activity || '',
      Type: row.Type || '一般',
      Note: row.Note || '',
      Link: row.GoogleMap || row.Link || '',
      travelTime: parseInt(row.TravelTime) || 0,
      _timestamp: calculateTimestamp(row.Date, row.Time),
    }));

    const packing: PackingItem[] = (packingData as any[]).map((row: any, index: number) => ({
      id: `item-${index}`,
      Category: row.Category || '未分類',
      Item: row.Item || '',
      Note: row.Note || '',
    }));

    return { itinerary, packing };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { itinerary: [], packing: [] };
  }
}

async function fetchCsvData(url: string) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}
