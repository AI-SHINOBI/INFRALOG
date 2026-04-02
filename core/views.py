from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Project, DevLog


# ================= AUTH =================

def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect("dashboard")

    return render(request, "core/login.html")


def logout_view(request):
    logout(request)
    return redirect("login")


# ================= DASHBOARD =================

@login_required
def dashboard(request):
    total_projects = Project.objects.count()
    total_logs = DevLog.objects.count()

    error_count = DevLog.objects.filter(log_type="ERROR").count()
    warning_count = DevLog.objects.filter(log_type="WARNING").count()
    info_count = DevLog.objects.filter(log_type="INFO").count()

    health_score = (error_count * 3) + (warning_count * 2) + (info_count * 1)

    if error_count > 10:
        system_status = "Critical"
    elif error_count > 5 or warning_count > 10:
        system_status = "Moderate"
    else:
        system_status = "Healthy"

    highest_risk_project = Project.objects.annotate(
        error_count=Count("logs", filter=Q(logs__log_type="ERROR"))
    ).order_by("-error_count").first()

    highest_risk_project_errors = (
        highest_risk_project.error_count if highest_risk_project else 0
    )

    context = {
        "total_projects": total_projects,
        "total_logs": total_logs,
        "error_count": error_count,
        "warning_count": warning_count,
        "info_count": info_count,
        "system_status": system_status,
        "health_score": health_score,
        "highest_risk_project": highest_risk_project,
        "highest_risk_project_errors": highest_risk_project_errors,
    }

    return render(request, "core/dashboard.html", context)


# ================= PROJECTS =================

@login_required
def projects(request):
    if request.method == "POST":
        name = request.POST.get("name")
        if name:
            Project.objects.create(
                name=name,
                created_by=request.user
            )
        return redirect("projects")

    projects = Project.objects.all().order_by("-created_at")
    return render(request, "core/projects.html", {"projects": projects})


@login_required
def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    if request.method == "POST":
        log_type = request.POST.get("log_type")
        message = request.POST.get("message")

        if log_type and message:
            DevLog.objects.create(
                project=project,
                log_type=log_type,
                message=message,
                created_by=request.user
            )
        return redirect("project_detail", project_id=project.id)

    logs = project.logs.all().order_by("-created_at")

    return render(
        request,
        "core/project_detail.html",
        {
            "project": project,
            "logs": logs
        }
    )


@login_required
def delete_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    project.delete()
    return redirect("projects")


# ================= LOGS =================

@login_required
def logs(request):
    logs = DevLog.objects.select_related("project").order_by("-created_at")
    return render(request, "core/logs.html", {"logs": logs})


@login_required
def delete_log(request, log_id):
    log = get_object_or_404(DevLog, id=log_id)
    project_id = log.project.id
    log.delete()
    return redirect("project_detail", project_id=project_id)


@login_required
def settings(request):
    return render(request, "core/settings.html")


# ================= API (PUBLIC FOR REACT) =================

def api_dashboard(request):
    total_projects = Project.objects.count()
    total_logs = DevLog.objects.count()

    error_count = DevLog.objects.filter(log_type="ERROR").count()
    warning_count = DevLog.objects.filter(log_type="WARNING").count()
    info_count = DevLog.objects.filter(log_type="INFO").count()

    # 🚨 ALERT ENGINE
    alerts = []

    if error_count > 10:
        alerts.append({
            "type": "CRITICAL",
            "message": "High number of system errors detected"
        })

    if warning_count > 15:
        alerts.append({
            "type": "WARNING",
            "message": "Warnings are increasing rapidly"
        })

    if total_logs == 0:
        alerts.append({
            "type": "INFO",
            "message": "No logs available yet"
        })

    data = {
        "total_projects": total_projects,
        "total_logs": total_logs,
        "error_count": error_count,
        "warning_count": warning_count,
        "info_count": info_count,
        "alerts": alerts,  # 🔥 NEW
    }

    return JsonResponse(data)


def api_projects(request):
    projects = Project.objects.all().order_by("-created_at")

    data = [
        {
            "id": p.id,
            "name": p.name,
            "created_at": p.created_at.isoformat(),  # 🔥 IMPORTANT FIX
        }
        for p in projects
    ]

    return JsonResponse(data, safe=False)


def api_project_logs(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    logs = project.logs.all().order_by("-created_at")

    data = [
        {
            "id": log.id,
            "type": log.log_type,
            "message": log.message,
            "created_at": log.created_at.isoformat(),  # 🔥 IMPORTANT FIX
        }
        for log in logs
    ]

    return JsonResponse(data, safe=False)