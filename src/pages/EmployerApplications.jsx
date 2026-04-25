import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/jobs/applications/employer/');
            console.log('API Response:', response.data);
            // The data is in response.data (not response.data.results for this endpoint)
            const apps = response.data.results || response.data;
            setApplications(Array.isArray(apps) ? apps : []);
            console.log('Set applications:', apps);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (appId, newStatus) => {
        try {
            await api.patch(`/jobs/applications/${appId}/status/`, { status: newStatus });
            fetchApplications();
        } catch (error) {
            console.error('Failed to update status:', error);
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
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Applications</h1>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No applications received yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{app.job_title}</h2>
                            <p className="text-gray-600 mb-1"><strong>Candidate:</strong> {app.candidate_name}</p>
                            <p className="text-gray-600 mb-1"><strong>Email:</strong> {app.candidate_email}</p>
                            <p className="text-gray-600 mb-3"><strong>Cover Letter:</strong> {app.cover_letter || 'No cover letter'}</p>

                            {app.resume && (
                                <a
                                    href={app.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm block mb-3"
                                >
                                    📄 View Resume
                                </a>
                            )}

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold">Status:</span>
                                <select
                                    value={app.status}
                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(app.status)} border cursor-pointer`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="interview">Interview</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="hired">Hired</option>
                                </select>
                            </div>

                            <p className="text-gray-400 text-xs mt-3">
                                Applied: {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployerApplications;