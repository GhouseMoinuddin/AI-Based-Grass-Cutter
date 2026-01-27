import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import MowerMap from '../components/MowerMap';
import '../styles/Simulator.css';

const Simulator = () => {
    const [status, setStatus] = useState(null);
    const [controls, setControls] = useState({
        mode: 'Shape', // Shape | Text
        shape: 'Square',
        text: 'A',
        speed: 5
    });

    const shapes = ['Square', 'Circle', 'Triangle', 'Star'];

    const fetchStatus = async () => {
        try {
            const { data } = await axios.get('/api/status');
            setStatus(data);
        } catch (e) {
            console.error(e);
            // Fallback mock data if server is offline for demo
            setStatus({
                battery: 85,
                mode: 'Simulation',
                position: { x: 50, y: 50 }
            });
        }
    };

    useEffect(() => {
        fetchStatus();
        const timer = setInterval(fetchStatus, 2000);
        return () => clearInterval(timer);
    }, []);

    const saveSimulation = async () => {
        try {
            const payload = {
                type: controls.mode,
                value: controls.mode === 'Shape' ? controls.shape : controls.text,
                duration: Math.floor(Math.random() * 20) + 5, // Fake duration 5-25m
                status: 'Completed'
            };
            await axios.post('/api/records', payload);
            alert('Operation Saved!');
        } catch (err) {
            alert('Failed to save record');
        }
    };

    const deployToMower = async () => {
        // Generate waypoints based on current shape
        let points = [];
        const scale = 5; // Scale factor for real world meters vs unit square

        if (controls.mode === 'Shape') {
            if (controls.shape === 'Square') {
                points = [{ x: 0, y: 0 }, { x: scale, y: 0 }, { x: scale, y: scale }, { x: 0, y: scale }, { x: 0, y: 0 }];
            } else if (controls.shape === 'Triangle') {
                points = [{ x: 0, y: 0 }, { x: scale, y: 0 }, { x: scale / 2, y: scale }, { x: 0, y: 0 }];
            } else if (controls.shape === 'Circle') {
                for (let i = 0; i <= 36; i++) {
                    const angle = (i * 10) * Math.PI / 180;
                    points.push({
                        x: (scale / 2) + (scale / 2) * Math.cos(angle),
                        y: (scale / 2) + (scale / 2) * Math.sin(angle)
                    });
                }
            } else {
                // Star or other
                points = [{ x: 0, y: 0 }, { x: scale, y: scale }]; // Mock fallback
            }
        } else {
            // Text mode mock
            points = [{ x: 0, y: 0 }, { x: scale, y: 0 }];
        }

        try {
            await axios.post('/api/hardware/mission', {
                type: `${controls.mode} - ${controls.mode === 'Shape' ? controls.shape : controls.text}`,
                waypoints: points
            });
            alert(`Mission Deployed! Sent ${points.length} waypoints to rover.`);
        } catch (err) {
            console.error(err);
            alert('Failed to deploy mission.');
        }
    };

    return (
        <div className="simulator-container">
            {/* Simulation Visualizer */}
            <div className="sim-visualizer-box">
                <div className="save-btn-container flex gap-4">
                    <button
                        onClick={saveSimulation}
                        className="btn-save"
                    >
                        Simulate
                    </button>
                    <button
                        onClick={deployToMower}
                        className="btn-deploy bg-skin-accent text-white font-bold py-2 px-6 rounded-xl hover:bg-skin-accent-hover shadow-lg shadow-skin-accent/20 flex items-center gap-2"
                    >
                        <Zap size={20} /> Deploy to Mower
                    </button>
                </div>
                <h2 className="sim-title">
                    Simulation View
                </h2>
                <div className="sim-map-wrapper">
                    {status && (
                        <MowerMap
                            position={status.position}
                            battery={status.battery}
                            mode={controls.mode}
                            shape={controls.shape}
                            text={controls.text}
                        />
                    )}
                </div>            </div>

            {/* Control Sidebar */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="controls-sidebar"
            >
                <div>
                    <h3 className="config-label-small">
                        Configuration
                    </h3>

                    <div className="mode-toggle-box">
                        {['Shape', 'Text'].map(m => (
                            <button
                                key={m}
                                onClick={() => setControls(c => ({ ...c, mode: m }))}
                                className={`mode-btn ${controls.mode === m
                                    ? 'mode-btn-active'
                                    : 'mode-btn-inactive'
                                    }`}
                            >
                                {m} Switching
                            </button>
                        ))}
                    </div>

                    {controls.mode === 'Shape' ? (
                        <div className="shapes-grid">
                            {shapes.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setControls(c => ({ ...c, shape: s }))}
                                    className={`shape-btn ${controls.shape === s
                                        ? 'shape-btn-active'
                                        : 'shape-btn-inactive'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <label className="text-input-label">Enter Name / Word Pattern</label>
                            <input
                                type="text"
                                maxLength={12}
                                placeholder="NAME"
                                value={controls.text}
                                onChange={(e) => setControls(c => ({ ...c, text: e.target.value.toUpperCase() }))}
                                className="text-input-field"
                            />
                            <p className="input-helper-text">Max 12 characters</p>
                        </div>
                    )}
                </div>

                <div>
                    <div className="speed-control-label">
                        <span>Cutting Speed</span>
                        <span>{controls.speed}x</span>
                    </div>
                    <input
                        type="range"
                        min="1" max="10"
                        value={controls.speed}
                        onChange={(e) => setControls(c => ({ ...c, speed: parseInt(e.target.value) }))}
                        className="speed-slider"
                    />
                </div>

                <button className="btn-generate">
                    Generate Path
                </button>
            </motion.div>
        </div>
    );
};

export default Simulator;
