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
