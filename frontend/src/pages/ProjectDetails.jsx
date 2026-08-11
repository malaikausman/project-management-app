import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ProjectDetails = () => {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getProjectDetails = async () => {
            try {
                const projectResponse = await api.get(`/projects/${id}`);
                const tasksResponse = await api.get("/tasks");

                setProject(projectResponse.data.project);

                const projectTasks = tasksResponse.data.tasks.filter(
                    (task) => task.project?._id === id
                );

                setTasks(projectTasks);
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                        "Failed to load project details"
                );
            }
        };

        getProjectDetails();
    }, [id]);

    if (message) {
        return <p>{message}</p>;
    }

    if (!project) {
        return <p>Loading project...</p>;
    }

    return (
        <div>
            <h1>{project.name}</h1>

            <p>{project.description}</p>

            <hr />

            <h2>Project Tasks</h2>

            {tasks.length === 0 ? (
                <p>No tasks found for this project.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task._id}>
                        <h3>{task.title}</h3>

                        <p>{task.description}</p>

                        <p>Status: {task.status}</p>

                        <p>Priority: {task.priority}</p>

                        <p>
                            Due Date:{" "}
                            {task.dueDate
                                ? new Date(
                                      task.dueDate
                                  ).toLocaleDateString()
                                : "No due date"}
                        </p>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default ProjectDetails;