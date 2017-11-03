{% block content %}
var {{appName}} = {
  /* When set to false a query parameter is used to pass on the auth token.
   * This might be desirable if headers don't work correctly in some
   * environments and is still secure when using https. */
  useAuthTokenHeader: true
};

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {

  // Init module configuration options
  var applicationModuleName = '{{appName}}';

  var applicationModuleVendorDependencies = [
	'ui.router', 
	'ngSanitize', 
	'ngResource', 
	'ui.bootstrap', 
	'chieffancypants.loadingBar', 
	'ui-notification', 
	'angular-bootbox'
   ];

  var RESTServerURL = '{{serverUrl}}:{{serverPort}}/{{apiPath}}';

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };
  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    RESTServerURL : RESTServerURL,
    registerModule: registerModule
  };
})();
{% endblock %}
