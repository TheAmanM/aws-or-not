import { useCallback } from "react";

const STORAGE_KEY = "booleanHistory";

function smoothBooleanData(booleanArray: boolean[]): number[] {
  const n: number = booleanArray.length;

  let windowSize: number = Math.round(n * 0.2);
  windowSize = Math.max(3, windowSize);
  if (windowSize % 2 === 0) {
    windowSize += 1;
  }

  const numericData: number[] = booleanArray.map((b) => (b ? 1 : 0));
  const smoothedValues: number[] = [];
  const radius: number = Math.floor(windowSize / 2);

  for (let i = 0; i < n; i++) {
    const start: number = Math.max(0, i - radius);
    const end: number = Math.min(n, i + radius + 1);
    const windowSlice: number[] = numericData.slice(start, end);
    const sum: number = windowSlice.reduce(
      (total, current) => total + current,
      0
    );
    const average: number = sum / (windowSlice.length || 1);
    smoothedValues.push(average);
  }

  return smoothedValues;
}

export const useSaveData = () => {
  const saveResult = useCallback((newResult: boolean): void => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      const currentHistory: boolean[] =
        rawData && Array.isArray(JSON.parse(rawData))
          ? JSON.parse(rawData)
          : [];

      currentHistory.push(newResult);

      const trimmedHistory = currentHistory.slice(-50);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error("Failed to save boolean result to localStorage:", error);
    }
  }, []);

  const getData = useCallback(():
    | { score: number }[]
    | { itemsLeft: number }
    | null => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return { itemsLeft: 5 };
      }

      const history: boolean[] = JSON.parse(rawData);

      if (
        Array.isArray(history) &&
        history.length >= 5 &&
        history.length <= 50
      ) {
        return smoothBooleanData(history).map((value) => {
          return { score: value };
        });
      }

      return { itemsLeft: 5 - history.length };
    } catch (error) {
      console.error(
        "Failed to retrieve or process boolean data from localStorage:",
        error
      );
      return null;
    }
  }, []);

  const getStreak = useCallback((): number => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return 0;
      }

      const history: boolean[] = JSON.parse(rawData);

      if (!Array.isArray(history) || history.length === 0) {
        return 0;
      }

      let currentStreak = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        if (history[i]) {
          currentStreak++;
        } else {
          break;
        }
      }
      return currentStreak;
    } catch (error) {
      console.error(
        "Failed to calculate streak from localStorage data:",
        error
      );
      return 0;
    }
  }, []);

  return { saveResult, getData, getStreak };
};
