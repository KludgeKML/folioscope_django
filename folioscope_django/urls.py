from django.conf.urls import patterns, include, url
from django.conf.urls.i18n import i18n_patterns

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^docs/?', include('document_source.urls')),
)

urlpatterns += i18n_patterns('',
    url(r'^', include('folioscope.urls')),
)