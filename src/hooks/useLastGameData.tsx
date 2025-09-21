export const useLastGameData = () => {
  const getLastGameData = (): { score: number; round: number }[] | null => {
    try {
      const rawData = localStorage.getItem("lastGame");
      if (!rawData) {
        return null;
      }

      const history: boolean[] = JSON.parse(rawData);

      if (Array.isArray(history)) {
        return history.map((value, index) => ({
          score: value ? 1 : 0,
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
