import React from "react";
import { Container, Grid, Divider, Typography, Paper, Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
const NewspaperLayout = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Header />
      <MainContent />
      {/* <Footer /> */}
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
const Footer = () => (
  <Box sx={{ textAlign: "center", marginTop: 4, padding: 2, borderTop: "1px solid black" }}>
    <Typography variant="body2">Link to Figma file to pick the sizes, colors and other styling elements:</Typography>
    <Typography variant="body2">
      <a href="https://www.figma.com/design/W7ouPZh3NbmCvQfmVXFd/newswell?node-id=58-36&t=SFeZKjCKJjMiQKTS-4">https://www.figma.com/design/W7ouPZh3NbmCvQfmVXFd/newswell?node-id=58-36&t=SFeZKjCKJjMiQKTS-4</a>
    </Typography>
  </Box>
);
export default NewspaperLayout;
