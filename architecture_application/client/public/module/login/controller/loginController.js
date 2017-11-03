(function () {

    var self;

    function LoginController(UserService, $state, $scope, $rootScope, $location, Notification) {
        this.notif = Notification;
        this.UserService = UserService;
        this.$state = $state;
        this.userSiglum = "";
        this.userPassword = "";
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$location = $location;
        self = this;
    }

    LoginController.prototype.login = function () {
        self.UserService.Login(this.userSiglum, this.userPassword, function () {
            if (self.UserService.isLogged()) {
                if (self.UserService.IsDefaultPassword() === true) {
                    self.$location.path('/changepassword');
                } else {
                    if (self.$rootScope.returnToUrl && self.$rootScope.returnToUrl !== "/login") {
                        self.$location.path(self.$rootScope.returnToUrl);
                    } else {
                        self.$location.path('/home');
                    }
                }
            }
        }, function () {
            self.notif.error({message: 'Incorrect Credentials! Please verify your username and password', title: 'Something went wrong'});
        });
    };

    LoginController.prototype.logout = function () {
        self.UserService.Logout(self.UserService.getUserId(), function () {
            self.$location.path('/home');
        });
    };

    LoginController.prototype.isLoggedIn = function () {
        return self.UserService.isLogged() == false ? false : true;
    };

    LoginController.prototype.getUserName = function () {
        return self.UserService.getUserName();
    };

    angular.module('login').controller('loginController', LoginController);

}());
