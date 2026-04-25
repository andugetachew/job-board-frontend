import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        is_remote: false,
        employment_type: 'full',
        salary_min: '',
        salary_max: '',
        expires_at: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const dataToSend = {
            ...formData,
            salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
            salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        };

        try {
            const response = await api.post('/jobs/', dataToSend);
            console.log('Success:', response.data);
            navigate('/my-jobs');
        } catch (error) {
            console.error('Error:', error.response?.data);
            setError('Failed to create job. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6">Post a New Job</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2">Requirements *</label>
                        <textarea
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full p-2 border rounded"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2">Location *</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_remote}
                                onChange={(e) => setFormData({ ...formData, is_remote: e.target.checked })}
                                className="mr-2"
                            />
                            Remote Position
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2">Employment Type</label>
                        <select
                            value={formData.employment_type}
                            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="full">Full-time</option>
                            <option value="part">Part-time</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-bold mb-2">Min Salary</label>
                            <input
                                type="text"
                                value={formData.salary_min}
                                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-2">Max Salary</label>
                            <input
                                type="text"
                                value={formData.salary_max}
                                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="80000"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block font-bold mb-2">Expiration Date</label>
                        <input
                            type="datetime-local"
                            value={formData.expires_at}
                            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;