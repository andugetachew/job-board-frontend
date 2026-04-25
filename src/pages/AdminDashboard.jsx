import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, jobsRes, usersRes] = await Promise.all([
                api.get('/admin/stats/'),
                api.get('/admin/recent-jobs/'),
                api.get('/admin/recent-users/')
            ]);
            setStats(statsRes.data);
            setRecentJobs(jobsRes.data);
            setRecentUsers(usersRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteJob = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/admin/jobs/${id}/`);
                fetchDashboardData();
            } catch (error) {
                console.error('Failed to delete job:', error);
            }
        }
    };

    const toggleUserStatus = async (id, isActive) => {
        try {
            await api.patch(`/admin/users/${id}/`, { is_active: !isActive });
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to toggle user status:', error);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <div className="text-gray-600">Total Users</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-3xl font-bold text-green-600">{stats.totalJobs}</div>
                    <div className="text-gray-600">Total Jobs</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-3xl font-bold text-purple-600">{stats.totalApplications}</div>
                    <div className="text-gray-600">Total Applications</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</div>
                    <div className="text-gray-600">Pending Review</div>
                </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Jobs</h2>
                <div className="space-y-3">
                    {recentJobs.map((job) => (
                        <div key={job.id} className="flex justify-between items-center p-3 border rounded">
                            <div>
                                <h3 className="font-semibold">{job.title}</h3>
                                <p className="text-gray-600 text-sm">{job.employer_name} • {job.location}</p>
                            </div>
                            <button onClick={() => deleteJob(job.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
                <div className="space-y-3">
                    {recentUsers.map((user) => (
                        <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                            <div>
                                <h3 className="font-semibold">{user.username}</h3>
                                <p className="text-gray-600 text-sm">{user.email} • {user.role}</p>
                            </div>
                            <button
                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                                className={`px-3 py-1 rounded text-sm ${user.is_active ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                            >
                                {user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;