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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import StatusColumn from '../components/StatusColumn';
import TaskDialog from '../components/TaskDialog';
import TaskListSidebar from '../components/TaskListSidebar';
import { useParams } from 'react-router-dom';
import { getUserByProjectID, createTask, updateTask, deleteTask, getSprintIdsByProjectId, getSprintWithTasks, completeSprint } from '../utils/api';

// Hàm chuyển đổi TaskDTO từ backend sang định dạng frontend
const mapTaskDTOToTask = (taskDTO, users) => {
  const id = taskDTO.id || taskDTO._id;
  if (!id) {
    console.error('TaskDTO missing id:', taskDTO);
    return null;
  }
  return {
    id: id.toString(),
    title: taskDTO.title || taskDTO.name || 'Untitled Task',
    description: taskDTO.description || '',
    priority: taskDTO.priority || 'medium',
    storyPoints: taskDTO.story_points || taskDTO.storyPoints || 1,
    type: taskDTO.type || 'task',
    status: taskDTO.status || 'To Do',
    completed: taskDTO.completed || false,
    assignedAt: taskDTO.assignedAt ? new Date(taskDTO.assignedAt) : null,
    deadline: taskDTO.deadline ? new Date(taskDTO.deadline) : null,
    assignee: taskDTO.userId || taskDTO.assignedUserId
      ? users.find(user => user._id === taskDTO.userId || user._id === taskDTO.assignedUserId) || { name: 'Unassigned', _id: null }
      : { name: 'Unassigned', _id: null },
  };
};

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], inReview: [], done: [] });
  const [users, setUsers] = useState([]);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id: projectId } = useParams();

  useEffect(() => {
    console.log('Project ID:', projectId);
  }, [projectId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByProjectID(projectId);
        setUsers(response || []);
        console.log('Fetched users:', response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    if (projectId) fetchUser();
  }, [projectId]);

  const fetchSprintsAndTasks = async () => {
    try {
      const sprintIds = await getSprintIdsByProjectId(projectId);
      const sprintDetails = await Promise.all(sprintIds.map(async (sprintId) => {
        const sprintData = await getSprintWithTasks(sprintId);
        const tasksByStatus = { todo: [], inProgress: [], inReview: [], done: [] };
        if (sprintData.tasks) {
          sprintData.tasks.forEach(task => {
            const mappedTask = mapTaskDTOToTask(task, users);
            if (mappedTask) {
              switch (mappedTask.status) {
                case 'To Do':
                  tasksByStatus.todo.push(mappedTask);
                  break;
                case 'In Progress':
                  tasksByStatus.inProgress.push(mappedTask);
                  break;
                case 'In Review':
                  tasksByStatus.inReview.push(mappedTask);
                  break;
                case 'Done':
                  tasksByStatus.done.push(mappedTask);
                  break;
                default:
                  tasksByStatus.todo.push(mappedTask);
              }
            }
          });
        }
        return { ...sprintData.sprint, tasks: tasksByStatus, id: sprintData.sprint.id };
      }));

      setSprints(sprintDetails);
      setCurrentSprint(sprintDetails[0] || null);
      setTasks(sprintDetails[0]?.tasks || { todo: [], inProgress: [], inReview: [], done: [] });
    } catch (error) {
      console.error('Error fetching sprints and tasks:', error);
    }
  };

  useEffect(() => {
    if (users.length > 0 && projectId) fetchSprintsAndTasks();
  }, [users, projectId]);

  useEffect(() => {
    if (currentSprint) setTasks(currentSprint.tasks || { todo: [], inProgress: [], inReview: [], done: [] });
  }, [currentSprint]);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleOpenSprintDialog = () => setSprintDialogOpen(true);
  const handleCloseSprintDialog = () => setSprintDialogOpen(false);
  const handleChangeSprint = (sprint) => {
    setCurrentSprint(sprint);
    setTasks(sprint.tasks);
    handleCloseSprintDialog();
  };
  const handleTaskClick = (task) => {
    console.log('Selected task:', task);
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };
  const handleCloseTaskDetail = () => {
    setTaskDetailOpen(false);
    setSelectedTask(null);
  };

  const handleOpenEditTaskDialog = () => {
    setIsEditMode(true);
    setTaskDialogOpen(true);
    setTaskDetailOpen(false);
  };

  const handleOpenAddTaskDialog = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setTaskDialogOpen(true);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const taskToMove = tasks[sourceColumn][source.index];

    if (!taskToMove.id) {
      console.error('Task missing id during drag:', taskToMove);
      return;
    }

    const newTasks = { ...tasks };
    newTasks[sourceColumn] = [...newTasks[sourceColumn].filter((_, index) => index !== source.index)];

    const statusMap = {
      todo: 'To Do',
      inProgress: 'In Progress',
      inReview: 'In Review',
      done: 'Done',
    };
    const newStatus = statusMap[destColumn];
    const updatedTask = { ...taskToMove, status: newStatus, completed: destColumn === 'done' };

    newTasks[destColumn] = [
      ...newTasks[destColumn].slice(0, destination.index),
      updatedTask,
      ...newTasks[destColumn].slice(destination.index),
    ];

    setTasks(newTasks);
    const updatedSprints = sprints.map(sprint =>
      sprint.id === currentSprint.id ? { ...sprint, tasks: newTasks } : sprint
    );
    setSprints(updatedSprints);
    setCurrentSprint({ ...currentSprint, tasks: newTasks });

    try {
      const taskPayload = {
        status: newStatus,
        completed: destColumn === 'done',
        userId: taskToMove.assignee?._id || null,
        title: taskToMove.title,
        description: taskToMove.description,
        priority: taskToMove.priority,
        storyPoints: taskToMove.storyPoints,
        type: taskToMove.type,
        assignedAt: taskToMove.assignedAt ? taskToMove.assignedAt.toISOString().split('.')[0] : undefined,
        deadline: taskToMove.deadline ? taskToMove.deadline.toISOString().split('.')[0] : undefined,
      };
      const response = await updateTask(taskToMove.id, taskPayload);
      const updatedTaskFromResponse = mapTaskDTOToTask(response, users);

      if (updatedTaskFromResponse) {
        const finalTasks = { ...newTasks };
        finalTasks[destColumn] = finalTasks[destColumn].map(task =>
          task.id === taskToMove.id ? updatedTaskFromResponse : task
        );
        setTasks(finalTasks);
        const finalSprints = sprints.map(sprint =>
          sprint.id === currentSprint.id ? { ...sprint, tasks: finalTasks } : sprint
        );
        setSprints(finalSprints);
        setCurrentSprint({ ...currentSprint, tasks: finalTasks });
      } else {
        throw new Error('Invalid task data from API');
      }
    } catch (error) {
      console.error('Error updating task on drag:', error);
      fetchSprintsAndTasks();
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const taskDTO = {
        title: newTask.title,
        description: newTask.description || '',
        priority: newTask.priority || 'medium',
        storyPoints: parseInt(newTask.storyPoints) || 1,
        type: newTask.type || 'task',
        userId: newTask.assignee?._id || null,
        assignedAt: newTask.assignedAt ? newTask.assignedAt.toISOString().split('.')[0] : undefined,
        deadline: newTask.deadline ? newTask.deadline.toISOString().split('.')[0] : undefined,
      };
      const response = await createTask(currentSprint.id, taskDTO);
      const addedTask = mapTaskDTOToTask(response, users);

      if (addedTask) {
        const newTasks = {
          ...tasks,
          todo: [...tasks.todo, addedTask],
        };
        setTasks(newTasks);
        const updatedSprints = sprints.map(sprint =>
          sprint.id === currentSprint.id ? { ...sprint, tasks: newTasks } : sprint
        );
        setSprints(updatedSprints);
        setCurrentSprint({ ...currentSprint, tasks: newTasks });
      } else {
        throw new Error('Invalid task data from API');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      fetchSprintsAndTasks();
    }
    setTaskDialogOpen(false);
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const taskPayload = {
        userId: updatedTask.assignee?._id || null,
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        storyPoints: updatedTask.storyPoints,
        type: updatedTask.type,
        status: updatedTask.status || tasks[Object.keys(tasks).find(key => tasks[key].some(t => t.id === taskId))]?.find(t => t.id === taskId)?.status || 'To Do',
        assignedAt: updatedTask.assignedAt ? updatedTask.assignedAt.toISOString().split('.')[0] : undefined,
        deadline: updatedTask.deadline ? updatedTask.deadline.toISOString().split('.')[0] : undefined,
      };

      console.log('Sending taskPayload to API:', taskPayload);

      const currentColumn = Object.keys(tasks).find(key => tasks[key].some(task => task.id === taskId));
      const newTasks = { ...tasks };
      if (currentColumn) {
        newTasks[currentColumn] = newTasks[currentColumn].map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        );
      }

      setTasks(newTasks);
      const updatedSprints = sprints.map(sprint =>
        sprint.id === currentSprint.id ? { ...sprint, tasks: newTasks } : sprint
      );
      setSprints(updatedSprints);
      setCurrentSprint({ ...currentSprint, tasks: newTasks });

      const response = await updateTask(taskId, taskPayload);
      const updatedTaskFromResponse = mapTaskDTOToTask(response, users);

      if (updatedTaskFromResponse) {
        console.log('Received updated task from API:', updatedTaskFromResponse);
        const finalTasks = { ...newTasks };
        const finalColumn = Object.keys(finalTasks).find(key => finalTasks[key].some(task => task.id === taskId));
        if (finalColumn) {
          finalTasks[finalColumn] = finalTasks[finalColumn].map(task =>
            task.id === taskId ? updatedTaskFromResponse : task
          );
        }

        setTasks(finalTasks);
        const finalSprints = sprints.map(sprint =>
          sprint.id === currentSprint.id ? { ...sprint, tasks: finalTasks } : sprint
        );
        setSprints(finalSprints);
        setCurrentSprint({ ...currentSprint, tasks: finalTasks });
      } else {
        throw new Error('Invalid task data from API');
      }

      setTaskDialogOpen(false);
      setTaskDetailOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      fetchSprintsAndTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId) {
      console.error('Cannot delete task: taskId is undefined');
      alert('Không thể xóa task vì ID không hợp lệ.');
      return;
    }

    try {
      const response = await deleteTask(taskId);
      if (response.success) {
        const newTasks = { ...tasks };
        Object.keys(newTasks).forEach(status => {
          newTasks[status] = newTasks[status].filter(task => task.id !== taskId);
        });
        setTasks(newTasks);
        const updatedSprints = sprints.map(sprint =>
          sprint.id === currentSprint.id ? { ...sprint, tasks: newTasks } : sprint
        );
        setSprints(updatedSprints);
        setCurrentSprint({ ...currentSprint, tasks: newTasks });
        setTaskDetailOpen(false);
        setSelectedTask(null);
      } else {
        console.error('Failed to delete task:', response.message);
        alert('Xóa task thất bại: ' + response.message);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Đã xảy ra lỗi khi xóa task. Vui lòng thử lại.');
    }
  };

  const getFilteredTasks = () => {
    if (!searchQuery) return tasks;
    const filteredTasks = {};
    Object.keys(tasks).forEach(status => {
      filteredTasks[status] = tasks[status].filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  const calculateDaysRemaining = () => {
    if (currentSprint?.status === 'completed') return 0;
    const endDate = new Date(currentSprint?.endDate);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCompleteSprint = async () => {
    try {
      await completeSprint(currentSprint.id);
      const updatedSprints = sprints.map(sprint =>
        sprint.id === currentSprint.id ? { ...sprint, status: 'completed' } : sprint
      );
      setSprints(updatedSprints);
      setCurrentSprint({ ...currentSprint, status: 'completed' });
    } catch (error) {
      console.error('Error completing sprint:', error);
    }
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
              {currentSprint?.name || 'Select Sprint'}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            {currentSprint?.status !== 'completed' && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ color: 'text.secondary', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {calculateDaysRemaining()} days remaining
                </Typography>
              </Box>
            )}
            {currentSprint?.status === 'active' ? (
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
                <Tooltip key={user._id} title={user.name}>
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
              onClick={handleOpenAddTaskDialog}
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
              onAddTask={handleAddTask}
              teamMembers={users}
              projectId={projectId}
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
                selected={sprint.id === currentSprint?.id}
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
        <Dialog
          open={taskDetailOpen}
          onClose={handleCloseTaskDetail}
          maxWidth="md"
          minWidth="500px"
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ p: 2, borderBottom: '1px solid #E0E0E0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedTask.title}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 2, pt: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, color: '#374151' }}>
              Details
            </Typography>

            {/* Details Section */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                mb: 2,
              }}
            >
              {/* Type */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  {selectedTask.type === 'bug' ? (
                    <BugReportIcon fontSize="small" sx={{ color: '#DE350B', mr: 0.5 }} />
                  ) : (
                    <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#2684FF', mr: 0.5 }} />
                  )}
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    {selectedTask.type.charAt(0).toUpperCase() + selectedTask.type.slice(1)}
                  </Typography>
                </Box>
              </Box>

              {/* Story Points */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Story Points
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: '#374151' }}>
                  {selectedTask.storyPoints}
                </Typography>
              </Box>

              {/* Priority */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Priority
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  {selectedTask.priority === 'high' ? (
                    <ArrowUpwardIcon fontSize="small" sx={{ color: '#DE350B', mr: 0.5 }} />
                  ) : selectedTask.priority === 'low' ? (
                    <ArrowDownwardIcon fontSize="small" sx={{ color: '#2684FF', mr: 0.5 }} />
                  ) : (
                    <RemoveIcon fontSize="small" sx={{ color: '#FF9800', mr: 0.5 }} />
                  )}
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </Typography>
                </Box>
              </Box>

              {/* Assignee */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Assignee
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Avatar
                    alt={selectedTask.assignee.name}
                    src={selectedTask.assignee.avatar}
                    sx={{ width: 24, height: 24, mr: 0.5 }}
                  />
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    {selectedTask.assignee.name}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Description */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: '#374151' }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {selectedTask.description || 'No description provided for this task.'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Button onClick={handleCloseTaskDetail} variant="outlined" sx={{ borderRadius: 1 }}>
              Close
            </Button>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleOpenEditTaskDialog}
                sx={{ mr: 1, borderRadius: 1 }}
                disabled={!selectedTask.id}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteTask(selectedTask.id)}
                sx={{ borderRadius: 1 }}
                disabled={!selectedTask.id}
              >
                Delete
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
      {/* TaskDialog */}
      <TaskDialog
        open={taskDialogOpen}
        onClose={() => {
          setTaskDialogOpen(false);
          if (!isEditMode) setSelectedTask(null);
        }}
        onSubmit={isEditMode ? handleUpdateTask : handleAddTask}
        users={users}
        initialTask={isEditMode ? selectedTask : null}
        isEditMode={isEditMode}
      />
    </>
  );
}

export default App;