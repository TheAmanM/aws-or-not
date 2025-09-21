/**
 * Calculates a rolling average for a series of numbers.
 * @param data An array of numbers.
 * @param windowSize The number of data points to include in each average calculation.
 * @returns An array containing the rolling average.
 */
function calculateRollingAverage(data: number[], windowSize: number): number[] {
  if (windowSize <= 0) {
    return data;
  }

  const rollingAverages: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const windowSlice = data.slice(start, i + 1);
    const sum = windowSlice.reduce((acc, val) => acc + val, 0);
    rollingAverages.push(sum / windowSlice.length);
  }

  return rollingAverages;
}

export const useLastGameData = () => {
  const getLastGameData = (): { score: number; round: number }[] | null => {
    try {
      const rawData = localStorage.getItem("lastGame");
      if (!rawData) {
        return null;
      }

      const history: boolean[] = JSON.parse(rawData);

      if (Array.isArray(history)) {
        // Convert boolean history to numbers (1 for true, 0 for false)
        const numericHistory = history.map((result) => (result ? 1 : 0));

        // Calculate the rolling average with a window size of 3
        const rollingAverages = calculateRollingAverage(numericHistory, 4);

        // Map the averages to the format expected by the chart
        return rollingAverages.map((avg, index) => ({
          score: avg,
          round: index + 1,
        }));
      }

      return null;
    } catch (error) {
      console.error(
        "Failed to retrieve or process last game data from localStorage:",
        error
      );
      return null;
    }
  };

  const getLongestStreak = (): number => {
    try {
      const rawData = localStorage.getItem("lastGame");
      if (!rawData) {
        return 0;
      }

      const history: boolean[] = JSON.parse(rawData);

      if (!Array.isArray(history) || history.length === 0) {
        return 0;
      }

      let longestStreak = 0;
      let currentStreak = 0;
      for (let i = 0; i < history.length; i++) {
        if (history[i]) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 0;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak); // Check streak at the end
      return longestStreak;
    } catch (error) {
      console.error(
        "Failed to calculate longest streak from localStorage data:",
        error
      );
      return 0;
    }
  };

  return { getLastGameData, getLongestStreak };
};
