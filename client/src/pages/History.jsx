import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, CheckCircle, Clock, TrendingUp, Grid } from 'lucide-react';
import '../styles/History.css';

const History = () => {
    const [records, setRecords] = useState([]);
    const [trends, setTrends] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [recRes, trendRes] = await Promise.all([
                axios.get('/api/records'),
                axios.get('/api/records/trends')
            ]);
            setRecords(recRes.data);
            setTrends(trendRes.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    return (
        <div className="history-container">
            <h2 className="page-title">Operational Trends</h2>

            {/* Analytics Cards */}
            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="analytics-header">
                        <div className="icon-box-blue"><TrendingUp size={20} /></div>
                        <span className="analytics-label">TOTAL SESSIONS</span>
                    </div>
                    <div className="analytics-value">
                        {trends?.totalSessions || 0}
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-header">
                        <div className="icon-box-grass"><Clock size={20} /></div>
                        <span className="analytics-label">TOTAL RUNTIME</span>
                    </div>
                    <div className="analytics-value">
                        {trends?.totalRuntime || 0} <span className="analytics-unit">min</span>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="analytics-header">
                        <div className="icon-box-purple"><Grid size={20} /></div>
                        <span className="analytics-label">MOST FREQUENT</span>
                    </div>
                    <div className="analytics-value-small">
                        {trends?.favoritePattern || 'N/A'}
                    </div>
                </div>
            </div>

            <h3 className="section-subtitle">Recent Operations</h3>
            <div className="table-container">
                <table className="history-table">
                    <thead className="table-head">
                        <tr>
                            <th className="th-cell">Date</th>
                            <th className="th-cell">Type</th>
                            <th className="th-cell">Pattern</th>
                            <th className="th-cell">Runtime</th>
                            <th className="th-cell text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {records.map((r) => (
                            <tr key={r._id} className="table-row">
                                <td className="td-date">
                                    {new Date(r.timestamp).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className="td-type-badge">
                                        {r.type}
                                    </span>
                                </td>
                                <td className="td-value">{r.value}</td>
                                <td className="td-duration">{r.duration}m</td>
                                <td className="p-4 text-right">
                                    <span className={`status-badge ${r.status === 'Completed'
                                            ? 'status-completed'
                                            : 'status-failed'
                                        }`}>
                                        {r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-500">No records found. Start a simulation!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
