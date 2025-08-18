import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  loadAchievements, 
  saveAchievements, 
  checkAchievements 
} from "../components/achievements";

describe("Achievements utility functions", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("loadAchievements returns empty object if nothing stored", () => {
    expect(loadAchievements()).toEqual({});
  });

  it("loadAchievements returns parsed achievements from localStorage", () => {
    const mockData = { streak_10: { unlocked: "2023-01-01T00:00:00Z" } };
    localStorage.setItem("achievements", JSON.stringify(mockData));
    expect(loadAchievements()).toEqual(mockData);
  });

  it("saveAchievements stores data in localStorage", () => {
    const mockData = { correct_20: { unlocked: "2023-01-01T00:00:00Z" } };
    saveAchievements(mockData);
    expect(JSON.parse(localStorage.getItem("achievements"))).toEqual(mockData);
  });

  describe("checkAchievements", () => {
    it("unlocks streak_10 when streak >= 10", () => {
      const stats = { correct: 0, wrong: 0, streak: 10, rounds: 0 };
      const updated = checkAchievements(stats, "classic", {});
      expect(updated).toHaveProperty("streak_10");
      expect(updated.streak_10.name).toBe("Streak Master");
    });

    it("unlocks correct_20 when correct >= 20", () => {
      const stats = { correct: 20, wrong: 0, streak: 0, rounds: 0 };
      const updated = checkAchievements(stats, "classic", {});
      expect(updated).toHaveProperty("correct_20");
      expect(updated.correct_20.name).toBe("Sharp Eye");
    });

    it("unlocks timed_complete only in Timed mode", () => {
      const stats = { correct: 5, wrong: 5, streak: 0, rounds: 10 };
      const updatedTimed = checkAchievements(stats, "timed", {});
      const updatedClassic = checkAchievements(stats, "classic", {});
      expect(updatedTimed).toHaveProperty("timed_complete");
      expect(updatedClassic).not.toHaveProperty("timed_complete");
    });

    it("unlocks classic_complete only in Classic mode", () => {
      const stats = { correct: 5, wrong: 5, streak: 0, rounds: 10 };
      const updatedClassic = checkAchievements(stats, "classic", {});
      const updatedTimed = checkAchievements(stats, "timed", {});
      expect(updatedClassic).toHaveProperty("classic_complete");
      expect(updatedTimed).not.toHaveProperty("classic_complete");
    });

    it("unlocks multiple_choice_complete only in Multiple Choice mode", () => {
      const stats = { correct: 5, wrong: 5, streak: 0, rounds: 10 };
      const updatedChoice = checkAchievements(stats, "multiple-choice", {});
      const updatedClassic = checkAchievements(stats, "classic", {});
      expect(updatedChoice).toHaveProperty("multiple_choice_complete");
      expect(updatedChoice.multiple_choice_complete.name).toBe("Choice Conqueror");
      expect(updatedClassic).not.toHaveProperty("multiple_choice_complete");
    });

    it("does not re-unlock already unlocked achievements", () => {
      const stats = { correct: 20, wrong: 0, streak: 0, rounds: 0 };
      const alreadyUnlocked = { correct_20: { unlocked: "2023-01-01T00:00:00Z" } };
      const updated = checkAchievements(stats, "classic", alreadyUnlocked);
      expect(Object.keys(updated).length).toBe(1);
    });

    it("saves to localStorage after unlocking", () => {
      const stats = { correct: 20, wrong: 0, streak: 0, rounds: 0 };
      checkAchievements(stats, "classic", {});
      const stored = JSON.parse(localStorage.getItem("achievements"));
      expect(stored).toHaveProperty("correct_20");
    });
  });
});
