{% load i18n %}
		<label for="{{ for }}Style">{% trans label %}</label>
		<select name="{{ for }}Style">
			<option value="inline">{% trans 'inline_with_the_text' %}</value>
			<option value="footer">{% trans 'in_the_footer_when_highlighted' %}</value>
			<option value="popUp" selected>{% trans 'as_popup_links' %}</value>
			<option value="hidden">{% trans 'hidden' %}</value>
		</select><br />