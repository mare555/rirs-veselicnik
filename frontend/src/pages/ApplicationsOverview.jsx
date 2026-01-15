import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { API } from "../api";
import ApplicationCard from "../components/ApplicationCard";
import Layout from "../components/Layout";

export default function ApplicationsOverview() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        API.getApplications().then(setApplications).then(() => {console.log('Fetched applications:', applications);});
    }, []);

    return (
        <Layout title="Applications Overview" setWidth="80%">
            <Grid container spacing={3} justifyContent="center">
                {applications.map((app) => (
                    <Grid item xs={12} sm={6} md={4} key={app.id}>
                        <ApplicationCard application={app} />
                    </Grid>
                ))}
            </Grid>
        </Layout>
    );
}
