/* globals angular:true */ //tell js hint that angular is defined
var backendRoute = "";

angular
  .module('AsphaltechRM', [
      'ui.router',
      'ui.bootstrap',
      'ui.grid',
      'ngResource',
      'ngMaterial',
      'md.data.table',
      'ngMessages',
      'templates',
      'ARM.cartage',
      'ARM.cartage.services',
      'ARM.navigation.sidenav',
      'ARM.helper.services',
      'ARM.cartage.services',
      'ARM.navigation.sidenav',
      'ARM.employee',
      'ARM.employee.services',
      'ARM.payment.services',
      'ARM.mix',
      'ARM.mix.services',
      'ARM.material',
      'ARM.material.services',
      'ARM.client',
      'ARM.client.services',
      'ARM.quote',
      'ARM.quote.services',
      'ARM.sub_contractor',
      'ARM.sub_contractor.services',
      'ARM.callup',
      'ARM.job',
      'ARM.job.services',
      'ARM.purchase',
      'ARM.purchase.services',
      'ARM.invoice',
      'ARM.invoice.services',
      'angular.filter'

   ])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('red')
      .accentPalette('deep-purple');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/_home.html',
        controller: 'MainCtrl',
        controllerAs: 'mc',
        resolve: {
          today_callups: function (CallupRegisterService) {
            return CallupRegisterService.today();
          },
          this_week_callups: function (CallupRegisterService) {
            return CallupRegisterService.this_week();
          },
          this_month_callups: function (CallupRegisterService) {
            return CallupRegisterService.this_month();
          },
          tomorrow_callups: function (CallupRegisterService) {
            return CallupRegisterService.tomorrow();
          },
        }
      })
      .state('cartageRate', {
        url: '/cartage_rate',
        templateUrl: 'cartage_rate/_cartage_rate.html',
        controller: 'CartageRateCtrl',
        controllerAs: 'crc',
        resolve: {
          cartageRates: function ($state, CartageRateService) {
            return CartageRateService.query();
          }
        }
      })
      .state('material', {
        url: '/material',
        templateUrl: 'material/_material.html',
        controller: 'MaterialCtrl',
        controllerAs: 'mtc',
        resolve: {
          materials: function ($state, MaterialService) {
            return MaterialService.query();
          }
        }
      })
      .state('employees', {
        url: '/employees',
        templateUrl: 'employee/_employees.html',
        controller: 'EmployeeCtrl',
        controllerAs: 'ec',
        resolve: {
          employees: function (EmployeeService) {
            return EmployeeService.query();
          }
        }
      })
      .state('contractors', {
        url: '/contractors',
        templateUrl: 'sub_contractor/_sub_contractor.html',
        controller: 'SubCtrl',
        controllerAs: 'cc',
        resolve: {
          contractors: function (SubContractorService) {
            return SubContractorService.query();
          }
        }
      })

    .state('quotes', {
        url: '/quotes',
        templateUrl: 'quote/_quote.html',
        controller: 'QuoteCtrl',
        controllerAs: 'qc',
        resolve: {
          quotes: function (QuoteService) {
            return QuoteService.query();
          },
          materials: function (MaterialService) { //TODO: Pretty sure this is not needed, or mixes
            return MaterialService.query();
          },
          mixes: function (MixService) {
            return MixService.query();
          }
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'callup_register/_callup_register.html',
        controller: 'CallupRegisterCtrl',
        controllerAs: 'curc',
        resolve: {
          callups: function (CallupRegisterService) {
            return CallupRegisterService.query();
          }
        }
      })
      .state('jobs', {
        url: '/job',
        templateUrl: 'job/_job.html',
        controller: 'JobCtrl',
        controllerAs: 'jc',
        resolve: {
          jobs: function (JobService) {
            return JobService.query();
          }
        }
      })

    .state('mix', {
        url: '/mix',
        templateUrl: 'mix/_mix.html',
        controller: 'MixCtrl',
        controllerAs: 'mixc',
        resolve: {
          materials: function ($state, MaterialService) {
            return MaterialService.query();
          },
          mixes: function ($state, MixService) {
            return MixService.query();
          }
        }
      })
      .state('client', {
        url: '/client',
        templateUrl: 'client/_client.html',
        controller: 'ClientCtrl',
        controllerAs: 'clc',
        resolve: {
          clients: function ($state, ClientService) {
            return ClientService.query();
          },
        }
      })
      .state('purchase', {
        url: '/purchase',
        templateUrl: 'purchase/_purchase.html',
        controller: 'PurchaseCtrl',
        controllerAs: 'pcc',
        resolve: {
          purchases: function(PurchaseService){
            return PurchaseService.thisMonth().then(function(response){
              if (response.success) 
                return response.data;
              else
                return []
            })
          }
        }
      })
      .state('invoice', {
        url: '/invoice',
        templateUrl: 'invoice/_invoice.html',
        controller: 'InvoiceCtrl',
        controllerAs: 'ivc',
      })
      .state('generate_invoice',{
        url: '/generate_invoice/:job_id',
        templateUrl: 'invoice/_generate_invoice.html',
        controller: 'GenerateInvoiceCtrl',
        controllerAs: 'gic',
        resolve: {
          job: function(JobService,$stateParams,$state) {
            console.log($stateParams)
            return JobService.get_full($stateParams.job_id).then(function(response){
              if (response.success)
                return response.data;
              else
                $state.go('home')
            })
          },
          cartageRates: function(CartageRateService) {
            return CartageRateService.query();
          }
        }
      })
      .state('schedulerLogs', {
        url: '/scheduler_logs',
        templateUrl: 'scheduler_log/_scheduler_log.html',
        controller: function (logs) {
          var slc = this;
          slc.logs = logs;
          console.log(slc.logs);
        },
        controllerAs: 'slc',
        resolve: {
          logs: function ($http) {
            return $http.get('/scheduler_log').then(function (response) {
              if (response.data.success)
                return response.data.data
              else
                return [];
            })
          }
        }
      })

    $urlRouterProvider.otherwise('home');
  })
  .run(function ($state, $rootScope) {


  })
  .controller('MainCtrl', function ($scope, CartageRateService, CallupRegisterService, $http, $window) {
    var mc = this;
  

    mc.get_today_callups = function () {
      CallupRegisterService.today().then(function (response) {
        console.log('today', response);
      })
    };
    mc.get_this_week_callups = function () {
      CallupRegisterService.this_week().then(function (response) {
        console.log('this week', response);
      });
    };
    mc.get_this_month_callups = function () {
      CallupRegisterService.this_month().then(function (response) {
        console.log('this month', response);
      });
    };
    mc.get_tomorrow_callups = function () {
      CallupRegisterService.tomorrow().then(function (response) {
        console.log('tomorrow', response);
      })
    };

    mc.generatePdf = function () {
      $http.post('/test_pdf.pdf', {
        content: mc.randomText
      }).then(function (response) {
        console.log(response);
          // opening in new tab
          var file = new Blob([response.data], {
            type: 'application/pdf'
          });
          var fileURL = URL.createObjectURL(file);
          $window.open(fileURL, '_blank');
          //save as ti window with name
          //saveData(response.data,'sample.pdf','pdf')
        },
        function (error) {
          console.log(error);
        })

      console.log(mc.randomText);
    }

    mc.getCSV = function () {
      $http.get('/test_csv.csv').then(function (response) {
          saveData(response.data, 'mixes.csv', 'csv')
        },
        function (error) {
          console.log(error);
        })

    }
    mc.getPdf = function () {
      $window.open('/get_pdf', '_blank');
      /*$http.get('/get_pdf').then(function (response) {
          //var file = new Blob([response.data], {
            //type: 'application/pdf'
          //});
          var fileURL = URL.createObjectURL(file);
          //$window.open(fileURL, '_blank');
        },
        function (error) {
          console.log(error);
        })*/

    }

    var saveData = (function () {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.target = "_blank";
      return function (data, fileName, type) {
        var blob = new Blob([data], {
            type: "application/" + type
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    }());


  })
  .directive('stringToNumber', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (value) {
          return '' + value;
        });
        ngModel.$formatters.push(function (value) {
          return parseFloat(value, 10);
        });
      }
    }
  })