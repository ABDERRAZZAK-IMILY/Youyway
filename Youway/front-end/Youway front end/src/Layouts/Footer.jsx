export default function Footer() {

    return (
        <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto text-center">
            <p className="text-sm">© 2023 YOUway. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            </div>
        </div>
        </footer>
    );
    }