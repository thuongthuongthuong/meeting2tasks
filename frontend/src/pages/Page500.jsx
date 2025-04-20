import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(to right, ${theme.palette.error.light}, ${theme.palette.error.dark})`,
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  padding: theme.spacing(6),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  maxWidth: 480,
}));

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <Page title="Internal Server Error" sx={{ height: 1 }}>
      <RootStyle>
        <ContentBox>
          <ErrorOutlineIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
          <Typography variant="h3" sx={{ mb: 2 }}>
            500 - Internal Server Error
          </Typography>
          <Typography sx={{ color: 'white', mb: 4 }}>
            Oops! Something went wrong on our end. Please try again later or return to the homepage.
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={RouterLink} to="/">
            Go to Home
          </Button>
        </ContentBox>
      </RootStyle>
    </Page>
  );
}
