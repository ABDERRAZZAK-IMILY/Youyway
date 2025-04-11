import { createBrowserRouter } from "react-router-dom";


export const router = createBroswerRouter([
    {
   
        element : <Layout />,
        children : [
            {
                path : "/",
                element : <Home />
            },
            {
                path : "/about",
                element : <About />
            },
            {
                path : "/contact",
                element : <Contact />
            },
            {
                path : "/login",
                element : <Login />
            },
            {
                path : "/register",
                element : <Register />
            }
        ]


        
    }
]);