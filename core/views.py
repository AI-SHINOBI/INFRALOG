from django.shortcuts import render, redirect, get_object_or_404
from .models import Project, DevLog


def dashboard(request):
    context = {
        "system_status": "Online",
        "total_projects": Project.objects.count(),
        "total_logs": DevLog.objects.count(),
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
