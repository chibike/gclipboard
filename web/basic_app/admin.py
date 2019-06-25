from django.contrib import admin

from basic_app.models import Clipboard, TextContent, FileContent, Shareables

admin.site.register(Clipboard)
admin.site.register(TextContent)
admin.site.register(FileContent)
admin.site.register(Shareables)
