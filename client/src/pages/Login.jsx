import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            login({ token: data.token, email: email });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="login-container">
            {/* Background Glow */}
            <div className="login-bg-glow" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="login-card"
            >
                <div className="login-card-highlight" />

                <div className="login-header">
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to control the Mower System</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-input-group">
                        <label className="login-label">Email Address</label>
                        <div className="login-input-wrapper">
                            <Mail size={18} className="login-icon" />
                            <input
                                type="email"
                                className="login-input"
                                placeholder="admin@mower.ai"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="login-input-group">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrapper">
                            <Lock size={18} className="login-icon" />
                            <input
                                type="password"
                                className="login-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="login-error"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="btn-login"
                    >
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <p className="login-footer">
                    Restricted Access • Authorized Personnel Only
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
