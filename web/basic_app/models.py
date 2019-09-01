from django.contrib.auth.models import User
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from django.db import models
import json, os, time
import random


class TextContent(models.Model):
    text = models.TextField()

    # def __str__(self):
    #     return self.text

class FileContent(models.Model):
    file = models.FileField(upload_to="uploads/%Y/%m/%d/", null=True)
    filename = models.CharField(max_length=1000, null=True)

class Clipboard(models.Model):
    text_content = models.ForeignKey(TextContent, on_delete=models.CASCADE, null=True)
    file_content = models.ForeignKey(FileContent, on_delete=models.CASCADE, null=True)

    time_stamp = models.DateTimeField(default=timezone.now, blank=False)

characters = [chr(i) for i in range(65, 91)]+[chr(i) for i in range(97, 123)]

def return_future_date(days_delta=5):
    return timezone.now() + timedelta(days=days_delta)

def generate_unique_name():
    unique_id = hex(hash(time.time()))[2:]
    header = "".join([random.choice(characters) for i in range(5)])

    return header + unique_id

class Shareables(models.Model):

    clipboard_item = models.ForeignKey(Clipboard, on_delete=models.CASCADE, null=False)

    unique_url = models.CharField(default=generate_unique_name, max_length=1000, blank=False)
    
    date_created = models.DateTimeField(default=timezone.now, blank=False)
    expiry_date = models.DateTimeField(default=return_future_date, blank=False)

    request_limit = models.IntegerField(default=5, blank=False)
    request_count = models.IntegerField(default=0, blank=False)


# @receiver(models.signals.request_finished, sender=Shareables)
# def auto_increment_request_counter(sender, instance, **kwargs):
#     '''
#     '''

#     instance.request_count += 1
#     instance.save()

@receiver(models.signals.post_delete, sender=FileContent)
def auto_delete_file_on_delete(sender, instance, **kwargs):

    '''
        Deletes file from filesystem when corresponding Mediafile object is removed
    '''

    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

            # remove folder if empty
            dir_name = os.path.abspath(os.path.join(instance.file.path, os.pardir))
            if os.path.exists(dir_name) and os.path.isdir(dir_name):
                if not os.listdir(dir_name):
                    try:
                        os.rmdir(dir_name)
                    except OSError: # path is not empty
                        # to force delete
                        # shutil.rmtree(dir_name)
                        pass

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

            # remove folder if empty
            dir_name = os.path.abspath(os.path.join(old_file.path, os.pardir))
            if os.path.exists(dir_name) and os.path.isdir(dir_name):
                if not os.listdir(dir_name):
                    try:
                        os.rmdir(dir_name)
                    except OSError: # path is not empty
                        # to force delete
                        # shutil.rmtree(dir_name)
                        pass
