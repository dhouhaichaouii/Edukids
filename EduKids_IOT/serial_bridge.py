import serial
import requests
import time

SERIAL_PORT = "COM3"   # change selon ton PC
BAUD_RATE = 115200
API_BASE = "http://localhost:5000/api"

VALID_BUTTONS = {"understand", "confused", "overwhelmed", "help"}


def resolve_student(student_code):
    r = requests.post(
        f"{API_BASE}/iot/resolve-student",
        json={"studentCode": student_code},
        timeout=5
    )
    r.raise_for_status()
    payload = r.json()
    return payload.get("data") or {}


def get_active_session(class_id):
    r = requests.get(
        f"{API_BASE}/sessions/active/{class_id}",
        timeout=5
    )
    r.raise_for_status()
    payload = r.json()
    return payload.get("data") or {}


def send_button_event(student_id, session_id, button_type):
    r = requests.post(
        f"{API_BASE}/events/button-press",
        json={
            "studentId": student_id,
            "sessionId": session_id,
            "buttonType": button_type,
            "source": "iot"
        },
        timeout=5
    )
    r.raise_for_status()
    return r.json()


def main():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # laisse le temps à l'Arduino de redémarrer
        ser.reset_input_buffer()
        print(f"Serial bridge started on {SERIAL_PORT} at {BAUD_RATE} baud...")
    except Exception as e:
        print("Cannot open serial port:", e)
        return

    while True:
        try:
            raw = ser.readline()
            if not raw:
                continue

            line = raw.decode("utf-8", errors="ignore").strip()
            if not line:
                continue

            print("Received:", line)

            if line == "READY":
                print("Arduino is ready")
                continue

            parts = line.split(",")
            if len(parts) != 2:
                print("Invalid message format:", line)
                continue

            student_code = parts[0].strip().upper()
            button_type = parts[1].strip().lower()

            if not student_code:
                print("Empty student code")
                continue

            if button_type not in VALID_BUTTONS:
                print("Invalid buttonType:", button_type)
                continue

            student = resolve_student(student_code)
            if not student:
                print("Student not found for code:", student_code)
                continue

            student_id = student.get("studentId") or student.get("_id") or student.get("id")
            # classIds est un tableau, on prend le premier
            class_ids = student.get("classIds") or []
            class_id = class_ids[0] if class_ids else None

            if not student_id:
                print("Missing studentId in API response:", student)
                continue

            if not class_id:
                print("Student has no classId:", student)
                continue

            session = get_active_session(class_id)
            session_id = (
                session.get("_id")
                or session.get("id")
                or session.get("sessionId")
            )

            if not session_id:
                print("No active session for class:", class_id)
                continue

            result = send_button_event(student_id, session_id, button_type)
            print("Event sent successfully:", result)

        except requests.exceptions.RequestException as e:
            print("API error:", e)
            time.sleep(1)

        except serial.SerialException as e:
            print("Serial error:", e)
            time.sleep(1)

        except Exception as e:
            print("Unexpected error:", e)
            time.sleep(1)


if __name__ == "__main__":
    main()