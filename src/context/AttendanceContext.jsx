import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_SUBJECTS, DEFAULT_TIMETABLE } from "../data/defaultSubjects";

const AttendanceContext = createContext();

export function AttendanceProvider({ children }) {
  const [subjects, setSubjects] = useLocalStorage("attendx_subjects", DEFAULT_SUBJECTS);
  const [timetable, setTimetable] = useLocalStorage("attendx_timetable", DEFAULT_TIMETABLE);
  const [logs, setLogs] = useLocalStorage("attendx_logs", []);
  const [darkMode, setDarkMode] = useLocalStorage("attendx_dark_mode", true);
  const [goalPercentage, setGoalPercentage] = useLocalStorage("attendx_goal_percentage", 75);
  const [selectedSemester, setSelectedSemester] = useLocalStorage("attendx_semester", "Semester 3");
  const [streak, setStreak] = useLocalStorage("attendx_streak", 0);

  // Recalculate streak whenever logs change
  useEffect(() => {
    // Sort logs chronologically to reconstruct streak
    const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let currentStreak = 0;
    for (const log of sortedLogs) {
      if (log.status === "present") {
        currentStreak++;
      } else {
        currentStreak = 0;
      }
    }
    setStreak(currentStreak);
  }, [logs]);

  // Log attendance (Present / Absent)
  const logAttendance = (subjectId, status) => {
    const timestamp = new Date().toISOString();
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return;

    // Update subject attendance
    const updatedSubjects = subjects.map((sub) => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          present: status === "present" ? sub.present + 1 : sub.present,
          total: sub.total + 1,
        };
      }
      return sub;
    });

    setSubjects(updatedSubjects);

    // Create log entry
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      subjectId,
      subjectName: subject.name,
      status,
      timestamp,
    };

    setLogs((prevLogs) => [newLog, ...prevLogs]);
  };

  // Delete attendance log entry and revert counts
  const deleteLog = (logId) => {
    const logToDelete = logs.find((l) => l.id === logId);
    if (!logToDelete) return;

    const { subjectId, status } = logToDelete;

    // Update subject attendance to revert the log
    const updatedSubjects = subjects.map((sub) => {
      if (sub.id === subjectId) {
        return {
          ...sub,
          present: status === "present" ? Math.max(0, sub.present - 1) : sub.present,
          total: Math.max(0, sub.total - 1),
        };
      }
      return sub;
    });

    setSubjects(updatedSubjects);
    setLogs((prevLogs) => prevLogs.filter((l) => l.id !== logId));
  };

  // Add a new custom subject
  const addSubject = (newSubject) => {
    const id = `subject_${Date.now()}`;
    const subject = {
      id,
      present: parseInt(newSubject.initialPresent || 0, 10),
      total: parseInt(newSubject.initialTotal || 0, 10),
      ...newSubject,
    };
    // Clean up temporary variables
    delete subject.initialPresent;
    delete subject.initialTotal;

    setSubjects((prev) => [...prev, subject]);
    return id;
  };

  // Edit a subject
  const editSubject = (subjectId, updatedData) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          // If initial values are updated, adjust present/total
          return {
            ...sub,
            ...updatedData,
          };
        }
        return sub;
      })
    );
  };

  // Delete a subject and its associated logs + timetable slots
  const deleteSubject = (subjectId) => {
    setSubjects((prev) => prev.filter((sub) => sub.id !== subjectId));
    setLogs((prev) => prev.filter((log) => log.subjectId !== subjectId));

    // Clear timetable slots for this subject
    const updatedTimetable = {};
    Object.keys(timetable).forEach((day) => {
      updatedTimetable[day] = timetable[day].filter((slot) => slot.subjectId !== subjectId);
    });
    setTimetable(updatedTimetable);
  };

  // Reset entire application database
  const resetData = () => {
    setSubjects(DEFAULT_SUBJECTS);
    setTimetable(DEFAULT_TIMETABLE);
    setLogs([]);
    setStreak(0);
    setGoalPercentage(75);
    setSelectedSemester("Semester 3");
  };

  // Import JSON configuration
  const importData = (jsonData) => {
    try {
      const data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      if (data.subjects) setSubjects(data.subjects);
      if (data.timetable) setTimetable(data.timetable);
      if (data.logs) setLogs(data.logs);
      if (data.goalPercentage) setGoalPercentage(data.goalPercentage);
      if (data.selectedSemester) setSelectedSemester(data.selectedSemester);
      return true;
    } catch (e) {
      console.error("Failed to import data", e);
      return false;
    }
  };

  // Helper to export data
  const exportData = () => {
    const dataStr = JSON.stringify({
      subjects,
      timetable,
      logs,
      goalPercentage,
      selectedSemester,
      version: "1.0",
    }, null, 2);
    return dataStr;
  };

  return (
    <AttendanceContext.Provider
      value={{
        subjects,
        setSubjects,
        timetable,
        setTimetable,
        logs,
        darkMode,
        setDarkMode,
        goalPercentage,
        setGoalPercentage,
        selectedSemester,
        setSelectedSemester,
        streak,
        logAttendance,
        deleteLog,
        addSubject,
        editSubject,
        deleteSubject,
        resetData,
        importData,
        exportData,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  return useContext(AttendanceContext);
}
