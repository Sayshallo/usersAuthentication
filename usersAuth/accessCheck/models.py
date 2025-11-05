from django.db import models




class User(models.Model):
    username = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=250)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username

    class Meta:
        managed = False
        db_table = 'authorization_user'

class Goods(models.Model):
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=250)

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'role'
        verbose_name = 'Роль'
        verbose_name_plural = 'Роли'


class Permission(models.Model):
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.codename

    class Meta:
        db_table = 'permission'
        verbose_name = 'Разрешение'
        verbose_name_plural = 'Разрешения'



class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='roles')

    def __str__(self):
        return f"{self.role.name} - {self.permission.codename}"

    class Meta:
        db_table = 'role_permission'
        verbose_name = 'Связь роль-разрешение'
        verbose_name_plural = 'Связи роль-разрешения'
        unique_together = ('role', 'permission')



class UserRole(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='roles',
        help_text="Связь с пользователем"
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name='users',
        help_text="Связь с ролью"
    )

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"

    class Meta:
        db_table = 'user_role'
        verbose_name = 'Связь пользователь-роль'
        verbose_name_plural = 'Связи пользователь-роли'
        unique_together = ('user', 'role')
