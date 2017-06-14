angular
   .module("ARM.callup.services", ['ARM.helper.services', 'ngResource'])
   .factory("CallupRegisterRESTResouces", function ($resource) {
      // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/callup_register/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/callup_register/:id.:format",
            params: {
               format: "json",
               id: '@id'
            }
         },
         "today": {
            method: 'GET',
            url: "/callup_register/today.:format",
            params: {
               format: "json",
            }
         },
         "tomorrow": {
            method: 'GET',
            url: "/callup_register/tomorrow.:format",
            params: {
               format: "json",
            }
         },
         "this_week": {
            method: 'GET',
            url: "/callup_register/this_week.:format",
            params: {
               format: "json",
            }
         },
         "this_month": {
            method: 'GET',
            url: "/callup_register/this_month.:format",
            params: {
               format: "json",
            }
         },
         "range": {
            method: 'GET',
            url: "/callup_register/range/:range.:format",
            params: {
               format: "json",
               range: "@range"
            }
         }
      })
   })
   .factory("CallupRegisterService", function (CallupRegisterRESTResouces, HelperService) {
      var CallupRegisterServiceFactory = {};
      // $resouce default action query equivalent to get all or rails index method
      CallupRegisterServiceFactory.query = function () {
         return HelperService.backendCall(CallupRegisterRESTResouces, "query", {})
      }

      CallupRegisterServiceFactory.today = function () {
         return HelperService.backendCall(CallupRegisterRESTResouces, "today", {})
      }
      CallupRegisterServiceFactory.tomorrow = function () {
         return HelperService.backendCall(CallupRegisterRESTResouces, "tomorrow", {})
      }
      CallupRegisterServiceFactory.this_week = function () {
         return HelperService.backendCall(CallupRegisterRESTResouces, "this_week", {})
      }
      CallupRegisterServiceFactory.this_month = function () {
            return HelperService.backendCall(CallupRegisterRESTResouces, "this_month", {})
         }
         // $resouce default action query equivalent to get one or rails show method
      CallupRegisterServiceFactory.get = function (id) {
         return HelperService.backendCall(CallupRegisterRESTResouces, "get", {
            id: id
         }, true)
      }
      CallupRegisterServiceFactory.period = function (range) {
            return HelperService.backendCall(CallupRegisterRESTResouces, "range", {
               range: range
            }, true)
         }
         // $resouce default action save equivalent to create new or rails create method
      CallupRegisterServiceFactory.save = function (newCallupRegister) {
            return HelperService.backendCall(CallupRegisterRESTResouces, "save", newCallupRegister, true)
         }
         // $resouce default action save equivalent to create new or rails delete method
      CallupRegisterServiceFactory.delete = function (callup_register) {
         return HelperService.backendCall(CallupRegisterRESTResouces, "delete", {
            id: callup_register.id
         }, true)
      }
      CallupRegisterServiceFactory.update = function (newCallupRegister) {
         return HelperService.backendCall(CallupRegisterRESTResouces, "update", newCallupRegister, true)
      }

      return CallupRegisterServiceFactory;
   })