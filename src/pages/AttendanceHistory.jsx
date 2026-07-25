import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  DeleteOutlineRounded,
  HistoryRounded,
  FilterListRounded,
  CancelRounded,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";
import { EmptyState } from "../components/EmptyState";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { formatDate, formatTime } from "../utils/attendanceHelper";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function AttendanceHistory() {
  const { logs, deleteLog, subjects, darkMode } = useAttendance();
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteTargetLog, setDeleteTargetLog] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = (log) => {
    setDeleteTargetLog(log);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetLog) {
      deleteLog(deleteTargetLog.id);
      setConfirmOpen(false);
      setDeleteTargetLog(null);
    }
  };

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSubject = filterSubject === "All" || log.subjectId === filterSubject;
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesSubject && matchesStatus;
  });

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}
    >
      {/* Title */}
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Typography variant="h4" fontWeight="800" gutterBottom>
          Attendance Logs
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight="500">
          Review every logged lecture chronologically. Remove incorrect records to adjust counts.
        </Typography>
      </Box>

      {/* Filters Card */}
      <Card
        className={darkMode ? "glass-panel" : "glass-panel-light"}
        component={motion.div}
        variants={itemVariants}
        sx={{ p: 2.5, borderRadius: "20px", mb: 4, border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Subject</InputLabel>
              <Select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                label="Filter by Subject"
                sx={{ borderRadius: "12px" }}
                startAdornment={<FilterListRounded sx={{ mr: 1, color: "text.secondary" }} />}
              >
                <MenuItem value="All">All Subjects</MenuItem>
                {subjects.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter by Status"
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="present">Present Only</MenuItem>
                <MenuItem value="absent">Absent Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* History Logs Table */}
      {filteredLogs.length === 0 ? (
        <Box component={motion.div} variants={itemVariants}>
          <EmptyState
            icon="History"
            title={logs.length === 0 ? "No logs recorded yet" : "No logs matching filters"}
            description={
              logs.length === 0
                ? "Mark your attendance as Present or Absent on the dashboard to populate logs."
                : "Try resetting your search filters."
            }
            actionText={logs.length > 0 ? "Reset Filters" : null}
            onAction={
              logs.length > 0
                ? () => {
                    setFilterSubject("All");
                    setFilterStatus("All");
                  }
                : null
            }
          />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className={darkMode ? "glass-panel" : "glass-panel-light"}
          sx={{
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="attendance logs table">
            <TableHead
              sx={{
                background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: "700" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Time</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "700" }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    transition: "background 0.2s",
                    "&:hover": {
                      background: darkMode ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.005)",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>{formatTime(log.timestamp)}</TableCell>
                  <TableCell sx={{ fontWeight: "600" }}>{log.subjectName}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.status === "present" ? "Present" : "Absent"}
                      size="small"
                      sx={{
                        fontWeight: "700",
                        borderRadius: "8px",
                        background:
                          log.status === "present"
                            ? "rgba(16, 185, 129, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                        color: log.status === "present" ? "success.main" : "error.main",
                        border: `1px solid ${
                          log.status === "present"
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(239, 68, 68, 0.2)"
                        }`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Log Entry (Reverts statistics)">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(log)}
                        sx={{
                          "&:hover": {
                            background: "rgba(239, 68, 68, 0.08)",
                          },
                        }}
                      >
                        <DeleteOutlineRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirmation dialog for log delete */}
      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Log Entry?"
        message={`Are you sure you want to remove this log? Deleting this log will automatically adjust the attendance count for "${deleteTargetLog?.subjectName}".`}
        confirmText="Remove"
        severity="warning"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
