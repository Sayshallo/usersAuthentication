import json

from django.http import JsonResponse
from django.shortcuts import redirect

from .models import User, UserRole, RolePermission, Permission


def check_permission(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        permission_name = data.get('codename')
        user_id = request.session['user_id']
        return JsonResponse({'access': has_permission(int(user_id), permission_name)})
    return redirect('edit_data')


def has_permission(user_id: int, codename: str) -> bool:
    try:
        user = User.objects.get(id=user_id)

        user_roles = UserRole.objects.filter(user=user).values_list('role_id', flat=True)

        if not user_roles:
            return False

        permission_ids = RolePermission.objects.filter(
            role_id__in=user_roles
        ).values_list('permission_id', flat=True)

        if not permission_ids:
            return False

        return Permission.objects.filter(
            id__in=permission_ids,
            codename=codename
        ).exists()

    except User.DoesNotExist:
        return False
    except Exception as e:
        print(e)
        return False
