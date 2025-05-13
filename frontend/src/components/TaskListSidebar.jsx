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
  Menu,
  MenuItem
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
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import PercentIcon from '@mui/icons-material/Percent';
import { generateTasksFromMeetingNotes } from '../utils/api';

const AISidebar = ({ onAddTask, projectId = 1 }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [showAnimation, setShowAnimation] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const quickSuggestions = [
    "Assign tasks for this week",
    "Optimize the schedule",
    "Suggest task priorities"
  ];

  const handleSubmitPrompt = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setShowAnimation(true);

    setPromptHistory([{ text: prompt, timestamp: new Date() }, ...promptHistory]);

    try {
      const generatedTasks = await generateTasksFromMeetingNotes(prompt);
      const mappedTasks = generatedTasks.map((task, index) => ({
        id: `AI-${Date.now()}-${index}`,
        title: task.title,
        description: task.description || '',
        role: task.role || 'Unassigned',
        dueDate: "3 days",
        priority: "medium",
        type: "task",
        assignableUsers: task.assignableUsers || [],
        assignee: task.assignableUsers?.length > 0 && !task.assignee 
          ? task.assignableUsers.reduce((prev, curr) => 
              (prev.match_percentage || 0) > (curr.match_percentage || 0) ? prev : curr, task.assignableUsers[0])
          : task.assignee
      }));
      setSuggestions(mappedTasks);
    } catch (error) {
      console.error('Error generating tasks:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }

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
    handleSubmitPrompt();
  };
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setPrompt("Suggest tasks for the design team");
      setIsListening(false);
      handleSubmitPrompt();
    }, 2000);
  };
  const handleAcceptTask = (task) => {
    onAddTask(task);
    setSuggestions(suggestions.filter(s => s.id !== task.id));
  };

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  const getTaskIcon = (type) => {
    switch(type) {
      case 'design': return <LightbulbIcon sx={{ color: '#FF9800' }} />;
      case 'content': return <InsertChartIcon sx={{ color: '#2196F3' }} />;
      default: return <SmartToyIcon sx={{ color: '#9C27B0' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
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
          opacity: showAnimation ? 0.15 : 0, 
          transition: 'opacity 1.5s ease', 
          background: 'radial-gradient(circle, rgba(138,43,226,0.15) 0%, rgba(0,0,0,0) 70%)', 
          pointerEvents: 'none', 
          animation: showAnimation ? 'pulse 2s infinite' : 'none', 
          '@keyframes pulse': { '0%': { transform: 'scale(0.97)', opacity: 0.15 }, '50%': { transform: 'scale(1)', opacity: 0.25 }, '100%': { transform: 'scale(0.97)', opacity: 0.15 } } 
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
          Generate and manage tasks effortlessly with AI.
        </Typography>

        {/* Prompt Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter your request, e.g., 'Suggest tasks for Project X'"
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
                  <IconButton size="small" onClick={handleVoiceInput} sx={{ color: isListening ? '#F44336' : 'rgba(0,0,0,0.54)', animation: isListening ? 'pulse 1s infinite' : 'none' }}>
                    <MicIcon sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                  <IconButton size="small" onClick={handleVoiceInput} sx={{ color: 'rgba(0,0,0,0.54)' }}>
                    <InsertDriveFileIcon sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
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

        {/* Quick Suggestions */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickSuggestions.map((suggestion, index) => (
            <Chip 
              key={index} 
              label={suggestion} 
              onClick={() => handleQuickSuggestion(suggestion)} 
              size="small" 
              sx={{ 
                borderRadius: '16px', 
                background: 'rgba(33, 150, 243, 0.1)', 
                color: '#2196F3', 
                fontSize: '0.8rem', 
                px: 1, 
                '&:hover': { background: 'rgba(33, 150, 243, 0.2)' } 
              }} 
            />
          ))}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', position: 'relative', zIndex: 1 }}>
        <Button 
          sx={{ 
            flex: 1, 
            py: 1.5, 
            borderRadius: 0, 
            borderBottom: activeTab === 'suggestions' ? '2px solid #2196F3' : 'none', 
            color: activeTab === 'suggestions' ? '#2196F3' : 'text.secondary', 
            fontWeight: activeTab === 'suggestions' ? 600 : 400,
            fontSize: '0.9rem',
            textTransform: 'none'
          }} 
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </Button>
        <Button 
          sx={{ 
            flex: 1, 
            py: 1.5, 
            borderRadius: 0, 
            borderBottom: activeTab === 'history' ? '2px solid #2196F3' : 'none', 
            color: activeTab === 'history' ? '#2196F3' : 'text.secondary', 
            fontWeight: activeTab === 'history' ? 600 : 400,
            fontSize: '0.9rem',
            textTransform: 'none'
          }} 
          onClick={() => setActiveTab('history')}
        >
          History
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', position: 'relative', zIndex: 1, backgroundColor: '#FAFAFA' }}>
        {activeTab === 'suggestions' && (
          <>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={36} sx={{ color: '#9C27B0' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                  Generating suggestions...
                </Typography>
              </Box>
            ) : suggestions.length > 0 ? (
              <>
                <Box sx={{ p: 2 }}>
                  <Alert 
                    severity="info" 
                    variant="outlined" 
                    sx={{ 
                      fontSize: '0.85rem', 
                      backgroundColor: 'rgba(33, 150, 243, 0.05)', 
                      borderColor: 'rgba(33, 150, 243, 0.2)', 
                      color: '#1565C0'
                    }}
                  >
                    These are AI-generated suggestions. Please review before proceeding.
                  </Alert>
                </Box>
                <Box sx={{ px: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleAssignAll} 
                    disabled={isLoading} 
                    sx={{ 
                      borderRadius: '8px', 
                      background: '#2196F3', 
                      textTransform: 'none', 
                      px: 3, 
                      py: 0.8, 
                      '&:hover': { background: '#1E88E5' }
                    }}
                  >
                    Assign All
                  </Button>
                </Box>
                <List disablePadding sx={{ px: 1, pb: 2 }}>
                  {suggestions.map((task, index) => (
                    <Fade in={true} key={task.id} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          m: 1, 
                          borderRadius: '10px', 
                          position: 'relative', 
                          overflow: 'hidden', 
                          background: '#FFFFFF',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.08)' }
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: getPriorityColor(task.priority) }} />
                        <ListItem sx={{ px: 2, py: 1.5, alignItems: 'flex-start', gap: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                            {getTaskIcon(task.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                                  {task.title}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={task.role} 
                                  sx={{ 
                                    background: 'rgba(156, 39, 176, 0.1)', 
                                    color: '#9C27B0', 
                                    fontSize: '0.75rem', 
                                    height: 22, 
                                    borderRadius: '6px'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
                                  {task.description}
                                </Typography>
                                {task.assignableUsers && task.assignableUsers.length > 0 && (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {task.assignableUsers.map((user, idx) => (
                                      <Chip
                                        key={idx}
                                        icon={<PersonIcon sx={{ fontSize: '0.9rem !important', ml: 0.5 }} />}
                                        label={`${user.name} (${user.match_percentage || 0}%)`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          fontSize: '0.75rem',
                                          height: 24,
                                          borderRadius: '6px',
                                          borderColor: task.assignee?._id === user._id ? '#4CAF50' : 'rgba(0,0,0,0.1)',
                                          backgroundColor: task.assignee?._id === user._id ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                                          color: task.assignee?._id === user._id ? '#4CAF50' : 'inherit',
                                          '& .MuiChip-icon': {
                                            color: task.assignee?._id === user._id ? '#4CAF50' : 'inherit'
                                          }
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexShrink: 0, mt: 0.5 }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEditTask(task)} sx={{ color: '#FF9800' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Accept">
                              <IconButton size="small" onClick={() => handleAcceptTask(task)} sx={{ color: '#4CAF50' }}>
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton size="small" onClick={() => setSuggestions(suggestions.filter(s => s.id !== task.id))} sx={{ color: '#F44336' }}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Assign">
                              <IconButton size="small" onClick={() => handleAssignTask(task)} sx={{ color: '#2196F3' }}>
                                <AssignmentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                      </Paper>
                    </Fade>
                  ))}
                </List>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3, textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: 40, color: 'rgba(156,39,176,0.2)', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', mb: 1 }}>
                  No suggestions yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  Enter a request above to get AI-generated task suggestions.
                </Typography>
              </Box>
            )}
          </>
        )}
        {activeTab === 'history' && (
          <List disablePadding sx={{ p: 1 }}>
            {promptHistory.length > 0 ? promptHistory.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  button 
                  onClick={() => { setPrompt(item.text); setActiveTab('suggestions'); }} 
                  sx={{ 
                    borderRadius: '8px', 
                    py: 1, 
                    px: 2, 
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <HistoryIcon fontSize="small" sx={{ color: '#78909C' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    secondary={new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })} 
                    primaryTypographyProps={{ fontSize: '0.9rem', color: '#1A1A1A' }} 
                    secondaryTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
                  />
                </ListItem>
                {index < promptHistory.length - 1 && <Divider component="li" sx={{ my: 0.5 }} />}
              </React.Fragment>
            )) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
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
          Analyze Project
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Powered by AI Assistant
        </Typography>
      </Box>

      {/* Assign Task Dialog */}
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.08)', py: 2 }}>
          Assign Task: {selectedTask?.title}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedTask?.assignee && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
                Current Assignee:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={selectedTask.assignee.avatar} sx={{ width: 28, height: 28 }} />
                <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {selectedTask.assignee.name}
                </Typography>
                <Chip
                  icon={<PercentIcon sx={{ fontSize: '0.9rem !important', ml: 0.5 }} />}
                  label={`${selectedTask.assignee.match_percentage || 0}%`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.75rem',
                    height: 24,
                    borderRadius: '6px',
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    color: '#4CAF50',
                    '& .MuiChip-icon': { color: '#4CAF50' }
                  }}
                />
              </Box>
            </Box>
          )}
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1.5 }}>
            Select an Assignee:
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : selectedTask?.assignableUsers?.length > 0 ? (
            <List dense sx={{ py: 0 }}>
              {selectedTask.assignableUsers.map((user) => (
                <ListItem
                  key={user._id}
                  button
                  onClick={() => handleSelectAssignee(user)}
                  sx={{
                    border: selectedTask.assignee?._id === user._id ? '1px solid #4CAF50' : '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    mb: 1,
                    py: 1,
                    px: 2,
                    backgroundColor: selectedTask.assignee?._id === user._id ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' }
                  }}
                >
                  <Avatar src={user.avatar} sx={{ width: 28, height: 28, mr: 1.5 }} />
                  <ListItemText 
                    primary={user.name} 
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                  />
                  <Chip
                    icon={<PercentIcon sx={{ fontSize: '0.9rem !important', ml: 0.5 }} />}
                    label={`${user.match_percentage || 0}%`}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.75rem',
                      height: 24,
                      borderRadius: '6px',
                      borderColor: selectedTask.assignee?._id === user._id ? '#4CAF50' : 'rgba(0,0,0,0.1)',
                      backgroundColor: selectedTask.assignee?._id === user._id ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                      color: selectedTask.assignee?._id === user._id ? '#4CAF50' : 'inherit',
                      '& .MuiChip-icon': {
                        color: selectedTask.assignee?._id === user._id ? '#4CAF50' : 'inherit'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem', py: 2 }}>
              No suitable users available for assignment.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Button 
            onClick={handleCloseAssignDialog} 
            sx={{ 
              textTransform: 'none', 
              color: '#546E7A', 
              fontSize: '0.9rem',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.08)', py: 2 }}>
          Edit Task
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            fullWidth
            label="Task Title"
            value={editTask?.title || ''}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            sx={{ mb: 2, '& .MuiInputLabel-root': { fontSize: '0.9rem' }, '& .MuiInputBase-input': { fontSize: '0.9rem' } }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editTask?.description || ''}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            multiline
            rows={4}
            sx={{ mb: 2, '& .MuiInputLabel-root': { fontSize: '0.9rem' }, '& .MuiInputBase-input': { fontSize: '0.9rem' } }}
          />
          {editTask?.assignableUsers?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 500, mb: 1.5 }}>
                Assign to:
              </Typography>
              <List dense sx={{ py: 0 }}>
                {editTask.assignableUsers.map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => setEditTask({ ...editTask, assignee: user })}
                    sx={{
                      border: editTask.assignee?._id === user._id ? '1px solid #4CAF50' : '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      mb: 1,
                      py: 1,
                      px: 2,
                      backgroundColor: editTask.assignee?._id === user._id ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' }
                    }}
                  >
                    <Avatar src={user.avatar} sx={{ width: 28, height: 28, mr: 1.5 }} />
                    <ListItemText 
                      primary={user.name} 
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                    />
                    <Chip
                      icon={<PercentIcon sx={{ fontSize: '0.9rem !important', ml: 0.5 }} />}
                      label={`${user.match_percentage || 0}%`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        height: 24,
                        borderRadius: '6px',
                        borderColor: editTask.assignee?._id === user._id ? '#4CAF50' : 'rgba(0,0,0,0.1)',
                        backgroundColor: editTask.assignee?._id === user._id ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                        color: editTask.assignee?._id === user._id ? '#4CAF50' : 'inherit',
                        '& .MuiChip-icon': {
                          color: editTask.assignee?._id === user._id ? '#4CAF50' : 'inherit'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Button 
            onClick={handleCloseEditDialog} 
            sx={{ 
              textTransform: 'none', 
              color: '#546E7A', 
              fontSize: '0.9rem',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            sx={{ 
              borderRadius: '8px', 
              background: '#2196F3', 
              textTransform: 'none', 
              px: 3, 
              py: 0.8, 
              fontSize: '0.9rem',
              '&:hover': { background: '#1E88E5' }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AISidebar;