import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import MainRouter from "./routes";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme } from '@mui/material/styles';
//---------------------------------------------------

const theme = createTheme({
  palette: {
    primary: {
      main: '#0052CC',
    },
    secondary: {
      main: '#00875A',
    },
    error: {
      main: '#DE350B',
    },
    background: {
      default: '#F4F5F7',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <BrowserRouter>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3000}
            preventDuplicate
          >
            <MainRouter />
          </SnackbarProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}
