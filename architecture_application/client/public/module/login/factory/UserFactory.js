(function () {
  function UserFactory($resource) {
    return $resource(ApplicationConfiguration.RESTServerURL + '/user/:verb/:id', {
        verb: '@verb',
        id: '@id'
      },
      {
        'Login': {method: 'POST'},
        'Logout' : { method : 'POST' },
        'Add': {method: 'PUT'},
        'Get': {method: 'POST', isArray: true},
        'Count': {method: 'POST'},
        'Update': {method: 'POST'}
      });
  }

  angular.module('login').factory('UserFactory', UserFactory);
}());
