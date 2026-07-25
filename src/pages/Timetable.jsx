import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Button,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarMonthRounded,
  AccessTimeRounded,
  DeleteOutlineRounded,
  AddRounded,
  EditRounded,
} from "@mui/icons-material";
import { useAttendance } from "../context/AttendanceContext";
import { EmptyState } from "../components/EmptyState";
import { AddSubjectDialog } from "../components/AddSubjectDialog";
import { SubjectIcon } from "../components/SubjectIcon";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Timetable() {
  const { timetable, setTimetable, subjects, darkMode } = useAttendance();
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRemoveSlot = (day, subjectId, time) => {
    const updatedDaySlots = timetable[day].filter(
      (slot) => !(slot.subjectId === subjectId && slot.time === time)
    );
    setTimetable({
      ...timetable,
      [day]: updatedDaySlots,
    });
  };

  const handleOpenAddDialog = () => {
    setSelectedSubjectId(null);
    setDialogOpen(true);
  };

  const currentDay = DAYS[activeTab];
  const daySlots = timetable[currentDay] || [];

  // Map slots to full subject details
  const mappedSlots = daySlots
    .map((slot) => {
      const subject = subjects.find((s) => s.id === slot.subjectId);
      if (!subject) return null;
      return {
        ...subject,
        time: slot.time,
      };
    })
    .filter(Boolean);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}
    >
      {/* Title */}
      <Box sx={{ mb: 4 }} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="800" gutterBottom>
            Timetable Planner
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="500">
            Define your daily lecture schedule to auto-populate classes on your Dashboard.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            display: { xs: "none", sm: "flex" },
          }}
        >
          Add Class Slot
        </Button>
      </Box>

      {/* Tabs for Days of Week */}
      <Card
        className={darkMode ? "glass-panel" : "glass-panel-light"}
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          mb: 4,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            px: 2,
            py: 1,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: "4px",
            },
          }}
        >
          {DAYS.map((day, idx) => (
            <Tab
              key={day}
              label={day}
              sx={{
                fontWeight: "700",
                fontSize: "1rem",
                textTransform: "none",
                px: 3,
                py: 2,
              }}
            />
          ))}
        </Tabs>
      </Card>

      {/* Schedule slots list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDay}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {mappedSlots.length === 0 ? (
            <EmptyState
              icon="CalendarMonth"
              title={`No classes on ${currentDay}`}
              description="Keep your planner organized by mapping subjects to their class times."
              actionText="Schedule a Class"
              onAction={handleOpenAddDialog}
            />
          ) : (
            <Grid container spacing={2.5}>
              {mappedSlots.map((slot, index) => (
                <Grid item xs={12} md={6} key={`${slot.id}_${slot.time}_${index}`}>
                  <Card
                    className={darkMode ? "glass-panel" : "glass-panel-light"}
                    sx={{
                      p: 3,
                      borderRadius: "20px",
                      position: "relative",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      gap: 2.5,
                      alignItems: "center",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    {/* Time Badge */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 90,
                        py: 1.5,
                        px: 1,
                        borderRadius: "14px",
                        background: `${slot.color}15`,
                        color: slot.color,
                        border: `1px solid ${slot.color}30`,
                      }}
                    >
                      <AccessTimeRounded sx={{ fontSize: 20, mb: 0.5 }} />
                      <Typography variant="body2" fontWeight="800">
                        {slot.time}
                      </Typography>
                    </Box>

                    {/* Class Details */}
                    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">
                        {slot.code || "SUB-CODE"}
                      </Typography>
                      <Typography variant="h6" fontWeight="700" noWrap>
                        {slot.name}
                      </Typography>
                      {slot.faculty && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {slot.faculty}
                        </Typography>
                      )}
                    </Box>

                    {/* Actions */}
                    <Box display="flex">
                      <Tooltip title="Remove Slot">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveSlot(currentDay, slot.id, slot.time)}
                        >
                          <DeleteOutlineRounded />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile-only FAB to add timetable slot */}
      <Button
        variant="contained"
        startIcon={<AddRounded />}
        onClick={handleOpenAddDialog}
        sx={{
          position: "fixed",
          bottom: 90,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "30px",
          textTransform: "none",
          px: 3.5,
          py: 1.2,
          background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
          boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4)",
          display: { xs: "flex", sm: "none" },
          zIndex: 100,
        }}
      >
        Add Class
      </Button>

      {/* Setup AddSubjectDialog link */}
      <AddSubjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        subjectId={selectedSubjectId}
      />
    </Box>
  );
}
