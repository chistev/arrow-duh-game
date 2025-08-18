import { useState, useEffect } from "react";

// Fisher-Yates shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useRounds = () => {
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    fetch("/rounds.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rounds data");
        }
        return response.json();
      })
      .then((data) => {
        const shuffledRounds = shuffleArray(data);
        setRounds(shuffledRounds);
      })
      .catch((error) => {
        console.error("Error fetching rounds:", error);
        const fallbackRounds = shuffleArray([
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1200&auto=format&fit=crop",
            answers: ["cat", "kitten", "feline"],
            clue: "House pet that says meow",
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
            answers: ["shoe", "sneakers", "footwear"],
            clue: "You wear them on your feet",
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop&ixid=1SAnrIxw5OY",
            answers: ["laptop", "notebook", "portable computer"],
            clue: "Portable computer",
          },
        ]);
        setRounds(fallbackRounds);
      });
  }, []);

  return rounds;
};