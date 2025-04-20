import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip,
  IconButton
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskCard = ({ task }) => {
  const getTypeIcon = () => {
    switch(task.type) {
      case 'bug':
        return <BugReportIcon fontSize="small" sx={{ color: '#DE350B' }} />;
      case 'task':
      default:
        return <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#2684FF' }} />;
    }
  };

  const getPriorityIcon = () => {
    switch(task.priority) {
      case 'high':
        return <ArrowUpwardIcon fontSize="small" sx={{ color: '#DE350B' }} />;
      case 'low':
        return <ArrowDownwardIcon fontSize="small" sx={{ color: '#2684FF' }} />;
      case 'medium':
      default:
        return <RemoveIcon fontSize="small" sx={{ color: '#FF9800' }} />;
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        '&:hover': { 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        }
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getTypeIcon()}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              component="span"
              sx={{ ml: 0.5, fontWeight: 500 }}
            >
              {task.id}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            {task.completed && <CheckCircleIcon fontSize="small" sx={{ color: '#00875A', mr: 0.5 }} />}
            <Chip 
              label={task.storyPoints} 
              size="small" 
              variant="outlined" 
              sx={{ 
                height: 20, 
                fontSize: '0.75rem',
                mr: 0.5
              }} 
            />
            {getPriorityIcon()}
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {task.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Avatar 
            alt={task.assignee.name} 
            src={task.assignee.avatar} 
            sx={{ width: 24, height: 24 }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;