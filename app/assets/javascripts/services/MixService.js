angular
   .module("ARM.mix.services", ['ARM.helper.services', 'ngResource'])
   .factory("MixRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/mix/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/mix/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         },
         "uncorrupted": {
            method: 'PUT',
            url: "/mix/:id/uncorrupted.:format",
            params: {
               format: "json",
               id: '@id'
            }
         }
      })
   })
   .factory("MixService", function (MixRESTResouces, HelperService) {
      var MixServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      MixServiceFactory.query = function () {
            return HelperService.backendCall(MixRESTResouces, "query", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      MixServiceFactory.get = function (id) {
            return HelperService.backendCall(MixRESTResouces, "get", {
               id: id
            }, true)
         }
         // $resouce default action save equivalent to create new or rails create method
      MixServiceFactory.save = function (newMix) {
            return HelperService.backendCall(MixRESTResouces, "save", newMix, true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      MixServiceFactory.delete = function (mix) {
         return HelperService.backendCall(MixRESTResouces, "delete", {
            id: mix.id
         }, true)
      }
      MixServiceFactory.update = function (newMix) {
         return HelperService.backendCall(MixRESTResouces, "update", newMix, true)
      }
      MixServiceFactory.uncorrupted = function (corruptedMix) {
         return HelperService.backendCall(MixRESTResouces, "uncorrupted", corruptedMix)
      }


      return MixServiceFactory;
   })