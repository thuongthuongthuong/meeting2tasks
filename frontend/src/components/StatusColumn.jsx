import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TaskCard from './TaskCard';
//-------------------------------------------------------

const StatusColumn = ({ title, count, tasks }) => {
  return (
    <Box sx={{ width: 280, flexShrink: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: '#6B778C', fontWeight: 600 }}>
          {title} {count}
        </Typography>
      </Box>
      <Paper 
        variant="outlined" 
        sx={{ 
          bgcolor: '#F4F5F7', 
          borderRadius: 1, 
          p: 1,
          minHeight: '100%'
        }}
      >
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Paper>
    </Box>
  );
};

export default StatusColumn;