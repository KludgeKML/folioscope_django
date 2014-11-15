from django.shortcuts import render

def index(request):
    return render(request, 'document_source/index.html')

def document(request, source, group, document):
	context = { 'source': source, 'group': group, 'document': document }
	return render(request, 'document_source/AC__greekLit__BarGr111.FB.saws01.html', context)