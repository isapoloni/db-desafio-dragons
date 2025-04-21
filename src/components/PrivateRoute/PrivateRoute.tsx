import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router';
import { type ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; 

    return user ? (
        <>{children}</>
    ) : (
        <Navigate
            to="/login"
            replace
            state={{ from: location, message: 'Você deve estar logado primeiro.' }}
        />
    );
}