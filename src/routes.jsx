import { HomePage } from './pages/home/HomePage';
import { AuthPage } from './pages/auth/AuthPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { GoalPage } from './pages/goal/GoalPage';
import { PrivateRoute } from './components/PrivateRoute.jsx';

export const routes = [
    { path: '/*', element: <HomePage /> },
    { path: '/auth', element: <AuthPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/goal', element: <PrivateRoute><GoalPage /></PrivateRoute> },
];