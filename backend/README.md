Elderly Care Backend (MVP)
- Endpoints:
  - POST /api/reports/upload: upload a PDF/Excel report. Requires file in form-data named "file".
  - GET /api/reports/summary: get a quick summary of the last parsed report.
  - POST /api/medicines/generate: generate medicine suggestions from parsed report.
  - POST /api/fitness/generate: generate fitness suggestions from parsed report.
  - POST /api/emergency/notify: trigger a mock emergency notification.
  - POST /api/fall-detection/start, /api/fall-detection/stop: control fall-detection session (MVP stub).

- Session handling:
  - Each request should include header X-Session-Id to associate data per session. If missing, a new session is created automatically on upload.

- How to run:
  - npm install
  - npm run start
