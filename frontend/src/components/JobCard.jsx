// In JobCard.jsx
import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, m: 0.4 }}>
      <Typography variant="h6" color="primary">
        {job?.job_title || "No job title provided"} {/* Provide fallback */}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {job?.job_description || "No description provided"}
      </Typography>
      <Box mt={2}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/apply`)}
        >
          Apply
        </Button>
      </Box>
    </Paper>
  );
}
