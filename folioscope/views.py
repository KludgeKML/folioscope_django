from django.shortcuts import render
import os

def index(request):
    context = {
    	'document_endpoint': os.environ['DOCUMENT_ENDPOINT'],
    	'sparql_endpoint': os.environ['SPARQL_ENDPOINT'],
    	'url_base': os.environ['URL_BASE'],
    	}
    return render(request, 'folioscope/index.html', context)
