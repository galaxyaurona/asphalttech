angular
   .module("ARM.material.services", ['ARM.helper.services', 'ngResource'])
   .factory("MaterialRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/material/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/material/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         }
      })
   })
   .factory("MaterialService", function (MaterialRESTResouces, HelperService) {
      var MaterialServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      MaterialServiceFactory.query = function () {
            return HelperService.backendCall(MaterialRESTResouces, "query", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      MaterialServiceFactory.get = function (id) {
            return HelperService.backendCall(MaterialRESTResouces, "get", {
               id: id
            },true)
         }
         // $resouce default action save equivalent to create new or rails create method
      MaterialServiceFactory.save = function (newMaterial) {
            return HelperService.backendCall(MaterialRESTResouces, "save", newMaterial,true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      MaterialServiceFactory.delete = function (material) {
         return HelperService.backendCall(MaterialRESTResouces, "delete", {
            id: material.id
         },true)
      }
      MaterialServiceFactory.update = function (newMaterial) {
         return HelperService.backendCall(MaterialRESTResouces, "update", newMaterial,true)
      }

      return MaterialServiceFactory;
   })