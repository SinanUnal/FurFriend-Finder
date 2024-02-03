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
    path: "/admin-dashboard",
    element: <AdminDashboard/>,
  },
  {
    path: "/adopter-dashboard",
    element: <AdopterDashboard/>,
  },
  {
    path: "/giver-dashboard",
    element: <GiverDashboard/>,
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
     <RouterProvider router={router} />
  </React.StrictMode>
);

