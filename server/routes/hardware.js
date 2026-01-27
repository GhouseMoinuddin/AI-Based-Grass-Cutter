
const router = require('express').Router();

// GET /api/hardware/command - Rover polls this
router.get('/command', (req, res) => {
    const queue = req.app.locals.commandQueue;
    if (queue && queue.length > 0) {
        const cmd = queue.shift();
        return res.json(cmd);
    }
    res.status(204).send(); // No content
});

// POST /api/hardware/telemetry - Rover sends status
router.post('/telemetry', (req, res) => {
    const {
        batteryLevel,
        // gps, // { latitude, longitude } ? Or x/y?
        // Let's assume input is now descriptive
        positionX, positionY,
        gpsLatitude, gpsLongitude,
        compassHeading,
        operationMode,
        wifiSignalStrength,
        leftWheelMotor,
        rightWheelMotor,
        bladeCuttingMotor
    } = req.body;

    // Support legacy (if any) or flatten gps
    // input expected: { positionX: 50, positionY: 50 ... }

    const state = req.app.locals.mowerState;
    if (state) {
        state.lastUpdate = Date.now();
        if (batteryLevel !== undefined) state.batteryLevel = batteryLevel;
        if (positionX !== undefined) state.positionX = positionX;
        if (positionY !== undefined) state.positionY = positionY;
        if (gpsLatitude !== undefined) state.gpsLatitude = gpsLatitude;
        if (gpsLongitude !== undefined) state.gpsLongitude = gpsLongitude;
        if (compassHeading !== undefined) state.compassHeading = compassHeading;
        if (operationMode) state.operationMode = operationMode;
        if (wifiSignalStrength !== undefined) state.wifiSignalStrength = wifiSignalStrength;

        // Motor Updates
        if (leftWheelMotor) state.motors.leftWheelMotor = leftWheelMotor;
        if (rightWheelMotor) state.motors.rightWheelMotor = rightWheelMotor;
        if (bladeCuttingMotor) state.motors.bladeCuttingMotor = bladeCuttingMotor;

        // Derive blade status
        // Check bladeCuttingMotor.speedRPM
        state.isBladeActive = (bladeCuttingMotor && bladeCuttingMotor.speedRPM > 100);

        // Append to path if moving
        if (state.operationMode === 'MOWING' || state.operationMode === 'RETURNING') {
            state.pathHistory.push({ x: state.positionX, y: state.positionY });
            if (state.pathHistory.length > 300) state.pathHistory.shift();
        } else if (state.operationMode === 'DOCKED') {
            state.pathHistory = [];
        }
    }

    res.json({ success: true });
});

// POST /api/hardware/mission - Receive mission waypoints from Frontend
router.post('/mission', (req, res) => {
    const { waypoints, type } = req.body;

    // Create mission command
    const cmd = {
        id: `mis_${Date.now()}`,
        type: 'MISSION_START',
        missionType: type || 'CUSTOM',
        waypoints: waypoints || []
    };

    // Queue for rover
    const queue = req.app.locals.commandQueue;
    if (queue) {
        queue.push(cmd);
        console.log(`[HARDWARE] Mission queued: ${type} with ${waypoints?.length} points`);
        res.json({ success: true, missionId: cmd.id });
    } else {
        res.status(500).json({ error: "Command queue unavailable" });
    }
});

// Internal helper to add commands (exported if needed, but for now just attached to req)
// In a real app, use a shared service or DB
router.addCommand = (cmd) => commandQueue.push(cmd);

module.exports = router;
