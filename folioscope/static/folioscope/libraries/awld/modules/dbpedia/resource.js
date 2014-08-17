// Module: DBPedia resources

define(function() {
    return {
        name: 'DBPedia Resources',
        dataType: 'jsonp',

        toDataUri: function(uri) {
            var pageId = uri.split('/').pop();
            return 'http://dbpedia.org/data/' + pageId + '.json';
        },

        parseData: function(data) {
            data = data && data.parse || {};
            var $content = $('<div>' + data.text['*'] + '</div>');

            var description = $('p', $content).first().html();
            description = description.replace(/href="\//g,'href="http://en.wikipedia.org/')

            var imageURI = $('.image img',$content);
            imageURI = typeof imageURI.first()[0] === 'object' ? imageURI = 'http:'+imageURI.first()[0].getAttribute('src') : ''; 

            return {
                name: data.title,
                description: description,
                imageURI: imageURI,
            };
        }
    };
});
