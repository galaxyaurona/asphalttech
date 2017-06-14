angular
   .module("ARM.client.services", ['ARM.helper.services', 'ngResource'])
   .factory("ClientRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/client/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/client/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         },
         "queryClientsJob": {
            method: 'GET',
            url: "/client/job.:format",
            params: {
               format: "json",
               id: '@id'
            }
         }
      })
   })
   .factory("ClientService", function (ClientRESTResouces, HelperService) {
      var ClientServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      ClientServiceFactory.query = function () {
            return HelperService.backendCall(ClientRESTResouces, "query", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      ClientServiceFactory.get = function (id) {
            return HelperService.backendCall(ClientRESTResouces, "get", {
               id: id
            }, true)
         }
         // $resouce default action save equivalent to create new or rails create method
      ClientServiceFactory.save = function (newClient) {
            return HelperService.backendCall(ClientRESTResouces, "save", newClient, true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      ClientServiceFactory.delete = function (client) {
         return HelperService.backendCall(ClientRESTResouces, "delete", {
            id: client.id
         }, true)
      }
      ClientServiceFactory.update = function (newClient) {
         return HelperService.backendCall(ClientRESTResouces, "update", newClient, true)
      }
      ClientServiceFactory.queryClientsJob = function(query) {
         return HelperService.backendCall(ClientRESTResouces, "queryClientsJob", query, true)
      }


      return ClientServiceFactory;
   })