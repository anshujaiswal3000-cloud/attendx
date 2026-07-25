import React from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Paper,
  Divider,
  useTheme,
  Box as MuiBox,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUpRounded,
  TrendingDownRounded,
  AssessmentRounded,
  AutoGraphRounded,
  PieChartOutlineRounded,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";
import { calculatePercentage } from "../utils/attendanceHelper";
import { EmptyState } from "../components/EmptyState";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function Analytics() {
  const { subjects, logs, darkMode } = useAttendance();
  const theme = useTheme();

  // Compute Overall stats
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalAbsent = totalClasses - totalPresent;
  const overallPercentage = calculatePercentage(totalPresent, totalClasses);

  // Filter subjects that have conducted at least one class
  const activeSubjects = subjects.filter((s) => s.total > 0);

  // Highest Attendance
  const highestSubject = activeSubjects.reduce((max, s) => {
    const pct = calculatePercentage(s.present, s.total);
    const maxPct = max ? calculatePercentage(max.present, max.total) : -1;
    return pct > maxPct ? s : max;
  }, null);

  // Lowest Attendance
  const lowestSubject = activeSubjects.reduce((min, s) => {
    const pct = calculatePercentage(s.present, s.total);
    const minPct = min ? calculatePercentage(min.present, min.total) : 101;
    return pct < minPct ? s : min;
  }, null);

  // Pie Chart Data
  const pieData = [
    { name: "Present", value: totalPresent, color: "#10b981" },
    { name: "Absent", value: totalAbsent, color: "#ef4444" },
  ];

  // Bar Chart Data (Subject Wise %)
  const barData = subjects.map((sub) => {
    const pct = calculatePercentage(sub.present, sub.total);
    return {
      name: sub.code || sub.name.substring(0, 8) + "..",
      fullName: sub.name,
      percentage: pct,
      color: sub.color,
    };
  });

  // Line Chart Data (Attendance Trend)
  // Sort logs chronologically
  const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  let runningPresent = 0;
  let runningTotal = 0;
  
  const trendData = sortedLogs.map((log, index) => {
    if (log.status === "present") runningPresent++;
    runningTotal++;
    return {
      entry: index + 1,
      date: new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric" }),
      attendance: calculatePercentage(runningPresent, runningTotal),
    };
  });

  // Render Empty State if no classes conducted yet
  if (totalClasses === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Typography variant="h4" fontWeight="800" gutterBottom>
          Analytics & Insights
        </Typography>
        <EmptyState
          icon="Assessment"
          title="No analytics available"
          description="Attend/bunk logging is required to construct your charts and analytics insights. Mark attendance on your Dashboard first!"
        />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}
    >
      {/* Title */}
      <Box sx={{ mb: 4 }} component={motion.div} variants={cardVariants}>
        <Typography variant="h4" fontWeight="800" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight="500">
          Deep-dive insights, subject trends, and breakdown charts for your academic record.
        </Typography>
      </Box>

      {/* Stats Summary cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Average */}
        <Grid item xs={12} sm={4} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{
              p: 3,
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="700">
                AVERAGE ATTENDANCE
              </Typography>
              <Typography variant="h3" fontWeight="800" className="gradient-text" sx={{ mt: 1 }}>
                {overallPercentage}%
              </Typography>
            </Box>
            <Avatar sx={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}>
              <AutoGraphRounded />
            </Avatar>
          </Card>
        </Grid>

        {/* Highest */}
        <Grid item xs={12} sm={4} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{
              p: 3,
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box overflow="hidden">
              <Typography variant="caption" color="text.secondary" fontWeight="700">
                HIGHEST ATTENDANCE
              </Typography>
              {highestSubject ? (
                <>
                  <Typography variant="h4" fontWeight="800" color="success.main" sx={{ mt: 1 }}>
                    {calculatePercentage(highestSubject.present, highestSubject.total)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {highestSubject.name}
                  </Typography>
                </>
              ) : (
                <Typography variant="h5" fontWeight="800" sx={{ mt: 1 }}>
                  N/A
                </Typography>
              )}
            </Box>
            <Avatar sx={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <TrendingUpRounded />
            </Avatar>
          </Card>
        </Grid>

        {/* Lowest */}
        <Grid item xs={12} sm={4} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{
              p: 3,
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box overflow="hidden">
              <Typography variant="caption" color="text.secondary" fontWeight="700">
                LOWEST ATTENDANCE
              </Typography>
              {lowestSubject ? (
                <>
                  <Typography variant="h4" fontWeight="800" color="error.main" sx={{ mt: 1 }}>
                    {calculatePercentage(lowestSubject.present, lowestSubject.total)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {lowestSubject.name}
                  </Typography>
                </>
              ) : (
                <Typography variant="h5" fontWeight="800" sx={{ mt: 1 }}>
                  N/A
                </Typography>
              )}
            </Box>
            <Avatar sx={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
              <TrendingDownRounded />
            </Avatar>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Pie Chart: Present vs Absent */}
        <Grid item xs={12} md={5} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{ p: 3, borderRadius: "24px", height: "400px", display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }} display="flex" alignItems="center" gap={1}>
              <PieChartOutlineRounded color="primary" /> Ratio (Present vs Absent)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ flexGrow: 1, width: "100%", height: "80%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Bar Chart: Subject wise attendance */}
        <Grid item xs={12} md={7} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{ p: 3, borderRadius: "24px", height: "400px", display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }} display="flex" alignItems="center" gap={1}>
              <AssessmentRounded color="primary" /> Subject wise Attendance %
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ flexGrow: 1, width: "100%", height: "80%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="recharts-default-tooltip" style={{ padding: "10px" }}>
                            <p style={{ margin: 0, fontWeight: "bold" }}>{data.fullName}</p>
                            <p style={{ margin: "5px 0 0", color: "#60a5fa" }}>
                              Attendance: {data.percentage}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Line Chart: Attendance Trend */}
        {trendData.length > 0 && (
          <Grid item xs={12} component={motion.div} variants={cardVariants}>
            <Card
              className={darkMode ? "glass-panel" : "glass-panel-light"}
              sx={{ p: 3, borderRadius: "24px", height: "400px", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }} display="flex" alignItems="center" gap={1}>
                <AutoGraphRounded color="primary" /> Overall Attendance Trend
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ flexGrow: 1, width: "100%", height: "80%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
