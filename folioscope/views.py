from django.shortcuts import render

def index(request):
    context = {
    	'document_endpoint': 'http://localhost:8000/docs',
    	'sparql_endpoint': 'http://www.ancientwisdoms.ac.uk/sesame/repositories/saws',
    	'url_base': 'http://www.ancientwisdoms.ac.uk/cts/urn:cts:',
    	}
    return render(request, 'folioscope/index.html', context)
