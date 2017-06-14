angular
   .module("ARM.payment.services", ['ARM.helper.services', 'ngResource'])
   .factory("PaymentRESTResouces", function ($resource) {
       
        // this will supplies 4 default action, refer to angular guide for more info
      // https://docs.angularjs.org/api/ngResource/service/$resource
      return $resource(backendRoute + "/payment/:id.:format", {
         format: "json"
      }, {
         // custom method
         "update": {
            method: 'PUT',
            url: "/payment/:id.:format",
            params:{format:"json",id:'@id'}
         }
      })
   })
   .factory("PaymentService",function(PaymentRESTResouces,HelperService){
       var PaymentServiceFactory = {};
       
       // $resouce default action query equivalent to : {method:'GET'} AKA 'Get via Identifier'
      PaymentServiceFactory.get = function (id) {
            return HelperService.backendCall(PaymentRESTResouces, "get",{id:id})
         }
       
       // $resouce default action query equivalent to : {method:'POST'} AKA 'POST or CREATE'
      PaymentServiceFactory.save = function (newPayment) {
            return HelperService.backendCall(PaymentRESTResouces, "save", newPayment) //TODO: Ensure this actually sends the object correctly
         }
       
       // $resouce default action query equivalent to : {method:'GET', isArray:true} AKA 'Get All'
      PaymentServiceFactory.query = function () {
            return HelperService.backendCall(PaymentRESTResouces, "query", {})
         }
       
       // $resource default action query equivalent to : {method:'DELETE'}
       PaymentServiceFactory.remove = function (id) {
            return HelperService.backendCall(PaymentRESTResouces, "delete", {id:id})
         }
         
         // $resource default action query equivalent to : {method:'PUT'} AKA edit existing
       PaymentServiceFactory.update = function (oldPayment) {
            return HelperService.backendCall(PaymentRESTResouces, "update", oldPayment)
         }
         
       return PaymentServiceFactory;
   })