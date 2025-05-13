import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Box, Avatar, Typography, Chip, IconButton, Divider, Stack, Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';

const TaskDialog = ({ open, onClose, onAdd, onEdit, users, task }) => {
  
  // Default task data
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    story_points: 1,
    userId: parseInt(users[0]?.id, 10),
    status: 'To Do',
  });

  // If editing, pre-fill task data
  useEffect(() => {
    if (task) {
      setTaskData({
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        story_points: task.story_points,
        userId: parseInt(users.find(user => user.id === +task?.userId)?.id, 10) || parseInt(users[0]?.id, 10),
        status: task.status,
      });
    } else {
      // Reset form when adding new task
      setTaskData({
        title: '',
        description: '',
        type: 'task',
        priority: 'medium',
        story_points: 1,
        userId: parseInt(users[0]?.id, 10),
        status: 'To Do',
      });
    }
  }, [task, users, open]);

    console.log('TaskDialog', taskData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserChange = (e) => {
    const selectedUser = users.find(user => user.id === e.target.value);
    setTaskData(prev => ({
      ...prev,
      userId: selectedUser.id,
    }));
  };

  const handleSubmit = () => {
    if (task) {
      onEdit(taskData);  // If editing, use onEdit
    } else {
      onAdd(taskData);   // If adding, use onAdd
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
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.light',
        color: 'primary.contrastText',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon />
          <Typography variant="h6">{task ? 'Edit Task' : 'Add New Task'}</Typography>
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={3}>
          {/* Title field */}
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
              sx: { borderRadius: 1.5 }
            }}
          />

          {/* Description field */}
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
              sx: { borderRadius: 1.5 }
            }}
          />
          
          <Divider>
            <Chip label="Task Properties" variant="outlined" />
          </Divider>

          {/* Type field */}
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
              <MenuItem value="Task">Task</MenuItem>
              <MenuItem value="Bug">Bug</MenuItem>
              <MenuItem value="Feature">Feature</MenuItem>
              <MenuItem value="Unknown">Unknown</MenuItem>
            </Select>
          </FormControl>

          {/* Priority field */}
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
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          {/* Story Points field */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="story-points-label">Story Points</InputLabel>
            <Select
              labelId="story-points-label"
              name="story_points"
              value={taskData.story_points}
              onChange={handleInputChange}
              label="Story Points"
              sx={{ borderRadius: 1.5 }}
            >
              {[1, 2, 3, 5, 8, 13].map(point => (
                <MenuItem key={point} value={point}>
                  {point} {point === 1 ? 'point' : 'points'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assignee field */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="assignee-label">Assignee</InputLabel>
            <Select
              labelId="assignee-label"
              value={taskData.userId}
              label="Assignee"
              onChange={handleUserChange}
              sx={{ borderRadius: 1.5 }}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar 
                      src={user.avatar} 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        border: '2px solid',
                        borderColor: 'primary.light'
                      }} 
                    />
                    <Typography>{user.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            boxShadow: 2
          }}
        >
          {task ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;