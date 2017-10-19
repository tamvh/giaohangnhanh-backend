/* global theApp, Highcharts */

(function () {
    'use strict';
    theApp.controller('ListCabinetController', ListCabinetController);
    ListCabinetController.$inject = ['$scope', 'ListCabinetService', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', '$confirm'];
    function ListCabinetController($scope, ListCabinetService, LoginService, $rootScope, $uibModal, $timeout, $location, $confirm) {
        $rootScope.listcabinet = [];
        $scope.itemNameSearch = "";
        
        if (!LoginService.isLogined()) {
            $location.path("/login");
            return;
        }
        
        $scope.init = function () {
            console.log('init listcabinetcontroller');
            ListCabinetService.getListCabinet()
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
                            ListCabinetService.deleteListItem($scope.listItemIDDelete)
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
    
    theApp.controller('EditItemController', EditItemController);
    EditItemController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'ListCabinetService', 'itemCabinet'];
    function EditItemController($rootScope, $scope, $uibModalInstance, ListCabinetService, itemCabinet) {
        $scope.editItem = {};
        $scope.init = function() {
            console.log(JSON.stringify(itemCabinet));
            $scope.editItem.id = itemCabinet.id;
            $scope.editItem.name = itemCabinet.name;
            $scope.editItem.nlat = itemCabinet.nlat;
            $scope.editItem.nlong = itemCabinet.nlong;
            $scope.editItem.address = itemCabinet.address;
        };
        $scope.init();
        $scope.edit = function() {
            if(String($scope.editItem.name).trim() === "" || String($scope.editItem.name).trim() === "undefined") {
                $scope.errItemIsNull = true;
                return;
            }
            ListCabinetService.editItem($scope.editItem)
                    .then(function (response) {
                        if (response.err === 0) {
                            console.log('edit cabinet success');
                            $scope.updateItemInList();
                        } else {
                            console.log("error edit cabinet");
                            alert('Chỉnh sửa thông tin thất bại.');
                         }
                    });
            $uibModalInstance.close();
        };
        
        $scope.updateItemInList = function() {
            for(var i in $rootScope.listcabinet) {
                if($rootScope.listcabinet[i].id === $scope.editItem.id) {
                    $rootScope.listcabinet[i].name = $scope.editItem.name;
                    $rootScope.listcabinet[i].nlat = $scope.editItem.nlat;
                    $rootScope.listcabinet[i].nlong = $scope.editItem.nlong;
                    $rootScope.listcabinet[i].address = $scope.editItem.address;
                    break;
                }
            }
        };
        
        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    }

    theApp.controller('AddItemController', AddItemController);
    AddItemController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'ListCabinetService'];
    function AddItemController($rootScope, $scope, $uibModalInstance, ListCabinetService) {
        $scope.newItem = {};
        $scope.errItemIsNull = false;
        $scope.ok = function () {
            if(String($scope.newItem.name).trim() === "" || String($scope.newItem.name).trim() === "undefined") {
                $scope.errItemIsNull = true;
                return;
            }
            ListCabinetService.insertItem($scope.newItem)
                    .then(function (response) {
                        if (response.err === 0) {
                            $scope.newItem = response.dt;
                            $rootScope.listcabinet.push($scope.newItem);
                            console.log('insert cabinet success');
                        } else {
                            console.log("error insert cabinet");
                            alert('Lưu thông tin thất bại.');
                         }
                    });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };
        
    }
})();