import React, { useContext, useState } from "react";
import { Container, Grid, Typography, Paper, Box, Tooltip, Fade, IconButton, Button, CircularProgress, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { styled } from "@mui/system";
import { Context } from "../App";
import { getNews } from "./GenerateNews";
import ImageUploader from "./ImageUploader";

const env = import.meta.env;
import axios from "axios";

const OverlayBox = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: "white",
  "&:hover .overlay": {
    opacity: 1,
    zIndex: 1, // Ensure it's above other elements
  },
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s",
  zIndex: -1, // Default z-index to ensure it only shows on hover
}));
const TextBox = styled(Typography)(({ theme }) => ({
  position: "absolute",
  color: "#000",
  cursor: "pointer",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  color: "#fff",
  borderColor: "#fff",
}));
const Row1 = ({ id, width, height }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
      <HoverText id={id} height={height} width={width} />
      <ImageUploader
        id={id}
        width={320}
        height={211}
        sx={{
          marginLeft: 2,
        }}
      />
    </Box>
  );
};
const HoverText = ({ id, width, height }) => {
  const [layout, setLayout] = useContext(Context);
  const handleEdit = () => {
    setLayout((prev) => {
      return { ...prev, selectedTextbox: id };
    });
  };
  const handleRegenerate = () => {
    setLayout((prev) => {
      return { ...prev, [id]: { ...prev[id], loading: true } };
    });
    getNews(layout[id]?.body, layout[id]?.maxLimit, "", function (res) {
      setLayout((prev) => {
        return {
          ...prev,
          selectedTextbox: id,
          [id]: {
            ...prev[id],
            body: res,
            loading: false,
          },
        };
      });
    });
  };
  return (
    <OverlayBox
      sx={{
        width: width,
        height: height,
        boxShadow: id === layout.selectedTextbox ? "0px 3px 3px -2px #abd8de, 0px 3px 4px 0px rgb(176 224 230), 0px 1px 8px 0px rgb(176 224 230)" : "none",
      }}
    >
      <TextBox sx={{ height: "100%", fontSize: layout[id].body ? "1rem" : "1rem" }}>{layout[id].body || "Click  to add text"}</TextBox>
      <Overlay className="overlay">
        <StyledButton variant="text" onClick={handleEdit} startIcon={<EditIcon />}>
          Edit
        </StyledButton>
        <StyledButton variant="text" onClick={handleRegenerate} startIcon={<AutorenewIcon />}>
          Regenerate
        </StyledButton>
      </Overlay>
    </OverlayBox>
  );
};
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
                {layout.price} <br />
                {layout.country} <br />
                {`${layout.day}` || getDayOfWeek()}
                <br />
                {`${layout.date}` || getFormattedDate()}
                <br />
                Issue Number {layout.issueNumber}
              </Typography>
            </Grid>
            <div style={{ border: "0.5px solid black" }} />
            <Grid item xs={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "red" }}>
                {layout.banner}
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                {layout.bannerSubtitle}
              </Typography>
            </Grid>
            <div style={{ border: "0.5px solid black" }} />
            <Grid item xs={2.9} />
          </Grid>
        </Box>
      </Box>
    </>
  );
};
const Row2 = ({ id, width, height }) => {
  const [layout, setLayout] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateHeadline = async () => {
    setIsLoading(true);
    const success = await generateHeadline(layout?.[id]?.body, layout?.[id]?.headlineLimit, id, function (response) {
      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          title: response,
        },
      }));
    });
    setIsLoading(false);
  };

  return (
    <>
      <Grid item xs={4} container spacing={2} direction="row" alignContent="flex-start">
        <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "600" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
            {layout?.[id].title || "Click to generate headline"}
          </Typography>
          <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <HoverText id={id} width={width} height={height} />
        </Grid>
      </Grid>
      <Grid item xs={8} sx={{ height: "100%" }}>
        <ImageUploader
          id={id}
          width={648}
          height={528}
          sx={{
            marginLeft: 2,
          }}
        />
      </Grid>
    </>
  );
};
const Row3 = ({ id, width, height }) => {
  const [layout, setLayout] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateHeadline = async () => {
    setIsLoading(true);
    const success = await generateHeadline(layout?.[id]?.body, layout?.[id]?.headlineLimit, id, function (response) {
      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          title: response,
        },
      }));
    });
    setIsLoading(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: "1rem 0" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", backgroundColor: "#FFFF00", width: "fit-content" }}>
              TOP STORIES
            </Typography>
          </Paper>
          <Divider />
        </Grid>

        <Grid item xs={6}>
          <ImageUploader id={id} width="100%" height={300} placeholder="Add Image" />
        </Grid>

        <Grid item xs={6}>
          <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "600" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
              {layout?.[id].title || "Click to generate headline"}
            </Typography>
            <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
            </IconButton>
          </Grid>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            By James Smith | The Times
          </Typography>

          <HoverText id={id} width={width} height={height} />

          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            More news page 2
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
const Row4 = ({ id, width, height }) => {
  const [layout, setLayout] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateHeadline = async () => {
    setIsLoading(true);
    const success = await generateHeadline(layout?.[id]?.body, layout?.[id]?.headlineLimit, id, function (response) {
      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          title: response,
        },
      }));
    });
    setIsLoading(false);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: "1rem 0" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", backgroundColor: "#FFFF00", width: "fit-content" }}>
              ECONOMICS
            </Typography>
          </Paper>
          <Divider />
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "600" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
              {layout?.[id].title || "Click to generate headline"}
            </Typography>
            <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
            </IconButton>
          </Grid>

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            By James Smith | The Times
          </Typography>

          <HoverText id={id} width={width} height={height} />

          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            More news page 2
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <ImageUploader id={id} width="100%" height={300} placeholder="Add Image" />
        </Grid>
      </Grid>
    </>
  );
};
const Col1 = ({ id, width, height }) => {
  const [layout, setLayout] = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerateHeadline = async () => {
    setIsLoading(true);
    const success = await generateHeadline(layout?.[id]?.body, layout?.[id]?.headlineLimit, id, function (response) {
      setLayout((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          title: response,
        },
      }));
    });
    setIsLoading(false);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: "1rem 0" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", backgroundColor: "#FFFF00", width: "fit-content" }}>
              CULTURE
            </Typography>
          </Paper>
          <Divider />
        </Grid>
        <Grid container item>
          <Grid item xs={12}>
            <ImageUploader id={id} width="100%" height={300} placeholder="Add Image" />
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "600" }} onClick={handleGenerateHeadline} style={{ cursor: "pointer", flexGrow: 1 }}>
                {layout?.[id].title || "Click to generate headline"}
              </Typography>
              <IconButton onClick={handleGenerateHeadline} disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} /> : <AutorenewIcon />}
              </IconButton>
            </Grid>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              By James Smith | The Times
            </Typography>

            <HoverText id={id} width={width} height={height} />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              More news page 2
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const MainContent = () => (
  <Box sx={{ padding: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Row1 id={"row1_1"} width="300px" height="13rem" />
      </Grid>
      <Grid item xs={4}>
        <Row1 id={"row1_2"} width="300px" height="13rem" />
      </Grid>
      <Grid item xs={4}>
        <Row1 id={"row1_3"} width="300px" height="13rem" />
      </Grid>

      <Grid container item xs={12}>
        <Row2 id={"row2"} width="100%" height="26rem" />
      </Grid>
      <Grid container item xs={8}>
        <Grid item xs={12}>
          <Row3 id={"row3"} width="100%" height="10.5rem" />
        </Grid>
        <Grid item xs={12}>
          <Row4 id={"row4"} width="100%" height="10.5rem" />
        </Grid>
      </Grid>
      <Grid container item xs={4}>
        <Col1 id={"col1"} width="100%" height="15rem" />
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
