var app = angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state(
    'app', {
      abstract: true,
      templateUrl: 'module/layout/view/app-layout.html',
      controller: 'loginController as login'
    }).state(
    'app.index', {
      url: '/home',
      authenticate : false,
      templateUrl: 'module/layout/view/home.html'
    }).state(
    'login', {
      url: '/login',
      templateUrl: 'module/login/view/login.html',
      controller: 'loginController as login'
    });
});

//https://github.com/danicomas/angular-bootbox
app.config(function ($bootboxProvider) {
  $bootboxProvider.setDefaults({ locale: "en" });
});

//https://github.com/danicomas/angular-bootbox
angular.module('angular-bootbox', []).factory('bootbox', [function () {
  return bootbox;
}]).provider('$bootbox', function () {
  return {
    setDefaults: function (options) {
      bootbox.setDefaults(options);
    },
    $get: function () {
      return {}
    }
  }
});

app.run(function ($location, $rootScope, UserService, $state, $timeout) {
    $rootScope.returnToUrl = $location.$$url;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (toState.authenticate && !UserService.isLogged()) {
            if ($location.$$url !== '/login') {
                $rootScope.returnToUrl = $location.$$url;
            }
            $timeout(function () {
                $location.path('/login');
            });
        }
    });
});

app.config(['$httpProvider', function ($httpProvider, $window) {
  /* Registers auth token interceptor, auth token is either passed by header or by query parameter
   * as soon as there is an authenticated user */
  $httpProvider.interceptors.push(function ($q, $rootScope, $window) {
    return {
      'request': function (config) {
        {% block content %}
        var isRestCall = config.url.indexOf('{{serverUrl}}:{{serverPort}}/{{apiPath}}') === 0;
        {% endblock %}
        if (isRestCall) {
          if ($window.sessionStorage.length > 0) {
            console.log(JSON.parse($window.sessionStorage["User"]));
            //Add authentication header to API calls
            config.headers['Authorization'] = JSON.parse($window.sessionStorage["User"]).token;
          }
        }
        return config || $q.when(config);
      }
    };
  });
}]);



