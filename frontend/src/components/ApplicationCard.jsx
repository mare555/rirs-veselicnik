import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ApplicationCard({ app }) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, m:0.4 }}>
      <Typography variant="h6" color="primary">
        {app.first_name} {app.last_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {app.job_title}
      </Typography>
      <Box mt={2}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/applications/${app.id}`)}
        >
          View Details
        </Button>
      </Box>
    </Paper>
  );
}
