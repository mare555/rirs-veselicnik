import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ApplicationCard({ application }) {
  const navigate = useNavigate();
  console.log('Rendering ApplicationCard for:', application);

  return (
    <Paper sx={{ p: 3, m: 0.4 }}>
      <Typography variant="h6" color="primary">

        {application.first_name} {application.last_name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {application.email}
      </Typography>

      {/* Render the Submitted date in the format: "Submitted: DD.MM.YYYY" */}
      {application.submitted_at && (
        <Typography variant="body2" color="text.secondary">
          Submitted: {new Date(application.submitted_at).toLocaleDateString('en-GB')}  {/* Format as DD.MM.YYYY */}
        </Typography>
      )}

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
