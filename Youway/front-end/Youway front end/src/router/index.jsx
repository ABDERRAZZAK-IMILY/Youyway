import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layouts/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CompleteProfile from "../pages/CompleteProfile";
import Inbox from "../pages/Inbox";

import DashboardLayout from "../components/Layout/DashboardLayout";


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

        path : '/dash',
        element : <DashboardLayout/>
    },

    {
        path : "/inbox",
        element : <Inbox/>
    }
]);