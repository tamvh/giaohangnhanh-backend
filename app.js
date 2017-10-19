/* global posConfig, angular, API_URL */

var theApp = angular.module('theApp', ['ngRoute', 'ngCookies', 'smart-table', 'ui.bootstrap', 'ngFileUpload', 'angular-confirm', 'ngMaterial', 'bootstrapLightbox', 'angularjs-dropdown-multiselect']);

theApp.constant('API_URL', API_URL); //define CONST API_URL
(function () {
    'use strict';
    theApp
            .config(config)
            .run(run);

    config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider'];
    function config($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
                .when('/', {
                    controller: 'DashboardController',
                    templateUrl: 'dashboard/dashboard.view.html?v=' + posConfig.TEMPLATE_DASHBOARD_VERSION
                })
                .when('/login/', {
                    controller: 'LoginController',
                    templateUrl: 'login/login.view.html?v=' + posConfig.TEMPLATE_LOGIN_VERSION
                })
                .when('/dashboard/', {
                    controller: 'DashboardController',
                    templateUrl: 'dashboard/dashboard.view.html?v=' + posConfig.TEMPLATE_DASHBOARD_VERSION
                })
                .when('/listcabinet/', {
                    controller: 'ListCabinetController',
                    templateUrl: 'cabinets/list.cabinet.view.html?v=' + posConfig.TEMPLATE_CABINET_VERSION
                })
                .when('/cabinet/:cabinet_id', {
                    controller: 'CabinetDetailsController',
                    templateUrl: 'cabinet_details/cabinet.details.view.html?v=' + posConfig.TEMPLATE_CABINET_DETAILS_VERSION
                })
                .when('/historyopenbox/', {
                    controller: 'HistoryOpenBoxController',
                    templateUrl: 'historyopenbox/history.openbox.view.html?v=' + posConfig.TEMPLATE_HISTORYOPENBOX_VERSION
                })
                .otherwise({redirectTo: '/'});

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    run.$inject = ['$rootScope', '$cookies', '$location', '$window'];
    function run($rootScope, $cookies, $location, $window) {
        $rootScope.globals = {currentUser: {}};

        $rootScope.loadSidebarTemplate = "sidebar/sidebar.view.html?v=" + posConfig.TEMPLATE_SIDEBAR_VERSION;
        $rootScope.loadHeaderTemplate = "header/header.view.html?v=" + posConfig.TEMPLATE_HEADER_VERSION;

        if (localStorage.newtabInfo) {
            var newtabInfo = JSON.parse(localStorage.newtabInfo);
            $cookies.put('u', newtabInfo.u);
            localStorage.removeItem("newtabInfo");
        }

        $rootScope.globals.currentUser.username = ($cookies.get('u') !== undefined ? $cookies.get('u') : "");


        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var loggedIn = ($rootScope.globals.currentUser.username !== "");

//            if (!loggedIn) {
//                $location.path('/login');
//            } else {
//            }
            $rootScope.menuItemList = [
                    {
                        index: 0,
                        title: "Tổng quan",
                        icon: "fa fa-dashboard",
                        value: 1201,
                        bshow: true,
                        link: "#dashboard",
                        submenu: []
                    },
                    {
                        index: 1,
                        title: "Danh sách tủ",
                        icon: "fa fa-list-alt",
                        value: 1201,
                        bshow: true,
                        link: "#listcabinet",
                        submenu: []
                    },
                    {
                        index: 2,
                        title: "Lịch sử mở tủ",
                        icon: "fa fa-bar-chart",
                        value: 1201,
                        bshow: true,
                        link: "#historyopenbox",
                        submenu: []
                    }
                ];
        });
    };


    theApp.directive('currencyInput', function ($filter, $browser) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    $element.val($filter('number')(value, false));
                };

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    return viewValue.replace(/,/g, '');
                });

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, false));
                };

                $element.bind('change', listener);
                $element.bind('keydown', function (event) {
                    var key = event.keyCode;
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
                        return;
                    $browser.defer(listener); // Have to do this or changes don't get picked up properly
                });

                $element.bind('paste cut', function () {
                    $browser.defer(listener);
                });
            }
        };
    });



})();
