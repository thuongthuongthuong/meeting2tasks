// TaskCard.js
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskCard = ({ task, index, onClick, user }) => {
  const getTypeIcon = () => {
    switch(task.type) {
      case 'Bug':
        return <BugReportIcon fontSize="small" sx={{ color: '#DE350B' }} />;
      case 'Task':
      default:
        return <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#2684FF' }} />;
    }
  };
  
  const getPriorityIcon = () => {
    switch(task.priority) {
      case 'High':
        return <ArrowUpwardIcon fontSize="small" sx={{ color: '#DE350B' }} />;
      case 'Low':
        return <ArrowDownwardIcon fontSize="small" sx={{ color: '#2684FF' }} />;
      case 'Medium':
      default:
        return <RemoveIcon fontSize="small" sx={{ color: '#FF9800' }} />;
    }
  };
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          variant="outlined"
          onClick={onClick}
          sx={{
            mb: 2,
            cursor: 'pointer',
            opacity: snapshot.isDragging ? 0.8 : 1,
            // Position fixed during drag prevents other cards from moving
            position: snapshot.isDragging ? 'fixed' : 'relative',
            zIndex: snapshot.isDragging ? 999 : 'auto',
            width: snapshot.isDragging ? 280 - 16 : 'auto', // Adjust width when dragging
            '&:hover': {
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              backgroundColor: '#FAFBFC'
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
                  {task.id && task.id.length >= 9 ? task.id.slice(-9, -2) : task.id}
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={task.story_points}
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                {user?.name}
              </Typography>
              <Avatar
                alt={user?.name}
                src={user?.avatar}
                sx={{ width: 24, height: 24 }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;