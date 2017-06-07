import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from text.forms import TextForm
from text.models import Text as TextModel


def serialize(item):

    return {
        'id': item.pk,
        'text': item.text,
        'url': item.get_absolute_url()
    }


class GetPayloadMixin(object):

    def dispatch(self, request, *args, **kwargs):
        self.payload = json.loads(
            request.body.decode('utf-8')
        ) if request.body else {}
        return super(GetPayloadMixin, self).dispatch(request, *args, **kwargs)


class Texts(GetPayloadMixin, View):

    def get(self, request, *args, **kwargs):
        """Получение списка объектов. """

        result = {
            'data': list(map(serialize, TextModel.objects.order_by('-pk'))),
        }

        return JsonResponse(result)

    def post(self, request, *args, **kwargs):
        """ Создание нового объекта. """

        form = TextForm(self.payload)

        if form.is_valid():
            form.save()
            return JsonResponse({'data': serialize(form.instance)}, status=201)

        return JsonResponse({
            'data': {},
            'messages': form.errors
        }, status=400)


class Text(GetPayloadMixin, View):

    def dispatch(self, request, *args, **kwargs):
        try:
            self.instance = TextModel.objects.get(pk=kwargs.get('pk'))
        except TextModel.DoesNotExist:
            return JsonResponse({
                'messages': {'__all': ['Объект не найден']}
            }, status=404)
        return super(Text, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        """Получение объекта. """

        result = {'data': serialize(self.instance)}

        return JsonResponse(result)

    def put(self, request, *args, **kwargs):
        """ Редактирование объекта. """

        form = TextForm(self.payload, instance=self.instance)

        if form.is_valid():
            form.save()
            return JsonResponse({'data': serialize(self.instance)}, status=200)

        return JsonResponse({
            'data': {'id': form.instance.pk},
            'messages': form.errors
        }, status=400)

    def delete(self, request, *args, **kwargs):
        """ Удаление объекта. """

        self.instance.delete()

        return JsonResponse({'messages': {'__all': ['Объект удален.']}})
