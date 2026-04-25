import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(formData.username, formData.password);
        if (result.success) {
            navigate('/jobs');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResetMessage('');
        try {
            await api.post('/auth/forgot-password/', { email: resetEmail });
            setResetMessage('Reset link sent to your email. Check your inbox.');
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetEmail('');
                setResetMessage('');
            }, 3000);
        } catch (error) {
            setResetMessage('Email not found. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">

                {!showForgotPassword ? (
                    <>
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right mb-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(true)}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p className="mt-4 text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        {resetMessage && (
                            <div className={`mb-4 p-3 rounded ${resetMessage.includes('sent') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {resetMessage}
                            </div>
                        )}
                        <form onSubmit={handleForgotPassword}>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetMessage('');
                                    setResetEmail('');
                                }}
                                className="w-full mt-3 text-gray-600 py-2 rounded hover:text-gray-800 transition"
                            >
                                Back to Login
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;