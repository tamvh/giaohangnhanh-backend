

/* global theApp */

theApp.controller('HeaderController', function($rootScope,$scope, $http,$cookies, $location, LoginService, $window) {
    
    var path = $location.path();
    var titlePage = "Giao hàng nhanh - Admin";
    switch(path){
        case '/dashboard/':
            titlePage = "Tổng quan";
            break;
        case '/listcabinet/':
            titlePage = "Danh sách tủ";
            break;
        case '/historyopenbox/':
            titlePage = "Lịch sử mở tủ";
            break;
    }
    
    $scope.titlePage = titlePage;
    
    $scope.logout = function (){
        $rootScope.globals.currentUser.username = "";
        $cookies.remove('u');   
        $location.path("/login");  
    };
});