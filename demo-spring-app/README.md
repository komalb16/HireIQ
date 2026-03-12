# ⚡ Demo App — Spring Boot Task Manager

A full-stack task manager with a polished dark UI, REST API, and Spring Boot backend.

---

## 📂 Project Structure

```
demo-spring-app/
├── pom.xml                          ← Maven build config
├── build-and-run.sh                 ← One-command build & run
├── demo_preview.py                  ← Preview instantly (no Java needed)
└── src/main/
    ├── java/com/demo/
    │   ├── DemoApplication.java     ← Spring Boot entry point
    │   ├── Task.java                ← Task model
    │   └── TaskController.java      ← REST API controller
    └── resources/
        ├── application.properties
        └── static/
            └── index.html           ← Full UI (served by Spring Boot)
```

---

## 🚀 Option A — Build & Run (requires Java 17+ and Maven)

```bash
chmod +x build-and-run.sh
./build-and-run.sh
```

Then open: **http://localhost:8080**

**Manual build:**
```bash
mvn clean package -DskipTests
java -jar target/demo-app-1.0.0.jar
```

---

## 👁 Option B — Preview Now (requires Python 3 only)

```bash
python3 demo_preview.py
```

Then open: **http://localhost:8080**

---

## 🌐 REST API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task `{"title":"..."}` |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PATCH | `/api/tasks/{id}` | Update status `{"status":"done"}` |
| GET | `/api/info` | App info |
| GET | `/actuator/health` | Health check |

---

## 📱 Connect to Your PWA

Set the Base URL in the PWA Settings tab to `http://your-server:8080`
