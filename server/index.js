const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lawnmower')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('DB Error:', err));

app.use(cors());
app.use(express.json());

// Routes
// Routes
const authRoute = require('./routes/auth');
const recordRoute = require('./routes/records');
const hardwareRoute = require('./routes/hardware');
const controlRoute = require('./routes/control');

// Shared Command Queue for Hardware
const commandQueue = [];
app.locals.commandQueue = commandQueue;

// Route Middleware
app.use('/api/auth', authRoute);
app.use('/api/records', recordRoute);
app.use('/api/hardware', hardwareRoute);
app.use('/api/control', controlRoute);

// Pass queue to hardware route (since we can't easily pass it via require in this simple setup,
// we'll actually rely on the route reading from app.locals or we can attach it here to the router if needed.
// However, seeing hardware.js logic, it uses its own local queue.
// Let's correct this: we need to share the queue.
// We will assign the queue from hardware route to app.locals so control route can access it.
// Actually, let's reverse it. We defined the queue in hardware.js. Let's export it from there?
// No, circular deps. Best way: attach to `req` via middleware or use app.locals.
// Let's stick to app.locals for simplicity in this file, but we need to update hardware.js to use it.
// Wait, hardware.js created its own queue.
// I should update hardware.js to use `req.app.locals.commandQueue`.


// Basic route
app.get('/', (req, res) => {
  res.send('AI Grass Mower API Running');
});

// Mower Simulation State
// Mower State Store (Real Data)
// Initial state is Offline until first telemetry packet
app.locals.mowerState = {
  batteryLevel: 0,
  operationMode: 'OFFLINE',
  positionX: 50,
  positionY: 50,
  gpsLatitude: 0,
  gpsLongitude: 0,
  wifiSignalStrength: 0,
  isBladeActive: false,
  compassHeading: 0,
  pathHistory: [],
  motors: {
    leftWheelMotor: { speedRPM: 0, currentAmps: 0, temperatureCelsius: 0 },
    rightWheelMotor: { speedRPM: 0, currentAmps: 0, temperatureCelsius: 0 },
    bladeCuttingMotor: { speedRPM: 0, currentAmps: 0, temperatureCelsius: 0 }
  },
  lastUpdate: 0
};

// Check for timeout to set OFFLINE
setInterval(() => {
  const now = Date.now();
  if (now - app.locals.mowerState.lastUpdate > 5000 && app.locals.mowerState.operationMode !== 'OFFLINE') {
    app.locals.mowerState.operationMode = 'OFFLINE';
    // console.log("Mower Connection Lost");
  }
}, 5000);

// Status Endpoint
app.get('/api/status', (req, res) => {
  const state = req.app.locals.mowerState;

  res.json({
    batteryLevel: parseFloat(state.batteryLevel?.toFixed(1) || 0),
    operationMode: state.operationMode,
    position: { x: state.positionX, y: state.positionY },
    positionX: state.positionX,
    positionY: state.positionY,
    gpsLatitude: state.gpsLatitude,
    gpsLongitude: state.gpsLongitude,
    wifiSignalStrength: state.wifiSignalStrength,
    isBladeActive: state.isBladeActive,
    compassHeading: Math.floor(state.compassHeading),
    pathHistory: state.pathHistory,
    motors: state.motors
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
