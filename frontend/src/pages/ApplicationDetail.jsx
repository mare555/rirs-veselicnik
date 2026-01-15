import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button, Box } from "@mui/material";
import { API } from "../api";
import Layout from "../components/Layout";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);

  useEffect(() => {
    API.getApplicationById(id).then(setApp);
  }, [id]);

  if (!app) return <Layout title="Application Details" setWidth="40%">Loading...</Layout>;

  return (
    <Layout title={`${app.first_name} ${app.last_name}`} setWidth="40%">
      <Typography variant="subtitle1" gutterBottom>
        Applied for job: {app.job_title}
      </Typography>
      <Typography variant="body2">{app.description}</Typography>

      <Box display="flex" gap={2} mt={3}>
        <Button variant="outlined" color="error">Reject</Button>
        <Button variant="contained" color="primary">Accept</Button>
        <Button variant="text">Next Round</Button>
      </Box>
    </Layout>
  );
}
