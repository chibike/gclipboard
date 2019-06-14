from django.contrib import admin
from django.urls import path

from basic_app.views import IndexView, ChangePasswordView, AdminView, NewUserView, AuthView, DeleteUserView, EditUserView, dummy_function,\
    UploadText, UploadFile, GetItems, DownloadFile, DownloadText, DeleteText, DeleteFile

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('admin/', AdminView.as_view(), name='admin'),
    path('dummy_function', dummy_function, name='dummy_function'),
    path('upload_text/', UploadText.as_view(), name='upload_text'),
    path('delete_text/<int:id>', DeleteText.as_view(), name='delete_text'),
    path('download_text/<int:id>', DownloadText.as_view(), name='download_text'),
    path('upload_file/', UploadFile.as_view(), name='upload_file'),
    path('download_file/<int:id>', DownloadFile.as_view(), name='download_file'),
    path('delete_file/<int:id>', DeleteFile.as_view(), name='delete_file'),
    path('get_items/<int:howmany>', GetItems.as_view(), name='get_items'),
    path('new_user/', NewUserView.as_view(), name='new_user'),
    # path('admin/<str:card>', AdminView.as_view(), name='admin'),
    path('dashboard/', dummy_function, name='dashboard'),
    path('logout/', AuthView.as_view(), name='logout'),
    path('delete_user/<int:id>', DeleteUserView.as_view(), name='delete_user'),
    path('edit_user/<int:id>', EditUserView.as_view(), name='edit_user'),
    path('change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('', IndexView.as_view(), name='index')
]
