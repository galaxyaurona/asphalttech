angular
   .module("ARM.sub_contractor.services", ['ARM.helper.services', 'ngResource'])
   .factory("SubContractorRESTResouces", function ($resource) {
       
        // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/sub_contractor/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/sub_contractor/:id.:format",
            params:{format:"json",id:'@id'}
         }
      })
   })
   .factory("SubContractorService",function(SubContractorRESTResouces,HelperService){
       var ContractorServiceFactory = {};
       
       // $resouce default action query equivalent to : {method:'GET'} AKA 'Get via Identifier'
      ContractorServiceFactory.get = function (id) {
            return HelperService.backendCall(SubContractorRESTResouces, "get",{id:id},true)
         }
       
       // $resouce default action query equivalent to : {method:'POST'} AKA 'POST or CREATE'
      ContractorServiceFactory.save = function (newContractor) {
            return HelperService.backendCall(SubContractorRESTResouces, "save", newContractor) //TODO: Ensure this actually sends the object correctly
         }
       
       // $resouce default action query equivalent to : {method:'GET', isArray:true} AKA 'Get All'
      ContractorServiceFactory.query = function () {
            return HelperService.backendCall(SubContractorRESTResouces, "query", {},true)
         }
       
       // $resource default action query equivalent to : {method:'DELETE'}
       ContractorServiceFactory.remove = function (id) {
            return HelperService.backendCall(SubContractorRESTResouces, "delete", {id:id})
         }
         
         // $resource default action query equivalent to : {method:'PUT'} AKA edit existing
       ContractorServiceFactory.update = function (oldContractor) {
            return HelperService.backendCall(SubContractorRESTResouces, "update", oldContractor, true)
         }
         
       return ContractorServiceFactory;
   })