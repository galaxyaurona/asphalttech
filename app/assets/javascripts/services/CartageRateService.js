angular
   .module("ARM.cartage.services", ['ARM.helper.services', 'ngResource'])
   .factory("CartageRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/cartage_rate/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/cartage_rate/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         }
      })
   })
   .factory("CartageRateService", function (CartageRESTResouces, HelperService) {
      var CartageRateServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      CartageRateServiceFactory.query = function () {
            return HelperService.backendCall(CartageRESTResouces, "query", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      CartageRateServiceFactory.get = function (id) {
            return HelperService.backendCall(CartageRESTResouces, "get", {
               id: id
            },true)
         }
         // $resouce default action save equivalent to create new or rails create method
      CartageRateServiceFactory.save = function (newRate) {
            return HelperService.backendCall(CartageRESTResouces, "save", newRate,true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      CartageRateServiceFactory.delete = function (rate) {
         return HelperService.backendCall(CartageRESTResouces, "delete", {
            id: rate.id
         },true)
      }
      // Custom user method for updating existing employees
      CartageRateServiceFactory.update = function (newRate) {
         return HelperService.backendCall(CartageRESTResouces, "update", newRate,true)
      }

      //Changed this to accept rates as well - waste of networking to get rates each time from the server
      CartageRateServiceFactory.getRate = function(distance,rates)
      {
         var response = -1;
         angular.forEach(rates,function(value,key){
            if(value.km == distance){
               response = value.rate;
            };
         });
         return response;
      }
      
      /*//Just incase the rates are not available
      CartageRateServiceFactory.getRate = function(distance)
      {
         console.log("Get Rate called with Distance")
         var rates = {};
         CartageRateServiceFactory.query().then(function(response)
         {
            rates = response;
         });
         return CartageRateServiceFactory.getRate(distance,rates);
      }*/
      
      return CartageRateServiceFactory;
   })