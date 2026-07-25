import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DashboardRounded,
  MenuBookRounded,
  HistoryRounded,
  CalendarMonthRounded,
  BarChartRounded,
  SettingsRounded,
  DarkModeRounded,
  LightModeRounded,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";

const navItems = [
  { path: "/", label: "Dashboard", icon: DashboardRounded },
  { path: "/subjects", label: "Subjects", icon: MenuBookRounded },
  { path: "/timetable", label: "Timetable", icon: CalendarMonthRounded },
  { path: "/analytics", label: "Analytics", icon: BarChartRounded },
  { path: "/history", label: "History", icon: HistoryRounded },
  { path: "/settings", label: "Settings", icon: SettingsRounded },
];

export function Navbar() {
  const { darkMode, setDarkMode } = useAttendance();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  if (isDesktop) {
    // Desktop Sidebar
    return (
      <Box
        className={darkMode ? "glass-panel" : "glass-panel-light"}
        sx={{
          width: 260,
          height: "94vh",
          position: "sticky",
          top: "3vh",
          left: 20,
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          p: 3,
          boxSizing: "border-box",
          ml: 2,
        }}
      >
        {/* Logo and App Title */}
        <Box display="flex" alignItems="center" gap={1.5} mb={4} px={1}>
          <Box
            className="gradient-bg animate-float"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
            }}
          >
            <Typography variant="h6" fontWeight="800" color="#fff">
              A
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: 0.5 }}>
            Attend<span className="gradient-text">X</span>
          </Typography>
        </Box>

        {/* User Profile Info */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={4}
          p={1.5}
          sx={{
            borderRadius: "16px",
            background: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Avatar
            alt="Anshu"
            src=""
            sx={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
              fontWeight: "700",
            }}
          >
            A
          </Avatar>
          <Box overflow="hidden">
            <Typography variant="subtitle2" fontWeight="700" noWrap>
              Anshu 👋
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Student Account
            </Typography>
          </Box>
        </Box>

        {/* Sidebar Nav Links */}
        <List sx={{ flexGrow: 1, p: 0 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: "14px",
                    py: 1.5,
                    px: 2,
                    background: isActive
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)"
                      : "transparent",
                    color: isActive ? "primary.main" : "text.secondary",
                    borderLeft: isActive ? "3px solid #10b981" : "3px solid transparent",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                      color: "text.primary",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    <Icon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? "700" : "500",
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Dark Mode Switcher */}
        <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid rgba(255, 255, 255, 0.08)">
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            {darkMode ? "Dark Mode" : "Light Mode"}
          </Typography>
          <IconButton onClick={handleThemeToggle} color="inherit">
            {darkMode ? <DarkModeRounded color="primary" /> : <LightModeRounded sx={{ color: "#f59e0b" }} />}
          </IconButton>
        </Box>
      </Box>
    );
  }

  // Mobile Bottom Navigation
  return (
    <Paper
      className={darkMode ? "glass-panel" : "glass-panel-light"}
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 12,
        left: 12,
        right: 12,
        borderRadius: "20px",
        zIndex: 1000,
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <BottomNavigation
        value={location.pathname}
        showLabels
        sx={{
          background: "transparent",
          height: 64,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <BottomNavigationAction
              key={item.path}
              component={NavLink}
              to={item.path}
              value={item.path}
              label={item.label}
              icon={<Icon />}
              sx={{
                color: "text.secondary",
                "&.active": {
                  color: "primary.main",
                  fontWeight: "700",
                },
                minWidth: "auto",
                px: 1,
                py: 0.5,
                "& .MuiBottomNavigationAction-label": {
                  fontSize: "0.7rem",
                  "&.Mui-selected": {
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  },
                },
              }}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}
