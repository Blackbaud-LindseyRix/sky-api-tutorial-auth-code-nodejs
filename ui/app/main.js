(function (angular) {
    'use strict';

    angular.module('AuthCodeFlowTutorial', ['ngRoute'])
        .config(function ($routeProvider) {

            /**
            *  Define the views/hash routes for our app to use.
            *  For this example we will only be using two,  a #/home
            *  and a #/auth-success.   We define which controllers and
            *  templates each view will use.
            */
            $routeProvider
                .when('/home', {
                    templateUrl: './app/main-template.html',
                    controller: 'AppController'
                })
                .when('/auth-success', {
                    template: '<h1>Login Successful</h1>',
                    controller: 'AuthController'
                })
                .otherwise({
                    redirectTo: '/home'
                })
        })

        /**
        *This controller is for handling our post-success authentication.
        */
        .controller('AuthController', function ($window) {

            /**
            * When we arive at this view, the popup window is closed, and we redirect the main
            * Window to our desired route, in this case, '/';
            *   -This is also a great place for doing any post-login logic you want to implement
            *    before we redirect.
            */
            $window.opener.location = '/';
            $window.close();
        })

        /**
        * General controller for handling our app in most states.  As our app grows, we would use more
        * controllers for each view.
        */
        .controller('AppController', function ($scope, $http, $window) {

            /**
            *  Check user access token.
            */
            $http.get('/auth/authenticated').then(function (res) {
                $scope.isAuthenticated = res.data.authenticated;
                if ($scope.isAuthenticated === false) {
                    $scope.isReady = true;
                    return;
                }

                /**
                *  Access token is valid. Fetch constituent record.
                */
                $http.get('/api/constituents/280').then(function (res) {
                    $scope.constituent = res.data;
                    $scope.isReady = true;
                });
            });

            /**
            *  Opens a new popup window, and directs it to our login route,  to achieve the correct
            *  redirect on success to close the popup window and redirect the parent, we pass in
            *  the ?redirect= as a paremeter and set it to the hash url we want to watch.
            */
            $scope.popupLogin = function () {
                var popup

                popup = window.open('auth/login?redirect=/%23/auth-success', 'login', 'height=450,width=600,');
                if (window.focus) {
                    popup.focus();
                }
            }
        });
})(window.angular);
