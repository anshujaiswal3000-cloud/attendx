import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { AttendanceProvider, useAttendance } from "./context/AttendanceContext";
import { Navbar } from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Timetable from "./pages/Timetable";
import Analytics from "./pages/Analytics";
import AttendanceHistory from "./pages/AttendanceHistory";
import Settings from "./pages/Settings";

function AppContent() {
  const { darkMode } = useAttendance();

  // Create MUI theme dynamically based on dark mode selection
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#3b82f6", // Royal Blue
          },
          secondary: {
            main: "#10b981", // Emerald Green
          },
          background: {
            default: darkMode ? "#070b13" : "#f8fafc",
            paper: darkMode ? "#0f1624" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#f3f4f6" : "#1f2937",
            secondary: darkMode ? "#9ca3af" : "#4b5563",
          },
        },
        shape: {
          borderRadius: 20, // Rounded corners (18px+)
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
          h4: {
            fontWeight: 800,
          },
          h5: {
            fontWeight: 800,
          },
          h6: {
            fontWeight: 700,
          },
          subtitle1: {
            fontWeight: 600,
          },
          subtitle2: {
            fontWeight: 600,
          },
          body1: {
            fontWeight: 500,
          },
          button: {
            fontWeight: 700,
            textTransform: "none",
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "12px",
                padding: "8px 16px",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: "20px",
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            minHeight: "100vh",
            width: "100vw",
            background: darkMode
              ? "radial-gradient(ellipse at top, #10192e 0%, #05080e 100%)"
              : "radial-gradient(ellipse at top, #f1f5f9 0%, #cbd5e1 100%)",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Navigation layout */}
          <Navbar />

          {/* Main workspace */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { xs: "100%", md: "calc(100% - 280px)" },
              boxSizing: "border-box",
              minHeight: "100vh",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/history" element={<AttendanceHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
}
