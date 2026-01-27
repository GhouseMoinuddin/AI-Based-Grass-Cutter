import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Map, Scissors, Shield } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
    const features = [
        { icon: Map, title: "Path Planning", desc: "Algorithmic generation of optimal cutting routes." },
        { icon: Cpu, title: "AI Core", desc: "Intelligent obstacle avoidance and pattern recognition." },
        { icon: Scissors, title: "Precision Cut", desc: "Support for geometric shapes and typography." }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-glow" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="badge"
                >
                    Technical Preview
                </motion.div>

                <h1 className="hero-title">
                    Autonomous <span className="hero-title-highlight">Grass Cutting</span> System
                </h1>

                <p className="hero-desc">
                    A smart simulation interface for controlling AI-driven lawn mowers.
                    Capable of executing complex patterns, shapes, and alphabets purely through autonomous algorithms.
                </p>

                <div className="hero-actions">
                    <Link
                        to="/simulator"
                        className="btn-primary-large"
                    >
                        Launch Simulator <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/monitor"
                        className="btn-secondary-large"
                    >
                        Live Monitor
                    </Link>
                </div>
            </section>

            {/* Workflow Visualization */}
            <section className="features-grid">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="feature-card"
                    >
                        <div className="feature-icon-box">
                            <f.icon size={24} />
                        </div>
                        <h3 className="feature-title">{f.title}</h3>
                        <p className="feature-desc">{f.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* How It Works */}
            <h2 className="section-title">How It Works</h2>
            <div className="steps-grid">
                {[
                    { title: "Design", desc: "Select a shape or type text in the Simulator." },
                    { title: "Preview", desc: "Visualize the cutting path on the virtual map." },
                    { title: "Deploy", desc: "Send commands to the autonomous mower." }
                ].map((step, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="step-card"
                    >
                        <div className="step-number">{i + 1}</div>
                        <h3 className="text-xl font-bold text-white mb-2 mt-4">{step.title}</h3>
                        <p className="text-slate-400">{step.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Technical Specs */}
            <h2 className="section-title">Technical Specifications</h2>
            <div className="specs-container">
                <div className="specs-row">
                    <div className="specs-label">Navigation System</div>
                    <div className="specs-value">RTK-GPS + Lidar Fusion</div>
                </div>
                <div className="specs-row">
                    <div className="specs-label">Cutting Width</div>
                    <div className="specs-value">22 cm</div>
                </div>
                <div className="specs-row">
                    <div className="specs-label">Battery Autonomy</div>
                    <div className="specs-value">120 Minutes</div>
                </div>
                <div className="specs-row">
                    <div className="specs-label">Wireless Range</div>
                    <div className="specs-value">500m (LoRaWAN)</div>
                </div>
            </div>

            {/* Safety First */}
            <section className="py-24 bg-skin-card border-y border-skin-border">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="section-title text-left mb-6">{/* Safety First Design */}Safety First Design</h2>
                        <p className="text-skin-muted text-lg mb-8">
                            Our autonomous mowers are built with multi-layer safety protocols to protect pets, children, and property.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Instant blade stop upon lift detection",
                                "Ultrasonic obstacle avoidance sensors",
                                "Geofencing with 2cm precision",
                                "Physical emergency stop button"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-skin-base">
                                    <div className="w-2 h-2 bg-skin-accent rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative h-64 md:h-auto bg-skin-main rounded-2xl border border-skin-border overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-skin-accent/5" />
                        <Shield size={120} className="text-skin-accent/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-skin-accent font-bold text-2xl">100% Safe</span>
                        </div>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-logo">AI GrassCutter</div>
                    <div className="footer-links">
                        <Link to="/docs" className="footer-link">Documentation</Link>
                        <span className="footer-link">API Reference</span>
                        <span className="footer-link">Support</span>
                    </div>
                </div>
                <div className="text-center mt-8 footer-copyright">
                    &copy; 2026 AI GrassCutter Systems. All rights reserved.
                </div>
            </footer>
        </div >
    );
};

export default Home;
