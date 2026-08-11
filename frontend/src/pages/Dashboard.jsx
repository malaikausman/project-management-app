import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import "./Dashboard.css";
const getErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};


const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [title, setTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [project, setProject] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [message, setMessage] = useState("");

  const getProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.projects);
      setMessage("");
    } catch (error) {
      setMessage(
        getErrorMessage(error, "Failed to load projects")
      );
    }
  };

  const getTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load tasks"
      );
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        getProjects(),
        getTasks(),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Project name is required");
      return;
    }

    try {
      await api.post("/projects", {
        name,
        description,
      });

      setName("");
      setDescription("");
      setMessage("Project created successfully!");

      getProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create project"
      );
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Task title is required");
      return;
    }

    try {
      await api.post("/tasks", {
        title,
        description: taskDescription,
        dueDate,
        status,
        priority,
        project,
      });

      setTitle("");
      setTaskDescription("");
      setDueDate("");
      setStatus("To Do");
      setPriority("Medium");
      setProject("");

      setMessage("Task created successfully!");

      getTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create task"
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);

      setMessage("Task deleted successfully!");
      getTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        title: "Updated Login Task",
        description: "This task was updated from React.",
        status: "In Progress",
        priority: "High",
      });

      setMessage("Task updated successfully!");
      getTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update task"
      );
    }
  };

  const handleUpdateProject = async (projectId) => {
    try {
      await api.put(`/projects/${projectId}`, {
        name: "Updated React Project",
        description: "This project was updated from React.",
      });

      setMessage("Project updated successfully!");
      getProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update project"
      );
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}`);
      setMessage("Project deleted successfully!");

      getProjects();
      getTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      statusFilter === "All"
        ? true
        : task.status === statusFilter
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter
    );
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Navbar
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      />

      <main className="dashboard-content">
        <h1>Dashboard</h1>

        <Toast message={message} />


        <section className="dashboard-section">
          <h2>Create Project</h2>

          <form
            className="dashboard-form"
            onSubmit={handleCreateProject}
          >
            <div>
              <label>Project Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                rows="3"
              />
            </div>

            <button type="submit">
              Create Project
            </button>
          </form>
        </section>


        <section className="dashboard-section">
          <h2>My Projects</h2>

          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <div className="dashboard-grid">
              {projects.map((projectItem) => (
                <div
                  className="dashboard-card"
                  key={projectItem._id}
                >
                  <h3>
                    <Link to={`/projects/${projectItem._id}`}>
                      {projectItem.name}
                    </Link>
                  </h3>

                  <p>{projectItem.description}</p>

                  <button
                    onClick={() =>
                      handleUpdateProject(projectItem._id)
                    }
                  >
                    Update
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(projectItem._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>


        <section className="dashboard-section">
          <h2>Create Task</h2>

          <form
            className="dashboard-form"
            onSubmit={handleCreateTask}
          >
            <div>
              <label>Task Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label>Task Description</label>

              <textarea
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(e.target.value)
                }
                placeholder="Enter task description"
                rows="3"
              />
            </div>

            <div>
              <label>Due Date</label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label>Priority</label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label>Project</label>

              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                required
              >
                <option value="">
                  Select a project
                </option>

                {projects.map((projectItem) => (
                  <option
                    key={projectItem._id}
                    value={projectItem._id}
                  >
                    {projectItem.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">
              Create Task
            </button>
          </form>
        </section>


        <section className="dashboard-section">
          <h2>My Tasks</h2>

          <div className="task-filters">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Done">Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="dashboard-grid">
              {filteredTasks.map((task) => (
                <div
                  className="dashboard-card"
                  key={task._id}
                >
                  <h3>{task.title}</h3>

                  <p>{task.description}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {task.status}
                  </p>

                  <p>
                    <strong>Priority:</strong>{" "}
                    {task.priority}
                  </p>

                  <p>
                    <strong>Due Date:</strong>{" "}
                    {task.dueDate
                      ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                      : "No due date"}
                  </p>

                  <p>
                    <strong>Project:</strong>{" "}
                    {task.project?.name || "No project"}
                  </p>

                  <button
                    onClick={() =>
                      handleUpdateTask(task._id)
                    }
                  >
                    Update
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTask(task._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;