{% block content %}
(function () {
    function {{className}}($stateProvider) {
        $stateProvider.state('app.{{moduleName}}', {
            abstract: true,
            url: '/{{moduleName}}',
            template: '<div ui-view></div>'
        }).state('app.{{moduleName}}.list', {
            url: '/list',
            templateUrl: 'module/{{moduleName}}/view/{{moduleName}}List.html',
            controller: '{{className}}ControllerList as {{moduleName}}CtrlList',
            resolve: {
                {{className}}Resolve: function ($stateParams, $state, {{className}}Resource) {
                return {{className}}Resource.getAll().$promise;
            }
        }
        }).state('app.{{moduleName}}.details', {
            url: '/update/:{{moduleName}}ID',
            templateUrl: 'module/{{moduleName}}/view/{{moduleName}}Details.html',
            controller: '{{className}}ControllerDetail as {{moduleName}}Ctrl',
            resolve: {
                {{className}}Resolve: function ($stateParams, $state, {{className}}Resource) {
                var {{moduleName}}ID = $stateParams.{{moduleName}}ID === "" ? $state.params.{{moduleName}}ID : $stateParams.{{moduleName}}ID;
                return {{className}}Resource.get({id:{{moduleName}}ID}).$promise;
            }
         }
        }).state('app.{{moduleName}}.create', {
            url: '/create',
            templateUrl: 'module/{{moduleName}}/view/{{moduleName}}Details.html',
            controller: '{{className}}ControllerDetail as {{moduleName}}Ctrl',
            resolve: {
            {{className}}Resolve: function ($stateParams, $state, {{className}}Resource) {
                return {};
            }
        }
       })
    }
    angular.module('{{moduleName}}').config({{className}});
}());
{% endblock %}
