import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Divider,
  Stack,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FlagIcon from '@mui/icons-material/Flag';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';

const TaskDialog = ({ open, onClose, onSubmit, users, initialTask, isEditMode }) => {
  const [taskData, setTaskData] = useState({
    id: '',
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    storyPoints: 1,
    assignee: null,
  });

  useEffect(() => {
    if (isEditMode && initialTask) {
      setTaskData({
        id: initialTask.id || '',
        title: initialTask.title || '',
        description: initialTask.description || '',
        type: initialTask.type || 'task',
        priority: initialTask.priority || 'medium',
        storyPoints: initialTask.storyPoints || 1,
        assignee: initialTask.assignee || { _id: null, name: 'Unassigned' },
      });
    } else {
      setTaskData({
        id: '',
        title: '',
        description: '',
        type: 'task',
        priority: 'medium',
        storyPoints: 1,
        assignee: users.length > 0 ? users[0] : { _id: null, name: 'Unassigned' },
      });
    }
    console.log('Pre-filled taskData:', taskData);
  }, [initialTask, isEditMode, users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find((user) => user._id === selectedUserId) || { _id: null, name: 'Unassigned' };
    setTaskData((prev) => ({
      ...prev,
      assignee: selectedUser,
    }));
    console.log('Selected user:', selectedUser);
  };

  const handleSubmit = () => {
    if (!taskData.title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (isEditMode && initialTask) {
      onSubmit(initialTask.id, taskData);
    } else {
      onSubmit(taskData);
    }
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug':
        return <BugReportIcon color="error" />;
      case 'story':
        return <AutoStoriesIcon color="primary" />;
      default:
        return <AssignmentIcon color="action" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditMode && initialTask ? getTypeIcon(initialTask.type) : <AssignmentIcon />}
          <Typography variant="h6">{isEditMode ? 'Edit Task' : 'Add New Task'}</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            fullWidth
            required
            variant="outlined"
            placeholder="Enter task title"
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
          />

          <TextField
            label="Description"
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Describe the task in detail"
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
          />

          <Divider>
            <Chip label="Task Properties" variant="outlined" />
          </Divider>

          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={taskData.type}
                    onChange={handleInputChange}
                    label="Type"
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="task">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon color="action" />
                        <Typography>Task</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="bug">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BugReportIcon color="error" />
                        <Typography>Bug</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="story">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoStoriesIcon color="primary" />
                        <Typography>Story</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    name="priority"
                    value={taskData.priority}
                    onChange={handleInputChange}
                    label="Priority"
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="high">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlagIcon color="error" />
                        <Typography>High</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="medium">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlagIcon color="warning" />
                        <Typography>Medium</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="low">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlagIcon color="success" />
                        <Typography>Low</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="story-points-label">Story Points</InputLabel>
                  <Select
                    labelId="story-points-label"
                    name="storyPoints"
                    value={taskData.storyPoints}
                    onChange={handleInputChange}
                    label="Story Points"
                    sx={{ borderRadius: 1.5 }}
                  >
                    {[1, 2, 3, 5, 8, 13].map((point) => (
                      <MenuItem key={point} value={point}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpeedIcon />
                          <Typography>
                            {point} {point === 1 ? 'point' : 'points'}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="assignee-label">Assignee</InputLabel>
                  <Select
                    labelId="assignee-label"
                    value={taskData.assignee?._id || ''}
                    label="Assignee"
                    onChange={handleUserChange}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PersonIcon />
                        <Typography>Unassigned</Typography>
                      </Box>
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            src={user.avatar}
                            sx={{
                              width: 32,
                              height: 32,
                              border: '2px solid',
                              borderColor: 'primary.light',
                            }}
                          />
                          <Typography>{user.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!taskData.title.trim()}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: 2,
          }}
        >
          {isEditMode ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;