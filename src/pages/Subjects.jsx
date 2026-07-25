import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Tooltip,
  Fab,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  AddRounded,
  SearchRounded,
  FilterListRounded,
  SortRounded,
  CheckCircleOutlineRounded,
  HighlightOffRounded,
  EditRounded,
  DeleteOutlineRounded,
  InfoOutlined,
  SchoolRounded,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";
import { SubjectIcon } from "../components/SubjectIcon";
import { AddSubjectDialog } from "../components/AddSubjectDialog";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { EmptyState } from "../components/EmptyState";
import {
  calculatePercentage,
  calculateBunkStatus,
  getAttendanceStatus,
  getStatusColor,
} from "../utils/attendanceHelper";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function Subjects() {
  const {
    subjects,
    logAttendance,
    deleteSubject,
    darkMode,
    goalPercentage,
    selectedSemester,
    setSelectedSemester,
  } = useAttendance();

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name_asc");

  const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

  const handleOpenAddDialog = () => {
    setSelectedSubjectId(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (id) => {
    setSelectedSubjectId(id);
    setDialogOpen(true);
  };

  const handleOpenDeleteConfirm = (subject) => {
    setSubjectToDelete(subject);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete.id);
      setConfirmOpen(false);
      setSubjectToDelete(null);
    }
  };

  // Filter and Sort subjects
  const filteredSubjects = subjects
    .filter((sub) => {
      // 1. Search Query filter
      const matchesSearch =
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Status Filter
      if (statusFilter === "All") return matchesSearch;
      const subPct = calculatePercentage(sub.present, sub.total);
      const status = getAttendanceStatus(subPct);
      return matchesSearch && status === statusFilter;
    })
    .sort((a, b) => {
      // 3. Sorting
      const pctA = calculatePercentage(a.present, a.total);
      const pctB = calculatePercentage(b.present, b.total);

      switch (sortBy) {
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "pct_asc":
          return pctA - pctB;
        case "pct_desc":
          return pctB - pctA;
        case "total_desc":
          return b.total - a.total;
        case "name_asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}
    >
      {/* Title & Semester Selector */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            My Subjects
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">
            Manage your course subjects, check bunk safety limits, and log lectures.
          </Typography>
        </Box>

        {/* Semester Selector */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="semester-select-label">Semester</InputLabel>
          <Select
            labelId="semester-select-label"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            label="Semester"
            sx={{ borderRadius: "12px", background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)" }}
          >
            {semesters.map((sem) => (
              <MenuItem key={sem} value={sem}>
                {sem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Search, Filter, Sort Controls */}
      <Card
        className={darkMode ? "glass-panel" : "glass-panel-light"}
        sx={{ p: 2.5, borderRadius: "20px", mb: 4, border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded color="action" />
                  </InputAdornment>
                ),
                style: { borderRadius: "12px" },
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ borderRadius: "12px" }}
                startAdornment={<FilterListRounded sx={{ mr: 1, color: "text.secondary" }} />}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Safe">Safe (&ge;75%)</MenuItem>
                <MenuItem value="Warning">Warning (65%-75%)</MenuItem>
                <MenuItem value="Critical">Critical (&lt;65%)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sorting */}
          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                sx={{ borderRadius: "12px" }}
                startAdornment={<SortRounded sx={{ mr: 1, color: "text.secondary" }} />}
              >
                <MenuItem value="name_asc">Name (A - Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z - A)</MenuItem>
                <MenuItem value="pct_desc">Attendance (High - Low)</MenuItem>
                <MenuItem value="pct_asc">Attendance (Low - High)</MenuItem>
                <MenuItem value="total_desc">Total Classes (High - Low)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <EmptyState
          icon={searchQuery || statusFilter !== "All" ? "YoutubeSearchedFor" : "MenuBook"}
          title={searchQuery || statusFilter !== "All" ? "No matching subjects" : "No subjects loaded"}
          description={
            searchQuery || statusFilter !== "All"
              ? "Try adjusting your search query or status filter."
              : "Click the floating button below to add your first subject."
          }
          actionText={searchQuery || statusFilter !== "All" ? "Clear Filters" : "Add Subject"}
          onAction={
            searchQuery || statusFilter !== "All"
              ? () => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }
              : handleOpenAddDialog
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredSubjects.map((sub) => {
            const currentPct = calculatePercentage(sub.present, sub.total);
            const status = getAttendanceStatus(currentPct);
            const statusColor = getStatusColor(status, darkMode);
            const bunk = calculateBunkStatus(sub.present, sub.total, goalPercentage);

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={sub.id}
                component={motion.div}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={darkMode ? "glass-panel" : "glass-panel-light"}
                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    boxSizing: "border-box",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Top Bar Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                      background: sub.color,
                    }}
                  />

                  {/* Subject Header */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Box sx={{ pr: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase" }}>
                        {sub.code || "SUB-CODE"}
                      </Typography>
                      <Typography variant="h6" fontWeight="700" sx={{ mt: 0.5, lineHeight: 1.2 }}>
                        {sub.name}
                      </Typography>
                      {sub.faculty && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Faculty: {sub.faculty}
                        </Typography>
                      )}
                    </Box>
                    <Avatar
                      sx={{
                        background: `${sub.color}15`,
                        color: sub.color,
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                      }}
                    >
                      <SubjectIcon name={sub.icon} />
                    </Avatar>
                  </Box>

                  {/* Attendance Stats & Circular indicator */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                    <Box>
                      <Typography variant="h4" fontWeight="800" sx={{ color: statusColor }}>
                        {currentPct}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sub.present} / {sub.total} Classes
                      </Typography>
                    </Box>
                    <Chip
                      label={status}
                      size="small"
                      sx={{
                        background: `${statusColor}15`,
                        color: statusColor,
                        fontWeight: "800",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ width: "100%", mb: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={currentPct}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${sub.color} 0%, ${statusColor} 100%)`,
                        },
                      }}
                    />
                  </Box>

                  {/* Bunk status calculator card */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "14px",
                      background:
                        bunk.status === "safe"
                          ? "rgba(16, 185, 129, 0.06)"
                          : "rgba(239, 68, 68, 0.06)",
                      border: `1px dashed ${bunk.status === "safe" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                      mb: 3,
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <InfoOutlined
                      sx={{
                        color: bunk.status === "safe" ? "success.main" : "error.main",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color={bunk.status === "safe" ? "success.main" : "error.main"}
                    >
                      {bunk.message}
                    </Typography>
                  </Box>

                  {/* Quick Attendance Trigger & Actions */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                    {/* Log Buttons */}
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        startIcon={<CheckCircleOutlineRounded />}
                        onClick={() => logAttendance(sub.id, "present")}
                        sx={{ borderRadius: "8px", textTransform: "none", py: 0.6 }}
                      >
                        Present
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<HighlightOffRounded />}
                        onClick={() => logAttendance(sub.id, "absent")}
                        sx={{ borderRadius: "8px", textTransform: "none", py: 0.6 }}
                      >
                        Absent
                      </Button>
                    </Box>

                    {/* Edit/Delete Actions */}
                    <Box>
                      <Tooltip title="Edit Subject">
                        <IconButton size="small" onClick={() => handleOpenEditDialog(sub.id)}>
                          <EditRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Subject">
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteConfirm(sub)}>
                          <DeleteOutlineRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Floating Action Button for Add Subject */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpenAddDialog}
        sx={{
          position: "fixed",
          bottom: { xs: 90, md: 30 },
          right: { xs: 20, md: 30 },
          background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
          },
        }}
      >
        <AddRounded />
      </Fab>

      {/* Add/Edit Dialog */}
      <AddSubjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subjectId={selectedSubjectId}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={confirmOpen}
        title="Delete Subject?"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? All associated attendance logs and scheduled timetable hours will be permanently deleted.`}
        confirmText="Delete"
        severity="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
}
