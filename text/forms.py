from django.forms import ModelForm

from text.models import Text


class TextForm(ModelForm):

    class Meta:
        model = Text
        fields = ('text', )
