import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/jobs/applications/my/');
            setApplications(response.data.results);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            interview: 'bg-purple-100 text-purple-800',
            rejected: 'bg-red-100 text-red-800',
            hired: 'bg-green-100 text-green-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>
            {applications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-lg shadow-md p-6">
                            <Link to={`/jobs/${app.job}`}>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">{app.job_title}</h2>
                            </Link>
                            <p className="text-gray-600 mb-3">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                            <div className="mb-3">
                                <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(app.status)}`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>
                            {app.cover_letter && (
                                <div className="mt-3 p-3 bg-gray-50 rounded">
                                    <p className="text-gray-700 text-sm">{app.cover_letter}</p>
                                </div>
                            )}
                            {app.resume && (
                                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                    View Resume
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;