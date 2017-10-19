/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('BoxService', BoxService);

    BoxService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function BoxService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "box"; 
        
        service.insertBox = insertBox;
        service.editBox = editBox;
        service.deleteListBox = deleteListBox;
        return service;

        function editBox(item) {
            var cmd = "edit_box_info";
            var dtJSON = {box: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error edit box'));
        }

        function deleteListBox(item) {
            var cmd = "delete_box";
            var dtJSON = {list_item_id_del: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error delete list box'));
        }

        function insertBox(item) {
            var cmd = "insert_box";
            var dtJSON = {box: item};
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });
            return $http.post(url, data).then(handleSuccess, handleError('Error insert box'));
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
