from django.urls import path
from . import views

urlpatterns = [
    path("", views.dashboard, name="dashboard"),

    path("projects/", views.projects, name="projects"),
    path("projects/<int:project_id>/", views.project_detail, name="project_detail"),
    path("projects/delete/<int:project_id>/", views.delete_project, name="delete_project"),

    path("logs/", views.logs, name="logs"),
    path("logs/delete/<int:log_id>/", views.delete_log, name="delete_log"),

    path("settings/", views.settings, name="settings"),
]
