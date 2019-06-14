from django.contrib.auth.mixins import AccessMixin, LoginRequiredMixin
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse, HttpResponse, FileResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django_tables2 import RequestConfig
from django.urls import reverse
from django.http import Http404
from django.views import View

from basic_app.forms import LoginForm, ChangePasswordForm, UserFilterFormHelper, NewUserForm
from basic_app import support_functions
from basic_app.tables import UserTable
from basic_app.models import Clipboard, TextContent, FileContent
from basic_app import filters

import json

def add_text_to_clipboard(text):
    text_content = TextContent(text=text)
    text_content.save()

    clipboard_item = Clipboard(text_content=text_content)
    clipboard_item.save()

    return True

def add_file_to_clipboard(filename, file):
    file_content = FileContent(file=file, filename=filename)
    file_content.save()

    clipboard_item = Clipboard(file_content=file_content)
    clipboard_item.save()

    return True

def get_clipboard_items(howmany):
    clipboard_items = Clipboard.objects.all().order_by("-time_stamp")[:howmany+1]

    items = []
    for c_item in clipboard_items:
        json_data = {
            "id" : c_item.id,
            "content_type" : "text" if c_item.text_content else "file",
            "time_stamp" : c_item.time_stamp
        }

        if json_data["content_type"] == "file":
            json_data["filename"] = c_item.file_content.filename
        else:
            json_data["text"] = c_item.text_content.text

        items.append(json_data)
    
    return items

class IndexView(AccessMixin, View):
    @staticmethod
    def get(request):
        data = dict()
        return render(request, 'basic_app/html/index.html', data)

    def post(self, request):
        data = dict()
        return render(request, "basic_app/html/index.html", data)


class ChangePasswordView(LoginRequiredMixin, View):
    @staticmethod
    def get(request):
        change_password_form = ChangePasswordForm
        return render(request, 'basic_app/html/change_password.html', {'change_password_form': change_password_form,
                                                             'active_nav': 'change_password'})

    @staticmethod
    def post(request):
        user = request.user
        change_password_form = ChangePasswordForm(user, request.POST)
        if change_password_form.is_valid():
            change_password_form.save()
        else:
            return render(request, 'basic_app/html/change_password.html', {'change_password_form': change_password_form,
                                                                 'active_nav': 'change_password'})
        return redirect(reverse('dashboard'))

class AdminView(support_functions.TestIsSuperuser, View):
    @staticmethod
    def get(request, card='users'):
        card_list = ['users']
        card = card if card in card_list else 'users'

        parameters = {
                        'active_nav': 'admin',
                        'active_card': card
                    }

        if card == 'users':
            user_list = User.objects.all()
            user_filter = filters.UserFilter(request.GET, queryset=user_list)
            user_filter.form.helper = UserFilterFormHelper()
            table = UserTable(user_filter.qs)
            template = 'basic_app/html/admin_users.html'
            parameters['filter'] = user_filter
        

        RequestConfig(request, paginate={'per_page': 10}).configure(table)
        parameters['table'] = table
        return render(request, template, parameters)

class AuthView(View):
    @staticmethod
    def post(request):
        logout(request)
        return redirect(reverse('index'))

@method_decorator(csrf_exempt, name='dispatch')
class UploadText(View):
    @staticmethod
    def get(request):
        response = {
            "status" : False
        }

        return JsonResponse(response)
    
    @staticmethod
    def post(request):
        response = {
            "status" : False
        }

        try:
            json_data = json.loads(request.body.decode("utf-8"))
            response["status"] = add_text_to_clipboard(json_data["text"])
        except:
            pass

        return JsonResponse(response)

@method_decorator(csrf_exempt, name='dispatch')
class DownloadText(View):
    @staticmethod
    def get(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        text_content = clipboard_item.text_content

        file = open("text.txt", "w")
        file.write(text_content.text)
        file.close()

        response = FileResponse(open('text.txt', 'rb'), content_type="text/plain")
        response['Content-Disposition'] = 'attachment; filename="text.txt"'
        file.close()
        return response
    
    @staticmethod
    def post(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        text_content = clipboard_item.text_content
        
        with open("text.txt", "w") as f:
            f.write(text_content.text)
            response = FileResponse(f, content_type="text/plain")

        response['Content-Disposition'] = 'attachment; filename="text.txt"'
        return response

@method_decorator(csrf_exempt, name='dispatch')
class DeleteText(View):
    @staticmethod
    def get(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        text_content = clipboard_item.text_content
        
        clipboard_item.delete()
        text_content.delete()

        response = {
            "status" : True
        }

        return JsonResponse(response)
    
    @staticmethod
    def post(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        text_content = clipboard_item.text_content
        
        clipboard_item.delete()
        text_content.delete()

        response = {
            "status" : True
        }

        return JsonResponse(response)

@method_decorator(csrf_exempt, name='dispatch')
class DownloadFile(View):
    @staticmethod
    def get(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        file_content = clipboard_item.file_content
        response = FileResponse(file_content.file)

        response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_content.filename)
        return response
    
    @staticmethod
    def post(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        file_content = clipboard_item.file_content
        response = FileResponse(file_content.file)

        response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_content.filename)
        return response

@method_decorator(csrf_exempt, name='dispatch')
class DeleteFile(View):
    @staticmethod
    def get(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        file_content = clipboard_item.file_content
        
        clipboard_item.delete()
        file_content.delete()

        response = {
            "status" : True
        }

        return JsonResponse(response)
    
    @staticmethod
    def post(request, id):
        clipboard_item = Clipboard.objects.get(id=id)
        file_content = clipboard_item.file_content
        
        clipboard_item.delete()
        file_content.delete()

        response = {
            "status" : True
        }

        return JsonResponse(response)


@method_decorator(csrf_exempt, name='dispatch')
class GetItems(View):
    @staticmethod
    def get(request):
        response = {
            "status" : False
        }

        return JsonResponse(response)
    
    @staticmethod
    def post(request, howmany=30):
        response = {
            "status" : False
        }

        response["items"] = get_clipboard_items(howmany)
        response["status"] = True

        return JsonResponse(response)

@method_decorator(csrf_exempt, name='dispatch')
class UploadFile(View):
    @staticmethod
    def get(request):
        response = {
            "status" : False
        }

        return JsonResponse(response)
    
    @staticmethod
    def post(request):
        response = {
            "status" : False
        }

        filename = request.POST["filename"]
        file = request.FILES["file"]

        response["status"] = add_file_to_clipboard(filename, file)

        return JsonResponse(response)

class NewUserView(support_functions.TestIsSuperuser, View):
    @staticmethod
    def get(request):
        new_user_form = NewUserForm
        return render(request, 'basic_app/html/new_user.html', {'new_user_form': new_user_form})

    @staticmethod
    def post(request):
        new_user_form = NewUserForm(request.POST)
        if new_user_form.is_valid():
            new_user_form.save()
        else:
            return render(request, 'basic_app/html/new_user.html', {'new_user_form': new_user_form})
        return redirect(reverse('admin'))

class DeleteUserView(support_functions.TestIsSuperuser, View):
    @staticmethod
    def post(request, id):
        User.objects.get(pk=id).delete()
        return redirect(reverse('admin'))

class EditUserView(support_functions.TestIsSuperuser, View):
    @staticmethod
    def get(request, id):
        user = User.objects.get(pk=id)
        edit_user_form = NewUserForm(instance=user)
        return render(request, 'basic_app/html/new_user.html', {'new_user_form': edit_user_form})

    @staticmethod
    def post(request, id):
        user = User.objects.get(pk=id)
        edit_user_form = NewUserForm(request.POST, instance=user)
        if edit_user_form.is_valid():
            edit_user_form.save()
        else:
            return render(request, 'basic_app/html/new_user.html', {'new_user_form': edit_user_form})
        return redirect(reverse('admin'))

# class DashboardView(LoginRequiredMixin, View):
#     @staticmethod
#     def get(request, highlight=None):
#         user = request.user
#         ownership_list = user.ownership_set.all()
#         table = OwnershipTable(ownership_list)
#         has_certificate = True # has_certificate = hasattr(user, 'authorisationcertificate')
#         RequestConfig(request, paginate={'per_page': 10}).configure(table)
#         return render(request, 'basic_app/html/dashboard.html', {'table': table, 'has_certificate': has_certificate})


# class UpdateDashboard(LoginRequiredMixin, View):
#     @staticmethod
#     def get(request):
#         user = request.user
#         device_ids = [ownership.device.id for ownership in user.ownership_set.all()]
#         return JsonResponse(support_functions.get_js_for_device_status(device_ids))

def dummy_function(request):
    raise Http404("Oops! This page has not been implemented")
    return HttpResponse("Oops! This page has not been implemented")