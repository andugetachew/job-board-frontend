import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Profile form state
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        website: '',
        avatar: null,
    });

    // Password form state
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        email_notifications: true,
        push_notifications: false,
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profile_visible: true,
        show_email: false,
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                avatar: null,
            });
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    // Handle Profile Update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const data = new FormData();
        data.append('username', profileData.username);
        data.append('email', profileData.email);
        data.append('phone', profileData.phone);
        data.append('bio', profileData.bio);
        data.append('location', profileData.location);
        data.append('website', profileData.website);
        if (profileData.avatar) {
            data.append('avatar', profileData.avatar);
        }

        try {
            await api.put('/auth/profile/update/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    // Handle Password Change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    // Handle Forgot Password (opens modal or redirect)
    const handleForgotPassword = () => {
        const email = prompt('Enter your email address to reset password:');
        if (email) {
            api.post('/auth/forgot-password/', { email })
                .then(() => alert('Reset link sent to your email'))
                .catch(() => alert('Email not found'));
        }
    };

    // Handle Notification Settings
    const handleNotificationUpdate = async (key, value) => {
        setNotifications({ ...notifications, [key]: value });
        await api.post('/api/jobs/email-preferences/', { receive_email_notifications: value });
    };

    // Handle Avatar Change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({ ...profileData, avatar: file });
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
                    <h1 className="text-3xl font-bold">Account Settings</h1>
                    <p className="mt-1 opacity-90">Manage your profile and preferences</p>
                </div>

                {/* Tabs */}
                <div className="border-b flex flex-wrap">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 font-medium transition ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        👤 Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-6 py-3 font-medium transition ${activeTab === 'security' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🔒 Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`px-6 py-3 font-medium transition ${activeTab === 'notifications' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🔔 Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`px-6 py-3 font-medium transition ${activeTab === 'privacy' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        🔒 Privacy
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {message && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileUpdate}>
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-gray-200" />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Click camera to upload photo</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input type="text" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input type="text" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                    <input type="url" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea rows="3" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div>
                            {/* Change Password */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input type="password" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} className="w-full p-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input type="password" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} className="w-full p-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <input type="password" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} className="w-full p-2 border rounded" required />
                                    </div>
                                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                        Update Password
                                    </button>
                                </form>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-semibold mb-4">Forgot Password?</h3>
                                <p className="text-sm text-gray-600 mb-2">Reset your password if you've forgotten it.</p>
                                <button onClick={handleForgotPassword} className="text-blue-600 hover:underline text-sm">
                                    Send reset link to email →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b">
                                <div>
                                    <h3 className="font-medium">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive job alerts and application updates</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationUpdate('email_notifications', !notifications.email_notifications)}
                                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${notifications.email_notifications ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications.email_notifications ? 'translate-x-5' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <div>
                                    <h3 className="font-medium">Push Notifications</h3>
                                    <p className="text-sm text-gray-500">Get real-time updates in browser</p>
                                </div>
                                <button
                                    onClick={() => setNotifications({ ...notifications, push_notifications: !notifications.push_notifications })}
                                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${notifications.push_notifications ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications.push_notifications ? 'translate-x-5' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b">
                                <div>
                                    <h3 className="font-medium">Profile Visibility</h3>
                                    <p className="text-sm text-gray-500">Allow others to see your profile</p>
                                </div>
                                <button
                                    onClick={() => setPrivacy({ ...privacy, profile_visible: !privacy.profile_visible })}
                                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${privacy.profile_visible ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${privacy.profile_visible ? 'translate-x-5' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b">
                                <div>
                                    <h3 className="font-medium">Show Email</h3>
                                    <p className="text-sm text-gray-500">Display your email on your profile</p>
                                </div>
                                <button
                                    onClick={() => setPrivacy({ ...privacy, show_email: !privacy.show_email })}
                                    className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${privacy.show_email ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                >
                                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${privacy.show_email ? 'translate-x-5' : 'translate-x-0.5'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Logout Button */}
                    <div className="mt-8 pt-6 border-t">
                        <button onClick={logout} className="text-red-600 hover:text-red-700 font-medium">
                            Sign out of your account →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;