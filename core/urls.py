from django.urls import path
from . import views

urlpatterns = [
    # AUTH
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),

    # UI ROUTES
    path("", views.dashboard, name="dashboard"),
    path("projects/", views.projects, name="projects"),
    path("projects/<int:project_id>/", views.project_detail, name="project_detail"),
    path("projects/delete/<int:project_id>/", views.delete_project, name="delete_project"),
    path("logs/", views.logs, name="logs"),
    path("logs/delete/<int:log_id>/", views.delete_log, name="delete_log"),
    path("settings/", views.settings, name="settings"),

    # API ROUTES (NEW)
    path("api/dashboard/", views.api_dashboard),
    path("api/projects/", views.api_projects),
    path("api/projects/<int:project_id>/logs/", views.api_project_logs),
]