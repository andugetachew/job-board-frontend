import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                    JobBoard
                </Link>

                <div className="flex space-x-4 items-center">
                    <Link to="/jobs" className="text-gray-700 hover:text-blue-600">
                        Browse Jobs
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'candidate' && (
                                <>
                                    <Link to="/my-applications" className="text-gray-700 hover:text-blue-600">
                                        My Applications
                                    </Link>
                                    <Link to="/saved-jobs" className="text-gray-700 hover:text-blue-600">
                                        Saved Jobs
                                    </Link>
                                </>
                            )}

                            {user?.role === 'employer' && (
                                <>
                                    <Link to="/post-job" className="text-gray-700 hover:text-blue-600">
                                        Post Job
                                    </Link>
                                    <Link to="/my-jobs" className="text-gray-700 hover:text-blue-600">
                                        My Jobs
                                    </Link>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                                    Admin
                                </Link>
                            )}

                            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;