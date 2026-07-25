import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import * as Icons from "@mui/icons-material";

export function EmptyState({ 
  icon = "Inbox", 
  title = "No data found", 
  description = "There are no entries to display right now.",
  actionText,
  onAction
}) {
  const IconComponent = Icons[icon] || Icons.Inbox;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        minHeight: "300px",
        borderRadius: "24px",
        border: "2px dashed rgba(255, 255, 255, 0.1)",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(8px)",
        my: 3
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderRadius: "50%", 
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          color: "primary.main",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <IconComponent sx={{ fontSize: 48 }} />
      </Box>
      <Typography variant="h6" fontWeight="700" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350, mb: 3 }}>
        {description}
      </Typography>
      {actionText && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          className="ripple-btn"
          sx={{ 
            borderRadius: "12px", 
            textTransform: "none",
            px: 4,
            py: 1,
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #059669 0%, #2563eb 100%)",
            }
          }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}
