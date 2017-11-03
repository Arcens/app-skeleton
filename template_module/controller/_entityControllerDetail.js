{% block content %}
(function () {

    function {{className}}({{className}}Manager,$scope, $state,{{className}}Resolve) {        
        var Manager = new {{className}}Manager($scope,{{className}}Resolve);
        
        /**        
        example property
        Manager.foo = bar;
        
        example function 
        Manager.foo = function($bar){
            return $bar;
        }        
        **/
       
        //Set Json dates as Javascript dates
        {% for property in properties %}{% if property.type == 'date' %}Manager.data.{{property.name}} = new Date(Manager.data.{{property.name}});{% endif %}
        {% endfor %}
        
        return Manager;
    }


    angular.module('{{moduleName}}').controller('{{className}}ControllerDetail', {{className}});
}());
{% endblock %}


