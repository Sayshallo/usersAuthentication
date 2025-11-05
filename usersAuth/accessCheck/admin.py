from django.contrib import admin

from .models import User, UserRole, Role, RolePermission, Goods, Permission

admin.site.register(User)
admin.site.register(UserRole)
admin.site.register(Role)
admin.site.register(RolePermission)
admin.site.register(Goods)
admin.site.register(Permission)
