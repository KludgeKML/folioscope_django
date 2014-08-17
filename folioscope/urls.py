from django.conf.urls import url, patterns

urlpatterns = patterns('',
    url(r'^/blank$', 'folioscope.views.index', name='index'),
    url(r'^/_blank_$', 'folioscope.views.index', name='index'),
    url(r'^/?$', 'folioscope.views.index', name='index'),
)