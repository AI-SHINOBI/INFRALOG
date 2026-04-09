from django.urls import path
from . import views

urlpatterns = [
    # ================= DASHBOARD =================
    path("api/dashboard/", views.api_dashboard),

    # ================= PROJECTS =================
    path("api/projects/", views.api_projects),
    path("api/projects/create/", views.api_create_project),
    path("api/projects/<int:project_id>/delete/", views.api_delete_project),

    # ================= PROJECT DETAIL =================
    path("api/projects/<int:project_id>/", views.api_project_detail),

    # ================= LOGS =================
    path("api/projects/<int:project_id>/logs/", views.api_project_logs),
    path("api/projects/<int:project_id>/logs/create/", views.api_create_log),

    # ================= LOG DELETE =================
    path("api/logs/<int:log_id>/delete/", views.api_delete_log),
]