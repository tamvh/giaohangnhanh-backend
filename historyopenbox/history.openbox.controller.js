/* global theApp */

(function () {
    'use strict';
    theApp.controller('HistoryOpenBoxController', HistoryOpenBoxController);
    HistoryOpenBoxController.$inject = ['$scope', 'HistoryOpenBoxService', 'BoxService', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', '$confirm'];
    function HistoryOpenBoxController($scope, HistoryOpenBoxService, BoxService, LoginService, $rootScope, $uibModal, $timeout, $location, $confirm) {
        $scope.totalOpenBoxPerPageList = [10, 30, 50, 100];
        $scope.totalOpenBoxPerPage = 10;
        $scope.currentPage = 1;
        $scope.fromDate = new Date();
        $scope.toDate = new Date();
        $scope.loadPageChoose = function () {
            var fromDate = "";
            var toDate = "";
            if ($scope.fromDate !== "") {
                fromDate = $scope.fromDate.getFullYear() + "-" + ($scope.fromDate.getMonth() + 1) + "-" + $scope.fromDate.getDate();
            }

            if ($scope.toDate !== "") {
                toDate = $scope.toDate.getFullYear() + "-" + ($scope.toDate.getMonth() + 1) + "-" + $scope.toDate.getDate();
            }
            console.log('from: ' + fromDate + ", to: " + toDate);
            HistoryOpenBoxService.getHistoryOpenBoxPerPage($scope.currentPage, $scope.totalOpenBoxPerPage, fromDate, toDate)
                    .then(function (response) {
                        console.log(JSON.stringify(response));
                        if (response.err === 0) {
                            $scope.historyOpen = JSON.parse(response.dt.list_history);
                            $scope.totalHistoryOpenBox = response.dt.length;
                        } else {
                            console.log("error get list history open box");
                        }

                    });
        }
        ;
        $scope.init = function () {
            console.log('init history open box');
            $scope.loadPageChoose();
        };
        $scope.init();

        $scope.changePageSize = function () {
            $scope.currentPage = 1;
            $scope.loadPageChoose();
        };
        $scope.search = function() {
            var fromDate = "";
            var toDate = "";
            if ($scope.fromDate !== "") {
                fromDate = $scope.fromDate.getFullYear() + "-" + ($scope.fromDate.getMonth() + 1) + "-" + $scope.fromDate.getDate();
            }

            if ($scope.toDate !== "") {
                toDate = $scope.toDate.getFullYear() + "-" + ($scope.toDate.getMonth() + 1) + "-" + $scope.toDate.getDate();
            }
            $scope.loadPageChoose();
        };
    }
})();