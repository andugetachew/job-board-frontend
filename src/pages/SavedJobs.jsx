import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const response = await api.get('/jobs/saved/');
            setSavedJobs(response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch saved jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeSavedJob = async (id) => {
        try {
            await api.delete(`/jobs/saved/${id}/`);
            fetchSavedJobs();
        } catch (error) {
            console.error('Failed to remove saved job:', error);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Jobs</h1>
            {savedJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">You haven't saved any jobs yet.</p>
                    <Link to="/jobs" className="text-blue-600 hover:underline mt-2 inline-block">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedJobs.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <Link to={`/jobs/${item.job.id}`} className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600">
                                        {item.job.title}
                                    </h2>
                                    <p className="text-gray-600">{item.job.employer_name}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        📍 {item.job.location} {item.job.is_remote && '(Remote)'}
                                    </p>
                                    {item.job.salary_min && item.job.salary_max && (
                                        <p className="text-green-600 font-semibold mt-1">
                                            ${item.job.salary_min} - ${item.job.salary_max}
                                        </p>
                                    )}
                                </Link>
                                <button
                                    onClick={() => removeSavedJob(item.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                            <p className="text-gray-400 text-xs mt-2">Saved: {new Date(item.saved_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedJobs;