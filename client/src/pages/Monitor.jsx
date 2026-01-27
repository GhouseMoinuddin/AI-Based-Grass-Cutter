import { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, MapPin, Zap, Activity, Battery, BatteryCharging, BatteryWarning, Wifi, WifiOff, Disc } from 'lucide-react';
import { motion } from 'framer-motion';
import MotorPanel from '../components/MotorPanel';
import '../styles/Monitor.css';

const Monitor = () => {
    const [status, setStatus] = useState({
        batteryLevel: 100,
        operationMode: 'Connecting...',
        position: { x: 50, y: 50 }, // UI component expects position.x, position.y structure still? Backend sends position: {x,y} AND positionX. Let's stick to status.position
        pattern: 'None'
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data } = await axios.get('/api/status');
                setStatus(data);
            } catch (err) {
                console.error("Status fetch failed", err);
            }
        };

        const interval = setInterval(fetchStatus, 1000); // Update every second
        fetchStatus(); // Initial fetch

        return () => clearInterval(interval);
    }, []);

    const getBatteryIcon = () => {
        if (status.operationMode === 'DOCKED') return <BatteryCharging size={24} className="text-green-400" />;
        if (status.batteryLevel < 20) return <BatteryWarning size={24} className="text-red-400" />;
        return <Battery size={24} className="text-grass-400" />;
    };

    const getWifiIcon = () => {
        if (!status.wifiSignalStrength) return <WifiOff size={20} className="text-slate-600" />;
        if (status.wifiSignalStrength > -50) return <Wifi size={20} className="text-green-400" />;
        if (status.wifiSignalStrength > -70) return <Wifi size={20} className="text-yellow-400" />;
        return <Wifi size={20} className="text-red-400" />;
    };

    return (
        <div className="monitor-grid">
            {/* Live Camera Feed */}
            <div className="monitor-card group">
                <div className="live-badge">
                    <div className={`live-badge-dot ${status.operationMode === 'Connecting...' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    {status.operationMode === 'Connecting...' ? 'OFFLINE' : 'LIVE CAM'}
                </div>
                <div className="camera-feed-placeholder">
                    <Video size={48} className="text-slate-600 mb-2" />
                    <p className="text-slate-500 text-sm absolute mt-16">Camera Feed Unavailable</p>
                </div>
                {/* UI Overlay */}
                <div className="camera-overlay">
                    <span>CAM 01</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                            {getWifiIcon()}
                            <span className="text-xs font-mono">{status.wifiSignalStrength || '--'} dBm</span>
                        </div>
                        <span className="uppercase">{status.operationMode}</span>
                    </div>
                </div>
            </div>

            {/* GPS Map */}
            <div className="monitor-card">
                <div className="gps-badge">
                    <MapPin size={12} />
                    <span>
                        LAT: {status.gpsLatitude ? status.gpsLatitude.toFixed(6) : "0.00"} |
                        LON: {status.gpsLongitude ? status.gpsLongitude.toFixed(6) : "0.00"}
                    </span>
                </div>

                <div className="gps-map-container">
                    {/* Grid Pattern */}
                    <div className="gps-map-grid" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Path Trail */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                        {status.pathHistory && status.pathHistory.length > 1 && (
                            <polyline
                                points={status.pathHistory.map(p => `${p.x} ${p.y}`).join(',')}
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="0.5"
                                vectorEffect="non-scaling-stroke"
                                transform="scale(1, 1)"
                            />
                        )}
                    </svg>
                    {status.pathHistory && (
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                            <polyline
                                points={status.pathHistory.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="0.5"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}

                    {/* Dynamic GPS Dot & Heading */}
                    <motion.div
                        className="gps-dot"
                        animate={{
                            left: `${status.position?.x || 50}%`,
                            top: `${status.position?.y || 50}%`,
                            rotate: status.compassHeading || 0
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                    >
                        {/* Show arrow for heading instead of just dot */}
                        <div className="gps-heading-arrow"></div>
                        <div className="gps-ping"></div>
                    </motion.div>
                </div>
            </div>

            {/* Telemetry */}
            <div className="telemetry-card">
                <div className="telemetry-item">
                    <div className="telemetry-icon-box">
                        {getBatteryIcon()}
                    </div>
                    <div>
                        <div className="telemetry-label">Battery Level</div>
                        <div className="telemetry-value">{status.batteryLevel}%</div>
                    </div>
                </div>

                <div className="telemetry-item">
                    <div className={`telemetry-icon-box ${status.isBladeActive ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-500'}`}>
                        <Disc size={24} className={status.isBladeActive ? 'animate-spin' : ''} />
                    </div>
                    <div>
                        <div className="telemetry-label">Blade Status</div>
                        <div className={`telemetry-value text-lg ${status.isBladeActive ? 'text-red-500' : 'text-slate-500'}`}>
                            {status.isBladeActive ? 'ACTIVE' : 'STOPPED'}
                        </div>
                    </div>
                </div>

                <div className="telemetry-right">
                    <div className="text-xs text-slate-500 text-right mb-1">OPERATION MODE</div>
                    <div className={`text-xl font-bold ${status.operationMode === 'Mowing' || status.operationMode === 'MOWING' ? 'text-grass-400' : 'text-blue-400'}`}>
                        {status.operationMode}
                    </div>
                </div>
            </div>

            {/* Motor Telemetry Panel */}
            <div className="col-span-1 md:col-span-2">
                <MotorPanel motors={status.motors} />
            </div>
        </div>
    );
};

export default Monitor;
