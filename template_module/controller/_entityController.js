{% block content %}
(function () {

    var self;

    function {{className}}({{className}}Resolve, {{className}}Manager,$scope, $state) {
        var Manager = new {{className}}Manager($scope, {{className}}Resolve);
        
        
        
        return Manager;
    }

    angular.module('{{moduleName}}').controller('{{className}}ControllerList', {{className}});
}());
{% endblock %}

