import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
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

export default function Maintenance() {
  return (
    <Page title="Maintenance" sx={{ height: 1 }}>
      <RootStyle>
        <ContentBox>
          <BuildIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
          <Typography variant="h3" sx={{ mb: 2 }}>
            We're Under Maintenance
          </Typography>
          <Typography sx={{ color: 'white', mb: 4 }}>
            Our website is currently undergoing scheduled maintenance. We’ll be back shortly. Thank you for your patience!
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={RouterLink} to="/">
            Go to Home
          </Button>
        </ContentBox>
      </RootStyle>
    </Page>
  );
}
