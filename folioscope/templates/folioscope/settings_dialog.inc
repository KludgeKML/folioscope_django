{% load i18n %}
<div id="settingsDialog" title="Settings">
	<form name="settings">
	{% include 'folioscope/settings/notes.inc' with for='apparatus' label='display_apparatus' %}
	{% include 'folioscope/settings/notes.inc' with for='generalNote' label='display_notes' %}
	{% include 'folioscope/settings/notes.inc' with for='commentaryNote' label='display_commentary_notes' %}
	{% include 'folioscope/settings/notes.inc' with for='sourceNote' label='display_source_notes' %}
	{% include 'folioscope/settings/notes.inc' with for='apparatusNote' label='display_apparatus_notes' %}

	{% include 'folioscope/settings/nothing_highlight_mark.inc' with for='hoverBehaviour' label='hover_behaviour' %}
	{% include 'folioscope/settings/show_hide.inc' with for='hoverPopups' label='hover_popups' %}
	{% include 'folioscope/settings/show_hide.inc' with for='awldPopups' label='awld_popups' %}
	</form>
</div>
