angular
   .module("ARM.employee.services", ['ARM.helper.services', 'ngResource'])
   .factory("EmployeeRESTResouces", function ($resource) {
       
        // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/employee/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/employee/:id.:format",
            params:{format:"json",id:'@id'}
         }
      })
   })
   .factory("EmployeeService",function(EmployeeRESTResouces,HelperService){
       var EmployeeServiceFactory = {};
       
       // $resouce default action query equivalent to : {method:'GET'} AKA 'Get via Identifier'
      EmployeeServiceFactory.get = function (id) {
            return HelperService.backendCall(EmployeeRESTResouces, "get",{id:id},true)
         }
       
       // $resouce default action query equivalent to : {method:'POST'} AKA 'POST or CREATE'
      EmployeeServiceFactory.save = function (newEmployee) {
            return HelperService.backendCall(EmployeeRESTResouces, "save", newEmployee) //TODO: Ensure this actually sends the object correctly
         }
       
       // $resouce default action query equivalent to : {method:'GET', isArray:true} AKA 'Get All'
      EmployeeServiceFactory.query = function () {
            return HelperService.backendCall(EmployeeRESTResouces, "query", {},true)
         }
       
       // $resource default action query equivalent to : {method:'DELETE'}
       EmployeeServiceFactory.remove = function (id) {
            return HelperService.backendCall(EmployeeRESTResouces, "delete", {id:id})
         }
         
         // $resource default action query equivalent to : {method:'PUT'} AKA edit existing
       EmployeeServiceFactory.update = function (oldEmployee) {
            return HelperService.backendCall(EmployeeRESTResouces, "update", oldEmployee, true)
         }
         
       return EmployeeServiceFactory;
   })