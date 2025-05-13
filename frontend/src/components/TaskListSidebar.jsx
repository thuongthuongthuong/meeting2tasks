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
    "Phân bổ task cho tuần này",
    "Tối ưu hóa lịch trình",
    "Gợi ý ưu tiên công việc"
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
        dueDate: "3 ngày",
        priority: "medium",
        type: "task"
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
        assignee: task.assignableUsers?.length > 0 ? task.assignableUsers[0] : null
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
        body: JSON.stringify([{ ...task, assignee }]),
      });
      if (!response.ok) throw new Error('Failed to assign task');
      const assignedTasks = await response.json();
      console.log('Assigned single task from API:', assignedTasks);

      const updatedTask = assignedTasks[0];
      setSuggestions(suggestions.map(t =>
        t.id === task.id ? { ...t, ...updatedTask, assignee: updatedTask.assignableUsers?.[0] || assignee } : t
      ));
      return updatedTask;
    } catch (error) {
      console.error('Error assigning single task:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTask = async (task) => {
    setSelectedTask(task);
    setAssignDialogOpen(true);

    const updatedTask = await assignSingleTask(task);
    if (updatedTask) {
      setSelectedTask(updatedTask);
    }
  };

  const handleSelectAssignee = async (user) => {
    if (!selectedTask) return;
    await assignSingleTask(selectedTask, user);
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
    setEditTask({ ...task });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setSuggestions(suggestions.map(task =>
      task.id === editTask.id ? { ...editTask } : task
    ));
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
      setPrompt("Gợi ý task cho team thiết kế");
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
      sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,250,252,0.95) 100%)', borderLeft: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: showAnimation ? 0.1 : 0, transition: 'opacity 2s ease', background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', animation: showAnimation ? 'pulse 2s infinite' : 'none', '@keyframes pulse': { '0%': { transform: 'scale(0.95)', opacity: 0.2 }, '50%': { transform: 'scale(1)', opacity: 0.3 }, '100%': { transform: 'scale(0.95)', opacity: 0.2 } } }} />
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'linear-gradient(90deg, rgba(30,30,30,0.02) 0%, rgba(138,43,226,0.05) 100%)', position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SmartToyIcon sx={{ mr: 1, color: '#9C27B0', filter: 'drop-shadow(0px 0px 3px rgba(156,39,176,0.3))' }} />
          <Typography variant="h6" sx={{ fontWeight: 500, background: 'linear-gradient(90deg, #9C27B0, #2196F3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Assistant</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Để mình gợi ý vài task cho team nhé!</Typography>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            size="medium"
            placeholder="Nhập yêu cầu, ví dụ: 'Gợi ý task cho dự án X'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', '&:hover fieldset': { borderColor: 'rgba(30, 144, 255, 0.5)' }, '&.Mui-focused fieldset': { borderColor: '#2196F3', boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)' } } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#2196F3' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={handleVoiceInput} sx={{ mr: 0.5, color: 'rgba(0,0,0,0.54)' }}><InsertDriveFileIcon /></IconButton><IconButton size="small" onClick={handleVoiceInput} sx={{ mr: 0.5, color: isListening ? '#F44336' : 'rgba(0,0,0,0.54)', animation: isListening ? 'pulse 1s infinite' : 'none' }}><MicIcon /></IconButton><Button variant="contained" size="small" onClick={handleSubmitPrompt} endIcon={<SendIcon />} disabled={!prompt.trim() || isLoading} sx={{ borderRadius: '8px', background: '#00C9FF', textTransform: 'none', boxShadow: '0 2px 5px rgba(0, 201, 255, 0.2)', '&:hover': { boxShadow: '0 4px 10px rgba(0, 201, 255, 0.3)' } }}>{isLoading ? <CircularProgress size={24} /> : 'Gửi'}</Button></InputAdornment> }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickSuggestions.map((suggestion, index) => (
            <Chip key={index} label={suggestion} onClick={() => handleQuickSuggestion(suggestion)} size="small" sx={{ borderRadius: '16px', background: 'rgba(33, 150, 243, 0.08)', color: '#2196F3', '&:hover': { background: 'rgba(33, 150, 243, 0.15)' } }} />
          ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'rgba(250,250,252,0.8)', position: 'relative', zIndex: 1 }}>
        <Button sx={{ flexGrow: 1, py: 1, borderRadius: 0, borderBottom: activeTab === 'suggestions' ? '2px solid #2196F3' : 'none', color: activeTab === 'suggestions' ? '#2196F3' : 'text.secondary', fontWeight: activeTab === 'suggestions' ? 500 : 400 }} onClick={() => setActiveTab('suggestions')}>Gợi ý</Button>
        <Button sx={{ flexGrow: 1, py: 1, borderRadius: 0, borderBottom: activeTab === 'history' ? '2px solid #2196F3' : 'none', color: activeTab === 'history' ? '#2196F3' : 'text.secondary', fontWeight: activeTab === 'history' ? 500 : 400 }} onClick={() => setActiveTab('history')}>Lịch sử</Button>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
        {activeTab === 'suggestions' && (
          <>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                <CircularProgress size={40} sx={{ mb: 2, color: '#9C27B0' }} />
                <Typography variant="body2" color="text.secondary">Đang phân tích và tạo gợi ý...</Typography>
              </Box>
            ) : suggestions.length > 0 ? (
              <>
                <Box sx={{ mx: 2, mt: 2 }}>
                  <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.875rem' }}>Các gợi ý dưới đây được tạo bởi AI. Vui lòng kiểm tra lại kỹ lưỡng trước khi sử dụng.</Alert>
                </Box>
                <Button variant="contained" onClick={handleAssignAll} sx={{ m: 2, background: '#00C9FF', textTransform: 'none', '&:hover': { background: '#00B0FF' } }} disabled={isLoading}>Phân công toàn bộ</Button>
                <List disablePadding>
                  {suggestions.map((task, index) => (
                    <Fade in={true} key={task.id} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          m: 1.5, 
                          borderRadius: '12px', 
                          position: 'relative', 
                          overflow: 'hidden', 
                          background: 'linear-gradient(135deg, #ffffff 0%, #f9f9fb 100%)',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 12px rgba(0,0,0,0.1)' }
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: getPriorityColor(task.priority) }} />
                        <ListItem sx={{ pr: 1, pl: 2, py: 2, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                            {getTaskIcon(task.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#333' }}>
                                  {task.title}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={task.role} 
                                  sx={{ ml: 1, background: 'rgba(156, 39, 176, 0.1)', color: '#9C27B0', fontSize: '0.75rem', height: 20 }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {task.description}
                                </Typography>
                                <Chip 
                                  icon={<PersonIcon sx={{ fontSize: '0.8rem !important' }} />} 
                                  label={task.assignee ? task.assignee.name : task.role} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ mt: 1, height: 20, fontSize: '0.65rem', borderColor: 'rgba(0,0,0,0.1)' }} 
                                />
                              </Box>
                            }
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Tooltip title="Chỉnh sửa">
                              <IconButton size="small" onClick={() => handleEditTask(task)} sx={{ color: '#FF9800' }}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Chấp nhận">
                              <IconButton size="small" onClick={() => handleAcceptTask(task)} sx={{ color: '#4CAF50' }}>
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Bỏ qua">
                              <IconButton size="small" onClick={() => setSuggestions(suggestions.filter(s => s.id !== task.id))} sx={{ color: '#F44336' }}>
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Phân công">
                              <IconButton size="small" onClick={() => handleAssignTask(task)} sx={{ color: '#2196F3' }}>
                                <AssignmentIcon />
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
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%', p: 3 }}>
                <StarIcon sx={{ fontSize: 48, color: 'rgba(156,39,176,0.2)', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>Nhập yêu cầu để AI gợi ý task cho bạn</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>AI sẽ phân tích yêu cầu và đề xuất các task phù hợp</Typography>
              </Box>
            )}
          </>
        )}
        {activeTab === 'history' && (
          <List disablePadding>
            {promptHistory.length > 0 ? promptHistory.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem button onClick={() => { setPrompt(item.text); setActiveTab('suggestions'); }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><HistoryIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText primary={item.text} secondary={new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })} primaryTypographyProps={{ noWrap: true, variant: 'body2' }} />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            )) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50%', p: 3 }}>
                <Typography variant="body2" color="text.secondary">Lịch sử trống</Typography>
              </Box>
            )}
          </List>
        )}
      </Box>
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1, backgroundColor: 'rgba(250,250,252,0.9)' }}>
        <Button size="small" startIcon={<InsertChartIcon />} sx={{ textTransform: 'none', color: '#2196F3' }}>Phân tích dự án</Button>
        <Typography variant="caption" color="text.secondary">Powered by AI Assistant</Typography>
      </Box>
      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Phân công Task: {selectedTask?.title}</DialogTitle>
        <DialogContent>
          {selectedTask?.assignee && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Người được đề xuất hiện tại:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar src={selectedTask.assignee.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body2">{selectedTask.assignee.name}</Typography>
              </Box>
            </Box>
          )}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Chọn người để phân công:
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : selectedTask?.assignableUsers?.length > 0 ? (
            <List dense>
              {selectedTask.assignableUsers.map((user) => (
                <ListItem
                  key={user._id}
                  button
                  onClick={() => handleSelectAssignee(user)}
                  sx={{
                    border: selectedTask.assignee?._id === user._id ? '2px solid #4CAF50' : 'none',
                    borderRadius: '4px',
                    mb: 1
                  }}
                >
                  <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">Không có người dùng phù hợp để phân công.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tiêu đề"
            value={editTask?.title || ''}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Mô tả"
            value={editTask?.description || ''}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
          {editTask?.assignableUsers?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Người được phân công</Typography>
              <List dense>
                {editTask.assignableUsers.map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => setEditTask({ ...editTask, assignee: user })}
                    sx={{
                      border: editTask.assignee?._id === user._id ? '2px solid #4CAF50' : 'none',
                      borderRadius: '4px',
                      mb: 1
                    }}
                  >
                    <Avatar src={user.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AISidebar;