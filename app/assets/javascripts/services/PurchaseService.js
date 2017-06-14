angular
   .module("ARM.purchase.services", ['ARM.helper.services', 'ngResource'])
   .factory("PurchaseRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/purchase/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/purchase/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         },
         "inRange": {
            method: 'GET',
            url: "/purchase/in_range"
         }
      })
   })
   .factory("PurchaseService", function (PurchaseRESTResouces, HelperService) {
      var PurchaseServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      PurchaseServiceFactory.query = function () {
            return HelperService.backendCall(PurchaseRESTResouces, "query", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      PurchaseServiceFactory.get = function (id) {
            return HelperService.backendCall(PurchaseRESTResouces, "get", {
               id: id
            }, true)
         }
         // $resouce default action save equivalent to create new or rails create method
      PurchaseServiceFactory.save = function (newPurchase) {
            return HelperService.backendCall(PurchaseRESTResouces, "save", newPurchase, true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      PurchaseServiceFactory.delete = function (purchase) {
         return HelperService.backendCall(PurchaseRESTResouces, "delete", {
            id: purchase.id
         }, true)
      }
      PurchaseServiceFactory.update = function (newPurchase) {
         return HelperService.backendCall(PurchaseRESTResouces, "update", newPurchase, true)
      }
      PurchaseServiceFactory.inRange = function (startDate, endDate) {
         return HelperService.backendCall(PurchaseRESTResouces, "inRange", {
            start_date: startDate,
            end_date: endDate
         }, true)
      }
      PurchaseServiceFactory.thisMonth = function () {
         var date = new Date(),
         startDate = new Date(date.getFullYear(), date.getMonth(), 1),
         endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

         return HelperService.backendCall(PurchaseRESTResouces, "inRange", {
            start_date: startDate,
            end_date: endDate
         }, false)
      }



      return PurchaseServiceFactory;
   })