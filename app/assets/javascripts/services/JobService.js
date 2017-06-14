angular
    .module("ARM.job.services", ['ARM.helper.services', 'ngResource'])
    .factory("JobRESTResouces", function ($resource) {

        // this will supplies 4 default action, refer to angular guide for more info
        // https://docs.angularjs.org/api/ngResource/service/$resource
        return $resource(backendRoute + "/job/:id.:format", {
            format: "json"
        }, {
            // custom method
            "update": {
                method: 'PUT',
                url: "/job/:id.:format",
                params: {
                    format: "json",
                    id: '@id'
                }
            },
            'get_full': {
                method: 'GET',
                url: '/job/:id/full.:format',
                params: {
                    format: "json"
                }
            },
            "upload_docket": {
            method: 'POST',
            url: "/job/:id/upload_docket.:format",
            params:{format:"json",id:'@id'}
            }
        })
    })
   .factory("JobService",function(JobRESTResouces,HelperService){
       var JobServiceFactory = {};
       
       // $resouce default action query equivalent to : {method:'GET'} AKA 'Get via Identifier'
        JobServiceFactory.get = function (id) {
            return HelperService.backendCall(JobRESTResouces, "get", {
                id: id
            }, true)
        }
        JobServiceFactory.get_full = function (id) {
            return HelperService.backendCall(JobRESTResouces, "get_full", {
                id: id
            })
        }
       
       // $resouce default action query equivalent to : {method:'POST'} AKA 'POST or CREATE'
      JobServiceFactory.save = function (newJob) {
            return HelperService.backendCall(JobRESTResouces, "save", newJob) //TODO: Ensure this actually sends the object correctly
        }

        // $resouce default action query equivalent to : {method:'GET', isArray:true} AKA 'Get All'
        JobServiceFactory.query = function () {
            return HelperService.backendCall(JobRESTResouces, "query", {}, true)
        }

        // $resource default action query equivalent to : {method:'DELETE'}
        JobServiceFactory.remove = function (id) {
            return HelperService.backendCall(JobRESTResouces, "delete", {
                id: id
            })
        }

        // $resource default action query equivalent to : {method:'PUT'} AKA edit existing
        JobServiceFactory.update = function (oldJob) {
            return HelperService.backendCall(JobRESTResouces, "update", oldJob, true)
         }
         
         JobServiceFactory.upload_docket = function (id,docket) {
            return HelperService.backendCall(JobRESTResouces, "upload_docket", {id:id,upload_docket:docket}, true)
         }
         
       return JobServiceFactory;
   })
