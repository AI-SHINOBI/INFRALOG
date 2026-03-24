from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Q
from .models import Project, DevLog


def dashboard(request):
    total_projects = Project.objects.count()
    total_logs = DevLog.objects.count()

    # Severity counts
    error_count = DevLog.objects.filter(log_type="ERROR").count()
    warning_count = DevLog.objects.filter(log_type="WARNING").count()
    info_count = DevLog.objects.filter(log_type="INFO").count()

    # Health scoring
    health_score = (error_count * 3) + (warning_count * 2) + (info_count * 1)

    # System status
    if error_count > 10:
        system_status = "Critical"
    elif error_count > 5 or warning_count > 10:
        system_status = "Moderate"
    else:
        system_status = "Healthy"

    # Highest risk project
    highest_risk_project = Project.objects.annotate(
        error_count=Count("logs", filter=Q(logs__log_type="ERROR"))
    ).order_by("-error_count").first()

    highest_risk_project_errors = 0
    if highest_risk_project:
        highest_risk_project_errors = highest_risk_project.error_count

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


def projects(request):
    if request.method == "POST":
        name = request.POST.get("name")
        if name:
            Project.objects.create(name=name)
        return redirect("projects")

    projects = Project.objects.all().order_by("-created_at")
    return render(request, "core/projects.html", {"projects": projects})


def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)

    if request.method == "POST":
        log_type = request.POST.get("log_type")
        message = request.POST.get("message")

        if log_type and message:
            DevLog.objects.create(
                project=project,
                log_type=log_type,
                message=message
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


def delete_project(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    project.delete()
    return redirect("projects")


def logs(request):
    logs = DevLog.objects.select_related("project").order_by("-created_at")
    return render(request, "core/logs.html", {"logs": logs})


def delete_log(request, log_id):
    log = get_object_or_404(DevLog, id=log_id)
    project_id = log.project.id
    log.delete()
    return redirect("project_detail", project_id=project_id)


def settings(request):
    return render(request, "core/settings.html")