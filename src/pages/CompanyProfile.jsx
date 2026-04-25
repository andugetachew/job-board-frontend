import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CompanyProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanyAndJobs();
    }, [id]);

    const fetchCompanyAndJobs = async () => {
        try {
            const [companyRes, jobsRes] = await Promise.all([
                api.get(`/accounts/companies/${id}/`),
                api.get(`/jobs/?employer_id=${id}`)
            ]);
            setCompany(companyRes.data);
            setJobs(jobsRes.data.results || []);
        } catch (error) {
            console.error('Failed to fetch company:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!company) return <div className="text-center py-12">Company not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <div className="flex items-start gap-6">
                    {company.logo && (
                        <img src={company.logo} alt={company.name} className="w-24 h-24 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{company.name}</h1>
                        {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {company.website}
                            </a>
                        )}
                        <div className="flex gap-4 mt-2 text-gray-600">
                            {company.founded_year && <span>🏢 Founded: {company.founded_year}</span>}
                            {company.employee_count && <span>👥 {company.employee_count} employees</span>}
                        </div>
                    </div>
                    {user?.id === company.employer && (
                        <Link to="/edit-company" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Edit Profile
                        </Link>
                    )}
                </div>
                {company.description && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">About</h2>
                        <p className="text-gray-700">{company.description}</p>
                    </div>
                )}
                {company.address && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Location</h2>
                        <p className="text-gray-700">{company.address}</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Open Positions ({jobs.length})</h2>
                {jobs.length === 0 ? (
                    <p className="text-gray-500">No open positions at this time.</p>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <Link key={job.id} to={`/jobs/${job.id}`} className="block p-4 border rounded-lg hover:bg-gray-50">
                                <h3 className="font-semibold text-blue-600">{job.title}</h3>
                                <p className="text-gray-600 text-sm">{job.location} {job.is_remote && '(Remote)'}</p>
                                {job.salary_min && job.salary_max && (
                                    <p className="text-green-600 text-sm">${job.salary_min} - ${job.salary_max}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;