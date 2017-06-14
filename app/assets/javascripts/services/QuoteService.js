angular
   .module("ARM.quote.services", ['ARM.helper.services', 'ngResource'])
   .factory("QuoteRESTResouces", function ($resource) {
       
        // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/quote/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/quote/:id.:format",
            params:{format:"json",id:'@id'}
         },
          // custom method TODO: This doesnt get used I think, remove it
         "deleteEmployee": {
            method: 'DELETE',
            url: "/quote/:id/deleteEmployee.:format",
            params:{format:"json",id:'@id'}
        },
         "duplicate_quote": {
            method: 'POST',
            url: "/quote/:id/duplicate_quote.:format",
            params:{format:"json",id:'@id'}
        }
      })
   })
   .factory("QuoteService",function(QuoteRESTResouces,HelperService,$http){
       var QuoteServiceFactory = {};
       
       // $resouce default action query equivalent to : {method:'GET'} AKA 'Get via Identifier'
      QuoteServiceFactory.get = function (id) {
            return HelperService.backendCall(QuoteRESTResouces, "get",{id:id},true)
         }
       
       // $resouce default action query equivalent to : {method:'POST'} AKA 'POST or CREATE'
      QuoteServiceFactory.save = function (newQuote) {
            return HelperService.backendCall(QuoteRESTResouces, "save", newQuote)
         }
       
       // $resouce default action query equivalent to : {method:'GET', isArray:true} AKA 'Get All'
      QuoteServiceFactory.query = function () {
            return HelperService.backendCall(QuoteRESTResouces, "query", {},true)
         }
       
       // $resource default action query equivalent to : {method:'DELETE'}
       QuoteServiceFactory.remove = function (id) {
            return HelperService.backendCall(QuoteRESTResouces, "delete", {id:id})
         }
         
         // $resource default action query equivalent to : {method:'PUT'} AKA edit existing
       QuoteServiceFactory.update = function (oldQuote) {
            return HelperService.backendCall(QuoteRESTResouces, "update", oldQuote, true)
         }
         
         QuoteServiceFactory.deleteEmployee = function(id){
             return HelperService.backendCall(QuoteRESTResouces, 'deleteEmployee',{id:id})
         }
          QuoteServiceFactory.duplicateQuote = function(id){
             return HelperService.backendCall(QuoteRESTResouces, 'duplicate_quote',{id:id})
         }
       return QuoteServiceFactory;
   })