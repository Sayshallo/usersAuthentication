from django.shortcuts import render, redirect
from .models import Goods


def index(request):
    if 'user_id' not in request.session: return redirect('authorization')
    return render(request, 'accessCheck/temp.html', context={'goods': Goods.objects.all()})
