import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Helpers
  const loadState = (key, defaultVal) => {
    const saved = localStorage.getItem(`astraos_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  };

  // States
  const [tasks, setTasks] = useState(() =>
    loadState("tasks", [
      {
        id: "1",
        text: "Linear algebra chapter 6",
        tag: "math",
        priority: "#F43F5E",
        completed: false,
      },
      {
        id: "2",
        text: "Review OS lecture notes",
        tag: "cs",
        priority: "#F59E0B",
        completed: false,
      },
      {
        id: "3",
        text: "Push assignment to GitHub",
        tag: "dev",
        priority: "#6B7A99",
        completed: true,
      },
      {
        id: "4",
        text: "Read 20 pages of Deep Work",
        tag: "read",
        priority: "#06B6D4",
        completed: false,
      },
      {
        id: "5",
        text: "30 min evening walk",
        tag: "health",
        priority: "#10B981",
        completed: false,
      },
    ]),
  );

  const [studySessions, setStudySessions] = useState(() =>
    loadState("study", []),
  );
  const [focusSessions, setFocusSessions] = useState(() =>
    loadState("focus", []),
  );
  const [vaultFiles, setVaultFiles] = useState(() =>
    loadState("vault", [
      {
        id: "1",
        name: "Semester Timetable.pdf",
        date: new Date().toISOString(),
        size: "1.2 MB",
        icon: "📄",
        color: "rgba(239,68,68,0.12)",
      },
      {
        id: "2",
        name: "Study Plan Q1.xlsx",
        date: new Date().toISOString(),
        size: "420 KB",
        icon: "📊",
        color: "rgba(16,185,129,0.12)",
      },
      {
        id: "3",
        name: "Algorithms Notes.md",
        date: new Date().toISOString(),
        size: "88 KB",
        icon: "📝",
        color: "rgba(139,92,246,0.12)",
      },
    ]),
  );
  const [healthData, setHealthData] = useState(() =>
    loadState("health", { bmi: null, water: 1.8, sleep: 7.2 }),
  );
  const [entertainmentData, setEntertainmentData] = useState(() =>
    loadState("entertainment", {
      items: [
        {
          id: "1",
          title: "Dark (Netflix)",
          duration: 2.1,
          progress: 80,
          icon: "🎬",
        },
        {
          id: "2",
          title: "Severance",
          duration: 1.3,
          progress: 50,
          icon: "🎭",
        },
        {
          id: "3",
          title: "YouTube Mix",
          duration: 0.8,
          progress: 30,
          icon: "🎥",
        },
      ],
    }),
  );
  const [userPreferences, setUserPreferences] = useState(() =>
    loadState("prefs", { darkMode: true }),
  );

  // Persistence
  useEffect(() => {
    localStorage.setItem("astraos_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("astraos_study", JSON.stringify(studySessions));
  }, [studySessions]);
  useEffect(() => {
    localStorage.setItem("astraos_focus", JSON.stringify(focusSessions));
  }, [focusSessions]);
  useEffect(() => {
    localStorage.setItem("astraos_vault", JSON.stringify(vaultFiles));
  }, [vaultFiles]);
  useEffect(() => {
    localStorage.setItem("astraos_health", JSON.stringify(healthData));
  }, [healthData]);
  useEffect(() => {
    localStorage.setItem(
      "astraos_entertainment",
      JSON.stringify(entertainmentData),
    );
  }, [entertainmentData]);
  useEffect(() => {
    localStorage.setItem("astraos_prefs", JSON.stringify(userPreferences));
  }, [userPreferences]);

  const resetAllData = () => {
    setTasks([]);
    setStudySessions([]);
    setFocusSessions([]);
    setVaultFiles([]);
    setHealthData({ bmi: null, water: 0, sleep: 0 });
    setEntertainmentData({ items: [] });
  };

  const value = {
    tasks,
    setTasks,
    studySessions,
    setStudySessions,
    focusSessions,
    setFocusSessions,
    vaultFiles,
    setVaultFiles,
    healthData,
    setHealthData,
    entertainmentData,
    setEntertainmentData,
    userPreferences,
    setUserPreferences,
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
