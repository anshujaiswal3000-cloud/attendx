import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export function ConfirmationDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  severity = "primary" // 'primary' | 'error' | 'warning'
}) {
  const getButtonColor = () => {
    if (severity === "error") return "error";
    if (severity === "warning") return "warning";
    return "primary";
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        style: {
          borderRadius: "18px",
          padding: "8px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }
      }}
    >
      <DialogTitle fontWeight="700">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onCancel} 
          sx={{ borderRadius: "10px", textTransform: "none" }}
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={getButtonColor()}
          sx={{ borderRadius: "10px", textTransform: "none", px: 3 }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
