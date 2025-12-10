import React, { useEffect, useState } from "react";
import { TextField, Button, Box, MenuItem, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { API } from "../api";
import Layout from "../components/Layout";

export default function NewApplication() {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    job_id: "",   
    description: "",
    agree: false,
  });

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await API.getJobs(); 
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheck = (e) => setForm({ ...form, agree: e.target.checked });

  const handleSubmit = async () => {
    if (!form.agree) return alert("You must agree to terms.");
    if (!form.job_id) return alert("Please select a job");
    await API.submitApplication(form);
    alert("Application submitted!");
  };

  return (
    <Layout title="Job Application" setWidth="40%">
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        <TextField name="email" label="Email" onChange={handleChange} />
        <TextField name="first_name" label="First Name" onChange={handleChange} />
        <TextField name="last_name" label="Last Name" onChange={handleChange} />
        <TextField name="address" label="Address" onChange={handleChange} />
        <TextField name="phone" label="Phone" onChange={handleChange} />
        
        {/* Job selection */}
        <TextField
          select
          name="job_id"
          label="Select Job"
          value={form.job_id}
          onChange={handleChange}
        >
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.job_title}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          name="description"
          label="Short description about yourself"
          multiline
          rows={3}
          onChange={handleChange}
        />

        <FormControlLabel
          control={<Checkbox checked={form.agree} onChange={handleCheck} />}
          label={<Typography>I agree to the terms and conditions</Typography>}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Submit Application
        </Button>
      </Box>
    </Layout>
  );
}
