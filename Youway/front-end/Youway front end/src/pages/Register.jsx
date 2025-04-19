import registerImage from '../assets/register.png';

export default function Register() {
    return (
        <div className="flex h-screen ">
        {/* Left side - Image section */}
        <div className="hidden md:block md:w-1/2 bg-gray-100">
          <div className="h-full relative">
            <img 
              src={registerImage}
              alt="Student working on computer" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
  
        {/* Right side - Form section */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Your Account</h1>
            
            <form>
             
  
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="username">Name</label>
                <input 
                
                  className="border border-gray-300 p-3 w-full rounded-md"
                />
              </div>
  
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="border border-gray-300 p-3 w-full rounded-md"
                />
              </div>
  
              <div className="flex gap-4 mb-8">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                  <input 
                  
                    className="border border-gray-300 p-3 w-full rounded-md"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                  <input 
            
                    className="border border-gray-300 p-3 w-full rounded-md"
                  />
                </div>
              </div>
              <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
                        <select 
                            id="role" 
                            className={`border  p-2 w-full rounded`}
                           
                        >
                            <option value="Student">Student</option>
                            <option value="Mentor">Mentore</option>
                        </select>
                    </div>
  
              <button 
                type="submit" 
                className="bg-gray-900 text-white py-3 px-4 rounded-md w-full flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                Create Account 
              </button>
              
             
            </form>
          </div>
        </div>
      </div>
    );
}