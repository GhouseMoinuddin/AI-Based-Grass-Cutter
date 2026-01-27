
import React from 'react';
import { Activity, Thermometer, Zap } from 'lucide-react';

const MotorGauge = ({ label, stats }) => {
    // Stats: { speedRPM, currentAmps, temperatureCelsius }
    const { speedRPM = 0, currentAmps = 0, temperatureCelsius = 0 } = stats || {};

    return (
        <div className="bg-skin-main/50 p-4 rounded-xl border border-skin-border/50">
            <div className="text-xs font-bold text-skin-muted uppercase mb-3">{label}</div>

            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center">
                    <Activity size={16} className="text-blue-400 mb-1" />
                    <span className="text-lg font-mono font-bold text-skin-base">{Math.round(speedRPM)}</span>
                    <span className="text-[10px] text-skin-muted">RPM</span>
                </div>
                <div className="flex flex-col items-center">
                    <Zap size={16} className="text-yellow-400 mb-1" />
                    <span className="text-lg font-mono font-bold text-skin-base">{currentAmps.toFixed(1)}</span>
                    <span className="text-[10px] text-skin-muted">AMPS</span>
                </div>
                <div className="flex flex-col items-center">
                    <Thermometer size={16} className="text-red-400 mb-1" />
                    <span className="text-lg font-mono font-bold text-skin-base">{temperatureCelsius.toFixed(1)}</span>
                    <span className="text-[10px] text-skin-muted">°C</span>
                </div>
            </div>
        </div>
    );
};

const MotorPanel = ({ motors }) => {
    if (!motors) return null;

    return (
        <div className="mt-6">
            <div className="text-sm font-bold text-skin-muted mb-4 flex items-center gap-2">
                <Activity size={16} /> MOTOR TELEMETRY
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MotorGauge label="Left Drive" stats={motors.leftWheelMotor} />
                <MotorGauge label="Right Drive" stats={motors.rightWheelMotor} />
                <MotorGauge label="Blade Motor" stats={motors.bladeCuttingMotor} />
            </div>
        </div>
    );
};

export default MotorPanel;
