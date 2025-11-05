import json
from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from .models import User

@csrf_exempt
def add_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        name = data.get('name')
        password = data.get('password')

        try:
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'auth_message': 'Пользователь с таким email уже существует'})

                # Создаем пользователя
            hashed_password = make_password(password)
            user = User.objects.create(
                username=name,
                email=email,
                password_hash=hashed_password
            )

            request.session['user_id'] = user.id

            return JsonResponse({
                'success': True,
                'auth_message': 'Вы успешно зарегистрировались!'
            })
        except Exception as e:
            print(f"Ошибка: {e}")
            return JsonResponse({'success': False, 'auth_message': f'Ошибка: {e}'})

    # Если запрос не POST, возвращаем ошибку
    return JsonResponse({'success': False, 'user': 'Неверный метод запроса.'})

def log_in(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)

            if user.is_active == False:
                return JsonResponse({
                    'success': False,
                    'auth_message': 'Аккаунт с этим адресом уже существует. '
                                    'Если вы удаляли его ранее, пожалуйста, обратитесь в поддержку для восстановления'
                })

            # Проверяем пароль с помощью check_password
            if check_password(password, user.password_hash):

                request.session['user_id'] = user.id

                return JsonResponse({
                    'success': True,
                    'auth_message': 'Вы успешно вошли!'
                })
            else:
                return JsonResponse({'success': False, 'auth_message': 'FORBIDDEN (403)\nНеверный пароль!'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'auth_message': 'ОШИБКА 401\nПользователя с такой почтой не существует!'})

    return render(request, 'authorization/auth.html')

def logout(request):
    if 'user_id' in request.session:
        del request.session['user_id']  # Удаляем ID пользователя из сессии
    return redirect('authorization')  # Перенаправляем на страницу авторизации

def update_data(request):
    data = json.loads(request.body)
    new_name = data.get('new_name')
    new_email = data.get('new_email')
    password = data.get('password')
    new_password = data.get('new_password')

    try:
        user = User.objects.get(id=request.session['user_id'])

        # Проверяем пароль с помощью check_password
        if check_password(password, user.password_hash):
            if new_email:
                User.objects.filter(id=request.session['user_id']).update(email=new_email)
                return JsonResponse({'success': True, 'message': 'Почта успешно заменена!'})
            if new_name:
                User.objects.filter(id=request.session['user_id']).update(username=new_name)
                return JsonResponse({'success': True, 'message': 'Имя успешно заменено!'})
            if new_password:
                User.objects.filter(id=request.session['user_id']).update(password_hash=make_password(new_password))
                return JsonResponse({'success': True, 'message': 'Пароль успешно заменен!'})

            print(data)
            return JsonResponse({ 'success': False, 'message': "Произошла ошибка при обработке данных" })
        else:
            return JsonResponse({'success': False, 'message': 'Неверный пароль!'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Ошибка: {e}'})

def soft_delete(request):
    if 'user_id' in request.session:
        User.objects.filter(id=request.session['user_id']).update(is_active=False)
        del request.session['user_id']  # Удаляем ID пользователя из сессии
    return redirect('authorization')  # Перенаправляем на страницу авторизации
