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
  Alert
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
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const AISidebar = ({ onAddTask, teamMembers, projectName }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [showAnimation, setShowAnimation] = useState(false);

  // Danh sách gợi ý nhanh
  const quickSuggestions = [
    "Phân bổ task cho tuần này",
    "Tối ưu hóa lịch trình",
    "Gợi ý ưu tiên công việc"
  ];

  // Danh sách task mẫu (giả lập phản hồi từ AI)
  const demoTasks = [
    {
      id: "AI-1",
      title: "Thiết kế logo cho khách hàng X",
      assignee: { id: 1, name: "Nam", avatar: "/api/placeholder/30/30" },
      dueDate: "3 ngày",
      priority: "high",
      type: "design"
    },
    {
      id: "AI-2",
      title: "Tạo wireframe cho trang landing page",
      assignee: { id: 2, name: "Lan", avatar: "/api/placeholder/30/30" },
      dueDate: "2 ngày",
      priority: "medium",
      type: "design"
    },
    {
      id: "AI-3",
      title: "Viết nội dung cho trang giới thiệu",
      assignee: { id: 3, name: "Hùng", avatar: "/api/placeholder/30/30" },
      dueDate: "4 ngày",
      priority: "low",
      type: "content"
    },
    {
      id: "AI-4",
      title: "Viết nội dung cho trang giới thiệu",
      assignee: { id: 3, name: "Hùng", avatar: "/api/placeholder/30/30" },
      dueDate: "4 ngày",
      priority: "low",
      type: "content"
    },
    {
      id: "AI-5",
      title: "Viết nội dung cho trang giới thiệu",
      assignee: { id: 3, name: "Hùng", avatar: "/api/placeholder/30/30" },
      dueDate: "4 ngày",
      priority: "low",
      type: "content"
    },
    {
      id: "AI-66",
      title: "Viết nội dung cho trang giới thiệu",
      assignee: { id: 3, name: "Hùng", avatar: "/api/placeholder/30/30" },
      dueDate: "4 ngày",
      priority: "low",
      type: "content"
    }
  ];

  // Xử lý khi gửi prompt
  const handleSubmitPrompt = () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setShowAnimation(true);

    // Lưu prompt vào lịch sử
    setPromptHistory([{ text: prompt, timestamp: new Date() }, ...promptHistory]);

    // Giả lập thời gian phản hồi của AI
    setTimeout(() => {
      setSuggestions(demoTasks);
      setIsLoading(false);
    }, 1500);

    setPrompt('');
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitPrompt();
    }
  };

  // Xử lý khi chọn gợi ý nhanh
  const handleQuickSuggestion = (suggestion) => {
    setPrompt(suggestion);
    handleSubmitPrompt();
  };

  // Giả lập voice input
  const handleVoiceInput = () => {
    setIsListening(true);
    // Giả lập nhận giọng nói
    setTimeout(() => {
      setPrompt("Gợi ý task cho team thiết kế");
      setIsListening(false);
      handleSubmitPrompt();
    }, 2000);
  };

  // Xử lý khi chấp nhận task
  const handleAcceptTask = (task) => {
    onAddTask(task);
    // Xóa khỏi danh sách gợi ý
    setSuggestions(suggestions.filter(s => s.id !== task.id));
  };

  // Animation cho background
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  // Hiển thị icon dựa trên loại task
  const getTaskIcon = (type) => {
    switch(type) {
      case 'design':
        return <LightbulbIcon sx={{ color: '#FF9800' }} />;
      case 'content':
        return <InsertChartIcon sx={{ color: '#2196F3' }} />;
      default:
        return <SmartToyIcon sx={{ color: '#9C27B0' }} />;
    }
  };

  // Màu cho priority
  const getPriorityColor = (priority) => {
    switch(priority) {
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
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,250,252,0.95) 100%)',
        borderLeft: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '8px'
      }}
    >
      {/* Background animation */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: showAnimation ? 0.1 : 0,
          transition: 'opacity 2s ease',
          background: 'radial-gradient(circle, rgba(138,43,226,0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          animation: showAnimation ? 'pulse 2s infinite' : 'none',
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
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          background: 'linear-gradient(90deg, rgba(30,30,30,0.02) 0%, rgba(138,43,226,0.05) 100%)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SmartToyIcon sx={{ 
            mr: 1, 
            color: '#9C27B0',
            filter: 'drop-shadow(0px 0px 3px rgba(156,39,176,0.3))'
          }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 500,
            background: 'linear-gradient(90deg, #9C27B0, #2196F3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Assistant
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Để mình gợi ý vài task cho team nhé!
        </Typography>
        
        {/* Input prompt */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            size="medium"
            placeholder="Nhập yêu cầu, ví dụ: 'Gợi ý task cho dự án X, phân công cho team A'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ 
              mb: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: 'rgba(30, 144, 255, 0.5)', // DodgerBlue with opacity
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196F3', // Material blue
                  boxShadow: '0 0 0 2px rgba(33, 150, 243, 0.1)', // same blue with opacity
                }
              }
            }}
            
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#2196F3' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">

                  <IconButton 
                    size="small" 
                    onClick={handleVoiceInput} // đổi tên hàm nếu cần
                    sx={{ 
                      mr: 0.5,
                      color: 'rgba(0,0,0,0.54)', // không còn trạng thái "listening"
                    }}
                  >
                    <InsertDriveFileIcon />
                  </IconButton>

                  <IconButton 
                    size="small" 
                    onClick={handleVoiceInput}
                    sx={{ 
                      mr: 0.5,
                      color: isListening ? '#F44336' : 'rgba(0,0,0,0.54)',
                      animation: isListening ? 'pulse 1s infinite' : 'none',
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                  <Button 
  variant="contained" 
  size="small" 
  onClick={handleSubmitPrompt}
  endIcon={<SendIcon />}
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
  {isLoading ? <CircularProgress size={24} /> : 'Gửi'}
</Button>

                </InputAdornment>
              ),
            }}
          />
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
    Gợi ý
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
    Lịch sử
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
                  Đang phân tích và tạo gợi ý...
                </Typography>
              </Box>
            ) : suggestions.length > 0 ? (
              <>
                <Box sx={{ mx: 2, mt: 2 }}>
                  <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.875rem' }}>
                    Các gợi ý dưới đây được tạo bởi AI. Vui lòng kiểm tra lại kỹ lưỡng trước khi sử dụng.
                  </Alert>
                </Box>
              
              <List disablePadding>
                {suggestions.map((task, index) => (
                  <Fade in={true} key={task.id} style={{ transitionDelay: `${index * 100}ms` }}>
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
                        backgroundColor: getPriorityColor(task.priority)
                      }} />
                      
                      <ListItem
                        sx={{ pr: 1, pl: 2, py: 1.5 }}
                        secondaryAction={
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="Chấp nhận">
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
                            <Tooltip title="Bỏ qua">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={() => setSuggestions(suggestions.filter(s => s.id !== task.id))}
                                sx={{ 
                                  color: '#F44336',
                                  '&:hover': { backgroundColor: 'rgba(244,67,54,0.1)' }
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {getTaskIcon(task.type)}
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={
                            <>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                  {task.id}
                                </Typography>
                                <DragIndicatorIcon 
                                  fontSize="small" 
                                  sx={{ 
                                    color: 'text.disabled',
                                    cursor: 'grab'
                                  }} 
                                />
                              </Box>
                              <Typography variant="subtitle2">{task.title}</Typography>
                            </>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                              <Chip
                                icon={<PersonIcon sx={{ fontSize: '0.8rem !important' }} />}
                                avatar={<Avatar src={task.assignee.avatar} sx={{ width: 16, height: 16 }} />}
                                label={task.assignee.name}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  borderColor: 'rgba(0,0,0,0.1)'
                                }}
                              />
                              
                              <Chip
                                icon={<AccessTimeIcon sx={{ fontSize: '0.8rem !important' }} />}
                                label={task.dueDate}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  borderColor: 'rgba(0,0,0,0.1)'
                                }}
                              />
                              
                              <Chip
                                label={task.priority.toUpperCase()}
                                size="small"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  backgroundColor: `${getPriorityColor(task.priority)}20`,
                                  color: getPriorityColor(task.priority),
                                  fontWeight: 500
                                }}
                              />
                            </Box>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                      </ListItem>
                    </Paper>
                  </Fade>
                ))}
              </List>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70%', p: 3 }}>
                <StarIcon sx={{ fontSize: 48, color: 'rgba(156,39,176,0.2)', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Nhập yêu cầu để AI gợi ý task cho bạn
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                  AI sẽ phân tích yêu cầu và đề xuất các task phù hợp
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
                  Lịch sử trống
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 1.5, 
        borderTop: '1px solid rgba(0,0,0,0.08)', 
        display: 'flex', 
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(250,250,252,0.9)'
      }}>
        <Button
          size="small"
          startIcon={<InsertChartIcon />}
          sx={{
            textTransform: 'none',
            color: '#2196F3'
          }}
        >
          Phân tích dự án
        </Button>
        
        <Typography variant="caption" color="text.secondary">
          Powered by AI Assistant
        </Typography>
      </Box>
    </Paper>
  );
};

export default AISidebar;