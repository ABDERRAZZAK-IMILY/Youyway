import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layouts/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CompleteProfile from "../pages/CompleteProfile";
import Inbox from "../pages/Inbox";

import DashboardLayout from "../components/Layout/DashboardLayout";

import SessionMange from "../pages/Mentor/SessionsMange";

import SessionCreate from "../pages/Mentor/CreateSessions";

import SessionApponiment from "../pages/Student/SessionApponiment";

import Mentor from "../pages/Mentors";

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
                path : '/book-session/:id',

                element : <SessionCreate/>
            }

        ]
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


  
]);