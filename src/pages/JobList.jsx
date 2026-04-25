import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JobList = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobs, setSavedJobs] = useState([]);
    const [savedJobsData, setSavedJobsData] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        is_remote: false,
        employment_type: '',
        salary_min: '',
        salary_max: '',
    });

    useEffect(() => {
        fetchJobs();
        if (user && user.role === 'candidate') {
            fetchSavedJobs();
        }
    }, [filters, user]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.location) params.append('location', filters.location);
            if (filters.is_remote) params.append('is_remote', 'true');
            if (filters.employment_type) params.append('employment_type', filters.employment_type);
            if (filters.salary_min) params.append('salary_min_gte', filters.salary_min);
            if (filters.salary_max) params.append('salary_max_lte', filters.salary_max);

            const response = await api.get(`/jobs/?${params.toString()}`);
            setJobs(response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedJobs = async () => {
        try {
            const response = await api.get('/jobs/saved/');
            setSavedJobsData(response.data.results || []);
            const savedIds = (response.data.results || []).map(item => item.job.id);
            setSavedJobs(savedIds);
        } catch (error) {
            console.error('Failed to fetch saved jobs:', error);
        }
    };

    const saveJob = async (jobId) => {
        try {
            await api.post('/jobs/saved/', { job_id: jobId });
            setSavedJobs([...savedJobs, jobId]);
            fetchSavedJobs();
        } catch (error) {
            console.error('Failed to save job:', error);
            alert('Failed to save job');
        }
    };

    const unsaveJob = async (jobId) => {
        const savedItem = savedJobsData.find(item => item.job.id === jobId);
        if (savedItem) {
            try {
                await api.delete(`/jobs/saved/${savedItem.id}/`);
                setSavedJobs(savedJobs.filter(id => id !== jobId));
                fetchSavedJobs();
            } catch (error) {
                console.error('Failed to unsave job:', error);
                alert('Failed to unsave job');
            }
        }
    };

    const formatSalary = (min, max) => {
        if (min && max) return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
        if (min) return `From $${Number(min).toLocaleString()}`;
        if (max) return `Up to $${Number(max).toLocaleString()}`;
        return 'Salary not specified';
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            location: '',
            is_remote: false,
            employment_type: '',
            salary_min: '',
            salary_max: '',
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter Jobs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Job title or keyword"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={filters.employment_type}
                        onChange={(e) => setFilters({ ...filters, employment_type: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="full">Full-time</option>
                        <option value="part">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                    </select>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.is_remote}
                            onChange={(e) => setFilters({ ...filters, is_remote: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Remote only</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <input
                        type="number"
                        placeholder="Min Salary"
                        value={filters.salary_min}
                        onChange={(e) => setFilters({ ...filters, salary_min: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Max Salary"
                        value={filters.salary_max}
                        onChange={(e) => setFilters({ ...filters, salary_max: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* Job Listings */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-500">Loading jobs...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                    <button onClick={clearFilters} className="text-blue-600 hover:underline mt-2">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <Link to={`/jobs/${job.id}`} className="hover:underline">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h2>
                                    </Link>
                                    <Link to={`/company/${job.employer_id}`} className="text-gray-600 hover:text-blue-600 mb-2 inline-block">
                                        {job.employer_name}
                                    </Link>
                                    <p className="text-gray-600 mb-2">
                                        📍 {job.location} {job.is_remote && '(Remote)'}
                                    </p>
                                    <p className="text-green-600 font-semibold mb-3">
                                        {formatSalary(job.salary_min, job.salary_max)}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        📅 Posted: {new Date(job.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {user && user.role === 'candidate' && (
                                        savedJobs.includes(job.id) ? (
                                            <button
                                                onClick={() => unsaveJob(job.id)}
                                                className="text-yellow-500 hover:text-yellow-600 text-2xl"
                                                title="Saved"
                                            >
                                                ★
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => saveJob(job.id)}
                                                className="text-gray-400 hover:text-yellow-500 text-2xl"
                                                title="Save Job"
                                            >
                                                ☆
                                            </button>
                                        )
                                    )}
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobList;