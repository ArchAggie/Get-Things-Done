# Get Things Done

This To-Do List Web Application is designed to help you stay organized and on track with your daily tasks.

With this app, you can easily add tasks, set their priority and completion status, edit or delete tasks as needed, and sort tasks by different criteria.

![Screenshot of Get Things Done Application](getThingsDone.png)

## Getting Started

### Prerequisites

- Node.js (v17.5 or later)
- Git

### Installation

1. Open your favorite terminal and copy the following commands step by step:

2. Clone the repository:

`git clone git@github.com:BMP1ZK1_thdgit/Get-Things-Done.git`

3. Change directory into the project folder:

`cd Get-Things-Done`

4. Install the necessary dependencies:

`npm install`

### Running the server

To start the server, run the following commands:
`npm run start-server`

This will start the JSON server and make it available at http://localhost:3000, as well as start a node http server at http://localhost:8000

### Interacting with the server

Navigate to `http://localhost:8000` to interact with the application

You can also interact with the server using RESTful API calls
The JSON server will automatically serve data from the db.json file in the project directory.

- For example, to retrieve all the data from the server, use the following URL in your browser:

`http://localhost:3000/tasks`

- To retrieve a specific resource, use its ID as follows:

`http://localhost:3000/tasks/1`

## Built With

- Node.js
- json-server
- concurrently

## Project Resources

- [Trello Board](https://trello.com/invite/b/OZSPTDrX/ATTI230c93c8bf1e69e820e7fa7265dd2287C3C1CEEE/jw-bp-todo-app)

## Database Schema

![Structure Diagram](tasksDB.png)

- **id**: a unique identifier for each task
- **title**: the title or name of the task
- **description**: a brief description or details about the task
- **currentPriority**: a field indicating the priority level of the task, which can be "high", "medium", "low", or "complete"
- **previousPriority**: a field indicating the previous priority level of the task, intended for use with completion logic
