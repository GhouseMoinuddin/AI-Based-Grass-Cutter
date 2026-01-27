import requests
import time
import random
import json

# CONFIGURATION
API_URL = "http://localhost:5000/api" # Change to your PC's IP address (e.g. http://192.168.1.100:5000/api)
POLL_INTERVAL = 1.0 # Seconds

def get_real_sensor_data():
    """
    Replace this with actual GPIO/Serial reading logic.
    For now, it generates realistic-looking dummy data for testing.
    """
    return {
        "batteryLevel": 85.0 - (time.time() % 100) * 0.1, # Fake drain
        "positionX": 50 + 10 * random.random(),
        "positionY": 50 + 10 * random.random(),
        "gpsLatitude": 40.7128 + random.random() * 0.0001,  # Example: New York
        "gpsLongitude": -74.0060 + random.random() * 0.0001,
        "compassHeading": int(time.time() % 360),
        "operationMode": "IDLE", # IDLE, MOWING, DOCKED, ERROR
        "wifiSignalStrength": -40 - int(random.random() * 20),
        "leftWheelMotor": {
            "speedRPM": 1200,
            "currentAmps": 1.2,
            "temperatureCelsius": 45.0
        },
        "rightWheelMotor": {
            "speedRPM": 1200,
            "currentAmps": 1.1,
            "temperatureCelsius": 42.5
        },
        "bladeCuttingMotor": {
            "speedRPM": 3000,
            "currentAmps": 2.5,
            "temperatureCelsius": 50.0
        }
    }

def poll_commands():
    try:
        response = requests.get(f"{API_URL}/hardware/command")
        if response.status_code == 200:
            cmd = response.json()
            if cmd:
                print(f"[*] Received command: {cmd}")
                # TODO: Execute command here
                # execute_command(cmd)
    except Exception as e:
        print(f"[!] Command poll error: {e}")

def send_telemetry():
    data = get_real_sensor_data()
    try:
        requests.post(f"{API_URL}/hardware/telemetry", json=data)
        print(f"[>] Telemetry sent: Batt={data['batteryLevel']:.1f}%")
    except Exception as e:
        print(f"[!] Telemetry send error: {e}")

def main():
    print("--- AI Mower Raspberry Pi Client (Human Readable) ---")
    print(f"Connecting to {API_URL}")
    
    while True:
        send_telemetry()
        poll_commands()
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    main()
