import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './firebase';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import AdminDashboard from './components/dashboards/AdminDashboard';
import AdopterDashboard from './components/dashboards/AdopterDashboard';
import GiverDashboard from './components/dashboards/GiverDashboard';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import FavoriteList from './components/adopter/FavoriteList';
import ApplicationList from './components/adopter/ApplicationList';
import AnimalSubmissionFormPage from './components/giver/AnimalSubmissionFormPage';
import CurrentListingsPage from './components/giver/CurrentListingsPage';
import AdoptionApplicationsPage from './components/giver/AdoptionApplicationsPage';
import AdopterApplicationsPage from './components/adopter/AdopterApplicationsPage';
import { AuthProvider } from './components/Auth/Authcontext';
import AdoptionApplicationForm from './components/adopter/AdoptionApplicationForm';
import UserProfile from './components/UserProfile/UserProfile';
import PublicProfile from './components/UserProfile/PublicProfile';
import AdoptedAnimals from './components/adopter/AdoptedAnimal';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserManagement from './components/Users/UserManagement';
import Reports from './components/Reports/Reports';
import PendingApprovals from './components/Users/PendingApprovals';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/user/profile/:userId",
    element: <UserProfile />,
  },
  {
    path: "/user/public-profile/:userId",
    element: <PublicProfile />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard/>,
  },
  {
    path: "/admin-dashboard/user-management",
    element: <UserManagement/>,
  },
  {
    path: "/admin-dashboard/reports",
    element: <Reports/>,
  },
  {
    path: "/admin-dashboard/pending-approvals",
    element: <PendingApprovals/>,
  },
  {
    path: "/giver-dashboard",
    element: <GiverDashboard/>
  },
  {
    path: "/giver-dashboard/submission-form",
    element: <AnimalSubmissionFormPage />,
  },
  {
    path: "/giver-dashboard/current-listings/:userId",
    element: <CurrentListingsPage />,
  },
  {
    path: "/giver-dashboard/applications/:userId",
    element: <AdoptionApplicationsPage />,
  },
  {
    path: "/adopter-dashboard",
    element: <AdopterDashboard/>,
  },
  {
    path: "/adopter-dashboard/adopted-animals/:userId",
    element: <AdoptedAnimals />,
  },
  {
    path: "/adoption-application/:submissionId",
    element: <AdoptionApplicationForm />,
  },
  {
    path: "/adopter-dashboard/your-applications",
    element: <AdopterApplicationsPage/>,
  },
  {
    path: "/adopter-dashboard/favorites",
    element: <FavoriteList/>,
  },
  {
    path: "/applications",
    element: <ApplicationList />,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/about",
    element: <About/>,
  },
  {
    path: "/contact",
    element: <Contact/>,
  },
  
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <AuthProvider>
       <RouterProvider router={router} />
     </AuthProvider>
  </React.StrictMode>
);

