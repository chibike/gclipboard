from django.contrib.auth.models import User
from django.dispatch import receiver
from django.utils import timezone
from django.db import models
import json, os


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


@receiver(models.signals.post_delete, sender=FileContent)
def auto_delete_file_on_delete(sender, instance, **kwargs):

    '''
        Deletes file from filesystem when corresponding Mediafile object is removed
    '''

    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

@receiver(models.signals.pre_save, sender=FileContent)
def auto_delete_file_on_change(sender, instance, **kwargs):

    '''
        Deletes old file from filesystem when corresponding Mediafile object is updated with a new file
    '''

    if not instance.pk:
        return False
    
    try:
        old_file = sender.objects.get(pk=instance.pk).file
    except sender.DoesNotExist:
        return False
    
    new_file = instance.file
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)