import { HomePage } from './pages/home/HomePage';
import { AuthPage } from './pages/auth/AuthPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { GoalPage } from './pages/goal/GoalPage';
import { GoalHistoryPage } from './pages/goal/GoalHistoryPage.jsx';
import { GoalDetailPage } from './pages/goal/GoalDetailPage.jsx';
import { PrivateRoute } from './components/PrivateRoute.jsx';
import { TransactionPage } from './pages/transaction/TransactionPage.jsx';
import { TransactionDetailPage } from './pages/transaction/TransactionDetailPage.jsx';
import { FinancialPage } from './pages/financial/FinancialPage.jsx';
import { IncomePage } from './pages/income/IncomePage.jsx';
import { IncomeDetailPage } from './pages/income/IncomeDetailPage.jsx';
import { ProfilePage } from './pages/profile/ProfilePage.jsx';

export const routes = [
    { path: '/*', element: <HomePage /> },
    { path: '/auth', element: <AuthPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/goal', element: <PrivateRoute><GoalPage /></PrivateRoute> },
    { path: '/goals', element: <PrivateRoute><GoalHistoryPage /></PrivateRoute> },
    { path: '/goals/:gid', element: <PrivateRoute><GoalDetailPage /></PrivateRoute> },
    { path: '/transactions', element: <PrivateRoute><TransactionPage /></PrivateRoute> },
    { path: '/transactions/:tid', element: <PrivateRoute><TransactionDetailPage /></PrivateRoute> },
    { path: '/financial', element: <PrivateRoute><FinancialPage /></PrivateRoute> },
    { path: '/income', element: <PrivateRoute><IncomePage /></PrivateRoute> },
    { path: '/income/:iid', element: <PrivateRoute><IncomeDetailPage /></PrivateRoute> },
    { path: '/profile', element: <PrivateRoute><ProfilePage /></PrivateRoute> },
];