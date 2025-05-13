import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TaskCard = ({ task, index, onClick }) => {
  const getTypeIcon = () => {
    switch (task.type) {
      case 'bug':
        return <BugReportIcon fontSize="small" sx={{ color: '#DE350B' }} />;
      case 'task':
      default:
        return <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#2684FF' }} />;
    }
  };

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return <ArrowUpwardIcon fontSize="small" sx={{ color: '#DE350B' }} />;
      case 'low':
        return <ArrowDownwardIcon fontSize="small" sx={{ color: '#2684FF' }} />;
      case 'medium':
      default:
        return <RemoveIcon fontSize="small" sx={{ color: '#FF9800' }} />;
    }
  };

  const draggableId = task.id ? task.id.toString() : `task-${index}`;

  return (
    <Draggable draggableId={draggableId} index={index}>
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
            opacity: snapshot.isDragging ? 0.9 : 1,
            boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              backgroundColor: '#F9FAFB',
            },
            width: snapshot.isDragging ? 280 : 'auto',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {/* Header: Type và Status */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getTypeIcon()}
                <Typography variant="caption" color="text.secondary">
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                </Typography>
              </Box>
              {task.completed && (
                <Chip
                  icon={<CheckCircleIcon fontSize="small" />}
                  label="Done"
                  size="small"
                  color="success"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                mb: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {task.title}
            </Typography>

            {/* Details: Story Points, Priority, Assignee */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Story Points</Typography>
                <Chip
                  label={task.storyPoints}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.75rem', color: '#374151' }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Priority</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getPriorityIcon()}
                  <Typography variant="caption" sx={{ color: '#374151' }}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">Assignee</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Avatar
                    alt={task.assignee.name}
                    src={task.assignee.avatar}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography variant="caption" sx={{ color: '#374151' }}>
                    {task.assignee.name}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Description (nếu có) */}
            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1.5,
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {task.description}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;