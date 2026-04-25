import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await api.get(`/jobs/${id}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Failed to fetch job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (!resume) {
            setMessage({ type: 'error', text: 'Please select a resume file' });
            return;
        }

        setApplying(true);
        const formData = new FormData();
        formData.append('cover_letter', coverLetter);
        formData.append('resume', resume);

        try {
            const response = await api.post(`/jobs/${id}/apply/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Application success:', response.data);
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            setShowApplyForm(false);
            setCoverLetter('');
            setResume(null);
            fetchJob(); // Refresh to update application count
        } catch (error) {
            console.error('Apply error:', error.response?.data);
            const errorMsg = error.response?.data?.resume?.[0] || error.response?.data?.message || 'Failed to apply';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!job) return <div className="text-center py-12">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.title}</h1>
                <p className="text-gray-600 mb-2 text-lg">{job.employer_name}</p>
                <div className="mb-6">
                    <p className="text-gray-600">📍 {job.location} {job.is_remote && '(Remote)'}</p>
                    <p className="text-green-600 font-bold text-xl">
                        ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                    </p>
                    <p className="text-gray-500">Employment Type: {job.employment_type}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-700">{job.description}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                    <p className="text-gray-700">{job.requirements}</p>
                </div>

                {message && (
                    <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {user && user.role === 'candidate' && (
                    !showApplyForm ? (
                        <button
                            onClick={() => setShowApplyForm(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Apply Now
                        </button>
                    ) : (
                        <form onSubmit={handleApply}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Cover Letter</label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    rows="4"
                                    placeholder="Why are you a good fit for this position?"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Resume (PDF, DOC, DOCX, or TXT) *</label>
                                <input
                                    type="file"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    accept=".pdf,.doc,.docx,.txt"
                                    required
                                />
                                {resume && <p className="text-sm text-green-600 mt-1">Selected: {resume.name}</p>}
                            </div>
                            <div className="space-x-2">
                                <button
                                    type="submit"
                                    disabled={applying}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowApplyForm(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )
                )}

                {(!user || user.role !== 'candidate') && (
                    <p className="text-gray-500">Please login as a candidate to apply for this job.</p>
                )}
            </div>
        </div>
    );
};

export default JobDetail;