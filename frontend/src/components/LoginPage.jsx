import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, AppBar, Toolbar, Box, Divider } from '@mui/material';
import { signIn } from 'aws-amplify/auth';
import { styled } from '@mui/system';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // AWS Cognito login
      await signIn({
        username: email,
        password: password,
      });
      onLogin(); // Call the onLogin function when successful
    } catch (error) {
      console.error('Login error', error);
      setErrorMessage('Invalid credentials! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const StyledAppBar = styled(AppBar)({
    backgroundColor: "white",
    boxShadow: "none",
  });

  const LoginButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    backgroundColor: '#FFD700',
    color: '#000',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    minWidth: '100px',
    '&:hover': {
      backgroundColor: '#FFC700',
    },
  }));

  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: '#FFC627',
    marginBottom: '1.5rem',
  }));

  return (
    <Grid container style={{ height: '100vh' }}>
      {/* App Bar */}
      <StyledAppBar>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side: NEWSWELL Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#FFC627", fontWeight: "bold" }}>
              NEWS
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: "#4AB7C4", fontWeight: "bold" }}>
              WELL
            </Typography>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Main Login Area */}
      <Grid
        item
        xs={12}
        container
        justifyContent="center"
        alignItems="center"
        style={{ backgroundColor: '#B0E0E6' }}
      >
        <Box
          sx={{
            padding: '2rem',
            borderRadius: '10px',
            maxWidth: '350px', // Reduced width for smaller box size
            width: '100%',
            backgroundColor: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Typography variant="h5" align="center" fontWeight="bold" color="black">
                  Sign-in
                </Typography>
                <StyledDivider />
              </Grid>

              <Grid item>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  placeholder="Enter email id"
                  inputProps={{ maxLength: 100 }} // Ensure it only accepts reasonable input length
                />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  placeholder="Enter your Password"
                  inputProps={{ maxLength: 100 }} // Ensure it only accepts reasonable input length
                />
              </Grid>

              {errorMessage && (
                <Grid item>
                  <Typography
                    variant="body2"
                    style={{ color: 'red', textAlign: 'center' }}
                  >
                    {errorMessage}
                  </Typography>
                </Grid>
              )}

              <Grid
                item
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
                  Forgot Password?
                </Typography>

                <LoginButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Sign-in'}
                </LoginButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
