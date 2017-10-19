/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('CabinetDetailsService', CabinetDetailsService);

    CabinetDetailsService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function CabinetDetailsService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "cabinet"; 
        
        service.getListCabinet = getListCabinet;
        return service;

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
