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
import { mockSprints } from '../mockData/data';
import TaskDialog from '../components/TaskDialog';
import AIAssistant from '../components/AIAssistant';
import TaskListSidebar from '../components/TaskListSidebar';
import { useParams } from 'react-router-dom';
import { getUserByPRojectID, updateTask, getSprintByProjectID, getSprintDetails, addTask, deleteTask } from '../utils/api';
//------------------------------------------------------

export default function Karban() {
  const { id } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sprints, setSprints] = useState(mockSprints);
  const [currentSprint, setCurrentSprint] = useState(sprints[0]);
  const [currentSprintId, setCurrentSprintId] = useState(currentSprint?.sprint?.id);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [inReview, setInReview] = useState([]);
  const [done, setDone] = useState([]);
  const onAddTask= (task) => {
    setTodo((prev) => [...prev, task]);
    fetchSprint();
  }

  const fetchUser = async () => {
      try {
        const response = await getUserByPRojectID(id);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  const fetchSprint = async () => {
    try {
      const response = await getSprintDetails(currentSprintId);
      setCurrentSprint(response.data);
      setTodo(response.data.tasks.filter(task => task.status === 'To Do'));
      setInProgress(response.data.tasks.filter(task => task.status === 'In Progress'));
      setInReview(response.data.tasks.filter(task => task.status === 'In Review'));  
      setDone(response.data.tasks.filter(task => task.status === 'Done'));
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  }
  const fetchListSprint = async () => {
    try {
      const response = await getSprintByProjectID(id);
      setSprints(response.data);
      setCurrentSprintId(response.data[response.data.length - 1]);
    } catch (error) {
      console.error('Error fetching sprints:', error);
    }
  }
  useEffect(() => {
    fetchUser();
    fetchListSprint();
    fetchSprint();
  }, [id]);

  useEffect(() => {
    // Update tasks when current sprint changes
    fetchSprint();
  }, [currentSprintId]);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenSprintDialog = () => {
    setSprintDialogOpen(true);
  };

  const handleCloseSprintDialog = () => {
    setSprintDialogOpen(false);
  };

  const handleChangeSprint = (sprint) => {
    setCurrentSprintId(sprint);
    handleCloseSprintDialog();
  };

  const handleTaskClick = (task) => {
    task.assignee = users.find(user => user._id === task.userId);
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleCloseTaskDetail = () => {
    setTaskDetailOpen(false);
  };

  const onDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;

  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }

  // Get source and destination lists
  const getList = (id) => {
    switch (id) {
      case 'todo':
        return [...todo];
      case 'inProgress':
        return [...inProgress];
      case 'inReview':
        return [...inReview];
      case 'done':
        return [...done];
      default:
        return [];
    }
  };

  const setList = (id, list) => {
    switch (id) {
      case 'todo':
        setTodo(list);
        break;
      case 'inProgress':
        setInProgress(list);
        break;
      case 'inReview':
        setInReview(list);
        break;
      case 'done':
        setDone(list);
        break;
      default:
        break;
    }
  };
  const getStatus = (id) => {
    switch (id) {
      case 'todo':
        return 'To Do';
      case 'inProgress':
        return 'In Progress';
      case 'inReview':
        return 'In Review';
      case 'done':
        return 'Done';
      default:
        return '';
    }
  };

  const sourceList = getList(source.droppableId);
  const destList = getList(destination.droppableId);
  const taskToMove = sourceList[source.index];
  await updateTask(taskToMove.id, {
    ...taskToMove,
    status: getStatus(destination.droppableId),
  });
  // Remove from source
  sourceList.splice(source.index, 1);

  // Handle 'completed' property
  let updatedTask = { ...taskToMove };
  if (source.droppableId !== 'done' && destination.droppableId === 'done') {
    updatedTask.completed = true;
  }
  if (source.droppableId === 'done' && destination.droppableId !== 'done') {
    delete updatedTask.completed;
  }

  // Insert into destination
  destList.splice(destination.index, 0, updatedTask);

  // Update lists
  setList(source.droppableId, sourceList);
  setList(destination.droppableId, destList);
};

const handleEditTask = async (task) => {
  const updatedTask = {
    ...task,
    id: selectedTask.id,
    title: task.title,
    description: task.description,
    type: task.type,
    priority: task.priority,
    story_points: task.story_points,
    userId: task.userId,
    status: task.status,
  };
  const response = await updateTask(selectedTask.id, updatedTask);
  switch (selectedTask.status) {
    case 'To Do':
      setTodo((prev) => prev.map(t => (t.id === selectedTask.id ? updatedTask : t)));
      break;
    case 'In Progress':
      setInProgress((prev) => prev.map(t => (t.id === selectedTask.id ? updatedTask : t)));
      break;
    case 'In Review':
      setInReview((prev) => prev.map(t => (t.id === selectedTask.id ? updatedTask : t)));
      break;
    case 'Done':
      setDone((prev) => prev.map(t => (t.id === selectedTask.id ? updatedTask : t)));
      break;
    default:
      break;
  }
  setSelectedTask(null);
  setTaskDialogOpen(false);
  setTaskDetailOpen(false);
  }

const handleAddTask = async (newTask) => {
  // Generate a unique ID with format TASK-XXX
  const generateTaskId = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000).toString().substring(0, 9);
    return {randomId};
  };
  
  // Create the task object with default values plus user input
  const taskToAdd = {
    id: generateTaskId(),
    type: newTask.type || 'Task',
    title: newTask.title,
    description: newTask.description || '',
    priority: newTask.priority || 'Medium',
    story_points: newTask.storyPoints || 1,
    userId: newTask.assignee || users[0],
  };
  setTodo((prev) => [...prev, taskToAdd]);
  
  setTaskDialogOpen(false);
  await addTask(currentSprint?.sprint?.id, taskToAdd);
  fetchSprint();
};

  
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
  const handleDeleteTask = async () => {
    await deleteTask(selectedTask.id);
    switch (selectedTask.status) {
      case 'To Do':
        setTodo((prev) => prev.filter(task => task.id !== selectedTask.id));
        break;
      case 'In Progress':
        setInProgress((prev) => prev.filter(task => task.id !== selectedTask.id));
        break;
      case 'In Review':
        setInReview((prev) => prev.filter(task => task.id !== selectedTask.id));
        break;
      case 'Done':
        setDone((prev) => prev.filter(task => task.id !== selectedTask.id));
        break;
      default:
        break;
    }
    setSelectedTask(null);
  }
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
               {currentSprint?.sprint?.name}
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
              onClick={() => {setSelectedTask(null); setTaskDialogOpen(true)}}
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
              users={users}
              count={todo?.length} 
              tasks={todo}
              onTaskClick={handleTaskClick}
            />
            <StatusColumn 
              title="IN PROGRESS" 
              id="inProgress"
              users={users}
              count={inProgress?.length} 
              tasks={inProgress}
              onTaskClick={handleTaskClick}
            />
            <StatusColumn 
              title="IN REVIEW" 
              id="inReview"
              users={users}
              count={inReview?.length} 
              tasks={inReview}
              onTaskClick={handleTaskClick}
            />
            <StatusColumn 
              title="DONE" 
              id="done"
              users={users}
              count={done?.length} 
              tasks={done}
              onTaskClick={handleTaskClick}
            />
            <TaskListSidebar 
        id={id}
        sprintId={currentSprint?.sprint?.id}
        onAddTask={onAddTask}
      />
          </Box>
        </DragDropContext>
        
      </Box>

      {/* Sprint Selection Dialog */}
      <Dialog open={sprintDialogOpen} onClose={handleCloseSprintDialog}>
        <DialogTitle>Select Sprint</DialogTitle>
        <DialogContent>
          <List sx={{ minWidth: 350 }}>
            {sprints.map((sprint) => (
              <ListItem 
                button 
                key={sprint} 
                onClick={() => handleChangeSprint(sprint)}
                selected={sprint === currentSprint?.sprint?.id}
              >
                {sprint}
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
              {selectedTask.id && selectedTask.id.length >= 9 ? selectedTask.id.slice(-9, -2) : selectedTask.id} - {selectedTask.title}
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
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedTask.story_points}</Typography>
                  
                  <Typography variant="body2" color="text.secondary">Assignee</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      alt={selectedTask?.assignee?.name} 
                      src={selectedTask?.assignee?.avatar} 
                      sx={{ width: 24, height: 24, mr: 1 }} 
                    />
                    <Typography variant="body1">{selectedTask?.assignee?.name}</Typography>
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
            <Button variant="contained" onClick={handleDeleteTask} color="error">Delete</Button>
            <Button variant="contained" color="primary" onClick={() => setTaskDialogOpen(true)}>Edit</Button>
          </DialogActions>
        </Dialog>
      )}
      {/* Add Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        onAdd={handleAddTask}
        users={users}
        task={selectedTask}
        onEdit={handleEditTask}
      />
      {/* <AIAssistant/> */}
      </>
  );
}