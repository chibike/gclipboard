from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import json


class TextContent(models.Model):
    text = models.TextField()

    # def __str__(self):
    #     return self.text

class FileContent(models.Model):
    file = models.FileField(upload_to="uploads/%Y/%m/%d/", null=True)
    filename = models.CharField(max_length=1000, null=True)

class Clipboard(models.Model):
    text_content = models.ForeignKey(TextContent, on_delete=models.SET_NULL, null=True)
    file_content = models.ForeignKey(FileContent, on_delete=models.SET_NULL, null=True)

    time_stamp = models.DateTimeField(default=timezone.now, blank=False)