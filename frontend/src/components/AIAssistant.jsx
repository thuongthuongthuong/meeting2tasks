import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertPhoto as InsertPhotoIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SmartToy as AIIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messageEndRef = useRef(null);

  const handleSend = () => {
    if (message.trim() === '' && files.length === 0) return;

    // Add user message to conversation
    const newUserMessage = {
      type: 'user',
      content: message,
      files: files,
      timestamp: new Date().toISOString()
    };

    setConversations([...conversations, newUserMessage]);
    setMessage('');
    setFiles([]);
    
    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: 'I understand your request. I\'m processing the information you provided and will assist you shortly.',
        timestamp: new Date().toISOString()
      };
      setConversations(prevConversations => [...prevConversations, aiResponse]);
      setIsLoading(false);
      
      // Scroll to bottom after new message
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 360,
        maxHeight: expanded ? 500 : 60,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out',
        zIndex: 1300,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#0052CC', // Jira blue
          color: 'white',
          p: 1.5,
          cursor: 'pointer'
        }}
        onClick={toggleExpand}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium">AI Assistant</Typography>
        </Box>
        {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/* Messages Area */}
        <Box
          sx={{
            height: 320,
            overflowY: 'auto',
            bgcolor: '#f4f5f7', // Jira background color
          }}
        >
          {conversations.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary',
              }}
            >
              <AIIcon sx={{ fontSize: 40, mb: 2, color: '#0052CC' }} />
              <Typography variant="body1" align="center">
                I can help you manage tasks, answer questions, or analyze files. 
                Just send me a message to get started!
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%', p: 0 }}>
              {conversations.map((message, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  sx={{
                    mb: 2,
                    flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: message.type === 'user' ? '#0052CC' : '#00875A' // Jira colors
                      }}
                    >
                      {message.type === 'user' ? <PersonIcon /> : <AIIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <Box sx={{ maxWidth: '75%' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.type === 'user' ? '#E9F2FF' : 'white',
                        border: '1px solid',
                        borderColor: message.type === 'user' ? '#DEEBFF' : '#E1E4E8',
                      }}
                    >
                      <Typography variant="body2">{message.content}</Typography>
                      
                      {message.files && message.files.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {message.files.map((file, fileIndex) => (
                            <Box
                              key={fileIndex}
                              sx={{
                                p: 1,
                                mt: 1,
                                borderRadius: 1,
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                fontSize: '0.75rem',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {file.type.includes('image') ? (
                                <InsertPhotoIcon fontSize="small" sx={{ mr: 1 }} />
                              ) : (
                                <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                              )}
                              <Typography variant="caption" noWrap sx={{ flex: 1 }}>
                                {file.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Paper>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: message.type === 'user' ? 0 : 1, mr: message.type === 'user' ? 1 : 0 }}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', my: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#00875A', mr: 1 }}>
                    <AIIcon fontSize="small" />
                  </Avatar>
                  <CircularProgress size={20} sx={{ ml: 1 }} />
                </Box>
              )}
              <div ref={messageEndRef} />
            </List>
          )}
        </Box>

        <Divider />

        {/* File Preview */}
        {files.length > 0 && (
          <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {files.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    p: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 150 }}>
                    {file.type.includes('image') ? (
                      <InsertPhotoIcon fontSize="small" sx={{ mr: 0.5 }} />
                    ) : (
                      <AttachFileIcon fontSize="small" sx={{ mr: 0.5 }} />
                    )}
                    <Typography noWrap variant="caption">{file.name}</Typography>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{ ml: 0.5, p: 0.25 }}
                    onClick={() => removeFile(file)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Input Box */}
        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'flex-end',
            bgcolor: 'white',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '0.9rem',
                paddingY: 1,
              }
            }}
          />
          
          <Box sx={{ display: 'flex' }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              multiple
            />
            <Tooltip title="Attach file">
              <IconButton
                size="medium"
                color="primary"
                onClick={() => fileInputRef.current.click()}
              >
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            
            <input
              type="file"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
            />
            <Tooltip title="Upload image">
              <IconButton
                size="medium"
                color="primary"
                onClick={() => imageInputRef.current.click()}
              >
                <InsertPhotoIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Send">
              <IconButton
                size="medium" 
                color="primary"
                onClick={handleSend}
                disabled={message.trim() === '' && files.length === 0}
                sx={{
                  bgcolor: '#0052CC',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#0747A6',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#DFE1E6',
                    color: '#A5ADBA',
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AIAssistant;