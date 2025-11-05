from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import User


def authorization_view(request):
    if 'user_id' in request.session: return redirect('lk')
    return render(request, 'authorization/auth.html')

def lk_view(request):
    user_id = request.session.get('user_id')
    if not user_id: return redirect('authorization')

    try: user = User.objects.get(id=user_id)
    except User.DoesNotExist: return redirect('login')

    context = { 'user': user }

    # Передаем данные пользователя в шаблон
    return render(request, 'authorization/lk.html', context)

def start_page(request):
    return render(request, 'authorization/home.html')
