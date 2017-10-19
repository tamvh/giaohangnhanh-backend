/* global theApp */

(function () {
    'use strict';

    theApp
        .factory('HistoryOpenBoxService', HistoryOpenBoxService);

    HistoryOpenBoxService.$inject = ['$rootScope', '$http', '$q', 'API_URL'];
    function HistoryOpenBoxService($rootScope, $http, $q, API_URL) {
        var service = {};
        var url = API_URL + "box"; 
        
        service.getHistoryOpenBoxPerPage = getHistoryOpenBoxPerPage;
        return service;

        function getHistoryOpenBoxPerPage(currentPage, totalItemPerPage, fromDate, toDate){
            var cmd = "get_list_history_openbox";
            var dtJSON = {    
                current_page: currentPage,
                total_item_per_page: totalItemPerPage,
                fromDate: fromDate,
                toDate: toDate
            };
            var dt = JSON.stringify(dtJSON);
            var data = $.param({
                cm: cmd,
                dt: dt
            });            
            return $http.post(url, data).then(handleSuccess, handleError('Error get list history openbox'));

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
