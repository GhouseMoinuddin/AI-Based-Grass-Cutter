
const router = require('express').Router();

// We need a way to pass commands to the hardware queue.
// For this simple demo, we'll rely on a shared global or import.
// A better way is a shared module, but let's keep it simple for MERN demo.
// We will assign the queue array in index.js to keep it shared.

router.post('/', (req, res) => {
    const { action, params } = req.body;

    // Construct command for rover
    const cmd = {
        id: `cmd_${Date.now()}`,
        type: action, // MOVE, STOP, BLADE_ON, etc.
        params: params || {}
    };

    // Push to shared queue (exposed via app.locals in index.js)
    if (req.app.locals.commandQueue) {
        req.app.locals.commandQueue.push(cmd);
        console.log(`[CTRL] Queued: ${action}`);
        res.json({ success: true, cmdId: cmd.id });
    } else {
        res.status(500).json({ error: "Command queue not initialized" });
    }
});

module.exports = router;
