// App.js
import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  Typography, 
  ThemeProvider, 
  createTheme, 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  AvatarGroup,
  Chip,
  Select,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TaskCard from './components/TaskCard';
import StatusColumn from './components/StatusColumn';

// Mock data for users
const users = [
  { id: 1, name: 'User 1', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'User 2', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'User 3', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'User 4', avatar: 'https://i.pravatar.cc/150?img=4' },
];

// Mock data for tasks
const mockTasks = {
  todo: [
    { 
      id: 'NUC-205', 
      type: 'task', 
      title: 'Implement feedback collector', 
      priority: 'medium',
      assignee: users[3],
      storyPoints: 9
    },
    { 
      id: 'NUC-206', 
      type: 'bug', 
      title: 'Bump version for new API for billing', 
      priority: 'low',
      assignee: users[3],
      storyPoints: 3
    },
    { 
      id: 'NUC-208', 
      type: 'task', 
      title: 'Add NPS feedback to wallboard', 
      priority: 'low',
      assignee: users[3],
      storyPoints: 1
    }
  ],
  inProgress: [
    { 
      id: 'NUC-213', 
      type: 'bug', 
      title: 'Update T&C copy with v1.9 from the writers guild in all products that have cross country compliance', 
      priority: 'high',
      assignee: users[2],
      storyPoints: 1
    },
    { 
      id: 'NUC-216', 
      type: 'task', 
      title: 'Refactor stripe verification key validator to a single call to avoid timing out on slow connections', 
      priority: 'high',
      assignee: users[0],
      storyPoints: 3
    },
    { 
      id: 'NUC-218', 
      type: 'task', 
      title: 'Investigate perfomance dips from last week', 
      priority: 'high',
      assignee: users[0],
      storyPoints: 3
    }
  ],
  inReview: [
    { 
      id: 'NUC-338', 
      type: 'task', 
      title: 'Multi-dest search UI web', 
      priority: 'medium',
      assignee: users[1],
      storyPoints: 5
    }
  ],
  done: [
    { 
      id: 'NUC-336', 
      type: 'task', 
      title: 'Quick booking for accomodations - web', 
      priority: 'low',
      assignee: users[2],
      storyPoints: 4,
      completed: true
    },
    { 
      id: 'NUC-354', 
      type: 'bug', 
      title: 'Shoping cart purchasing error - quick fix required.', 
      priority: 'high',
      assignee: users[1],
      storyPoints: 1,
      completed: true
    }
  ]
};

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

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [aiAnchor, setAiAnchor] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAiMenuClick = (event) => {
    setAiAnchor(event.currentTarget);
  };

  const handleAiMenuClose = () => {
    setAiAnchor(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontWeight: 500 }}>
              Board
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="small" sx={{ mr: 1 }}>
              <FlashOnIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                4 days remaining
              </Typography>
            </Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              Complete sprint
            </Button>
            <IconButton onClick={handleMenuClick}>
              <MoreHorizIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Board settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Configure columns</MenuItem>
              <MenuItem onClick={handleMenuClose}>Export board</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, backgroundColor: 'white', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
              sx={{ width: 180, mr: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <AvatarGroup max={4} sx={{ mr: 2 }}>
              {users.map(user => (
                <Tooltip key={user.id} title={user.name}>
                  <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
                </Tooltip>
              ))}
            </AvatarGroup>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                GROUP BY
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value="Choices"
                  displayEmpty
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{ '& .MuiSelect-select': { py: 1 } }}
                >
                  <MenuItem value="Choices">Choices</MenuItem>
                  <MenuItem value="Status">Status</MenuItem>
                  <MenuItem value="Assignee">Assignee</MenuItem>
                  <MenuItem value="Priority">Priority</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip label="Epic" variant="outlined" onDelete={() => {}} deleteIcon={<KeyboardArrowDownIcon />} sx={{ mr: 1 }} />
            <Tooltip title="Get AI help">
              <Button 
                variant="outlined" 
                startIcon={<SmartToyIcon />} 
                size="small"
                onClick={handleAiMenuClick}
                sx={{ ml: 'auto' }}
              >
                AI Help
              </Button>
            </Tooltip>
            <Menu
              anchorEl={aiAnchor}
              open={Boolean(aiAnchor)}
              onClose={handleAiMenuClose}
            >
              <MenuItem onClick={handleAiMenuClose}>Generate task descriptions</MenuItem>
              <MenuItem onClick={handleAiMenuClose}>Summarize sprint</MenuItem>
              <MenuItem onClick={handleAiMenuClose}>Suggest task priorities</MenuItem>
              <MenuItem onClick={handleAiMenuClose}>Help with estimations</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          p: 2, 
          backgroundColor: '#F4F5F7', 
          overflowX: 'auto',
          gap: 2
        }}>
          <StatusColumn 
            title="TO DO" 
            count={mockTasks.todo.length} 
            tasks={mockTasks.todo} 
          />
          <StatusColumn 
            title="IN PROGRESS" 
            count={mockTasks.inProgress.length} 
            tasks={mockTasks.inProgress} 
          />
          <StatusColumn 
            title="IN REVIEW" 
            count={mockTasks.inReview.length} 
            tasks={mockTasks.inReview} 
          />
          <StatusColumn 
            title="DONE" 
            count={mockTasks.done.length} 
            tasks={mockTasks.done} 
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;


