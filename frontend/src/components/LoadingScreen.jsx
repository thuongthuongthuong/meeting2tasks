import React, { useEffect } from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TaskIcon from '@mui/icons-material/Task';
import BugReportIcon from '@mui/icons-material/BugReport';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const LoadingScreen = ({ isLoading = true, onLoadingComplete }) => {
  const theme = useTheme();

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoadingComplete]);

  // Card animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: index => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: index => ({
      opacity: 0,
      y: -10,
      transition: {
        delay: index * 0.05,
        duration: 0.3
      }
    })
  };

  // Logo animation variants
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Progress bar animation variants
  const progressVariants = {
    initial: { width: "0%" },
    animate: { 
      width: "100%", 
      transition: { 
        duration: 2.5, 
        ease: "easeInOut" 
      } 
    }
  };

  // Mock task cards data
  const taskCards = [
    { id: 'Task 1', icon: <TaskIcon sx={{ color: theme.palette.primary.main }} /> },
    { id: 'Bug Fix', icon: <BugReportIcon sx={{ color: theme.palette.error.main }} /> },
    { id: 'Feature', icon: <AssignmentIcon sx={{ color: theme.palette.info.main }} /> },
    { id: 'Complete', icon: <CheckCircleOutlineIcon sx={{ color: theme.palette.success.main }} /> }
  ];

  return (
    <AnimatePresence>
      {isLoading && (
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.default',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Container maxWidth="sm">
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate={["animate", "pulse"]}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  <TaskIcon fontSize="large" /> Task Board
                </Typography>
              </motion.div>
              
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Loading your workspace...
              </Typography>
            </Box>

            {/* Task Cards Animation */}
            <Box sx={{ position: 'relative', height: 120, mb: 4 }}>
              {taskCards.map((task, index) => (
                <Box
                  component={motion.div}
                  key={task.id}
                  custom={index}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    p: 2,
                    borderRadius: 1,
                    boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    top: 0,
                    left: 0,
                    opacity: 0,
                    zIndex: taskCards.length - index
                  }}
                >
                  {task.icon}
                  <Typography variant="body1" fontWeight={500}>
                    {task.id}
                  </Typography>
                  <Box 
                    component={motion.div}
                    animate={{ 
                      x: [0, 3, -3, 3, 0],
                      transition: { 
                        delay: 0.2 + index * 0.15, 
                        duration: 0.5, 
                        ease: "easeInOut" 
                      }
                    }}
                    sx={{ 
                      ml: 'auto', 
                      height: 20, 
                      width: 60, 
                      bgcolor: 'action.hover', 
                      borderRadius: 0.5 
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Progress bar */}
            <Box sx={{ width: '100%', bgcolor: 'action.hover', borderRadius: 1, height: 6, overflow: 'hidden' }}>
              <Box 
                component={motion.div} 
                variants={progressVariants}
                initial="initial"
                animate="animate"
                sx={{ 
                  height: '100%', 
                  borderRadius: 1, 
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              />
            </Box>

            {/* Loading text */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {['Preparing', 'your', 'workspace'].map((word, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 1 + i * 0.15, duration: 0.5 }
                    }}
                    color="text.secondary"
                  >
                    {word}
                  </Typography>
                ))}
                <Typography 
                  variant="body2" 
                  component={motion.div}
                  animate={{ 
                    opacity: [0, 1, 0],
                    transition: { 
                      repeat: Infinity,
                      duration: 1.5,
                      times: [0, 0.5, 1]
                    }
                  }}
                  color="text.secondary"
                >
                  ...
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;