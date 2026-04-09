from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json

from .models import Project, Log


# ================= RESPONSE =================

def success(data):
    return JsonResponse({"success": True, "data": data})


def error(msg="Error"):
    return JsonResponse({"success": False, "error": msg})


# ================= HEALTH ENGINE =================

def calculate_health(logs):
    total = logs.count()
    error_count = logs.filter(type="ERROR").count()
    warning_count = logs.filter(type="WARNING").count()
    info_count = logs.filter(type="INFO").count()

    if total == 0:
        return {"status": "healthy", "score": 100}

    score = 100 - (error_count * 15) - (warning_count * 5)
    score = max(score, 0)

    if score > 80:
        status = "healthy"
    elif score > 50:
        status = "moderate"
    else:
        status = "critical"

    return {"status": status, "score": score}


def generate_alerts(logs):
    alerts = []

    errors = logs.filter(type="ERROR").count()
    warnings = logs.filter(type="WARNING").count()

    if errors > 0:
        alerts.append({"type": "critical", "message": f"{errors} errors detected"})

    if warnings > 3:
        alerts.append({"type": "warning", "message": f"{warnings} warnings detected"})

    if logs.count() == 0:
        alerts.append({"type": "info", "message": "No logs available"})

    return alerts


# ================= PROJECTS =================

def api_projects(request):
    projects = list(Project.objects.values())
    return success(projects)


def api_project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    logs = Log.objects.filter(project=project)

    health = calculate_health(logs)

    insights = []
    if logs.filter(type="ERROR").count() > 3:
        insights.append("High error frequency detected")
    if logs.filter(type="WARNING").count() > 5:
        insights.append("Too many warnings — unstable system")
    if logs.count() == 0:
        insights.append("No logs — system not monitored")

    return success({
        "id": project.id,
        "name": project.name,
        "health": health,
        "alerts": generate_alerts(logs),
        "insights": insights
    })


@csrf_exempt
def api_create_project(request):
    if request.method != "POST":
        return error("Invalid method")

    try:
        data = json.loads(request.body or "{}")
        name = data.get("name")

        if not name:
            return error("Name required")

        project = Project.objects.create(name=name)

        return success({"id": project.id})
    except Exception as e:
        return error(str(e))


@csrf_exempt
def api_delete_project(request, project_id):
    if request.method != "POST":
        return error("Invalid method")

    Project.objects.filter(id=project_id).delete()
    return success(True)


# ================= LOGS =================

def api_project_logs(request, project_id):
    logs = Log.objects.filter(project_id=project_id).order_by("-created_at")

    return success([
        {
            "id": l.id,
            "type": l.type,
            "message": l.message,
            "created_at": l.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "relative_time": l.created_at.strftime("%d %b %H:%M"),
        }
        for l in logs
    ])


@csrf_exempt
def api_create_log(request, project_id):
    if request.method != "POST":
        return error("Invalid method")

    try:
        data = json.loads(request.body or "{}")

        log = Log.objects.create(
            project_id=project_id,
            type=data.get("type", "INFO"),
            message=data.get("message", "")
        )

        return success({"id": log.id})
    except Exception as e:
        return error(str(e))


@csrf_exempt
def api_delete_log(request, log_id):
    if request.method != "POST":
        return error("Invalid method")

    Log.objects.filter(id=log_id).delete()
    return success(True)


# ================= DASHBOARD =================

def api_dashboard(request):
    logs = Log.objects.all()

    return success({
        "total_projects": Project.objects.count(),
        "total_logs": logs.count(),
        "distribution": {
            "error": logs.filter(type="ERROR").count(),
            "warning": logs.filter(type="WARNING").count(),
            "info": logs.filter(type="INFO").count()
        },
        "health": calculate_health(logs)
    })