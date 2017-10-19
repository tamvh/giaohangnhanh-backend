/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('DashboardService', DashboardService);

    DashboardService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function DashboardService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "cabinet"; 
        
        service.getListCabinet = getListCabinet;
        service.deleteListItem = deleteListItem;
        service.insertItem = insertItem;
        service.editItem = editItem;
        return service;

        function editItem(item) {
            var cmd = "edit_cabinet";
            var dtJSON = {cabinet: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error edit cabinet'));
        }

        function insertItem(item) {
            var cmd = "insert_cabinet";
            var dtJSON = {cabinet: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error insert cabinet'));
        }

        function deleteListItem(listID) {
            var cmd = "delete_cabinet";
            var dtJSON = {list_item_id_del: listID};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error delete list cabinet'));
        }

        function getListCabinet() {
            var cmd = "get_list_cabinet";
            var data = $.param({
                cm: cmd
            });            
            return $http.post(url, data).then(handleSuccess, handleError('Error get list cabinet'));
        }
       
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {            
            return function () {
                return { err: -2, msg: error };
            };
        }
       
    }
    
})();
