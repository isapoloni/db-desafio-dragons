import { Routes, Route, Navigate } from "react-router";
import { Login } from "../pages/Login/Login";
import { DragonsList } from "../pages/DragonsList/DragonsList";
import { PrivateRoute } from "../components/PrivateRoute/PrivateRoute";
import { DragonForm } from "../pages/DragonForm/DragonForm";
import { DragonProvider } from "../context/DragonContext";
import { DragonDetails } from "../pages/DragonDetails/DragonDetails";
import { NotFound } from "../pages/NotFound/NotFound";


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/dragons"
                element={
                    <PrivateRoute>
                        <DragonsList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/dragons/new"
                element={
                    <PrivateRoute>
                        <DragonForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/dragons/:id"
                element={
                    <PrivateRoute>
                        <DragonProvider>
                            <DragonDetails />
                        </DragonProvider>
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
