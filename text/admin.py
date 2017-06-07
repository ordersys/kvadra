from django.contrib import admin

from text.models import Text


@admin.register(Text)
class TextAdmin(admin.ModelAdmin):
    list_display = ('id', 'text')
    fields = ('text', )
