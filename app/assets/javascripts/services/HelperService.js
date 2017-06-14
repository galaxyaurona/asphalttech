angular
   .module("ARM.helper.services", ['ui.bootstrap'])
   .factory('HelperService', function ($q, $mdToast, $uibModal) {
      var HelperServiceFactory = {};
      // Helper service to DRY up the repeatitive process of $q defer and resolve, reject
      HelperServiceFactory.backendCall = function (resource, method, params, loading) {
         var deferred = $q.defer();



         var modalInstance = {}
         if (loading)
            modalInstance = $uibModal.open({
               animation: true,
               templateUrl: 'loadingModal.html',
               controller: function () {},
               size: 'sm',
               backdrop: 'static',
            });

         resource[method](params, function (response) {
            if (loading)
               modalInstance.close()

            deferred.resolve(response);
         }, function (error) {
            if (loading)
               modalInstance.close()
            deferred.resolve({status:false,msg: error});
         })
         return deferred.promise;
      }
      
      HelperServiceFactory.checkExist = function (array,attr,item) {
         var tempArray = array.map(function (currentValue, index, currentArray) {
            return currentValue[attr];
         })
         return tempArray.indexOf(item[attr]) != -1;
      }
      
      return HelperServiceFactory;
   })