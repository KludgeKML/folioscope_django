from django.conf.urls import url, patterns

urlpatterns = patterns('',
    url(r'^(?P<source>[A-Za-z]+)__(?P<group>.+)__(?P<document>.+)$', 'document_source.views.document', name='document'),
    url(r'^$', 'document_source.views.index', name='doc_index'),
)