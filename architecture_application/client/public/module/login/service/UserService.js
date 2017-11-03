(function () {

    var self;

    function UserService($window, UserFactory) {
        self = this;
        self.UserFactory = UserFactory;
        self.$window = $window;
        self.MyUser = {
            id: undefined,
            isLogged: false,
            username: undefined,
            userrole: undefined,
            useremail: undefined
        };
        self.UserHasDefaultPassword = true;
        self.Init();
    }

    UserService.prototype.Get = function (filters, callback) {
        self.UserFactory.Get({verb: 'get'}, filters, function (data) {
            callback(data);
        });
    };

    UserService.prototype.Count = function (filters, callback) {
        self.UserFactory.Count({verb: 'count'}, filters, function (data) {
            callback(data);
        });
    };


    UserService.prototype.Add = function (newUser, callback) {
        self.UserFactory.Add({verb: 'add'}, newUser, function (data) {
            callback(data);
        });
    };

    UserService.prototype.Delete = function (idToDelete, callback) {
        self.UserFactory.Delete({verb: 'delete', id: idToDelete}, {}, function (data) {
            callback(data);
        });
    };

    UserService.prototype.UpdateUser = function (userToUpdate, callback) {
        self.UserFactory.Update({verb: 'updateuser'}, userToUpdate, function (data) {
            callback(data);
        });
    };


    UserService.prototype.UpdatePassword = function (newPassword, callback) {
        self.UserFactory.Update({verb: 'updatepassword'}, {
            Uid: MyUser.id,
            newPassword: md5.createHash(newPassword || '')
        }, function (data) {
            callback(data);
        });
    };

    UserService.prototype.IsDefaultPassword = function () {
        return self.UserHasDefaultPassword;
    };


    UserService.prototype.Login = function (username, password, callback, errorCallback) {
        var postData = {
            username: username,
            password: sha256(password || '')
        };

        if (postData.password !== '481bc61313bbd10a10bcb83a74df8ab3') {
            self.UserHasDefaultPassword = false;
        }

        self.UserFactory.Login({verb: 'login'}, postData, function (data) {
            if (data.length === 0) {
                self.$window.sessionStorage["User"] = null;
                callback();
                return;
            }

            self.MyUser = {
                id: data.id,
                isLogged: true,
                username: data.firstname + " " + data.lastname,
                userrole: data.role_id,
                useremail: data.email,
                token: data.Token
            };


            self.$window.sessionStorage["User"] = JSON.stringify(self.MyUser);
            callback(data.Token);
        }, function (err) {
            errorCallback(err);
        });
    };

    UserService.prototype.Logout = function () {
        self.UserFactory.Login({verb: 'logout'}, {}, function (data) {
            self.MyUser = {
                id: 0,
                isLogged: false,
                username: '',
                userrole: 0,
                useremail: ''
            };
            self.$window.sessionStorage.removeItem("User");
        });
    };

    UserService.prototype.isAdmin = function () {
        if (self.MyUser === null)
            return false;

        //Central Admin is also a normal admin
        if (self.MyUser.userrole === 1 || self.MyUser.userrole === 3) {
            return true;
        } else {
            return false;
        }
    };

    UserService.prototype.isCentralAdmin = function () {
        if (self.MyUser === null)
            return false;

        if (self.MyUser.userrole === 3) {
            return true;
        } else {
            return false;
        }
    };

    UserService.prototype.getToken = function () {
        if (self.MyUser) {
            return self.MyUser.token;
        } else {
            return null;
        }
    };

    UserService.prototype.isWriter = function () {
        if (self.MyUser === null)
            return false;

        if (self.MyUser.userrole === 1 || self.MyUser.userrole === 2 || self.MyUser.userrole === 3) {
            return true;
        } else {
            return false;
        }
    };

    UserService.prototype.isLogged = function () {
        if (!self.$window.sessionStorage["User"]) {
            return false;
        }
        return self.$window.sessionStorage["User"];
    };

    UserService.prototype.getUser = function () {
        return self.MyUser;
    };

    UserService.prototype.getUserName = function () {
        if (self.MyUser === null) {
            return '';
        } else {
            return self.MyUser.username;
        }
    };

    UserService.prototype.Init = function () {
        if (self.$window.sessionStorage["User"]) {
            if (JSON.parse(self.$window.sessionStorage["User"]) != null) {
                self.MyUser = JSON.parse(self.$window.sessionStorage["User"]);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    UserService.prototype.getUserId = function () {
        if (self.MyUser === null) {
            return 0;
        } else {
            return self.MyUser.id;
        }
    };


    angular.module('login').service('UserService', UserService);
}());
