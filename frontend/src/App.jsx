import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    return (
        <BrowserRouter>
            {loggedIn ? (
                <Routes>
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/projects/:id"
                        element={<ProjectDetails />}
                    />
                </Routes>
            ) : (
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Login
                                onLogin={() => setLoggedIn(true)}
                            />
                        }
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />
                </Routes>
            )}
        </BrowserRouter>
    );
}

export default App;