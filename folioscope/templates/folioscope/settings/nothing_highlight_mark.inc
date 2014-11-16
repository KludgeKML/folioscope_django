{% load i18n %}
		<label for="{{ for }}">{% trans label %}</label>
		<select name="{{ for }}">
			<option value="none">{% trans 'do_nothing' %}</value>
			<option value="highlight">{% trans 'highlight_only' %}</value>
			<option value="getRelated" selected>{% trans 'highlight_and_mark_related' %}</value>
		</select><br />