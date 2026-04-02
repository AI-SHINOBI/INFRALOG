from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    # NEW FIELD (SAFE)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="projects"
    )

    def __str__(self):
        return self.name


class DevLog(models.Model):
    LOG_TYPES = [
        ("INFO", "Info"),
        ("WARNING", "Warning"),
        ("ERROR", "Error"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="logs"
    )

    log_type = models.CharField(max_length=10, choices=LOG_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # NEW FIELD (SAFE)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="logs"
    )

    def __str__(self):
        return f"{self.project.name} | {self.log_type}"