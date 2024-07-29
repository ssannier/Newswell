import React, { useRef } from "react";
import { Container, Grid, Typography, Paper, Box, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import html2pdf from "html2pdf.js";

const SaveComponents = () => {
  const contentRef = useRef(null);

  const handleCreatePDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 10,
      filename: "newspaper.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <div ref={contentRef}>
        <Header />
        <MainContent />
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleCreatePDF}>
          Create PDF
        </Button>
      </Box>
    </Container>
  );
};

const Header = () => (
  <>
    <Box sx={{ borderBottom: "1px solid black", borderTop: "1px solid black", marginBottom: 4, padding: "2px 0" }}>
      <Box sx={{ textAlign: "center", padding: 2, borderBottom: "1px solid black", borderTop: "1px solid black" }}>
        <Grid container>
          <Grid item xs={2.9}>
            <Typography variant="body2" sx={{ textAlign: "left" }}>
              $4.50 / 3.20 <br />
              USA / UK <br />
              MONDAY <br />
              JULY 31, 2080 <br />
              Issue No. 77
            </Typography>
          </Grid>
          <div style={{ border: "0.5px solid black" }} />
          <Grid item xs={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ color: "red", fontWeight: "bold" }}>
              MASTHEAD
            </Typography>
            <Typography variant="body1">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem.</Typography>
          </Grid>
          <div style={{ border: "0.5px solid black" }} />
          <Grid item xs={2.9} />
        </Grid>
      </Box>
    </Box>
  </>
);

const MainContent = () => (
  <Box sx={{ padding: 2 }}>
    <Grid container spacing={2}>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <Grid item xs={4} key={index}>
            <Paper sx={{ padding: 2, height: "100%", display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2">Click to add text</Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  See Page 5
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "7rem",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ececec",
                }}
                alt="Sample"
              >
                <ImageIcon />
              </Box>
            </Paper>
          </Grid>
        ))}
      <Grid item xs={4}>
        <Paper sx={{ padding: 2, height: "100%", marginTop: 4, height: "35%" }}>
          <Typography variant="body2">Click to add title</Typography>
        </Paper>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="caption" display="block" gutterBottom>
              By James Smith / The Times
            </Typography>
            <Typography variant="body2" component="p">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={8} sx={{ padding: 2, height: "100%", marginTop: 4 }}>
        <Box
          sx={{
            width: "100%",
            height: "33rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ececec",
          }}
          alt="Sample"
        >
          <ImageIcon />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default SaveComponents;
