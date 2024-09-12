import React, { useContext, useEffect, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider, TextField, Stack } from "@mui/material";
import { Context } from "../App";

import axios from "axios";
import Row1 from "../helper-components/Row1";
import Row2 from "../helper-components/Row2";
import Row4 from "../helper-components/Row4";
import Row3 from "../helper-components/Row3";
import Col1 from "../helper-components/Col1";
import EditableField from "../helper-components/EditableField";
import QRUpload from "../helper-components/QRUpload";

const env = import.meta.env;

const NewspaperLayout = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: "3rem !important" }}>
      <Header />
      <MainContent />
    </Container>
  );
};
const Header = () => {
  const [layout, setLayout] = useContext(Context);
  return (
    <>
      <Box sx={{ borderBottom: "1px solid black", borderTop: "1px solid black", marginBottom: 4, padding: "2px 0" }}>
        <Box sx={{ textAlign: "center", padding: 2, borderBottom: "1px solid black", borderTop: "1px solid black" }}>
          <Grid container>
            <Grid item xs={2.9}>
              <Typography variant="body2" sx={{ textAlign: "left", color: "black" }}>
                <EditableField
                  field="price"
                  placeholder="Example $4.50 / 3.20"
                  displayText={(temp) => {
                    return temp;
                  }}
                  sx={{ textAlign: "left", color: "black", fontSize: "0.875rem", fontWeight: 400 }}
                  editCanvas={true}
                />
                <EditableField
                  field="country"
                  placeholder="Example USA / UK"
                  displayText={(temp) => {
                    return temp;
                  }}
                  sx={{ textAlign: "left", color: "black", fontSize: "0.875rem", fontWeight: 400 }}
                  editCanvas={true}
                />
                {`${layout.day}` || getDayOfWeek()}
                <br />
                {`${layout.date}` || getFormattedDate()}
                <br />
                <EditableField
                  field="issueNumber"
                  placeholder="66"
                  displayText={(temp) => {
                    return "Issue Number: " + temp;
                  }}
                  sx={{ textAlign: "left", color: "black", fontSize: "0.875rem", fontWeight: 400 }}
                  editCanvas={true}
                />
              </Typography>
            </Grid>
            <div style={{ border: "0.5px solid black" }} />
            <Grid item xs={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "red" }}>
                {layout.banner}
              </Typography>

              <EditableField
                field="bannerSubtitle"
                placeholder="Your daily source for the latest and greatest in San Diego."
                displayText={(temp) => {
                  return temp;
                }}
                sx={{ fontSize: "16px", textAlign: "center", fontWeight: 500 }}
                editCanvas={true}
              />
            </Grid>
            <div style={{ border: "0.5px solid black" }} />
            <Grid item xs={2.9}>
              <Stack flexDirection="row" sx={{ ml: 4 }}>
                <Box sx={{ height: "100px", width: "100px", backgroundColor: "#ccc" }}>
                  <QRUpload />
                </Box>
                <Typography sx={{ textAlign: "left", alignSelf: "center", fontSize: "12px", width: "30%", ml: 2 }}>QR & So-cial bugs-ForPosition Only</Typography>
              </Stack>
              <Typography variant="body1" sx={{ textAlign: "center", mt: 1 }}>
                <EditableField
                  field="mediaAddress"
                  placeholder="@media.address.com"
                  displayText={(temp) => {
                    return temp;
                  }}
                  sx={{ fontSize: "14px", textAlign: "left", fontWeight: 500, ml: 4 }}
                  editCanvas={true}
                />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

const MainContent = () => (
  <Box sx={{ padding: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={4} sx={{ mb: 2 }}>
        <Row1 id={"row1_1"} width="9rem" height="9rem" />
      </Grid>
      <Grid item xs={4} sx={{ mb: 2 }}>
        <Row1 id={"row1_2"} width="9rem" height="9rem" />
      </Grid>
      <Grid item xs={4} sx={{ mb: 2 }}>
        <Row1 id={"row1_3"} width="9rem" height="9rem" />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid container item xs={12}>
        <Row2 id={"row2"} width="19.5rem" height="23rem" />
      </Grid>
      <Grid container item xs={8}>
        <Grid item xs={12}>
          <Row3 id={"row3"} width="19rem" height="10.5rem" />
        </Grid>
        <Grid item xs={12}>
          <Row4 id={"row4"} width="19rem" height="10.5rem" />
        </Grid>
      </Grid>
      <Grid container item xs={4}>
        <Col1 id={"col1"} width="19rem" height="15rem" />
      </Grid>
    </Grid>
  </Box>
);

export default NewspaperLayout;
export function getDayOfWeek() {
  const date = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = daysOfWeek[date.getDay()];
  return dayName.toUpperCase();
}
export function getFormattedDate() {
  const date = new Date();
  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthsOfYear[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();
  return `${monthName.toUpperCase()} ${dayOfMonth}, ${year}`;
}
export const generateHeadline = async (body, headlineLimit, id, onSuccess, setLayout) => {
  const request = {
    content: body,
    length: headlineLimit,
    editor_message: "Regenerate this",
  };

  try {
    const response = await axios.post(env.VITE_API_ARTICLE_HEADLINE, request);
    if (onSuccess) {
      onSuccess(response.data.body);
    }
    return true; // indicate success
  } catch (error) {
    console.error("Error generating headline:", error);
    return false; // indicate failure
  }
};
