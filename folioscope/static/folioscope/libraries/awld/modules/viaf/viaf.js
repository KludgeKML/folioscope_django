// Module: VIAF API

define(['jquery'], function($) {
    return {
        name: 'Virtual International Authority File',
        dataType: 'xml',
        toDataUri: function(uri) {
            return uri + "/viaf.xml";
        },
        // data URI is the same
        corsEnabled: true,
        parseData: function(xml) {
            var getText = awld.accessor(xml);

            var name = getText('ns2:mainHeadings/ns2:data[1]/ns2:text[1]');

            return {
                name: name,
            };
        },
    };
});
