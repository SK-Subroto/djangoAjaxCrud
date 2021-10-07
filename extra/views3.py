from django.http import JsonResponse
from django.shortcuts import render
from enroll.forms import StudentRegistration
from enroll.models import User
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
        form = StudentRegistration(request.POST)
        print(request.POST)
        if form.is_valid():
            sid = request.POST.get('stuid')
            if sid:
                stud = User.objects.get(pk=sid)
                form = StudentRegistration(request.POST, instance=stud)
            form.save()
            student = User.objects.values()
            student_data = list(student)
            return JsonResponse({'status': 'save', 'student': student_data})
        else:
            return JsonResponse({'status': 0})


def delete_data(request):
    if request.method == 'POST':
        id = request.POST.get('sid')
        print(id)
        stu = User.objects.get(pk=id)
        stu.delete()
        return JsonResponse({'status': 1})
    else:
        return JsonResponse({'status': 0})


def edit_data(request):

    if request.method == 'POST':
        id = request.POST.get('sid')
        # print(id)
        stu = User.objects.get(pk=id)
        stu_data = {"id": stu.id,
                    "name": stu.name,
                    "email": stu.email,
                    "password": stu.password
                    }
        return JsonResponse(stu_data)