import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Box,
} from "@mui/material";
import { useAttendance } from "../context/AttendanceContext";

const COLOR_PRESETS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#10b981", label: "Emerald" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#f43f5e", label: "Rose" },
];

const ICON_PRESETS = [
  { value: "Computer", label: "Computer" },
  { value: "Code", label: "Code" },
  { value: "Storage", label: "Storage" },
  { value: "Layers", label: "Layers" },
  { value: "Memory", label: "Memory" },
  { value: "BarChart", label: "Chart" },
  { value: "School", label: "Graduation" },
  { value: "DeveloperMode", label: "Mobile" },
  { value: "Calculate", label: "Math" },
  { value: "Psychology", label: "Brain" },
  { value: "SmartToy", label: "Robot" },
  { value: "Html", label: "HTML" },
  { value: "MenuBook", label: "Book" },
];

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AddSubjectDialog({ open, onClose, subjectId = null }) {
  const { addSubject, editSubject, subjects, timetable, setTimetable } = useAttendance();

  const isEditMode = !!subjectId;

  // Form Fields State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [faculty, setFaculty] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [icon, setIcon] = useState("Computer");
  const [initialPresent, setInitialPresent] = useState(0);
  const [initialTotal, setInitialTotal] = useState(0);

  // Timetable State: { Monday: { active: false, time: '09:00 AM' } }
  const [daySchedule, setDaySchedule] = useState(() => {
    const initial = {};
    DAYS.forEach((day) => {
      initial[day] = { active: false, time: "09:00 AM" };
    });
    return initial;
  });

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode && open) {
      const subject = subjects.find((s) => s.id === subjectId);
      if (subject) {
        setName(subject.name || "");
        setCode(subject.code || "");
        setFaculty(subject.faculty || "");
        setColor(subject.color || "#6366f1");
        setIcon(subject.icon || "Computer");
        setInitialPresent(subject.present || 0);
        setInitialTotal(subject.total || 0);

        // Find timetable slots for this subject
        const schedule = {};
        DAYS.forEach((day) => {
          const slot = timetable[day]?.find((s) => s.subjectId === subjectId);
          if (slot) {
            schedule[day] = { active: true, time: slot.time };
          } else {
            schedule[day] = { active: false, time: "09:00 AM" };
          }
        });
        setDaySchedule(schedule);
      }
    } else if (open) {
      // Reset form
      setName("");
      setCode("");
      setFaculty("");
      setColor("#6366f1");
      setIcon("Computer");
      setInitialPresent(0);
      setInitialTotal(0);

      const initial = {};
      DAYS.forEach((day) => {
        initial[day] = { active: false, time: "09:00 AM" };
      });
      setDaySchedule(initial);
    }
  }, [isEditMode, subjectId, open, subjects, timetable]);

  const handleDayChange = (day) => (e) => {
    setDaySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: e.target.checked,
      },
    }));
  };

  const handleTimeChange = (day) => (e) => {
    setDaySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        time: e.target.value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name,
      code,
      faculty,
      color,
      icon,
    };

    let targetId = subjectId;

    if (isEditMode) {
      editSubject(subjectId, {
        ...data,
        present: parseInt(initialPresent, 10) || 0,
        total: parseInt(initialTotal, 10) || 0,
      });
    } else {
      targetId = addSubject({
        ...data,
        initialPresent,
        initialTotal,
      });
    }

    // Update timetable schedule
    const updatedTimetable = { ...timetable };
    DAYS.forEach((day) => {
      // Remove any existing slots for this subject on this day
      let daySlots = updatedTimetable[day] ? [...updatedTimetable[day]] : [];
      daySlots = daySlots.filter((s) => s.subjectId !== targetId);

      // If scheduled, add it
      if (daySchedule[day].active) {
        daySlots.push({
          subjectId: targetId,
          time: daySchedule[day].time,
        });
        // Sort timetable slots by time
        daySlots.sort((a, b) => {
          const timeA = parseTime(a.time);
          const timeB = parseTime(b.time);
          return timeA - timeB;
        });
      }

      updatedTimetable[day] = daySlots;
    });

    setTimetable(updatedTimetable);
    onClose();
  };

  // Helper to sort times
  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (hours === 12 && modifier === "AM") {
      hours = 0;
    }
    if (modifier === "PM" && hours < 12) {
      hours += 12;
    }
    return hours * 60 + parseInt(minutes, 10);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: "800", fontSize: "1.5rem" }}>
          {isEditMode ? "Edit Subject" : "Add New Subject"}
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Subject Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                placeholder="e.g. Data Structure"
                InputProps={{ style: { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Subject Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                variant="outlined"
                placeholder="e.g. CS-302"
                InputProps={{ style: { borderRadius: "12px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Faculty Name"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                variant="outlined"
                placeholder="e.g. Prof. Priya"
                InputProps={{ style: { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label={isEditMode ? "Present Classes" : "Initial Present"}
                value={initialPresent}
                onChange={(e) => setInitialPresent(Math.max(0, parseInt(e.target.value, 10) || 0))}
                InputProps={{ style: { borderRadius: "12px" } }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                type="number"
                label={isEditMode ? "Total Classes" : "Initial Total"}
                value={initialTotal}
                onChange={(e) => setInitialTotal(Math.max(0, parseInt(e.target.value, 10) || 0))}
                InputProps={{ style: { borderRadius: "12px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Theme Color</InputLabel>
                <Select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  label="Theme Color"
                  sx={{ borderRadius: "12px" }}
                >
                  {COLOR_PRESETS.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: c.value,
                          }}
                        />
                        {c.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Icon Symbol</InputLabel>
                <Select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  label="Icon Symbol"
                  sx={{ borderRadius: "12px" }}
                >
                  {ICON_PRESETS.map((i) => (
                    <MenuItem key={i.value} value={i.value}>
                      {i.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Timetable Configuration */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 1 }}>
                Timetable Slots
              </Typography>
              <FormGroup>
                <Grid container spacing={1}>
                  {DAYS.map((day) => (
                    <Grid
                      item
                      xs={12}
                      key={day}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        py: 0.5,
                        px: 1.5,
                        borderRadius: "12px",
                        background: daySchedule[day].active
                          ? "rgba(59, 130, 246, 0.05)"
                          : "transparent",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={daySchedule[day].active}
                            onChange={handleDayChange(day)}
                          />
                        }
                        label={day}
                        sx={{ width: 120 }}
                      />
                      {daySchedule[day].active && (
                        <FormControl size="small" sx={{ width: 150 }}>
                          <Select
                            value={daySchedule[day].time}
                            onChange={handleTimeChange(day)}
                            size="small"
                            sx={{ borderRadius: "8px" }}
                          >
                            {TIME_SLOTS.map((slot) => (
                              <MenuItem key={slot} value={slot}>
                                {slot}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit" sx={{ textTransform: "none", borderRadius: "10px" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim() || initialPresent > initialTotal}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              px: 4,
              background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            }}
          >
            {isEditMode ? "Save Changes" : "Add Subject"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
