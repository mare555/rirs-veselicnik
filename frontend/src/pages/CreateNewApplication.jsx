import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { API } from "../api";
import Layout from "../components/Layout";

export default function NewApplication() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    position: "",
    description: "",
    agree: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      navigate("/"); // redirect if not logged in
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheck = (e) => setForm({ ...form, agree: e.target.checked });

  const handleSubmit = async () => {
    await API.createApplication(form);
    alert("Application created!");
  };

  return (
    <Layout title="Creating Job Application" setWidth="40%">
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        <TextField name="job title" label="Job title" onChange={handleChange} />
        <TextField
          name="jobDescription"
          label="Job Description"
          multiline
          rows={3}
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit Application
        </Button>
      </Box>
    </Layout>
  );
}
