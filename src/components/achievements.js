export const ACHIEVEMENTS = [
  { id: "streak_10", name: "Streak Master", description: "Achieve a streak of 10 correct answers", condition: (stats) => stats.streak >= 10 },
  { id: "timed_complete", name: "Timed Champion", description: "Complete a game in Timed mode", condition: (stats, mode) => mode === "timed" && stats.rounds >= 10 },
  { id: "classic_complete", name: "Classic Finisher", description: "Complete a game in Classic mode", condition: (stats, mode) => mode === "classic" && stats.rounds >= 10 },
  { id: "multiple_choice_complete", name: "Choice Conqueror", description: "Complete a game in Multiple Choice mode", condition: (stats, mode) => mode === "multiple-choice" && stats.rounds >= 10 },
  { id: "correct_20", name: "Sharp Eye", description: "Get 20 correct answers", condition: (stats) => stats.correct >= 20 },
];

export const loadAchievements = () => {
  const stored = localStorage.getItem("achievements");
  return stored ? JSON.parse(stored) : {};
};

export const saveAchievements = (achievements) => {
  localStorage.setItem("achievements", JSON.stringify(achievements));
};

// Check and unlock achievements
export const checkAchievements = (stats, mode, currentAchievements) => {
  const newAchievements = { ...currentAchievements };
  ACHIEVEMENTS.forEach((achievement) => {
    if (!newAchievements[achievement.id] && achievement.condition(stats, mode)) {
      newAchievements[achievement.id] = { ...achievement, unlocked: new Date().toISOString() };
    }
  });
  saveAchievements(newAchievements);
  return newAchievements;
};