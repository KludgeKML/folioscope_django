{% load staticfiles %}
<script type="text/javascript" src="{% static "folioscope/libraries/jquery.min.js" %}" ></script>
<script type="text/javascript" src="{% static "folioscope/libraries/jquery-ui.min.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/jquery.equalheights.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/jquery-queryParser.min.js" %}"></script>

<script type="text/javascript" src="{% static "folioscope/libraries/compatability.js" %}"></script>

<script type="text/javascript" src="{% static "folioscope/libraries/shortcuts.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/positions.js" %}"></script>

<script type="text/javascript" src="{% static "folioscope/libraries/translations/en.js" %}"></script>
<script type="text/javascript">
		translationMap = en_Translation;
</script>

<script type="text/javascript">
	document_endpoint = '{{ document_endpoint }}';
	sparql_endpoint = '{{ sparql_endpoint }}';
	url_base = '{{ base_url }}';
</script>
<script type="text/javascript" src="{% static "folioscope/libraries/document.js" %}"></script>

<script type="text/javascript" src="{% static "folioscope/libraries/viewer.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/storage.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/tour.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/style-manager.js" %}"></script>
<script type="text/javascript" src="{% static "folioscope/libraries/tooltip-manager.js" %}"></script>

<script src="{% static "folioscope/libraries/awld/lib/requirejs/require.min.js" %}" type="text/javascript"></script>
<script src="{% static "folioscope/libraries/awld/awld.js" %}" type="text/javascript"></script>
<script type="text/javascript">
	awld.init();
</script>

<script type="text/javascript" src='https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["annotatedtimeline", "corechart", "gauge", "geomap", "geochart", "imagesparkline", "map", "orgchart", "table", "motionchart", "treemap"]}]}'></script>
<script type="text/javascript" id="sgvzlr_script" src="{% static "folioscope/libraries/sgvizler.js" %}"></script>
