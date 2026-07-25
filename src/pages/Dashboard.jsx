import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CheckCircleOutlineRounded,
  HighlightOffRounded,
  LocalFireDepartmentRounded,
  CalendarTodayRounded,
  TrendingUpRounded,
  InfoOutlined,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";
import { CircularProgressWithLabel } from "../components/CircularProgressWithLabel";
import { SubjectIcon } from "../components/SubjectIcon";
import { EmptyState } from "../components/EmptyState";
import { calculatePercentage, getAttendanceStatus, getStatusColor } from "../utils/attendanceHelper";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function Dashboard() {
  const {
    subjects,
    timetable,
    logs,
    logAttendance,
    streak,
    darkMode,
  } = useAttendance();

  const theme = useTheme();

  // Get current day
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const systemToday = daysOfWeek[new Date().getDay()];
  const [selectedDay, setSelectedDay] = useState(systemToday === "Sunday" ? "Monday" : systemToday);

  // Compute Overall Stats
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalAbsent = totalClasses - totalPresent;
  const overallPercentage = calculatePercentage(totalPresent, totalClasses);

  // Get subjects scheduled for the selected day
  const scheduleSlots = timetable[selectedDay] || [];
  
  // Map slots to full subject objects
  const todayClasses = scheduleSlots
    .map((slot) => {
      const subject = subjects.find((s) => s.id === slot.subjectId);
      if (!subject) return null;
      return {
        ...subject,
        time: slot.time,
      };
    })
    .filter(Boolean);

  const handleLog = (subjectId, status) => {
    logAttendance(subjectId, status);
  };

  const statCards = [
    {
      title: "Present Classes",
      value: totalPresent,
      color: "#10b981",
      subtitle: "Classes attended",
    },
    {
      title: "Absent Classes",
      value: totalAbsent,
      color: "#ef4444",
      subtitle: "Classes missed",
    },
    {
      title: "Total Classes",
      value: totalClasses,
      color: "#3b82f6",
      subtitle: "Conducted classes",
    },
    {
      title: "Attendance Goal",
      value: "75%",
      color: "#8b5cf6",
      subtitle: "Minimum required",
    },
  ];

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}
    >
      {/* Top Greeting & Streak Section */}
      <Box
        component={motion.div}
        variants={itemVariants}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Hello, Anshu <span className="animate-float" style={{ display: "inline-block" }}>👋</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">
            Here's your attendance breakdown for today. Keep maintaining that streak!
          </Typography>
        </Box>

        {/* Streak indicator */}
        {streak > 0 && (
          <Paper
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1,
              px: 2.5,
              borderRadius: "18px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
            }}
          >
            <LocalFireDepartmentRounded sx={{ color: "#ef4444", fontSize: 28 }} />
            <Box>
              <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2, color: "#ef4444" }}>
                {streak} Day{streak > 1 ? "s" : ""}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase" }}>
                Current Streak
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Overview Charts & Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Large Circular Gauge */}
        <Grid item xs={12} md={5} lg={4} component={motion.div} variants={itemVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{
              p: 4,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "24px",
              boxSizing: "border-box",
            }}
          >
            <CircularProgressWithLabel value={overallPercentage} />
          </Card>
        </Grid>

        {/* Stats Grid */}
        <Grid item xs={12} md={7} lg={8} component={motion.div} variants={itemVariants}>
          <Grid container spacing={2}>
            {statCards.map((card, index) => (
              <Grid item xs={6} key={index}>
                <Card
                  className={darkMode ? "glass-panel" : "glass-panel-light"}
                  sx={{
                    p: 3,
                    borderRadius: "18px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: "100%",
                      backgroundColor: card.color,
                    },
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="800" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {card.subtitle}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Today's Lectures Section */}
      <Box component={motion.div} variants={itemVariants}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarTodayRounded color="primary" />
            <Typography variant="h5" fontWeight="800">
              Lectures Schedule
            </Typography>
          </Box>

          {/* Quick Day Selector for flexibility */}
          <Box display="flex" gap={0.5} sx={{ overflowX: "auto", maxWidth: "60vw" }}>
            {daysOfWeek.filter((d) => d !== "Sunday").map((day) => (
              <Chip
                key={day}
                label={day.substring(0, 3)}
                clickable
                onClick={() => setSelectedDay(day)}
                color={selectedDay === day ? "primary" : "default"}
                variant={selectedDay === day ? "filled" : "outlined"}
                sx={{
                  fontWeight: "600",
                  borderRadius: "8px",
                  px: 0.5,
                }}
              />
            ))}
          </Box>
        </Box>

        {systemToday === "Sunday" && selectedDay === systemToday && (
          <EmptyState
            icon="Weekend"
            title="It's Sunday! 🎉"
            description="No classes scheduled for today. Take rest, recharge and prepare for the week ahead!"
            actionText="View Monday's Schedule"
            onAction={() => setSelectedDay("Monday")}
          />
        )}

        {todayClasses.length === 0 ? (
          <EmptyState
            icon="EventNote"
            title="No lectures scheduled"
            description={`You don't have any classes scheduled for ${selectedDay}.`}
            actionText="Setup Timetable"
            onAction={() => window.location.hash = "/timetable"} // Router fallback or redirect
          />
        ) : (
          <Grid container spacing={2.5}>
            {todayClasses.map((subject) => {
              const currentPct = calculatePercentage(subject.present, subject.total);
              const status = getAttendanceStatus(currentPct);
              const statusColor = getStatusColor(status, darkMode);

              return (
                <Grid item xs={12} sm={6} md={4} key={subject.id}>
                  <Card
                    className={darkMode ? "glass-panel" : "glass-panel-light"}
                    sx={{
                      p: 3,
                      borderRadius: "20px",
                      position: "relative",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 24px -10px ${subject.color}30`,
                        borderColor: `${subject.color}40`,
                      },
                      border: `1px solid rgba(255, 255, 255, 0.08)`,
                    }}
                  >
                    {/* Color Tag Indicator */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "5px",
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px",
                        background: subject.color,
                      }}
                    />

                    {/* Card Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase" }}>
                          {subject.code || "SUB-CODE"} • {subject.time}
                        </Typography>
                        <Typography variant="h6" fontWeight="700" sx={{ mt: 0.5, lineHeight: 1.2 }}>
                          {subject.name}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          background: `${subject.color}15`,
                          color: subject.color,
                          width: 40,
                          height: 40,
                        }}
                      >
                        <SubjectIcon name={subject.icon} />
                      </Avatar>
                    </Box>

                    {/* Faculty */}
                    {subject.faculty && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Faculty: <strong>{subject.faculty}</strong>
                      </Typography>
                    )}

                    {/* Attendance stats */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Attendance Rate
                        </Typography>
                        <Typography variant="h6" fontWeight="700" color={statusColor}>
                          {currentPct}%
                        </Typography>
                      </Box>
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          background: `${statusColor}15`,
                          color: statusColor,
                          fontWeight: "700",
                          borderRadius: "6px",
                        }}
                      />
                    </Box>

                    {/* Attendance buttons */}
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleOutlineRounded />}
                          onClick={() => handleLog(subject.id, "present")}
                          className="ripple-btn"
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            py: 1,
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)",
                          }}
                        >
                          Present
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<HighlightOffRounded />}
                          onClick={() => handleLog(subject.id, "absent")}
                          className="ripple-btn"
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            py: 1,
                            borderColor: "rgba(239, 68, 68, 0.4)",
                            color: "error.main",
                            "&:hover": {
                              borderColor: "error.main",
                              background: "rgba(239, 68, 68, 0.05)",
                            },
                          }}
                        >
                          Absent
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
