import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Tooltip,
  Fade,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SendIcon from '@mui/icons-material/Send';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MicIcon from '@mui/icons-material/Mic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonIcon from '@mui/icons-material/Person';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { processMeetingNotes, assignUserToTask, addTask } from '../utils/api';

const generateRandomId = (length = 20) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const AISidebar = ({ onAddTask, teamMembers, projectName, id, sprintId }) => {

  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  
  // New states for the enhanced features
  const [selectedUsers, setSelectedUsers] = useState({});
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [editedTask, setEditedTask] = useState(null);


  const quickSuggestions = [
    "Distribute tasks for this week",
    "Optimize the schedule",
    "Suggest task priorities"
  ];

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    const response = await processMeetingNotes(prompt);
    const user = await assignUserToTask(+id, response);
    console.log(user);
    
    // Initialize selected users object
    const initialSelectedUsers = {};
    user.forEach(task => {
      initialSelectedUsers[task.title] = task.assignableUsers.length > 0 ? null : task.assignableUsers[0]?._id;
    });
    setSelectedUsers(initialSelectedUsers);
    
    setSuggestions(user);
    // Lưu prompt vào lịch sử
    setPromptHistory([{ text: prompt, timestamp: new Date() }, ...promptHistory]);
    
    setIsLoading(false);

    setPrompt('');
  };

  const assignTasks = async (tasks) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8082/api/assign-users-to-tasks?projectId=${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks),
      });
      if (!response.ok) throw new Error('Failed to assign tasks');
      const assignedTasks = await response.json();
      setSuggestions(assignedTasks.map(task => ({
        ...task,
        assignee: task.assignableUsers?.length > 0 && !task.assignee 
          ? task.assignableUsers.reduce((prev, curr) => 
              (prev.match_percentage || 0) > (curr.match_percentage || 0) ? prev : curr, task.assignableUsers[0])
          : task.assignee,
        assignableUsers: task.assignableUsers || []
      })));
    } catch (error) {
      console.error('Error assigning tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const assignSingleTask = async (task, assignee = null) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8082/api/assign-users-to-tasks?projectId=${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ ...task, assignee: assignee || task.assignee || task.assignableUsers?.[0] }]),
      });
      if (!response.ok) throw new Error('Failed to assign task');
      const assignedTasks = await response.json();
      console.log('Assigned single task from API:', assignedTasks);

      const updatedTask = assignedTasks[0] || task;
      const newAssignee = assignee || updatedTask.assignee || (updatedTask.assignableUsers?.length > 0 && !updatedTask.assignee 
        ? updatedTask.assignableUsers.reduce((prev, curr) => 
            (prev.match_percentage || 0) > (curr.match_percentage || 0) ? prev : curr, updatedTask.assignableUsers[0])
        : null);
      
      setSuggestions(prevSuggestions => prevSuggestions.map(t =>
        t.id === task.id ? { ...t, ...updatedTask, assignee: newAssignee } : t
      ));
      return { ...updatedTask, assignee: newAssignee };
    } catch (error) {
      console.error('Error assigning single task:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTask = async (task) => {
    const taskToAssign = { ...task };
    const defaultAssignee = !taskToAssign.assignee && taskToAssign.assignableUsers?.length > 0 
      ? taskToAssign.assignableUsers.reduce((prev, curr) => 
          (prev.match_percentage || 0) > (curr.match_percentage || 0) ? prev : curr, taskToAssign.assignableUsers[0])
      : taskToAssign.assignee;
    taskToAssign.assignee = defaultAssignee;
    
    setSelectedTask(taskToAssign);
    setAssignDialogOpen(true);

    const result = await assignSingleTask(taskToAssign);
    if (result) {
      const updatedAssignee = !result.assignee && result.assignableUsers?.length > 0 
        ? result.assignableUsers.reduce((prev, curr) => 
            (prev.match_percentage || 0) > (curr.match_percentage || 0) ? prev : curr, result.assignableUsers[0])
        : result.assignee;
      setSelectedTask(prev => ({ ...prev, ...result, assignee: updatedAssignee }));
    }
  };

  const handleSelectAssignee = async (user) => {
    if (!selectedTask) return;
    
    const updatedTask = { ...selectedTask, assignee: user };
    setSelectedTask(updatedTask);
    
    const result = await assignSingleTask(updatedTask, user);
    if (result) {
      setSelectedTask(result);
    }
    setAssignDialogOpen(false);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedTask(null);
  };

  const handleAssignAll = () => {
    assignTasks(suggestions);
  };

  const handleEditTask = (task) => {
    const defaultAssignee = !task.assignee && task.assignableUsers?.length > 0 
      ? task.assignableUsers.reduce((prev, curr) => 
          (prev.match_percentage || 0) > (curr.match_percentage || 0) ? prev : curr, task.assignableUsers[0])
      : task.assignee;
    setEditTask({
      ...task,
      assignee: defaultAssignee
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editTask) {
      setSuggestions(prevSuggestions => prevSuggestions.map(task =>
        task.id === editTask.id ? { ...editTask } : task
      ));

      if (editTask.assignee) {
        await assignSingleTask(editTask, editTask.assignee);
      }
    }
    setEditDialogOpen(false);
    setEditTask(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditTask(null);
  };

  const handleKeyPress = (e) => e.key === 'Enter' && handleSubmitPrompt();
  const handleQuickSuggestion = (suggestion) => {
    setPrompt(suggestion);
  };

  // Xử lý khi chọn user cho task
  const handleSelectUser = (taskTitle, userId) => {
    setSelectedUsers(prev => ({
      ...prev,
      [taskTitle]: prev[taskTitle] === userId ? null : userId
    }));
  };

  // Xử lý khi chấp nhận task
  const handleAcceptTask = async (task) => {
    const selectedUserId = selectedUsers[task.title];
    if (!selectedUserId && task.assignableUsers.length > 1) return;
    
    const taskToAdd = {
      ...task,
      id: generateRandomId(),
      userId: selectedUserId || task.assignableUsers[0]?._id,
      priority: task.priority || 'Low',
      story_points: task.story_points || 1,
      type: task.type || 'Unknown',
      status: task.status || 'To Do',
    };
    
    await addTask(sprintId, taskToAdd);
    onAddTask(taskToAdd);
    // Xóa khỏi danh sách gợi ý
    setSuggestions(suggestions.filter(s => s.title !== task.title));
  };

  const handleAcceptAllTasks = async () => {
    // Only accept tasks that have a selected user or only one assignable user
    const tasksToAccept = suggestions.filter(task => 
      selectedUsers[task.title] || task.assignableUsers.length === 1
    );
    
    for (const task of tasksToAccept) {
      const taskToAdd = {
        ...task,
        id: generateRandomId(),
        userId: selectedUsers[task.title] || task.assignableUsers[0]?._id,
        priority: task.priority || 'Low',
        story_points: task.story_points || 1,
        type: task.type || 'Unknown',
        status: task.status || 'To Do',
      };
      try {
        await addTask(sprintId, taskToAdd);
        onAddTask(taskToAdd);
      } catch (error) {
        console.error(`Failed to add task "${task.title}":`, error);
      }
    }

    // Remove accepted tasks from suggestions
    setSuggestions(suggestions.filter(task => 
      !(selectedUsers[task.title] || task.assignableUsers.length === 1)
    ));
  };

  // View task details
  const handleViewTaskDetails = (task) => {
    setCurrentTask(task);
    setDetailDialogOpen(true);
  };

  // Edit task before adding
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditedTask({
      ...task,
      priority: task.priority || 'Low',
      story_points: task.story_points || 1,
      type: task.type || 'Unknown',
      status: 'To Do',
      userId: selectedUsers[task.title] || task.assignableUsers[0]?._id,
    });
    setEditDialogOpen(true);
  };

  // Save edited task
  const handleSaveEditedTask = async () => {
    if (!editedTask) return;
    
    const taskToAdd = {
      ...editedTask,
      id: generateRandomId(),
    };
    
    await addTask(sprintId, taskToAdd);
    onAddTask(taskToAdd);
    
    // Remove from suggestions
    setSuggestions(suggestions.filter(s => s.title !== currentTask.title));
    setEditDialogOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high':
        return '#F44336';
      case 'medium':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        borderRadius: '12px', 
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      {/* Background Animation */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: isLoading ? 0.1 : 0,
          transition: 'opacity 2s ease',
          background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          animation: isLoading ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.95)',
              opacity: 0.2,
            },
            '50%': {
              transform: 'scale(1)',
              opacity: 0.3,
            },
            '100%': {
              transform: 'scale(0.95)',
              opacity: 0.2,
            },
          },
        }}
      />

      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', position: 'relative', zIndex: 1, background: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <SmartToyIcon sx={{ fontSize: 28, color: '#9C27B0', filter: 'drop-shadow(0px 1px 2px rgba(156,39,176,0.2))' }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              background: 'linear-gradient(90deg, #9C27B0, #2196F3)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}
          >
            AI Assistant
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Let me suggest a few tasks for the team!
        </Typography>

        {/* Prompt Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="medium"
            placeholder="Enter a request, e.g.: 'Suggest tasks for project X, assign them to team A'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                backgroundColor: '#F9FAFB', 
                '&:hover fieldset': { borderColor: '#2196F3' }, 
                '&.Mui-focused fieldset': { borderColor: '#2196F3', boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)' } 
              },
              '& .MuiInputBase-input': { fontSize: '0.9rem', py: 1 }
            }}
            InputProps={{ 
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#2196F3', fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      mr: 0.5,
                      color: 'rgba(0,0,0,0.54)',
                    }}
                  >
                    <InsertDriveFileIcon />
                  </IconButton>

                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleSubmitPrompt}
                    disabled={!prompt.trim() || isLoading}
                    sx={{
                      borderRadius: '8px',
                      background: ' #00C9FF', // cool green-blue gradient
                      textTransform: 'none',
                      boxShadow: '0 2px 5px rgba(0, 201, 255, 0.2)', // light blue shadow
                      '&:hover': {
                        boxShadow: '0 4px 10px rgba(0, 201, 255, 0.3)', // stronger hover shadow
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Send'}
                  </Button>
                </InputAdornment>
              )
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSubmitPrompt} 
            disabled={!prompt.trim() || isLoading} 
            sx={{ 
              borderRadius: '8px', 
              background: '#2196F3', 
              textTransform: 'none', 
              px: 2, 
              py: 0.8, 
              '&:hover': { background: '#1E88E5' },
              '&:disabled': { background: '#B0BEC5' }
            }}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: '1.2rem' }} />}
          >
            Send
          </Button>
        </Box>
        
        {/* Quick suggestions */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickSuggestions.map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion}
              onClick={() => handleQuickSuggestion(suggestion)}
              size="small"
              sx={{ 
                borderRadius: '16px',
                background: 'rgba(33, 150, 243, 0.08)', // light blue background
                color: '#2196F3', // blue text
                '&:hover': {
                  background: 'rgba(33, 150, 243, 0.15)', // slightly darker on hover
                }
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Tabs */}
      <Box sx={{ 
        display: 'flex', 
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(250,250,252,0.8)',
        position: 'relative',
        zIndex: 1
      }}>
        <Button 
          sx={{ 
            flexGrow: 1, 
            py: 1, 
            borderRadius: 0,
            borderBottom: activeTab === 'suggestions' ? '2px solid #2196F3' : 'none',
            color: activeTab === 'suggestions' ? '#2196F3' : 'text.secondary',
            fontWeight: activeTab === 'suggestions' ? 500 : 400,
          }}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggest
        </Button>
        <Button 
          sx={{ 
            flexGrow: 1, 
            py: 1, 
            borderRadius: 0,
            borderBottom: activeTab === 'history' ? '2px solid #2196F3' : 'none',
            color: activeTab === 'history' ? '#2196F3' : 'text.secondary',
            fontWeight: activeTab === 'history' ? 500 : 400,
          }}
          onClick={() => setActiveTab('history')}
        >
          History
        </Button>
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        {activeTab === 'suggestions' && (
          <>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                <CircularProgress size={40} sx={{ mb: 2, color: '#9C27B0' }} />
                <Typography variant="body2" color="text.secondary">
                  Analyzing and generating suggestions...

                </Typography>
              </Box>
            ) : suggestions.length > 0 ? (
              <>
                <Box sx={{ mx: 2, mt: 2 }}>
                  <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.875rem' }}>
                    The suggestions below are AI-generated. Please review them carefully before use.
                  </Alert>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, mb: 0.5, mx: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAcceptAllTasks} 
                    sx={{ 
                      borderRadius: '6px',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      color: '#4CAF50',
                      borderColor: '#4CAF50',
                      '&:hover': { 
                        backgroundColor: 'rgba(76, 175, 80, 0.08)',
                        borderColor: '#4CAF50' 
                      }
                    }}
                  >
                    Add selected tasks
                  </Button>
                </Box>
                <List disablePadding>
                  {suggestions.map((task, index) => {
                    const selectedUserId = selectedUsers[task.title];
                    const isUserSelected = !!selectedUserId || task.assignableUsers.length === 1;
                    
                    return (
                      <Fade in={true} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Paper
                          elevation={1}
                          sx={{
                            m: 1.5,
                            borderRadius: '8px',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          <Box sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '4px', 
                            height: '100%',
                            backgroundColor: getPriorityColor(task?.priority)
                          }} />
                          
                          <ListItem
                            sx={{ pr: 1, pl: 2, py: 1.5 }}
                            secondaryAction={
                              isUserSelected && (
                                <Box sx={{ display: 'flex' }}>
                                  <Tooltip title="Edit Before Adding">
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      onClick={() => handleEditTask(task)}
                                      sx={{
                                        color: '#FF9800',
                                        '&:hover': { backgroundColor: 'rgba(255,152,0,0.1)' }
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Accept">
                                    <IconButton 
                                      edge="end" 
                                      size="small"
                                      onClick={() => handleAcceptTask(task)}
                                      sx={{ 
                                        color: '#4CAF50',
                                        '&:hover': { backgroundColor: 'rgba(76,175,80,0.1)' }
                                      }}
                                    >
                                      <CheckCircleIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Reject">
                                    <IconButton 
                                      edge="end" 
                                      size="small"
                                      onClick={() => setSuggestions(suggestions.filter(s => s.title !== task?.title))}
                                      sx={{ 
                                        color: '#F44336',
                                        '&:hover': { backgroundColor: 'rgba(244,67,54,0.1)' }
                                      }}
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              )
                            }
                          >
                            <ListItemText
                              primary={
                                <>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                                      {task?.title}
                                    </Typography>
                                  </Box>
                                  <Typography variant="caption">{task?.description}</Typography>
                                </>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                  {task.assignableUsers?.map((user) => (
                                    <Chip
                                      key={user._id}
                                      icon={<PersonIcon sx={{ fontSize: '0.8rem !important' }} />}
                                      avatar={<Avatar src={user.avatar} sx={{ width: 16, height: 16 }} />}
                                      label={user.name + ' - ' + user.match_percentage + '%'}
                                      size="small"
                                      variant="outlined"
                                      onClick={() => handleSelectUser(task.title, user._id)}
                                      sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        borderColor: selectedUserId === user._id ? '#2196F3' : 'rgba(0,0,0,0.1)',
                                        backgroundColor: selectedUserId === user._id ? 'rgba(33,150,243,0.1)' : 'transparent',
                                        color: selectedUserId === user._id ? '#2196F3' : 'inherit',
                                        mr: 0.5,
                                        cursor: 'pointer',
                                        '&:hover': {
                                          backgroundColor: 'rgba(33,150,243,0.05)',
                                          borderColor: 'rgba(33,150,243,0.3)'
                                        }
                                      }}
                                    />
                                  ))}
                                  {!isUserSelected && (
                                    <Typography variant="caption" color="error" sx={{ display: 'block'}}>
                                      Please select a user to enable task actions
                                    </Typography>
                                  )}
                                </Box>
                              }
                              secondaryTypographyProps={{ component: 'div' }}
                            />
                          </ListItem>
                        </Paper>
                      </Fade>
                    );
                  })}
                </List>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%', p: 3 }}>
                <StarIcon sx={{ fontSize: 48, color: 'rgba(156,39,176,0.2)', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Enter a request to let AI suggest tasks for you
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                  AI will analyze your request and suggest suitable tasks
                </Typography>
              </Box>
            )}
          </>
        )}
        {activeTab === 'history' && (
          <List disablePadding>
            {promptHistory.length > 0 ? (
              promptHistory.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button
                    onClick={() => {
                      setPrompt(item.text);
                      setActiveTab('suggestions');
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <HistoryIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      secondary={new Date(item.timestamp).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                      primaryTypographyProps={{ 
                        noWrap: true,
                        variant: 'body2'
                      }}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50%', p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No history available
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, backgroundColor: '#FFFFFF' }}>
        <Button 
          size="small" 
          startIcon={<InsertChartIcon sx={{ fontSize: '1.1rem' }} />} 
          sx={{ 
            textTransform: 'none', 
            color: '#2196F3', 
            fontSize: '0.85rem',
            '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.05)' }
          }}
        >
          Analyze project

        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Powered by AI Assistant
        </Typography>
      </Box>

      {/* Task Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Task Details
        </DialogTitle>
        <DialogContent dividers>
          {currentTask && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {currentTask.title}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {currentTask.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Suggested Assignees
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {currentTask.assignableUsers?.map((user) => (
                  <Chip
                    key={user._id}
                    avatar={<Avatar src={user.avatar} />}
                    label={`${user.name} (${user.match_percentage}% match)`}
                    variant="outlined"
                    sx={{
                      borderColor: selectedUsers[currentTask.title] === user._id ? '#2196F3' : 'rgba(0,0,0,0.1)',
                      backgroundColor: selectedUsers[currentTask.title] === user._id ? 'rgba(33,150,243,0.1)' : 'transparent',
                    }}
                  />
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Priority
                  </Typography>
                  <Typography variant="body2">
                    {currentTask.priority || 'Low'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Story Points
                  </Typography>
                  <Typography variant="body2">
                    {currentTask.story_points || '1'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2">
                    {currentTask.type || 'Unknown'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2">
                    To Do
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Close
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<EditIcon />}
            onClick={() => {
              setDetailDialogOpen(false);
              handleEditTask(currentTask);
            }}
          >
            Edit Task
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              setDetailDialogOpen(false);
              handleAcceptTask(currentTask);
            }}
            disabled={!selectedUsers[currentTask?.title] && currentTask?.assignableUsers?.length > 1}
          >
            Accept Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Task Before Adding
        </DialogTitle>
        <DialogContent dividers>
          {editedTask && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Title"
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Description"
                value={editedTask.description}
                onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                multiline
                rows={3}
                sx={{ mb: 3 }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Assignee
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="assignee-select-label">Assignee</InputLabel>
                <Select
                  labelId="assignee-select-label"
                  value={editedTask.userId || ''}
                  onChange={(e) => setEditedTask({...editedTask, userId: e.target.value})}
                  label="Assignee"
                >
                  {editedTask.assignableUsers?.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                        {user.name} - {user.match_percentage}% match
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
  {[
    {
      label: 'Priority',
      value: editedTask.priority || 'Low',
      onChange: (e) => setEditedTask({ ...editedTask, priority: e.target.value }),
      options: ['High', 'Medium', 'Low'],
    },
    {
      label: 'Story Points',
      value: editedTask.story_points || 1,
      onChange: (e) => setEditedTask({ ...editedTask, story_points: e.target.value }),
      options: [1, 2, 3, 5, 8, 13],
    },
    {
      label: 'Task Type',
      value: editedTask.type || 'Unknown',
      onChange: (e) => setEditedTask({ ...editedTask, type: e.target.value }),
      options: ['Bug', 'Feature', 'Task', 'Story', 'Unknown'],
    },
  ].map((field, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <FormControl fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select
          value={field.value}
          onChange={field.onChange}
          label={field.label}
        >
          {field.options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  ))}
</Grid>

            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveEditedTask}
            disabled={!editedTask?.userId && editedTask?.assignableUsers?.length > 1}
          >
            Save & Add Task
          </Button>
        </DialogActions>
      </Dialog>
    
    </Paper>
  );
}
export default AISidebar;