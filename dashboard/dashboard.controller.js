/* global theApp, Highcharts */

(function () {
    'use strict';
    theApp.controller('DashboardController', DashboardController);
    DashboardController.$inject = ['$scope', 'DashboardService', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', '$confirm'];
    function DashboardController($scope, DashboardService, LoginService, $rootScope, $uibModal, $timeout, $location, $confirm) {
        $rootScope.listcabinet = [];
        $scope.itemNameSearch = "";
        
        if (!LoginService.isLogined()) {
            $location.path("/login");
            return;
        }
        
        $scope.init = function () {
            console.log('init listcabinetcontroller');
            DashboardService.getListCabinet()
                    .then(function (response) {
                        if (response.err === 0) {
                            $rootScope.listcabinet = response.dt;
                            $scope.items = response.dt;
                        } else {
                            console.log("error get list cabinet");
                        }

                    });
        };
        $scope.init();
        
        $scope.search = function() {
            
        };
        
        $scope.deleteItems = function () {
            console.log('delete items');
            $scope.listItemIDDelete = [];
            for (var i in $scope.listcabinet) {
                if ($scope.listcabinet[i].delete_selected === true) {
                    $scope.listItemIDDelete.push($scope.listcabinet[i].id);
                }
            }
            if ($scope.listItemIDDelete.length <= 0) {
                alert('Bạn phải chọn tủ trước khi xoá.');
            } else {
                $confirm({title: 'Xóa tủ', text: 'Bạn có chắc chắn xóa tủ này ra khỏi hệ thống?'})
                        .then(function () {
                            console.log('delete list item');
                            DashboardService.deleteListItem($scope.listItemIDDelete)
                                    .then(function (response) {
                                        if (response.err === 0) {
                                            console.log('delete cabinet success');
                                            $scope.init();
                                        } else {
                                            console.log("error delete cabinet");
                                        }
                                    });
                        });

            }
        };

        $scope.openPopupEditItem = function(item) {
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupEditItem.html',
                controller: 'EditItemController',
                resolve: {
                    itemCabinet: function () {
                        return item;
                    }
                }
            });
        };

        $scope.openPopupAddItem = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupAddItem.html',
                controller: 'AddItemController',
                resolve: {
                }
            });
            
        };
    }
})();