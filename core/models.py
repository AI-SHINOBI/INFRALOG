from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) 

    def __str__(self):
        return self.name


class Log(models.Model):
    TYPE_CHOICES = [
        ("INFO", "Info"),
        ("WARNING", "Warning"),
        ("ERROR", "Error"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="logs")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="INFO")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.name} - {self.type}"