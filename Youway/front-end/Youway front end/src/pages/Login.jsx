
export default function Login() {   

     


    return (
        <div className="flex flex-col justify-center items-center h-screen bg-red-100">
            <h1 className="text-3xl font-bold text-center text-blue-500 ">
                Login to Youway
                <br />
            </h1>
            <form className="flex flex-col gap-4 mt-4">
                <input type="email" placeholder="Email" className="p-2 border border-gray-300 rounded" required />
                <input type="password" placeholder="Password" className="p-2 border border-gray-300 rounded" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
}