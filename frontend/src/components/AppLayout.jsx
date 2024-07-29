import React from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";
import ReplayIcon from "@mui/icons-material/Replay";
const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
  boxShadow: "none",
});
const Logo = styled(Typography)({
  color: "#FFA500",
  fontWeight: "bold",
});
const ContentArea = styled(Box)({
  backgroundColor: "#B0E0E6",
  padding: "20px",
  minHeight: "calc(100vh - 64px)", // Subtract AppBar height
});
const WhiteBox = styled(Paper)({
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  height: "100%",
});
const ActionButton = styled(Button)({
  textTransform: "none",
});
const AppLayout = () => {
  const handleUndo = () => {
    // Implement undo logic
  };
  const handleReset = () => {
    // Implement reset logic
  };
  const handleSave = () => {
    // Implement save logic
  };
  const handleCreatePDF = () => {
    // Implement PDF creation logic
  };
  return (
    <>
      <StyledAppBar position="static">
        <Toolbar sx={{ alignItems: "flex-end" }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#FFC627", fontWeight: "bold" }}>
            NEWS
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: "#4AB7C4", fontWeight: "bold" }}>
            WELL
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <ContentArea>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <WhiteBox sx={{ height: "40rem" }}>
              <Typography variant="h6">Placeholder for Editable Component</Typography>
            </WhiteBox>
          </Grid>
          <Grid item xs={12} md={4}>
            <WhiteBox sx={{ height: "20rem" }}>
              <Typography variant="h6">Placeholder for Control Panel</Typography>
            </WhiteBox>
            <div style={{ height: "1px", backgroundColor: "black", margin: "0rem 4rem" }}></div>
            <Box mt={2} sx={{ display: "flex" }}>
              <Button variant="outlined" startIcon={<ReplayIcon />}>
                Undo
              </Button>
              <div style={{ borderRight: "1px solid", marginLeft: "1rem" }}></div>
              <Button variant="text">Reset the canvas</Button>
            </Box>
            <div style={{ height: "1px", backgroundColor: "black", marginTop: "1rem" }}></div>
            <Box mt={2} sx={{ display: "flex" }}>
              <Typography variant="body2">
                Want to save the changes made so far? <br></br>Click on the save button
              </Typography>
              <ActionButton variant="contained" color="primary" onClick={handleSave} sx={{ mt: 1, backgroundColor: "#4682B4", "&:hover": { backgroundColor: "#357AE8" } }}>
                Save
              </ActionButton>
            </Box>
            <div style={{ height: "1px", backgroundColor: "black", marginTop: "1rem" }}></div>
            <Box mt={2} sx={{ display: "flex" }}>
              <Typography variant="body2">Done with editing? Click on this button to generate the PDF</Typography>
              <ActionButton
                variant="contained"
                onClick={handleCreatePDF}
                sx={{
                  mt: 1,
                  backgroundColor: "#FFD700",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#FFC700",
                  },
                }}
              >
                Create PDF
              </ActionButton>
            </Box>
          </Grid>
        </Grid>
      </ContentArea>
    </>
  );
};
export default AppLayout;
