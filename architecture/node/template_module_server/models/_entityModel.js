var mongoose = require('mongoose');

var {{className}}Schema = mongoose.Schema({     
    {% for property in properties %}
    {{property.name}} : {{property.type}},
    {% endfor %}
});


module.exports = mongoose.model('{{className}}', {{className}}Schema);