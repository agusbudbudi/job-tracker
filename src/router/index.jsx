import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from '../App';
import JobTracking from '../pages/JobTracking';
import Knowledge from '../pages/Knowledge';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/job-tracking" replace />,
      },
      {
        path: '/job-tracking',
        element: <JobTracking />,
      },
      {
        path: '/knowledge',
        element: <Knowledge />,
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
