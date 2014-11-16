<div id="docSettingsDialog" title="Document Settings">
	<form name="docSettings">
	{% include 'folioscope/settings/show_hide.inc' with for='lineNumbers' label='line_numbers' selected='show'%}
	{% include 'folioscope/settings/show_hide.inc' with for='pageNumbers' label='page_numbers' selected='hide'%}
	{% include 'folioscope/settings/show_hide.inc' with for='surplusBlocks' label='surplus_blocks' selected='show'%}
	{% include 'folioscope/settings/show_hide.inc' with for='linkIDs' label='link_ids' selected='hide'%}
	</form>
</div>