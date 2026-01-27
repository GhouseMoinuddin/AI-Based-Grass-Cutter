
import { useState } from 'react';
import axios from 'axios';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, StopCircle, Play, Pause, Zap, Disc } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/Controls.css';

const Controls = () => {
    const [status, setStatus] = useState('IDLE');
    const [bladeActive, setBladeActive] = useState(false);

    const sendCommand = async (action, params = {}) => {
        try {
            await axios.post('/api/control', { action, params });
            // console.log(`Sent: ${action}`, params);
        } catch (err) {
            console.error('Command failed', err);
        }
    };

    const handleStop = () => {
        sendCommand('STOP');
        setStatus('ESTOP');
        setBladeActive(false);
    };

    const toggleBlade = () => {
        const newState = !bladeActive;
        setBladeActive(newState);
        sendCommand(newState ? 'BLADE_ON' : 'BLADE_OFF');
    };

    return (
        <div className="controls-container">
            <header className="controls-header">
                <h1 className="text-2xl font-bold text-skin-base">Manual Control</h1>
                <div className="status-indicator">
                    <span className="text-skin-muted text-sm mr-2">STATUS:</span>
                    <span className={`font-mono font-bold ${status === 'ESTOP' ? 'text-red-500' : 'text-skin-accent'}`}>
                        {status}
                    </span>
                </div>
            </header>

            <div className="controls-main">
                {/* D-PAD Area */}
                <div className="dpad-section">
                    <div className="dpad-grid">
                        <div />
                        <button
                            className="dpad-btn dpad-up"
                            onMouseDown={() => sendCommand('MOVE', { x: 0, y: 1 })}
                            onMouseUp={() => sendCommand('STOP_MOVE')}
                        >
                            <ArrowUp size={32} />
                        </button>
                        <div />

                        <button
                            className="dpad-btn dpad-left"
                            onMouseDown={() => sendCommand('MOVE', { x: -1, y: 0 })}
                            onMouseUp={() => sendCommand('STOP_MOVE')}
                        >
                            <ArrowLeft size={32} />
                        </button>
                        <div className="dpad-center" />
                        <button
                            className="dpad-btn dpad-right"
                            onMouseDown={() => sendCommand('MOVE', { x: 1, y: 0 })}
                            onMouseUp={() => sendCommand('STOP_MOVE')}
                        >
                            <ArrowRight size={32} />
                        </button>

                        <div />
                        <button
                            className="dpad-btn dpad-down"
                            onMouseDown={() => sendCommand('MOVE', { x: 0, y: -1 })}
                            onMouseUp={() => sendCommand('STOP_MOVE')}
                        >
                            <ArrowDown size={32} />
                        </button>
                        <div />
                    </div>
                    <p className="text-skin-muted text-xs mt-4 text-center">Hold to move</p>
                </div>

                {/* Action Panel */}
                <div className="action-panel">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            className="btn-action btn-start"
                            onClick={() => { setStatus('ACTIVE'); sendCommand('START'); }}
                        >
                            <Play size={24} /> START
                        </button>
                        <button
                            className="btn-action btn-pause"
                            onClick={() => { setStatus('PAUSED'); sendCommand('PAUSE'); }}
                        >
                            <Pause size={24} /> PAUSE
                        </button>
                    </div>

                    <div className="flex items-center justify-between bg-skin-card p-4 rounded-xl border border-skin-border mb-6">
                        <div className="flex items-center gap-3">
                            <Disc size={24} className={bladeActive ? "text-red-500 animate-spin-slow" : "text-skin-muted"} />
                            <div>
                                <div className="font-bold text-skin-base">Blade Motor</div>
                                <div className="text-xs text-skin-muted">{bladeActive ? 'SPINNING' : 'STOPPED'}</div>
                            </div>
                        </div>
                        <button
                            onClick={toggleBlade}
                            className={`toggle-switch ${bladeActive ? 'active' : ''}`}
                        >
                            <div className="toggle-knob" />
                        </button>
                    </div>

                    <button
                        className="btn-estop"
                        onClick={handleStop}
                    >
                        <StopCircle size={48} />
                        <span>EMERGENCY STOP</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Controls;
