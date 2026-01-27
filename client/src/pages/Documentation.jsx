
import { motion } from 'framer-motion';
import { Book, Code, Shield, Terminal, Cpu, Wifi } from 'lucide-react';
import '../styles/Documentation.css';

const Documentation = () => {
    const sections = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: Book,
            content: (
                <div className="docs-content">
                    <p>
                        Welcome to the AI GrassCutter v3.0 documentation. This system allows for autonomous lawn maintenance
                        using advanced path planning and computer vision.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-3 text-skin-base">Prerequisites</h3>
                    <ul className="list-disc pl-6 space-y-2 text-skin-muted">
                        <li>Node.js v16+ installed on the control server.</li>
                        <li>MongoDB database (local or cloud).</li>
                        <li>RTK-GPS Base Station configured (baud rate 115200).</li>
                    </ul>
                    <h3 className="text-xl font-bold mt-6 mb-3 text-skin-base">Installation</h3>
                    <div className="bg-skin-main p-4 rounded-lg border border-skin-border font-mono text-sm">
                        <p className="text-skin-muted"># Clone the repository</p>
                        <p className="text-skin-accent">git clone https://github.com/ai-grasscutter/core.git</p>
                        <p className="text-skin-muted mt-2"># Install dependencies</p>
                        <p className="text-skin-accent">npm install</p>
                        <p className="text-skin-muted mt-2"># Start the system</p>
                        <p className="text-skin-accent">npm run dev</p>
                    </div>
                </div>
            )
        },
        {
            id: 'architecture',
            title: 'System Architecture',
            icon: Cpu,
            content: (
                <div className="docs-content">
                    <p>
                        The system is composed of three main layers:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-skin-card p-4 rounded-xl border border-skin-border">
                            <h4 className="font-bold text-skin-accent mb-2">Perception Layer</h4>
                            <p className="text-sm text-skin-muted">
                                Handles input from Lidar, Camera, and GPS sensors. Processes raw data into a local costmap.
                            </p>
                        </div>
                        <div className="bg-skin-card p-4 rounded-xl border border-skin-border">
                            <h4 className="font-bold text-skin-accent mb-2">Planning Layer</h4>
                            <p className="text-sm text-skin-muted">
                                Generates coverage paths using Boustrophedon decomposition. Handles dynamic obstacle avoidance.
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'api',
            title: 'API Reference',
            icon: Code,
            content: (
                <div className="docs-content">
                    <p>Control the mower programmatically via REST API.</p>

                    <div className="api-endpoint mt-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">GET</span>
                            <code className="text-skin-base">/api/status</code>
                        </div>
                        <p className="text-sm text-skin-muted mb-4">Returns current telemetry data.</p>
                        <pre className="bg-skin-main p-4 rounded-lg border border-skin-border text-xs text-skin-muted overflow-x-auto">
                            {`{
  "battery": 85,
  "mode": "MOWING",
  "gps": { "x": 12.5, "y": 45.3 },
  "signal": -42
}`}
                        </pre>
                    </div>

                    <div className="api-endpoint mt-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">POST</span>
                            <code className="text-skin-base">/api/command</code>
                        </div>
                        <p className="text-sm text-skin-muted mb-4">Send a command to the rover.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'safety',
            title: 'Safety protocols',
            icon: Shield,
            content: (
                <div className="docs-content">
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <div className="min-w-[4px] bg-red-500 rounded-full" />
                            <p className="text-skin-muted">
                                <strong className="text-skin-base">Emergency Stop:</strong> Physical button physically disconnects battery power. Software e-stop accessible via Spacebar.
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <div className="min-w-[4px] bg-yellow-500 rounded-full" />
                            <p className="text-skin-muted">
                                <strong className="text-skin-base">Geofencing:</strong> Rover will immediately shutdown if GPS coordinates drift 0.5m outside defined boundary.
                            </p>
                        </li>
                        <li className="flex gap-3">
                            <div className="min-w-[4px] bg-blue-500 rounded-full" />
                            <p className="text-skin-muted">
                                <strong className="text-skin-base">Tilt Protection:</strong> Blade motor cuts off if inclination exceeds 30 degrees.
                            </p>
                        </li>
                    </ul>
                </div>
            )
        }
    ];

    return (
        <div className="docs-container pb-20">
            <div className="docs-header">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-skin-base mb-4">Documentation</h1>
                        <p className="text-skin-muted text-lg">
                            Everything you need to know about setting up and controlling your autonomous mower.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12 grid gap-12">
                {sections.map((section, idx) => (
                    <motion.section
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        id={section.id}
                        className="scroll-mt-24"
                    >
                        <div className="flex items-center gap-4 mb-6 border-b border-skin-border pb-4">
                            <div className="p-3 bg-skin-card rounded-xl border border-skin-border text-skin-accent">
                                <section.icon size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-skin-base">{section.title}</h2>
                        </div>
                        {section.content}
                    </motion.section>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-16 pt-8 border-t border-skin-border text-center">
                <p className="text-skin-muted">
                    Need more help? <a href="#" className="text-skin-accent hover:underline">Join our Discord community</a> or <a href="#" className="text-skin-accent hover:underline">contact support</a>.
                </p>
            </div>
        </div>
    );
};

export default Documentation;
