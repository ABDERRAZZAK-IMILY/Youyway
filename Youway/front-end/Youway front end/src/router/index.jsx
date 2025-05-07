import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layouts/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CompleteProfile from "../pages/CompleteProfile";
import Inbox from "../pages/Inbox";

import DashboardLayout from "../components/Layout/DashboardLayout";

import SessionMange from "../pages/Mentor/SessionsMange";

import SessionCreate from "../pages/Student/CreateSessions";

import SessionApponiment from "../pages/Student/SessionApponiment";

import Mentor from "../pages/Student/Mentors";

import MentorDashboard from "../pages/Mentor/MentoreDashboard.jsx"
import StudentDashboard from "../pages/Student/StudentDashboard.jsx";

// Admin Components
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import SessionManagement from "../pages/Admin/SessionManagement";
import AdminLayout from "../components/Layout/AdminLayout";

import Profile from "../pages/Student/profile";
import EditProfile from "../pages/Student/EditProfile";
import MentorProfile from "../pages/Mentor/MentorProfile";
import MentorEditProfile from "../pages/Mentor/MentorEditProfile";
import ManageAvailability from "../pages/Mentor/ManageAvailability";
import MentorDetail from "../pages/Student/MentorDetail";

import Mentores from "../pages/Mentores.jsx";
export const router = createBrowserRouter([
    {
   
        element : <Layout />,
        children : [
            {
                path : "/",
                element : <Home />
            },
            {
                path : "/login",
                element : <Login />
            },
            {
                path : "/register",
                element : <Register />
            },
            {
                path : "/complete-profile",
                element : <CompleteProfile />
            }
            ,
            {
                path : "/mentors",
                element : <Mentores/>
            }
        ]
        
    },
    {

        
        element : <DashboardLayout/>,

        children :  [


            {
                path : '/sessionmange',
                element : <SessionMange/>
            },

            {
                path : '/book-session/:mentorId',

                element : <SessionCreate/>
            }

            , {
                path : '/student-dashboard',
                element : <StudentDashboard/>
            }
            , {
                path : '/mentordashboard',
                element : <MentorDashboard/>
            }
            , {
                path : '/studentdashboard', 
                element : <StudentDashboard/>
            }
            , {
                path : "/mentor-detail/:mentorId",
                element : <MentorDetail/>
            },
            {
                path : "/inbox",
                element : <Inbox/>
            }
        ,
            {
              path : "/sesssion" ,
        
              element : <SessionApponiment/>
        
            }
        
            ,
        
            {
                path : '/mentores' ,
        
                element : <Mentor/>
            }
        
            , {
                path : "/student-profile" ,
        
                element : <Profile/>
            }
            , {
        
                path : "/edit-profile",
                element : <EditProfile/>
            }
            , {
                path : "/mentor-profile",
                element : <MentorProfile/>
            }
            , {
                path : "/mentor-edit-profile",
                element : <MentorEditProfile/>
            }
            , {
                path : "/mentor-availability",
                element : <ManageAvailability/>
            }
        
            

        ]
    },


     // Admin Routes
     {
        path: "/",
        element: <AdminLayout />,
        children: [
            {
                path: "/admin-dashboard",
                element: <AdminDashboard />
            },
            {
                path: "/admin-users",
                element: <UserManagement />
            },
            {
                path: "admin-sessions",
                element: <SessionManagement />
            }
        ]
    },
  
]);