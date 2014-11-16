{% load i18n %}
		<label for="{{ for }}">{%  trans label %}</label>
		<select name="{{ for }}">
				<option value="show"{% if select != 'hide' %} selected{% endif %}>{% trans 'show' %}</value>
				<option value="hide"{% if select == 'hide' %} selected{% endif %}>{% trans 'hide' %}</value>
		</select><br />