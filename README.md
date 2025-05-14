# Meeting2Tasks

The `Meeting2Tasks` project builds an intelligent system to support businesses and workgroups in managing work more effectively by converting meeting content into specific tasks. The system leverages natural language models (LLM) combined with modern backend processing flows, saving time and minimizing the omission of important information during meetings.

## Overview

The system consists of three main microservices:
- **ai-service**: A FastAPI-based service that uses OpenAI's LLM to extract tasks from meeting notes.
- **task-service**: A Spring Boot application that processes meeting notes, calls `ai-service` to extract tasks, and stores them in MongoDB.
- **scheduling-service**: A Spring Boot application that schedules tasks by interacting with `task-service` and updating task statuses in MongoDB.

The services communicate with each other and use MongoDB as the database to store tasks.

## Prerequisites

Before running the project, ensure you have the following installed:
- Docker and Docker Compose
- An OpenAI API key (for `ai-service`)

## Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd meeting2tasks
   ```

2. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add your OpenAI API key:
     ```bash
     OPENAI_API_KEY=your-openai-api-key
     ```

3. **Build and run the services**:
   ```bash
   docker-compose up --build --remove-orphans
   ```
   This command builds and starts the following services:
   - `mongodb`: MongoDB database (port `27017`)
   - `ai-service`: FastAPI service (port `8000`)
   - `task-service`: Spring Boot service (port `8081`)
   - `scheduling-service`: Spring Boot service (port `8082`)

4. **Verify services are running**:
   ```bash
   docker ps
   ```
   Ensure all containers (`mongodb`, `ai-service`, `task-service`, `scheduling-service`) are running and in a "healthy" state.

## Usage

### Test `ai-service` (Port `8000`)
- **Access Swagger UI**:
  ```
  http://localhost:8000/docs
  ```
- **Call `/extract-tasks` API**:
  ```bash
  curl -X POST "http://localhost:8000/extract-tasks" \
  -H "Content-Type: application/json" \
  -d '{"user_input": "Discuss project timeline and assign tasks for next sprint", "project_id": 1}'
  ```
  **Expected Response**:
  ```json
  [
    {
      "id": "uuid-1234",
      "title": "Discuss project timeline",
      "description": "Discuss the timeline for the project",
      "status": "To Do",
      "assignedUserId": "user1",
      "meetingNoteId": "1"
    },
    {
      "id": "uuid-5678",
      "title": "Assign tasks for next sprint",
      "description": "Assign tasks for the next sprint",
      "status": "To Do",
      "assignedUserId": "user1",
      "meetingNoteId": "1"
    }
  ]
  ```

### Test `task-service` (Port `8081`)
- **Call `/api/tasks/meeting-notes` API**:
  ```bash
  curl -X POST "http://localhost:8081/api/tasks/meeting-notes" \
  -H "Content-Type: application/json" \
  -d '{"meetingNote": "Discuss project timeline and assign tasks for next sprint"}'
  ```
  **Expected Response**:
  ```json
  [
    {
      "id": "uuid-1234",
      "title": "Discuss project timeline",
      "description": "Discuss the timeline for the project",
      "status": "To Do",
      "assignedUserId": "user1",
      "meetingNoteId": "1"
    },
    {
      "id": "uuid-5678",
      "title": "Assign tasks for next sprint",
      "description": "Assign tasks for the next sprint",
      "status": "To Do",
      "assignedUserId": "user1",
      "meetingNoteId": "1"
    }
  ]
  ```
- **Check data in MongoDB**:
  ```bash
  docker exec -it meeting2tasks-mongodb-1 bash
  mongosh mongodb://localhost:27017/meeting2tasks
  ```
  ```javascript
  db.tasks.find().pretty()
  ```

### Test `scheduling-service` (Port `8082`)
- **Call `/api/schedule` API**:
  ```bash
  curl -X POST "http://localhost:8082/api/schedule" \
  -H "Content-Type: application/json" \
  -d '{"taskId": "uuid-1234", "scheduleDate": "2025-04-26T10:00:00Z"}'
  ```
  **Expected Response**:
  ```json
  {
    "taskId": "uuid-1234",
    "scheduleDate": "2025-04-26T10:00:00Z",
    "status": "Scheduled"
  }
  ```
- **Check updated data in MongoDB**:
  ```javascript
  db.tasks.find({ id: "uuid-1234" }).pretty()
  ```

## Troubleshooting

- **Container not running**:
  - Check logs for the failing service:
    ```bash
    docker logs meeting2tasks-<service-name>-1
    ```
    Replace `<service-name>` with `mongodb`, `ai-service`, `task-service`, or `scheduling-service`.
  - Ensure all dependencies are healthy (`mongodb` and `ai-service` must be healthy for `task-service` to start).
- **Port conflicts**:
  - If ports `27017`, `8000`, `8081`, or `8082` are already in use, stop the conflicting processes or change the port mappings in `docker-compose.yml`.
- **API errors**:
  - Ensure the request body is in the correct JSON format.
  - Verify the OpenAI API key in the `.env` file.

## Contributing

Feel free to submit issues or pull requests to improve the project. For major changes, please open an issue first to discuss the proposed changes.

## License

This project is licensed under the MIT License.