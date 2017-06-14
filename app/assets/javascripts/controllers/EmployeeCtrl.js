
angular
   .module('ARM.employee',[])
   .controller('EmployeeCtrl',function(employees,EmployeeService,PaymentService,$scope,$mdToast, $mdDialog){
      var ec = this;
      ec.employees = employees;
      console.log("Employees as:");
      console.log(ec.employees);
      $scope.selected = {};
      $scope.selectedTab = 0; //Used for the UI tabs
      $scope.newEmployee = {
          payment:{
              reg:[{name:"8",data:0},{name:"9",data:0},{name:"10",data:0},{name:"11",data:0},{name:"12",data:0}],
              night:[{name:"8",data:0},{name:"9",data:0},{name:"10",data:0},{name:"11",data:0},{name:"12",data:0}],
              sat:[{name:"4",data:0},{name:"5",data:0},{name:"6",data:0},{name:"7",data:0},{name:"8",data:0}],
              sun:[{name:"4",data:0},{name:"5",data:0},{name:"6",data:0},{name:"7",data:0},{name:"8",data:0}]
          }
      };
      
      $scope.employeeQuery = {
          given_names:undefined,
          last_name:undefined,
      }
    $scope.addNew = function(){
        console.log("Saving");
        //Turn new Employee details into employee and payment objects
        var sendPayment = $scope.reformatPaymentToServer($scope.newEmployee.payment);
        
        var sendEmployee = {
            given_names:$scope.newEmployee.givenName,
            last_name:$scope.newEmployee.lastName,
            contact_no:$scope.newEmployee.contactNo,
            notes:$scope.newEmployee.notes,
            payment:sendPayment
        }
        
        //Save employee
        
        EmployeeService.save(sendEmployee).then(function(response)
        {
            if(response.success)
            {
                $scope.newEmployee = {
                    payment:{
                         reg:[{name:"8",data:0},{name:"9",data:0},{name:"10",data:0},{name:"11",data:0},{name:"12",data:0}],
                         night:[{name:"8",data:0},{name:"9",data:0},{name:"10",data:0},{name:"11",data:0},{name:"12",data:0}],
                         sat:[{name:"4",data:0},{name:"5",data:0},{name:"6",data:0},{name:"7",data:0},{name:"8",data:0}],
                        sun:[{name:"4",data:0},{name:"5",data:0},{name:"6",data:0},{name:"7",data:0},{name:"8",data:0}]
                     }
                 };
                $scope.selectedTab = 0;
                $scope.refreshEmployees();
                
                $scope.showAddedToast();
            }else{
                $scope.showAddedFailToast();
            }
        })
        
    }
    
    $scope.edit = function(ev){
        
        var confirm = $mdDialog.confirm()
          .title('Are you sure about that?')
          .textContent('You are about to overwrite employee data, ensure everything is correct before pressing ok!')
          .ariaLabel('Edit employee confirmation')
          .targetEvent(ev)
          .ok('Ok')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {//Confirmed that yes they want to edit
           var sendPayment = $scope.reformatPaymentToServer($scope.selected.payment);
        
            var sendEmployee = $scope.selected;
                sendEmployee.payment = sendPayment;
            
             EmployeeService.update(sendEmployee).then(function(response)
            {
                if(response.success)
                {
                    $scope.selected = {};
                    $scope.selectedTab = 0;
                    $scope.refreshEmployees();
                    
                    $scope.showEditedToast();
                }else{
                    $scope.showEditedFailToast();
                }
            })
        }, function() { //Hit cancel
          return false;
        });
    }
    
    $scope.delete = function(id,ev){
        
        var confirm = $mdDialog.confirm()
          .title('Are you sure about that?')
          .textContent('Deletion of employees is probably irreversible or something like that!')
          .ariaLabel('Delete employee confirmation')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
          EmployeeService.remove(id).then(function(response){
                if(response.success){
                
                $scope.selectedTab = 0;
                $scope.selected = {};
                $scope.refreshEmployees();
                $scope.showDeletedToast();
                }else{
                    $scope.showDeletedFailToast();
                }
            })
        }, function() {
          return false;
        });
    }
    
    
    $scope.selectEmployee = function(id)
    {
        EmployeeService.get(id).then(function(response){
            $scope.selected = response;
            console.log($scope.selected);
            $scope.selected.payment = $scope.reformatPaymentFromServer($scope.selected.payment);
            $scope.selectedTab = 3;
            console.log($scope.selected);
        });
    }
    
    $scope.refreshEmployees = function()
    {
        EmployeeService.query().then(function(response){
            ec.employees = response;
        })
    }
    
    /* The two preceeding functions are used to reformat payment data for easier use on the front end.
    It means a tad more work when anything gets sent or recieved but its also alot simpler to manage,
    plus making changes to this is far quicker than re-doing the entire front end to add a single new item
    
    Formatted as <Array>[{name:<name>,data:<data>}...] locally*/
    $scope.reformatPaymentToServer = function(payment){
        var newPayment = {
            reg_8:payment.reg[0].data,
            reg_9:payment.reg[1].data,
            reg_10:payment.reg[2].data,
            reg_11:payment.reg[3].data,
            reg_12:payment.reg[4].data,
            
            night_8:payment.night[0].data,
            night_9:payment.night[1].data,
            night_10:payment.night[2].data,
            night_11:payment.night[3].data,
            night_12:payment.night[4].data,
            
            sat_4:payment.sat[0].data,
            sat_5:payment.sat[1].data,
            sat_6:payment.sat[2].data,
            sat_7:payment.sat[3].data,
            sat_8:payment.sat[4].data,
            
            sun_4:payment.sun[0].data,
            sun_5:payment.sun[1].data,
            sun_6:payment.sun[2].data,
            sun_7:payment.sun[3].data,
            sun_8:payment.sun[4].data
        }
        return newPayment;
    }
    $scope.reformatPaymentFromServer = function(payment)
    {
        var newPayment = {reg:[],night:[],sat:[],sun:[]
        }
        newPayment.reg.push({name:"8",data:payment.reg_8});
        newPayment.reg.push({name:"9",data:payment.reg_9});
        newPayment.reg.push({name:"10",data:payment.reg_10});
        newPayment.reg.push({name:"11",data:payment.reg_11});
        newPayment.reg.push({name:"12",data:payment.reg_12});
        
        newPayment.night.push({name:"8",data:payment.night_8});
        newPayment.night.push({name:"9",data:payment.night_9});
        newPayment.night.push({name:"10",data:payment.night_10});
        newPayment.night.push({name:"11",data:payment.night_11});
        newPayment.night.push({name:"12",data:payment.night_12});
        
        newPayment.sat.push({name:"4",data:payment.sat_4});
        newPayment.sat.push({name:"5",data:payment.sat_5});
        newPayment.sat.push({name:"6",data:payment.sat_6});
        newPayment.sat.push({name:"7",data:payment.sat_7});
        newPayment.sat.push({name:"8",data:payment.sat_8});
        
        newPayment.sun.push({name:"4",data:payment.sun_4});
        newPayment.sun.push({name:"5",data:payment.sun_5});
        newPayment.sun.push({name:"6",data:payment.sun_6});
        newPayment.sun.push({name:"7",data:payment.sun_7});
        newPayment.sun.push({name:"8",data:payment.sun_8});
        
        return newPayment;
    }
    
    
    
    //A whole head of toast
    
    $scope.showAddedToast = function() {
    var toast = $mdToast.simple()
          .textContent('Employee Added!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition())
          .hideDelay(3000);

    $mdToast.show(toast).then(function(response) {
      
    });
  };
  
   $scope.showAddedFailToast = function() {
    var toast = $mdToast.simple()
          .textContent('Failed to add employee!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition())
          .hideDelay(8000);

    $mdToast.show(toast).then(function(response) {
      
    });
  };
  
  $scope.showDeletedToast = function() {
    var toast = $mdToast.simple()
          .textContent('Employee Deleted!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition())
          .hideDelay(3000);

    $mdToast.show(toast).then(function(response) {
      
    });
  };
  
  $scope.showFailDeletedToast = function() {
    var toast = $mdToast.simple()
          .textContent('Failed to delete employee!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition())
          .hideDelay(8000);

    $mdToast.show(toast).then(function(response) {
      
    });
  };
  
  $scope.showEditedToast = function() {
    var toast = $mdToast.simple()
          .textContent('Employee Edited!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition())
          .hideDelay(3000);

    $mdToast.show(toast).then(function(response) {
      
    });
  };
  
  $scope.showEditedFailedToast = function() {
    var toast = $mdToast.simple()
          .textContent('Failed to edit employee!')
          .action('OK')
          .highlightAction(false)
          .position($scope.getToastPosition())
          .hideDelay(8000);

    $mdToast.show(toast).then(function(response) {
      
    });
  };
    
    
    //Global Toast stuff --------------------------
     var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }
  // End toast stuff ---------------------------
  
  //Confirmation Dialogue Boxes
  
})