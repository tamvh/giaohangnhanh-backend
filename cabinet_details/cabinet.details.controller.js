/* global theApp */

(function () {
    'use strict';
    theApp.controller('CabinetDetailsController', CabinetDetailsController);
    CabinetDetailsController.$inject = ['$scope', 'CabinetDetailsService', 'BoxService', 'LoginService', '$rootScope', '$uibModal', '$timeout', '$location', '$confirm'];
    function CabinetDetailsController($scope, CabinetDetailsService, BoxService, LoginService, $rootScope, $uibModal, $timeout, $location, $confirm) {
        $rootScope.listcabinet = [];
        $rootScope.listbox = [];
        
        if (!LoginService.isLogined()) {
            $location.path("/login");
            return;
        }
        
        $scope.init = function () {
            console.log('init cabinet details');

            CabinetDetailsService.getListCabinet()
                    .then(function (response) {
                        if (response.err === 0) {
                            $rootScope.listcabinet = response.dt;
                            var cabinet_id = getCabinetId();
                            for (var i in $rootScope.listcabinet) {
                                $rootScope.listcabinet[i].cindex = i;
                                if($rootScope.listcabinet[i].id === cabinet_id) {
                                    $rootScope.listcabinet[i].active = 1;
                                } else {
                                    $rootScope.listcabinet[i].active = 0;
                                }
                            }
                            
                            for (var i in $rootScope.listcabinet) {
                                if ($rootScope.listcabinet[i].id === cabinet_id) {
                                    $rootScope.listbox = $rootScope.listcabinet[i].list_box;
                                    break;
                                }
                            }
                        } else {
                            console.log("error get list cabinet");
                        }

                    });
        };
        $scope.init();

        $scope.deleteItems = function () {
            console.log('delete items');
            $scope.listItemIDDelete = [];
            for (var i in $scope.listbox) {
                if ($scope.listbox[i].delete_selected === true) {
                    $scope.listItemIDDelete.push($scope.listbox[i].id);
                }
            }
            if ($scope.listItemIDDelete.length <= 0) {
                alert('Bạn phải chọn box trước khi xoá.');
            } else {
                $confirm({title: 'Xóa box', text: 'Bạn có chắc chắn xóa box này ra khỏi hệ thống?'})
                        .then(function () {
                            console.log('delete list item');
                            BoxService.deleteListBox($scope.listItemIDDelete)
                                    .then(function (response) {
                                        if (response.err === 0) {
                                            console.log('delete box success');
                                            $scope.init();
                                        } else {
                                            console.log("error delete box");
                                        }
                                    });
                        });

            }
        };

        $scope.openPopupEditBox = function (boxItem) {
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupEditBox.html',
                controller: 'EditBoxController',
                resolve: {
                    boxItem: function () {
                        return boxItem;
                    }
                }
            });
        };

        $scope.openPopupAddItem = function () {
            var cabinet_id = getCabinetId();
            $uibModal.open({
                animation: true,
                templateUrl: 'PopupAddBox.html',
                controller: 'AddBoxController',
                resolve: {
                    cabinetId: function () {
                        return cabinet_id;
                    }
                }
            });
        };

        $scope.selectbox = function (item) {
            $location.path('/cabinet/' + item.id);
        };
        function getCabinetId() {
            var path = $location.path();
            var cabinet_id = -1;
            try {
                cabinet_id = (path.toString().split('/').length === 3) ? parseInt(path.toString().split('/')[2].toString()) : -1;
            } catch (e) {
                return -1;
            }
            return cabinet_id;
        }
    }

    theApp.controller('AddBoxController', AddBoxController);
    AddBoxController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'cabinetId', 'BoxService'];
    function AddBoxController($rootScope, $scope, $uibModalInstance, cabinetId, BoxService) {
        $scope.newItem = {};
        $scope.errItemIsNull = false;
        $scope.ok = function () {
            if (String($scope.newItem.label).trim() === "" || String($scope.newItem.label).trim() === "undefined") {
                $scope.errItemIsNull = true;
                return;
            }
            $scope.newItem.cabinet_id = cabinetId;
            BoxService.insertBox($scope.newItem)
                    .then(function (response) {
                        if (response.err === 0) {
                            $scope.newItem = response.dt;
                            $rootScope.listbox.push(response.dt);
                            console.log('insert cabinet box');
                        } else {
                            console.log("error insert box");
                            alert('Lưu thông tin thất bại.');
                        }
                    });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };

    }

    theApp.controller('EditBoxController', EditBoxController);
    EditBoxController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'boxItem', 'BoxService'];
    function EditBoxController($rootScope, $scope, $uibModalInstance, boxItem, BoxService) {
        $scope.editItem = {};
        $scope.errItemIsNull = false;
        $scope.init = function () {
            $scope.editItem = boxItem;
            console.log(JSON.stringify('init: ' + $scope.editItem));
        };
        $scope.init();
        $scope.ok = function () {
            if (String($scope.editItem.label).trim() === "" || String($scope.editItem.label).trim() === "undefined") {
                $scope.errItemIsNull = true;
                return;
            }

            BoxService.editBox($scope.editItem)
                    .then(function (response) {
                        if (response.err === 0) {
                            $scope.editItem = response.dt;
                            console.log('res data: ' + JSON.stringify($scope.editItem));
                            $scope.updateBox();
                            console.log('edit box success');
                        } else {
                            console.log("error edit box");
                            alert('Lưu thông tin thất bại.');
                        }
                    });
            $uibModalInstance.close();
        };

        $scope.updateBox = function () {
            for (var i in $rootScope.listbox) {
                if ($rootScope.listbox[i].id === $scope.editItem.id) {
                    $rootScope.listbox[i].label = $scope.editItem.label;
                    $rootScope.listbox[i].attacheddata = $scope.editItem.attacheddata;
                }
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        };

    }
})();