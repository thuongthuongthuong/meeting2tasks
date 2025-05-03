// App.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CssBaseline, 
  Typography, 
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import StatusColumn from '../components/StatusColumn';
import { users, mockSprints } from '../mockData/data';
import TaskDialog from '../components/TaskDialog';
import AIAssistant from '../components/AIAssistant';
import TaskListSidebar from '../components/TaskListSidebar';
//------------------------------------------------------

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [aiAnchor, setAiAnchor] = useState(null);
  const [sprints, setSprints] = useState(mockSprints);
  const [currentSprint, setCurrentSprint] = useState(sprints[0]);
  const [tasks, setTasks] = useState(currentSprint.tasks);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  useEffect(() => {
    // Update tasks when current sprint changes
    setTasks(currentSprint.tasks);
  }, [currentSprint]);

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

  const handleOpenSprintDialog = () => {
    setSprintDialogOpen(true);
  };

  const handleCloseSprintDialog = () => {
    setSprintDialogOpen(false);
  };

  const handleChangeSprint = (sprint) => {
    setCurrentSprint(sprint);
    handleCloseSprintDialog();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleCloseTaskDetail = () => {
    setTaskDetailOpen(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Get task from source
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const taskToMove = tasks[sourceColumn][source.index];
    
    // Create new tasks state
    const newTasks = { ...tasks };
    
    // Remove from source
    newTasks[sourceColumn] = newTasks[sourceColumn].filter((_, index) => index !== source.index);
    
    // Add to destination at the end (ignore destination.index)
    // This ensures the task always goes to the end of the column
    if (sourceColumn !== destColumn) {
      newTasks[destColumn] = [
        ...newTasks[destColumn],
        taskToMove
      ];
    } else {
      // If in the same column, respect the original position
      newTasks[destColumn] = [
        ...newTasks[destColumn].slice(0, destination.index),
        taskToMove,
        ...newTasks[destColumn].slice(destination.index)
      ];
    }
    
    // Mark as completed if moved to done column
    if (destColumn === 'done' && sourceColumn !== 'done') {
      // Since we added it to the end, it's the last item in the array
      newTasks[destColumn][newTasks[destColumn].length - 1] = {
        ...newTasks[destColumn][newTasks[destColumn].length - 1],
        completed: true
      };
    }
    
    // Remove completed property if moved from done column
    if (sourceColumn === 'done' && destColumn !== 'done') {
      // Since we added it to the end, it's the last item in the array
      const { completed, ...taskWithoutCompleted } = newTasks[destColumn][newTasks[destColumn].length - 1];
      newTasks[destColumn][newTasks[destColumn].length - 1] = taskWithoutCompleted;
    }
    
    // Update state
    setTasks(newTasks);
    
    // Update sprint data
    const updatedSprints = sprints.map(sprint => {
      if (sprint.id === currentSprint.id) {
        return {
          ...sprint,
          tasks: newTasks
        };
      }
      return sprint;
    });
    
    setSprints(updatedSprints);
    setCurrentSprint({ ...currentSprint, tasks: newTasks });
  };

  // New function to add to App.js
const handleAddTask = (newTask) => {
  // Generate a unique ID with format TASK-XXX
  const generateTaskId = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString().substring(0, 3);
    return `TASK-${randomId}`;
  };
  
  // Create the task object with default values plus user input
  const taskToAdd = {
    id: generateTaskId(),
    type: newTask.type || 'task',
    title: newTask.title,
    description: newTask.description || '',
    priority: newTask.priority || 'medium',
    storyPoints: newTask.storyPoints || 1,
    assignee: newTask.assignee || users[0], // Default to first user if not specified
    completed: false
  };
  
  // Add to todo column by default
  const newTasks = {
    ...tasks,
    todo: [...tasks.todo, taskToAdd]
  };
  
  // Update state
  setTasks(newTasks);
  
  // Update sprint data
  const updatedSprints = sprints.map(sprint => {
    if (sprint.id === currentSprint.id) {
      return {
        ...sprint,
        tasks: newTasks
      };
    }
    return sprint;
  });
  
  setSprints(updatedSprints);
  setCurrentSprint({ ...currentSprint, tasks: newTasks });
  
  // Close dialog if needed
  setTaskDialogOpen(false);
};

// Add Task Dialog Component


  const getFilteredTasks = () => {
    if (!searchQuery) return tasks;
    
    const filteredTasks = {};
    
    Object.keys(tasks).forEach(status => {
      filteredTasks[status] = tasks[status].filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    
    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();
  
  // Calculate days remaining in sprint
  const calculateDaysRemaining = () => {
    if (currentSprint.status === 'completed') return 0;
    
    const endDate = new Date(currentSprint.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCompleteSprint = () => {
    const updatedSprints = sprints.map(sprint => {
      if (sprint.id === currentSprint.id) {
        return {
          ...sprint,
          status: 'completed'
        };
      }
      return sprint;
    });
    
    setSprints(updatedSprints);
    setCurrentSprint({ ...currentSprint, status: 'completed' });
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontWeight: 500 }}>
              Board
            </Typography>
            <Button 
              sx={{ ml: 2 }} 
              variant="outlined" 
              onClick={handleOpenSprintDialog}
              startIcon={<HistoryIcon />}
            >
              {currentSprint.name}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {currentSprint.status !== 'completed' && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {calculateDaysRemaining()} days remaining
                </Typography>
              </Box>
            )}
            {currentSprint.status === 'active' ? (
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mr: 1 }}
                onClick={handleCompleteSprint}
              >
                Complete sprint
              </Button>
            ) : (
              <Chip 
                label="Completed" 
                color="success" 
                variant="outlined" 
                sx={{ mr: 1 }}
              />
            )}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setTaskDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Create task
            </Button>
          </Box>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
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
              id="todo"
              count={filteredTasks.todo.length} 
              tasks={filteredTasks.todo}
              onTaskClick={handleTaskClick}
            />
            <StatusColumn 
              title="IN PROGRESS" 
              id="inProgress"
              count={filteredTasks.inProgress.length} 
              tasks={filteredTasks.inProgress}
              onTaskClick={handleTaskClick}
            />
            <StatusColumn 
              title="IN REVIEW" 
              id="inReview"
              count={filteredTasks.inReview.length} 
              tasks={filteredTasks.inReview}
              onTaskClick={handleTaskClick}
            />
            <StatusColumn 
              title="DONE" 
              id="done"
              count={filteredTasks.done.length} 
              tasks={filteredTasks.done}
              onTaskClick={handleTaskClick}
            />
            <TaskListSidebar 
        tasks={filteredTasks} 
        onTaskClick={handleTaskClick}
        currentSprint={currentSprint}
      />
          </Box>
        </DragDropContext>
        
      </Box>

      {/* Sprint Selection Dialog */}
      <Dialog open={sprintDialogOpen} onClose={handleCloseSprintDialog}>
        <DialogTitle>Select Sprint</DialogTitle>
        <DialogContent>
          <List sx={{ minWidth: 250 }}>
            {sprints.map((sprint) => (
              <ListItem 
                button 
                key={sprint.id} 
                onClick={() => handleChangeSprint(sprint)}
                selected={sprint.id === currentSprint.id}
              >
                <ListItemText 
                  primary={sprint.name} 
                  secondary={`${sprint.startDate} to ${sprint.endDate}`} 
                />
                {sprint.status === 'completed' && (
                  <Chip 
                    label="Completed" 
                    color="success" 
                    size="small" 
                    variant="outlined" 
                  />
                )}
                {sprint.status === 'active' && (
                  <Chip 
                    label="Active" 
                    color="primary" 
                    size="small" 
                    variant="outlined" 
                  />
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSprintDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <Dialog open={taskDetailOpen} onClose={handleCloseTaskDetail} maxWidth="md" minWidth="500px">
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedTask.id} - {selectedTask.title}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Details</Typography>
              <Box sx={{ display: 'flex', mt: 1 }}>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Typography variant="body1" sx={{ mb: 1, textTransform: 'capitalize' }}>{selectedTask.type}</Typography>
                  
                  <Typography variant="body2" color="text.secondary">Priority</Typography>
                  <Typography variant="body1" sx={{ mb: 1, textTransform: 'capitalize' }}>{selectedTask.priority}</Typography>
                </Box>
                <Box sx={{ width: '50%' }}>
                  <Typography variant="body2" color="text.secondary">Story Points</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedTask.storyPoints}</Typography>
                  
                  <Typography variant="body2" color="text.secondary">Assignee</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      alt={selectedTask.assignee.name} 
                      src={selectedTask.assignee.avatar} 
                      sx={{ width: 24, height: 24, mr: 1 }} 
                    />
                    <Typography variant="body1">{selectedTask.assignee.name}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Description</Typography>
              <Typography variant="body1">
                {selectedTask.description || "No description provided for this task."}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTaskDetail}>Close</Button>
            <Button variant="contained" color="primary">Edit</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Add Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onAdd={handleAddTask}
        users={users}
      />
      {/* <AIAssistant/> */}
      </>
  );
}

export default App;