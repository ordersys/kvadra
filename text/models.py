from django.db import models

# Create your models here.
from django.urls import reverse


class Text(models.Model):
    text = models.CharField('текст', max_length=128)

    def get_absolute_url(self):
        return reverse('api:text', kwargs={'pk': self.pk})
