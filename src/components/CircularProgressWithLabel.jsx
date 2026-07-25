import React from "react";
import { Box, Typography } from "@mui/material";

export function CircularProgressWithLabel({ value, size = 180, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Determine color based on attendance value
  let gradientId = "attendance-green-blue-purple";
  
  return (
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="attendanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />   {/* Emerald */}
            <stop offset="50%" stopColor="#3b82f6" />  {/* Blue */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        
        {/* Foreground Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#attendanceGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.8s ease-in-out",
          }}
        />
      </svg>
      
      {/* Label in center */}
      <Box
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h3"
          component="div"
          fontWeight="800"
          className="gradient-text"
          sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
        >
          {value.toFixed(2)}%
        </Typography>
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          fontWeight="700"
          sx={{ textTransform: "uppercase", letterSpacing: 1, mt: 0.5 }}
        >
          Overall Attendance
        </Typography>
      </Box>
    </Box>
  );
}
