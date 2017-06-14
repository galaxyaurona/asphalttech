angular
   .module("ARM.invoice.services", ['ARM.helper.services', 'ngResource'])
   .factory("InvoiceRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/invoice/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/invoice/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         },
         "inRange": {
            method: 'GET',
            url: "/invoice/in_range"
         }
      })
   })
   .factory("InvoiceService", function (InvoiceRESTResouces, HelperService) {
      var InvoiceServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      InvoiceServiceFactory.query = function () {
            return HelperService.backendCall(InvoiceRESTResouces, "query", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      InvoiceServiceFactory.get = function (id) {
            return HelperService.backendCall(InvoiceRESTResouces, "get", {
               id: id
            }, true)
         }
         // $resouce default action save equivalent to create new or rails create method
      InvoiceServiceFactory.save = function (newInvoice) {
            return HelperService.backendCall(InvoiceRESTResouces, "save", newInvoice, true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      InvoiceServiceFactory.delete = function (invoice) {
         return HelperService.backendCall(InvoiceRESTResouces, "delete", {
            id: invoice.id
         }, true)
      }
      InvoiceServiceFactory.update = function (newInvoice) {
         return HelperService.backendCall(InvoiceRESTResouces, "update", newInvoice, true)
      }
      InvoiceServiceFactory.inRange = function (startDate, endDate) {
         return HelperService.backendCall(InvoiceRESTResouces, "inRange", {
            start_date: startDate,
            end_date: endDate
         }, true)
      }
      InvoiceServiceFactory.thisMonth = function () {
         var date = new Date(),
         startDate = new Date(date.getFullYear(), date.getMonth(), 1),
         endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)

         return HelperService.backendCall(InvoiceRESTResouces, "inRange", {
            start_date: startDate,
            end_date: endDate
         }, false)
      }



      return InvoiceServiceFactory;
   })