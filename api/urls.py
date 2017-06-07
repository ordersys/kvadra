from django.conf.urls import url, include

from api.views import Texts, Text

app_name = 'api'

urlpatterns_1_0 = [
    url(r'texts/$', Texts.as_view(),  name='texts'),
    url(r'texts/(?P<pk>\d+)/$', Text.as_view(),  name='text'),
]

urlpatterns = [
    url(r'1\.0/', include(urlpatterns_1_0)),
]

