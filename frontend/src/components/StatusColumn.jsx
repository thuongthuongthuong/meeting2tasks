// StatusColumn.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const StatusColumn = ({ title, id, count, tasks, onTaskClick }) => {
  return (
    <Box sx={{ width: 280, flexShrink: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: '#6B778C', fontWeight: 600 }}>
          {title} {count}
        </Typography>
      </Box>
      <Droppable 
        droppableId={id}
        // This is the key change - using type="COLUMN" forces tasks to always go to the end
        type="COLUMN"
      >
        {(provided, snapshot) => (
          <Paper
            variant="outlined"
            sx={{
              // Change background when dragging over
              bgcolor: snapshot.isDraggingOver ? '#E6EFFC' : '#F4F5F7',
              borderRadius: 1,
              p: 1,
              minHeight: 300,
              transition: 'background-color 0.2s ease',
              height: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </Paper>
        )}
      </Droppable>
    </Box>
  );
};

export default StatusColumn;