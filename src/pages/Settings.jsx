import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Grid,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  SettingsRounded,
  CloudUploadRounded,
  CloudDownloadRounded,
  DeleteForeverRounded,
  BackupRounded,
  RestoreRounded,
  DarkModeRounded,
  PercentRounded,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";
import { ConfirmationDialog } from "../components/ConfirmationDialog";

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

export default function Settings() {
  const {
    darkMode,
    setDarkMode,
    goalPercentage,
    setGoalPercentage,
    selectedSemester,
    setSelectedSemester,
    resetData,
    importData,
    exportData,
    subjects,
    timetable,
    logs,
  } = useAttendance();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const fileInputRef = useRef(null);

  const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];
  const goals = [75, 80, 85, 90];

  const handleResetConfirm = () => {
    resetData();
    setConfirmResetOpen(false);
    showSnackbar("Application data has been reset to defaults.", "success");
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Export Data to JSON File
  const handleExportJSON = () => {
    try {
      const dataStr = exportData();
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `attendx_backup_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      showSnackbar("Data exported successfully!", "success");
    } catch (e) {
      showSnackbar("Failed to export data.", "error");
    }
  };

  // Import Data from JSON File
  const handleImportJSONClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        const success = importData(parsedData);
        if (success) {
          showSnackbar("Data imported successfully!", "success");
        } else {
          showSnackbar("Failed to import. Invalid JSON format.", "error");
        }
      } catch (err) {
        showSnackbar("Error reading file. Make sure it is a valid JSON.", "error");
      }
    };
    fileReader.readAsText(file);
    // Reset file input value
    event.target.value = null;
  };

  // Local Storage Backup (Internal Backup slot)
  const handleBackupLocalStorage = () => {
    try {
      const dataStr = exportData();
      localStorage.setItem("attendx_local_backup_slot", dataStr);
      showSnackbar("Local backup saved successfully!", "success");
    } catch (e) {
      showSnackbar("Failed to create local backup.", "error");
    }
  };

  // Local Storage Restore (Internal Restore slot)
  const handleRestoreLocalStorageClick = () => {
    const backup = localStorage.getItem("attendx_local_backup_slot");
    if (!backup) {
      showSnackbar("No local backup found. Please create a backup first.", "warning");
      return;
    }
    setConfirmRestoreOpen(true);
  };

  const handleRestoreConfirm = () => {
    const backup = localStorage.getItem("attendx_local_backup_slot");
    if (backup) {
      const success = importData(JSON.parse(backup));
      if (success) {
        showSnackbar("Data restored from local backup successfully!", "success");
      } else {
        showSnackbar("Failed to restore local backup.", "error");
      }
    }
    setConfirmRestoreOpen(false);
  };

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
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight="500">
          Personalize your preferences, manage thresholds, and handle your database.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Preference Settings */}
        <Grid item xs={12} md={6} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{ p: 3, borderRadius: "24px", height: "100%", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2.5 }} display="flex" alignItems="center" gap={1.5}>
              <SettingsRounded color="primary" /> App Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box display="flex" flexDirection="column" gap={3}>
              {/* Theme Selector */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight="700">
                    Dark Theme Mode
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Switch between dark and light themes
                  </Typography>
                </Box>
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  color="primary"
                />
              </Box>

              {/* Goal Percentage */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight="700">
                    Attendance Target
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Minimum attendance limit for safe bunking
                  </Typography>
                </Box>
                <FormControl variant="outlined" size="small" sx={{ width: 120 }}>
                  <Select
                    value={goalPercentage}
                    onChange={(e) => setGoalPercentage(e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    {goals.map((g) => (
                      <MenuItem key={g} value={g}>
                        {g}%
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Semester Selector */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight="700">
                    Current Semester
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active academic period
                  </Typography>
                </Box>
                <FormControl variant="outlined" size="small" sx={{ width: 140 }}>
                  <Select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    sx={{ borderRadius: "10px" }}
                  >
                    {semesters.map((sem) => (
                      <MenuItem key={sem} value={sem}>
                        {sem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Data Persistence Operations */}
        <Grid item xs={12} md={6} component={motion.div} variants={cardVariants}>
          <Card
            className={darkMode ? "glass-panel" : "glass-panel-light"}
            sx={{ p: 3, borderRadius: "24px", height: "100%", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2.5 }} display="flex" alignItems="center" gap={1.5}>
              <BackupRounded color="primary" /> Data Management
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box display="flex" flexDirection="column" gap={2}>
              {/* Local Storage Backup/Restore */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<BackupRounded />}
                    onClick={handleBackupLocalStorage}
                    sx={{ borderRadius: "12px", textTransform: "none", py: 1.2 }}
                  >
                    Backup Local
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RestoreRounded />}
                    onClick={handleRestoreLocalStorageClick}
                    sx={{ borderRadius: "12px", textTransform: "none", py: 1.2 }}
                  >
                    Restore Local
                  </Button>
                </Grid>
              </Grid>

              {/* JSON File Export/Import */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<CloudDownloadRounded />}
                    onClick={handleExportJSON}
                    sx={{ borderRadius: "12px", textTransform: "none", py: 1.2 }}
                  >
                    Export JSON
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadRounded />}
                    onClick={handleImportJSONClick}
                    sx={{ borderRadius: "12px", textTransform: "none", py: 1.2 }}
                  >
                    Import JSON
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </Grid>
              </Grid>

              {/* Dangerous Reset */}
              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<DeleteForeverRounded />}
                  onClick={() => setConfirmResetOpen(true)}
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    py: 1.5,
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
                  }}
                >
                  Reset All Attendance Data
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation for Resetting */}
      <ConfirmationDialog
        open={confirmResetOpen}
        title="Reset All Data?"
        message="Are you sure you want to delete all custom subjects, logs, and reset timetable structures? Default subjects will be reloaded and initialized to 0."
        confirmText="Reset"
        severity="error"
        onConfirm={handleResetConfirm}
        onCancel={() => setConfirmResetOpen(false)}
      />

      {/* Confirmation for Restoring local backup */}
      <ConfirmationDialog
        open={confirmRestoreOpen}
        title="Restore Local Backup?"
        message="Are you sure you want to restore your previous local backup? This will overwrite all of your current subjects and log data."
        confirmText="Restore"
        severity="warning"
        onConfirm={handleRestoreConfirm}
        onCancel={() => setConfirmRestoreOpen(false)}
      />

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
