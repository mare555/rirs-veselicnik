import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { API } from "../api";
import JobCard from "../components/JobCard";
import Layout from "../components/Layout";

export default function ApplicationsOverview() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        API.getJobs().then(setJobs);
    }, []);

    return (
        <Layout title="Available jobs" setWidth="80%">
            <Grid container spacing={3} justifyContent="center">
                {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job.id}>
                        <JobCard app={job} />
                    </Grid>
                ))}
            </Grid>
        </Layout>
    );
}
