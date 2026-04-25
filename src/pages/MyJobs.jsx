import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await api.get('/jobs/');
            setJobs(response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${id}/`);
                fetchMyJobs();
            } catch (error) {
                console.error('Failed to delete job:', error);
                alert('Failed to delete job');
            }
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Job Postings</h1>
                <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">You haven't posted any jobs yet.</p>
                    <Link to="/post-job" className="text-blue-600 hover:underline mt-2 inline-block">
                        Post your first job
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <Link to={`/jobs/${job.id}`}>
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h2>
                                    </Link>
                                    <p className="text-gray-600 mb-2">
                                        📍 {job.location} {job.is_remote && '(Remote)'}
                                    </p>
                                    {job.salary_min && job.salary_max && (
                                        <p className="text-green-600 font-semibold">
                                            💰 ${job.salary_min} - ${job.salary_max}
                                        </p>
                                    )}
                                    <p className="text-gray-500 text-sm mt-2">
                                        Applications: {job.applications_count} | Views: {job.views_count}
                                    </p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => navigate('/employer-applications')}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                    >
                                        View Applications
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyJobs;