import json

from django.http import JsonResponse
from django.shortcuts import render
from .forms import StudentRegistration
from .models import User
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def home(request):
    form = StudentRegistration()
    students = User.objects.all()
    return render(request, 'enroll/home.html',
                  {'form': form, 'students': students}
                  )


# @csrf_exempt
def save_data(request):
    if request.method == "POST":
        # form = StudentRegistration(request.POST)
        print('tttttt')
        # print(request.data)
        post_data = json.loads(request.body.decode("utf-8"))
        print(post_data)
        form = StudentRegistration(post_data)
        print(request.POST)
        if form.is_valid():
            # sid = request.POST.get('stuid')
            sid = post_data['stuid']
            if sid:
                stud = User.objects.get(pk=sid)
                # form = StudentRegistration(request.POST, instance=stud)
                form = StudentRegistration(post_data, instance=stud)
            form.save()
            student = User.objects.values()
            student_data = list(student)
            return JsonResponse({'status': 'save', 'student': student_data})
        else:
            return JsonResponse({'status': 0})


def delete_data(request):
    if request.method == 'POST':
        # id = request.POST.get('sid')
        post_data = json.loads(request.body.decode("utf-8"))
        sid = post_data['sid']
        print(sid)
        stu = User.objects.get(pk=sid)
        stu.delete()
        return JsonResponse({'status': 1})
    else:
        return JsonResponse({'status': 0})


def edit_data(request):

    if request.method == 'POST':
        # id = request.POST.get('sid')
        post_data = json.loads(request.body.decode("utf-8"))
        id = post_data['sid']
        # print(id)
        stu = User.objects.get(pk=id)
        stu_data = {"id": stu.id,
                    "name": stu.name,
                    "email": stu.email,
                    "password": stu.password
                    }
        return JsonResponse(stu_data)