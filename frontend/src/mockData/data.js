export const users = [
    { id: 1, name: 'User 1', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'User 2', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'User 3', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'User 4', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

export const mockSprints = [
    {
      id: 1,
      name: 'Sprint 35',
      status: 'active',
      startDate: '2025-04-15',
      endDate: '2025-04-29',
      tasks: {
        todo: [
          { 
            id: 'NUC-205', 
            type: 'task', 
            title: 'Implement feedback collector', 
            priority: 'medium',
            assignee: users[3],
            storyPoints: 9
          },
          { 
            id: 'NUC-206', 
            type: 'bug', 
            title: 'Bump version for new API for billing', 
            priority: 'low',
            assignee: users[3],
            storyPoints: 3
          },
          { 
            id: 'NUC-208', 
            type: 'task', 
            title: 'Add NPS feedback to wallboard', 
            priority: 'low',
            assignee: users[3],
            storyPoints: 1
          }
        ],
        inProgress: [
          { 
            id: 'NUC-213', 
            type: 'bug', 
            title: 'Update T&C copy with v1.9 from the writers guild in all products that have cross country compliance', 
            priority: 'high',
            assignee: users[2],
            storyPoints: 1
          },
          { 
            id: 'NUC-216', 
            type: 'task', 
            title: 'Refactor stripe verification key validator to a single call to avoid timing out on slow connections', 
            priority: 'high',
            assignee: users[0],
            storyPoints: 3
          },
          { 
            id: 'NUC-218', 
            type: 'task', 
            title: 'Investigate performance dips from last week', 
            priority: 'high',
            assignee: users[0],
            storyPoints: 3
          }
        ],
        inReview: [
          { 
            id: 'NUC-338', 
            type: 'task', 
            title: 'Multi-dest search UI web', 
            priority: 'medium',
            assignee: users[1],
            storyPoints: 5
          }
        ],
        done: [
          { 
            id: 'NUC-336', 
            type: 'task', 
            title: 'Quick booking for accommodations - web', 
            priority: 'low',
            assignee: users[2],
            storyPoints: 4,
            completed: true
          },
          { 
            id: 'NUC-354', 
            type: 'bug', 
            title: 'Shopping cart purchasing error - quick fix required', 
            priority: 'high',
            assignee: users[1],
            storyPoints: 1,
            completed: true
          }
        ]
      }
    },
    {
      id: 2,
      name: 'Sprint 34',
      status: 'completed',
      startDate: '2025-04-01',
      endDate: '2025-04-14',
      tasks: {
        todo: [],
        inProgress: [],
        inReview: [],
        done: [
          { 
            id: 'NUC-189', 
            type: 'task', 
            title: 'Implement user profile page', 
            priority: 'medium',
            assignee: users[1],
            storyPoints: 8,
            completed: true
          },
          { 
            id: 'NUC-190', 
            type: 'bug', 
            title: 'Fix login redirect issue', 
            priority: 'high',
            assignee: users[2],
            storyPoints: 2,
            completed: true
          },
          { 
            id: 'NUC-191', 
            type: 'task', 
            title: 'Add payment gateway integration', 
            priority: 'high',
            assignee: users[0],
            storyPoints: 5,
            completed: true
          },
          { 
            id: 'NUC-192', 
            type: 'task', 
            title: 'Optimize database queries', 
            priority: 'medium',
            assignee: users[3],
            storyPoints: 3,
            completed: true
          }
        ]
      }
    },
    {
      id: 3,
      name: 'Sprint 33',
      status: 'completed',
      startDate: '2025-03-18',
      endDate: '2025-03-31',
      tasks: {
        todo: [],
        inProgress: [],
        inReview: [],
        done: [
          { 
            id: 'NUC-175', 
            type: 'task', 
            title: 'Implement search functionality', 
            priority: 'high',
            assignee: users[0],
            storyPoints: 8,
            completed: true
          },
          { 
            id: 'NUC-176', 
            type: 'bug', 
            title: 'Fix mobile layout issues', 
            priority: 'medium',
            assignee: users[1],
            storyPoints: 3,
            completed: true
          },
          { 
            id: 'NUC-177', 
            type: 'task', 
            title: 'Add email notification system', 
            priority: 'low',
            assignee: users[2],
            storyPoints: 5,
            completed: true
          }
        ]
      }
    }
  ];