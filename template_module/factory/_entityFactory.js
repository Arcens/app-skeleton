{% block content %}

(function () {
    function {{className}}Factory($resource) {
        return $resource( ApplicationConfiguration.RESTServerURL + '/{{moduleName}}/:id/:verb', {
                verb: '@verb',
                id: '@id'
            },
            {
                'getAll': {method: 'GET', isArray:true},
                'update': {method: 'PUT'}
            }
        );
    }

    angular.module('{{moduleName}}').factory('{{className}}Resource', {{className}}Factory);
}());
{% endblock %}

