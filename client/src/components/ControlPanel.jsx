import { motion } from 'framer-motion';

const ControlPanel = ({
    settings,
    setSettings,
    onStart,
    onStop
}) => {
    const shapes = ['Square', 'Circle', 'Star', 'ZigZag', 'Spiral'];

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/80 backdrop-blur-lg p-6 rounded-xl border border-slate-700 h-fit"
        >
            <h2 className="text-xl font-semibold mb-6 text-white border-b border-slate-700 pb-2">
                Mission Control
            </h2>

            <div className="space-y-6">
                {/* Toggle Mode */}
                <div className="bg-slate-900/50 p-1 rounded-lg flex text-sm font-medium">
                    {['Shape', 'Text'].map((m) => (
                        <button
                            key={m}
                            onClick={() => handleChange('mode', m)}
                            className={`flex-1 py-2 rounded-md transition-all ${settings.mode === m
                                    ? 'bg-grass-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {m} Mode
                        </button>
                    ))}
                </div>

                {/* Dynamic Inputs */}
                <div className="space-y-4">
                    {settings.mode === 'Shape' ? (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                Select Pattern
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {shapes.map(shape => (
                                    <button
                                        key={shape}
                                        onClick={() => handleChange('shape', shape)}
                                        className={`p-2 rounded border text-sm transition-all ${settings.shape === shape
                                                ? 'bg-grass-500/20 border-grass-500 text-grass-400'
                                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                            }`}
                                    >
                                        {shape}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                Enter Text / Name
                            </label>
                            <input
                                type="text"
                                maxLength={10}
                                placeholder="Ex: HELLO"
                                value={settings.text}
                                onChange={(e) => handleChange('text', e.target.value.toUpperCase())}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white font-mono focus:border-grass-500 focus:outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1 text-right">
                                {settings.text.length}/10 chars
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                    <button
                        onClick={onStart}
                        className="w-full py-4 bg-gradient-to-r from-grass-600 to-green-600 hover:from-grass-500 hover:to-green-500 text-white font-bold rounded-lg shadow-lg shadow-grass-900/50 transform transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        INITIATE SEQUENCE
                    </button>
                    <button
                        onClick={onStop}
                        className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all active:scale-95"
                    >
                        ABORT / RETURN
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ControlPanel;
