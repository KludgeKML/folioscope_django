{% load i18n %}
<div id="viewContainer">
</div>

<div id="footnotes" class="furniture"><div id="footnotesContent">Footnotes</div></div>

<!-- Document View Prototype: This section will be copied and duplicated for each document, then placed into the viewContainer -->
<div class="documentView" id="documentViewPrototype">
	<div class="documentHeader">
		<p><span class="titleChooser" title="{% trans 'click_to_choose_document' %}">{% trans 'click_to_choose_document' %}</span>
			<span class="documentControlGroup">
		   		<span class="linkControl pv-scroll-linked" title="Toggle linked scrollbars"> </span>
		   		<span class="removeColumn" title="Remove this column"> </span>
		   		<span class="docSettings" title="Change Document Settings"> </span>
		   		<span class="downloadTEI" title="Download TEI"> </span>
		   		<span class="docBibliography" title="Document Bibliography"> </span>
		   		<span class="docInformation" title="Document Information"> </span>
		   	</span>
		</p>
	</div>
	<div class="documentField awld-scope">
		<div class="documentContent"></div>
		<div class="pv-loadingModal"></div>
	</div>
</div>
