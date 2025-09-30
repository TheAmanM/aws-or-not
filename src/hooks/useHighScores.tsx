const HIGH_SCORE_KEY = "highScore";

export const useHighScores = () => {
  const getHighScore = (): number | null => {
    try {
      const highScore = localStorage.getItem(HIGH_SCORE_KEY);
      if (highScore) {
        return parseInt(highScore, 10);
      }
      return null;
    } catch (error) {
      console.error("Error getting high score:", error);
      return null;
    }
  };

  const saveHighScore = (score: number) => {
    const currentHighScore = getHighScore();

    if (currentHighScore === null || score > currentHighScore) {
      try {
        localStorage.setItem(HIGH_SCORE_KEY, String(score));
      } catch (error) {
        console.error("Error saving high score:", error);
      }
    }
  };

  return { getHighScore, saveHighScore };
};