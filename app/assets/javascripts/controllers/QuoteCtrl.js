/* Bug List
    Adding multiple of the same employee (check mixes to make sure they can be added) should not be allowed - causes issues with deletion
    Adding multiple of the same contractor causes data to be mirrored between them
    */
    
    //TODO: Encapsulate the quote tabs in one whole form and then use ng-form for individual area's
angular
    .module('ARM.quote', [])
    .controller('QuoteCtrl', function(quotes, mixes, QuoteService, EmployeeService, PaymentService,CartageRateService, MixService,ClientService, SubContractorService, $scope, $mdToast, $mdDialog,$http,$window, $filter) {
        var qc = this;
        qc.quotes = quotes;
        console.log(qc.quotes);
        qc.employees = undefined;
        qc.contractors = undefined;
        qc.mixes = mixes;
        qc.selected = {};
        qc.cartageRates = undefined;
        
        
        qc.generation_array = [];
        //Used to order the quotes on the view screen
        qc.current_order = 'name';
        //Used to control the collapsable panels
        $scope.collapseEmployee = true;
        $scope.collapseContractor = true;
        $scope.collapseMaterial = true;
        $scope.collapseEditEmployee = true;
        $scope.collapseEditContractor = true;
        $scope.collapseEditMaterial = true;
        $scope.collapseOther = true;
        $scope.collapseEditOther = true;
        
        //Used in pdf
        $scope.attention = "";
        $scope.pdfDate = new Date();
        
        $scope.queryEmployee = {given_names:undefined};
        $scope.queryMix = {name:undefined};
        $scope.queryContractor = {name:undefined};

        $scope.quote_types = [{name:"Supply & Lay",data:1},{name:"Supply & Deliver",data:2},{name:"Supply",data:3},{name:"Service",data:4}];
        $scope.contractor_types = [{name:"Single Charge",data:0},{name:"Tonnage",data:1},{name:"Labour",data:2}];
        $scope.other_types = [{name:"Single Charge",data:0},{name:"Tonnage",data:1},{name:"Labour",data:2}];
        $scope.newQuote = {
            quote_type: undefined,
            name: undefined,
            contractors: [],
            workers: [],
            equipment: [],
            mixes: [],
            other: [],
            charge: 0,
            cost: 0,
            duration:0,
            street: undefined,
            suburb: undefined,
            hire :0,
            distance_to_site:0,
            costing: {
                cartage:0,
                EmployeeDetails: {
                    employeeCost: 0,
                    employeeCharge: 0,
                    employeeChargeOriginal:0, //This gets used to check if charge is modified by the user
                },
                ContractorDetails: {
                    contractorCost: 0,
                    contractorCharge: 0,
                    contractorOriginalCharge:0
                },
                MixDetails: {
                    mixCost:0,
                    mixCharge:0,
                    mixChargeOriginal:0,
                },
                OtherDetails: {
                    otherCost:0,
                    otherCharge:0,
                    otherOriginalCharge:0
                }
            }
        };
        
        $scope.clientInfo = {
            data: undefined,
            id: undefined
        };

        $scope.addNewQuote = function(subForm) {
            if(!subForm.$invalid){
                var snapshot = {};
                
                var sendQuote = {
                    quote: {
                        name: $scope.newQuote.name,
                        street: $scope.newQuote.street,
                        suburb: $scope.newQuote.suburb,
                        charge: $scope.newQuote.charge,
                        cost: $scope.newQuote.cost,
                        distance_to_site: $scope.newQuote.distance_to_site,
                        visits:$scope.newQuote.visits,
                        truck_hire: $scope.newQuote.hire,
                        quote_no: 0, //TODO: Should this be assigned server side or let daniel do it?
                        state:"Quoted",
                        client_id:$scope.clientInfo.id,
                        quote_type:$scope.newQuote.quote_type,
                        duration:$scope.newQuote.duration
                    },
                    quote_employees: [],
                    quote_contractors: [],
                    quote_mixes: $scope.newQuote.mixes,
                    quote_others : $scope.newQuote.other
                };
                
                var snapshot = {
                    quote:{
                        costing:{
                            employee_charge:$scope.newQuote.costing.EmployeeDetails.employeeCharge,
                            employee_original_charge:$scope.newQuote.costing.EmployeeDetails.employeeChargeOriginal,
                            employee_cost:$scope.newQuote.costing.EmployeeDetails.employeeCost,
                            
                            contractor_charge:$scope.newQuote.costing.ContractorDetails.contractorCharge,
                            contractor_original_charge:$scope.newQuote.costing.ContractorDetails.contractorOriginalCharge,
                            contractor_cost:$scope.newQuote.costing.ContractorDetails.contractorCost,
                            
                            mix_charge:$scope.newQuote.costing.MixDetails.mixCharge,
                            mix_original_charge:$scope.newQuote.costing.MixDetails.mixChargeOriginal,
                            mix_cost:$scope.newQuote.costing.MixDetails.mixCost,
                            
                            other_charge:$scope.newQuote.costing.OtherDetails.otherCharge,
                            other_cost:$scope.newQuote.costing.OtherDetails.otherCost,
                            
                            cartage:$scope.newQuote.costing.cartage
                        }
                    },employees:[],contractors:[],mixes:[],client_name:$scope.clientInfo.data};
                
                
                angular.forEach($scope.newQuote.workers, function(value, key) {
                    sendQuote.quote_employees.push({
                        employee_id: value.id,
                        cost: value.cost,
                        charge: value.charge,
                        margin: value.margin,
                        days: value.normal_days,
                        nights: value.night_days,
                        saturdays: value.sat_days,
                        sundays: value.sun_days,
                        payment:value.payment
                    });
                    snapshot.employees.push({
                        employee_id: value.id,
                        payment: value.payment,
                        original_charge: value.original_charge
                    });
                });
                
                angular.forEach($scope.newQuote.contractors, function(value, key) {
                    sendQuote.quote_contractors.push({
                        sub_contractor_id: value.id,
                        contractor_type: value.contractor_type,
                        cost:value.cost,
                        charge:value.charge,
                        quantity:value.quantity,
                        notes:value.notes,
                        rate:value.rate,
                        unit_type:value.unit_type,
                        description:value.descriptionTemp,
                        comments:value.comments
                    });
                    snapshot.contractors.push({
                        sub_contractor_id: value.id,
                        original_charge:value.original_charge
                    });
                });
                
                //Quote mixes - ID, price and mix materials are stored in the snapshot
                // While ID, corrupted, name ,notes, thickness, area and tonnes are stored in the table
                angular.forEach($scope.newQuote.mixes, function(value, key) {
                    snapshot.mixes.push({
                        mix_id:value.id,
                        price_per_tonne:value.price_per_tonne,
                        mix_materials:value.mix_materials,
                        original_charge:value.original_charge,
                        charge:value.charge,
                        cost:value.cost,
                        margin:value.margin,
                        original_tonnes:value.original_tonnes
                    });
                    value.mix_id = value.id;
                    value.id = undefined;
                    value.price_per_tonne = undefined;
                    value.mix_materials = undefined;
                    value.original_charge = undefined;
                    value.original_tonnes = undefined;
                });
    
                sendQuote.snapshot = snapshot;
                console.log(sendQuote);
                QuoteService.save(sendQuote).then(function(response) {
                    console.log(response);
                    if(response.success){
                        $scope.selectedTab = 0;
                        $scope.newQuote = {
                            quote_type: undefined,
                            contractors: [],
                            workers: [],
                            equipment: [],
                            mixes: [],
                            other: [],
                            charge: 0,
                            cost: 0,
                            costing: {
                                EmployeeDetails: {
                                    employeeCost: 0,
                                    employeeCharge: 0,
                                    employeeChargeOriginal:0,
                                },
                                ContractorDetails: {
                                    contractorCost: 0,
                                    contractorCharge: 0,
                                    contractorOriginalCharge:0
                                },
                                MixDetails: {
                                    mixCost:0,
                                    mixCharge:0,
                                    mixChargeOriginal:0,
                                },
                                OtherDetails: {
                                    otherCost:0,
                                    otherCharge:0,
                                    otherOriginalCharge:0
                                },
                                cartage:0
                            }
                        };
                        QuoteService.query().then(function(response){
                           qc.quotes = response; 
                            $mdToast.showSimple("Quote saved successefully!");
                        });
                    }else{
                         $mdToast.showSimple("Quote failed to save!");
                    }
                });
            }
        };

        $scope.delete = function(ev,id) {
            var confirm = $mdDialog.confirm()
          .title('Are you sure about that?')
          .textContent('Deletion of employees is probably irreversible or something like that!')
          .ariaLabel('Delete employee confirmation')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
              QuoteService.remove(id).then(function(response) {
                       if(response.success)
                       {
                           $scope.selectedTab = 0;
                           $mdToast.showSimple("Quote deleted!");
                           QuoteService.query().then(function(response){
                              qc.quotes = response; 
                           });
                       }else{
                            $mdToast.showSimple("An error occured while attempting to delete quote!");
                       }
                    });
            }, function() {
              return false;
            });
                
        };
            
        $scope.edit = function(subForm){ //TODO: Change this to be a single dialog that simply asks "update and save" or "save"
        console.log(subForm.$invalid);
            if(!subForm.$invalid){
                var updateQ = $mdDialog.confirm()
                  .title('Hold up!')
                  .textContent('Data such as employee or mix costs are kept from the time that you added them to this quote.\n Do you wish to update these to current prices?')
                  .ariaLabel('Edit update confirmation')
                  .ok('Update')
                  .cancel('Don\'t update');
                  
                 var confirm = $mdDialog.confirm()
                  .title('Are you sure about that?')
                  .textContent('Are you sure you wish to save current changes? \n Your changes will remain locally if you cancel saving.')
                  .ariaLabel('Edit save confirmation')
                  .ok('Save')
                  .cancel('Cancel');
        
                $mdDialog.show(updateQ).then(function() {
                  //do the update
                  $scope.updatePrices();
                  $mdToast.showSimple("Prices updated!");
                    $mdDialog.show(confirm).then(function() {
                         $scope.saveEdit();
                    }, function() {
                        //dont do save
                    });
                }, function() {
                    //dont do update
                    $mdDialog.show(confirm).then(function() {
                        $scope.saveEdit();
                    }, function() {
                        //dont do save
                    });
                });
            }
        }
        //Used when confirming you wish to save
        $scope.saveEdit = function(){
            var updateQuote = qc.selected.quote;
            
            updateQuote.quote_employees=[];
            updateQuote.quote_contractors=[];
            updateQuote.quote_mixes=[];
            updateQuote.quote_others= qc.selected.others;
            updateQuote.quote_delete_employees = qc.selected.delete_employees;
            updateQuote.quote_delete_contractors = qc.selected.delete_contractors;
            updateQuote.quote_delete_mixes = qc.selected.delete_mixes;
            updateQuote.quote_delete_others = qc.selected.delete_others;
            updateQuote.id = qc.selected.quote.id;
            
            updateQuote.snapshot.employees = [];
            angular.forEach(qc.selected.employees,function(value,key){
                var temp = value.details;
                temp.original_charge = undefined;
                updateQuote.quote_employees.push(temp); //Throw away the original charge - this will be in the snapshot
                updateQuote.snapshot.employees.push({
                    employee_id:value.id,
                    original_charge:value.details.original_charge,
                    payment:value.details.payment
                });
            });
            
            updateQuote.snapshot.contractors = [];
            angular.forEach(qc.selected.contractors,function(value,key){
               var temp = value.details;
               updateQuote.quote_contractors.push(temp);
               updateQuote.snapshot.contractors.push(); //TODO: THIS
            });
            
            updateQuote.snapshot.mixes = [];
            angular.forEach(qc.selected.mixes,function(value,key){
               var temp = value.details;
               updateQuote.quote_mixes.push(temp);
               updateQuote.snapshot.mixes.push(value.costing);
            });
            
            console.log(updateQuote);
            QuoteService.update(updateQuote).then(function(response){
                if(response.success){
                    console.log(response);
                    //Unsure why but the following code seems to not actually collapse said panels, could be a bug in my code or an intended feature of the collapse
                    $scope.collapseEditEmployee = true;
                    $scope.collapseEditContractor = true;
                    $scope.collapseEditMaterial = true;
                    $scope.collapseEditOther = true;
                     $mdToast.showSimple("Quote updated successefully!");
                     $scope.selectQuote(qc.selected.quote.id);
                }else{
                     $mdToast.showSimple("Failed to save quote edit!");
                }
                QuoteService.query().then(function(response){
                   qc.quotes = response; 
                });
            });
        };
         
        $scope.selectQuote = function(id)
        {
            QuoteService.get(id).then(function(response){
                if(response.quote){
                    console.log(response);
                    qc.selected = response;
                    qc.selected.delete_employees = [];
                    qc.selected.delete_contractors = [];
                    qc.selected.delete_mixes = [];
                    qc.selected.delete_others = [];
                    //This should find the employee as the first element it goes to as a new snapshot gets generated anytime there is an edit, keeping the order the same.
                    var i = 0;
                    angular.forEach(qc.selected.quote.snapshot.employees,function(value,key){
                        if(value.employee_id == qc.selected.employees[i].id){
                            qc.selected.employees[i].details.original_charge = value.original_charge;
                            qc.selected.employees[i].details.payment = value.payment;
                            ++i;
                        }else{
                            /*if it wasnt the first element it finds then the list is out of order or the element does not exist, either way this shouldnt happen*/
                            console.log("something borked");
                        };
                    });
                    
                    i = 0;
                    angular.forEach(qc.selected.quote.snapshot.mixes,function(value,key){
                        if(value.mix_id == qc.selected.mixes[i].id){
                            qc.selected.mixes[i].costing = value;
                        }
                    });
                    $scope.selectedTab = 2;
                }else{
                     $mdToast.showSimple("Failed to get quote information!");
                }
            })
            
        }
         $scope.duplicateQuote = function(ev){
             
             var confirm = $mdDialog.confirm()
              .title('Important Information!')
              .textContent('Please make sure you have saved any changes before duplicating or they will not appear in the new quote!')
              .ariaLabel('Duplication confirmation')
              .targetEvent(ev)
              .ok('Duplicate')
              .cancel('Cancel');
              
              $mdDialog.show(confirm).then(function() {
                     QuoteService.duplicateQuote(qc.selected.quote.id).then(function(response){
                           $scope.selectedTab = 0;
                            QuoteService.query().then(function(response){
                               qc.quotes = response; 
                            });
                       })
                }, function() {
                    //dont do save
                });
           
         };
         
        $scope.updatePrices = function(){ //Note that this only updates the pricing, should be simple to extend this to change all data but currently this isnt needed?
          angular.forEach(qc.selected.mixes,function(value,key){
              MixService.get(value.costing.mix_id).then(function(response){
                  value.costing.price_per_tonne = response.price_per_tonne;
              })
          });
          angular.forEach(qc.selected.employees,function(value,key){
             PaymentService.get(value.id).then(function(response) {
                 var temp = response;
                 value.details.payment = temp;
             })
          });
        };
        
        $scope.addClient = function(client,editMode){
            if(!editMode){
                $scope.clientInfo.id = client.id;
                $scope.clientInfo.data = client.name;
                $scope.close();
            }else{
                qc.selected.quote.client_id = client.id;
                qc.selected.quote.snapshot.quote.client_name = client.name;
                $scope.close();
            }
        }
        $scope.loadClients = function(){
         ClientService.query().then(function(response){
            console.log(response);
            if(response.success == undefined){
               qc.clients = response;
            }else{
               //error
            }
         });
      }
        //Employee stuff
        $scope.addEmployee = function(employee,editmode) {
            if(!editmode){
                employee.cost = 0;
                employee.charge = 0;
                employee.original_charge = 0;
    
                $scope.newQuote.workers.push(employee);
                console.log(employee);
            }else{
                employee.details = {cost:0,charge:0,original_charge:0,days:0,nights:0,saturdays:0,sundays:0,margin:0,employee_id:employee.id};
                PaymentService.get(employee.id).then(function(response){
                   employee.details.payment = response;
                   qc.selected.employees.push(employee);
                    console.log(employee);
                });
                
            }
                //$scope.newQuote.EmployeeDetails.employeeCost = $scope.getTotalEmployeesCost();
                //$scope.newQuote.EmployeeDetails.employeeCharge = $scope.getTotalEmployeesCharge();
                 
                 if($scope.collapseEmployee)
                       $scope.collapseEmployee = !$scope.collapseEmployee;
            
        };
        $scope.deleteEmployee = function(id){
            var i = 0;
            var x = -1;
            angular.forEach($scope.newQuote.workers,function(value,key){
               if(value.id == id)
                    x = i;
                ++i;
               
            });
            if(x >= 0)
             $scope.newQuote.workers.splice(x,1);
        };
        $scope.deleteEmployeeEdit = function(id,db){
                var i = 0;
                var x = -1;
                angular.forEach(qc.selected.employees,function(value,key){
                   if(value.id == id)
                        x = i;
                    ++i;
                   
                });
                if(x >= 0){
                    if(db)
                        qc.selected.delete_employees.push(qc.selected.employees[x]); //TODO: change this to only put in the ID and send that to the server
                    qc.selected.employees.splice(x,1);
                }
        }

        //Following methods are used for the job total costings
        $scope.getEmployeeCost = function(employee){
            var dayCost = employee.normal_days * employee.payment.reg_8;
            var nightCost = employee.night_days * employee.payment.night_8;
            var satCost = employee.sat_days * employee.payment.sat_4;
            var sunCost = employee.sun_days * employee.payment.sun_4;
            
            return dayCost + nightCost + satCost + sunCost;
        }
        $scope.getEmployeeCostEdit = function(employee){
            var dayCost = employee.details.days * employee.details.payment.reg_8;
            var nightCost = employee.details.nights * employee.details.payment.night_8;
            var satCost = employee.details.saturdays * employee.details.payment.sat_4;
            var sunCost = employee.details.sundays * employee.details.payment.sun_4;
            
            return dayCost + nightCost + satCost + sunCost;
        }
        $scope.getEmployeeCharge = function(employee){
            return employee.cost * 1.05; //TODO: implement a default margin amount to be referenced here
        }
        $scope.getTotalEmployeesCost = function() {
            var totalCost = 0;
            angular.forEach($scope.newQuote.workers, function(value, key) {
                totalCost += value.cost;
            });
            return totalCost;
        };
        $scope.getTotalEmployeesCharge = function() {
            var totalCharge = 0;
            angular.forEach($scope.newQuote.workers, function(value, key) {
                totalCharge += value.charge;
            });
            return totalCharge;
        };

        $scope.loadEmployees = function() {
            EmployeeService.query().then(function(response) {
                qc.employees = response;
                angular.forEach(qc.employees, function(value, key) //I would like to change this so that it only pulls this data when an employee is selected
                    {
                        PaymentService.get(value.payment_id).then(function(response) {
                            value.payment = response;
                        });
                        value.margin = 0;
                        value.allowance = 0;
                        value.normal_days = 0;
                        value.night_days = 0;
                        value.sat_days = 0;
                        value.sun_days = 0;
                    });
            });
        };
        
        //Contractor stuff
        $scope.addContractor = function(contractor,editmode) {
            var temp = {};
                angular.copy(contractor,temp);
                angular.copy(temp.charge,temp.original_charge); //TODO: This isnt even used, check on it
            if(!editmode){
                $scope.newQuote.contractors.push(temp);
                
                if($scope.collapseContractor)
                    $scope.collapseContractor = !$scope.collapseContractor
                    
            }else{
                temp.details = {
                    charge:0,
                    cost:0,
                    margin:0,
                    quantity:0,
                    rate:0,
                    notes:undefined,
                    contractor_type:undefined,
                    sub_contractor_id:contractor.id,
                    notes:""
                };
                qc.selected.contractors.push(temp);
                if($scope.collapseEditContractor)
                    $scope.collapseEditContractor = !$scope.collapseEditContractor
            }
        };

        $scope.loadContractors = function() {
            SubContractorService.query().then(function(response) {
                qc.contractors = response;
                angular.forEach(qc.contractors, function(value, key)
                    {
                        value.cost = 0;
                        value.charge = 0;
                        value.notes = undefined;
                        value.quantity = 0;
                        value.type = "Set Type";
                    });

            });
        };
        
        $scope.deleteContractor = function(item){
             try{
             $scope.newQuote.other.splice($scope.newQuote.contractor.indexOf(item),1);
            }catch(err){
                //TODO: Error toast
            };
        };
        $scope.deleteContractorEdit = function(id,db){
                var i = 0;
                var x = -1;
                angular.forEach(qc.selected.contractors,function(value,key){
                   if(value.id == id)
                        x = i;
                    ++i;
                   
                });
                if(x >= 0){
                    if(db)
                        qc.selected.delete_contractors.push(qc.selected.contractors[x]); //TODO: change this to only put in the ID and send that to the server
                    qc.selected.contractors.splice(x,1);
                }
        }

        //Material stuff
         $scope.addMix = function(mix,editmode) {
             if(!editmode){
                console.log(mix);
                mix.original_charge = 0;
                mix.charge = 0;
                mix.cost = 0;
                mix.original_tonnes = 0;
                mix.tonnes = 0;
                mix.thickness = 0;
                mix.area = 0;
                $scope.newQuote.mixes.push(mix);
                if($scope.collapseMaterial)
                    $scope.collapseMaterial = !$scope.collapseMaterial;
                
             }else{
                mix.details = {tonnes:0, thickness:0, area:0, mix_id:mix.id};
                mix.costing = {original_charge:0, charge: 0, cost:0,margin:0, original_tonnes:0,price_per_tonne:mix.price_per_tonne,mix_id:mix.id};
                qc.selected.mixes.push(mix);
                if($scope.collapseEditMaterial)
                    $scope.collapseEditMaterial = !$scope.collapseEditMaterial;
             }
             
         }
         
         $scope.deleteMix = function(item){
             try{
             $scope.newQuote.mixes.splice($scope.newQuote.mixes.indexOf(item),1);
            }catch(err){
                //TODO: Error toast
            };
        };
        $scope.deleteMixEdit = function(id,db){
                var i = 0;
                var x = -1;
                angular.forEach(qc.selected.mixes,function(value,key){
                   if(value.id == id)
                        x = i;
                    ++i;
                   
                });
                if(x >= 0){
                    if(db)
                        qc.selected.delete_mixes.push(qc.selected.mixes[x]); //TODO: change this to only put in the ID and send that to the server
                    qc.selected.mixes.splice(x,1);
                }
        }
         
         $scope.getMixTonnes = function(thickness,area){
             return area * (thickness * 1000) * 2.4;
         }
         $scope.getTotalTonnes = function(editMode){
             var temp = 0;
             if(editMode){
                  angular.forEach(qc.selected.mixes,function(value,key){
                     temp += value.details.tonnes;
                 });
             }else{
                angular.forEach($scope.newQuote.mixes,function(value,key){
                     temp += value.tonnes;
                 });
             }
             return temp;
         }
         
         $scope.loadMixes = function(){
             MixService.query().then(function(response){
                 qc.mixes = response;
             })
         }
        //TODO: see if auto complete can be used for the search strings
        $scope.materialSearch = function(materialString) {
            if (qc.mixes.length == 0)
                MixService.query().then(function(response) {
                    qc.mixes = response;
                    if (materialString)
                        qc.mixes.filter(function() {
                            return (qc.mixes.indexOf(angular.lowercase(materialString)) === 0);
                        })
                })
            return qc.mixes;
        }
        
        $scope.addOther = function(editMode){
            if(!editMode){
                $scope.newQuote.other.push({
                    name:"New Name...",
                    description:undefined,
                    cost:0,
                    charge:0
                });
                if($scope.collapseOther)
                    $scope.collapseOther = !$scope.collapseOther;
            }else{
                 qc.selected.others.push({
                    name:"New Name...",
                    description:undefined,
                    cost:0,
                    charge:0
                });
                if($scope.collapseEditOther)
                    $scope.collapseEditOther = !$scope.collapseEditOther;
            }
            
        }
        $scope.deleteOther = function(item){
            try{
             $scope.newQuote.other.splice($scope.newQuote.other.indexOf(item),1);
            }catch(err){
                //TODO: Error toast
            };
        };
        $scope.deleteOtherEdit = function(id,db){
                var i = 0;
                var x = -1;
                angular.forEach(qc.selected.others,function(value,key){
                   if(value.id == id)
                        x = i;
                    ++i;
                   
                });
                if(x >= 0){
                    if(db)
                        qc.selected.delete_others.push(qc.selected.others[x]); //TODO: change this to only put in the ID and send that to the server
                    qc.selected.others.splice(x,1);
                }
        }
        
        $scope.addComment = function(){
            qc.generation_array.push({
                name:"new comment",
                item_type:3
            });
        };
        //Dialogue Stuff
       $scope.openEmployeeDialog = function(ev)
        {
            if(qc.employees == undefined){
               $scope.loadEmployees();
            }
                
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_employeeDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              //console.log("dialog closed");
            });
        }
        
        $scope.openEmployeeDialogEdit = function(ev)
        {
            if(qc.employees == undefined){
               $scope.loadEmployees();
            }
                
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_employeeDialogEdit.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              //console.log("dialog closed");
            });
        }
        
        $scope.openContractorDialog = function(ev)
        {
            if(qc.contractors == undefined){
               $scope.loadContractors();
            }
                
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_contractorDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              //console.log("dialog closed");
            });
        }
        $scope.openContractorDialogEdit = function(ev)
        {
            if(qc.contractors == undefined){
               $scope.loadContractors();
            }
                
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_contractorDialogEdit.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              //console.log("dialog closed");
            });
        }
        
        $scope.openMixDialog = function(ev)
        {
            if(qc.employees == undefined){
               $scope.loadEmployees();
            }
                
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_mixDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              //console.log("dialog closed");
            });
        }
        $scope.openMixDialogEdit = function(ev)
        {
            if(qc.employees == undefined){
               $scope.loadEmployees();
            }
                
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_mixDialogEdit.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              //console.log("dialog closed");
            });
        }
        $scope.openNotes = function(ev,data){
            console.log(data.notes);
            var tempData;
            $scope.tempData = data.notes;
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_noteDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
             data.notes = $scope.tempData;
              $scope.tempData = "";
            });
        }
        $scope.openNotesContractor = function(ev,data){
            $scope.tempData = data.notes;
            $scope.tempDesc = data.descriptionTemp;
            $scope.tempComment = data.comments;
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_contractorNoteDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              data.notes = $scope.tempData;
              data.descriptionTemp = $scope.tempDesc; //This gets changed to description once added, this is due to desc already existing in pulled data
              data.comments = $scope.tempComment; 
              $scope.tempData = "";
              $scope.tempDesc = "";
              $scope.tempComment = "";
            });
        }
        
        $scope.openNotesContractorEdit = function(ev,data){
            $scope.tempData = data.details.notes;
            $scope.tempDesc = data.details.description;
            $scope.tempComment = data.details.comments;
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_contractorNoteDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              data.details.notes = $scope.tempData;
              data.details.description = $scope.tempDesc;
              data.details.comments = $scope.tempComment;
              $scope.tempData = "";
              $scope.tempDesc = "";
              $scope.tempComment = "";
            });
        }
        $scope.openNotesOther = function(ev,data){
            $scope.tempData = data.notes;
            $scope.tempComment = data.comments;
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/_other_note_dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
              data.notes = $scope.tempData;
              data.comments = $scope.tempComment;
              $scope.tempData = "";
              $scope.tempComment = "";
            });
        }
        $scope.openPickClient = function(ev,editMode){
            if(!editMode){
                if(qc.clients == undefined){
                   $scope.loadClients();
                }
                
                $mdDialog.show({
                    targetEvent: ev,
                    scope:$scope,
                    templateUrl: 'dialog_templates/_clientToQuoteDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    preserveScope:true
                })
                .then(function() {
                  //console.log("dialog closed");
                });
            }else{
                if(qc.clients == undefined){
                   $scope.loadClients();
                }
                    
                $mdDialog.show({
                    targetEvent: ev,
                    scope:$scope,
                    templateUrl: 'dialog_templates/_clientToQuoteDialogEdit.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    preserveScope:true
                })
                .then(function() {
                  //console.log("dialog closed");
                });
            }
     }
        $scope.openGenerateQuote = function(ev){
            qc.generation_array = [];
            angular.forEach(qc.selected.mixes,function(value,key){
                qc.generation_array.push({
                    id:value.details.id,
                    name:value.name,
                    item_type:0
                });
            });
            angular.forEach(qc.selected.contractors,function(value,key){
                if(value.details.contractor_type == 0){
                    qc.generation_array.push({
                    id:value.details.id,
                    name:value.name,
                    item_type:1
                    });
                }
            });
            angular.forEach(qc.selected.others,function(value,key){
                if(value.other_type == 0){
                    qc.generation_array.push({
                    id:value.id,
                    name:value.name,
                    item_type:2
                    });
                }
            });
            
            $mdDialog.show({
                targetEvent: ev,
                scope:$scope,
                templateUrl: 'dialog_templates/quote_templates/_create_quote_dialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                preserveScope:true
            })
            .then(function() {
                $scope.close();
            });
        } //TODO: Need to add the generation_array to the snapshot
        
        $scope.close = function() {
         $mdDialog.cancel();
        };
        $scope.done = function(){
            $mdDialog.hide();
        }
        //Watchers
        
        /*NOTE: The charging number input for each section has been disabled, the functionality remains in the system
        but as of now users can no longer directly edit it, this requires some reworking in the pdf generation to be re-enabled*/
        
        //Employee panel watcher
       $scope.$watch('newQuote.workers',function(){
           
           //If the charge has been modified by the user we dont want it to overide what they changed
            var chargeModified = true;
            if($scope.newQuote.costing.EmployeeDetails.employeeCharge == $scope.newQuote.costing.EmployeeDetails.employeeChargeOriginal){
                chargeModified = false;
                $scope.newQuote.costing.EmployeeDetails.employeeCharge = 0;
            }
            
            $scope.newQuote.costing.EmployeeDetails.employeeChargeOriginal = 0;
            $scope.newQuote.costing.EmployeeDetails.employeeCost = 0;
           
                 angular.forEach($scope.newQuote.workers,function(value,key){
                     value.cost = $scope.getEmployeeCost(value);
                     if(!isNaN(value.charge) && !isNaN(value.cost)){
                         //Same deal for the cost of the employee
                         if(value.original_charge == value.charge){
                             value.charge = $scope.getEmployeeCharge(value);
                             try{
                             angular.copy(value.charge,value.original_charge);
                             //This $watch is fired twice currently which causes angular.copy to throw an exception due to copying the same values
                             }catch(error){/*Attempting to find a way around such a cheap fix*/};
                         }else{
                             //if its been modified by the user then we want to only update the unseen charge.
                             value.original_charge = $scope.getEmployeeCharge(value);
                         }
                         
                         
                         value.margin = (value.charge - value.cost)/value.charge * 100;
                         
                         if(!chargeModified){ //if the charge has not been modified then update it
                            $scope.newQuote.costing.EmployeeDetails.employeeCharge += value.charge;
                         }
                        //update these either way
                        $scope.newQuote.costing.EmployeeDetails.employeeChargeOriginal += value.charge;
                        $scope.newQuote.costing.EmployeeDetails.employeeCost += value.cost;
                     }
                 });
             },true);
             
        //Editmode employee watcher
        $scope.$watch('qc.selected.employees',function(){
           if(qc.selected.quote){
           //If the charge has been modified by the user we dont want it to overide what they changed
            var chargeModified = true;
            if(qc.selected.quote.snapshot.quote.costing.employee_charge == qc.selected.quote.snapshot.quote.costing.employee_original_charge){
                chargeModified = false;
                qc.selected.quote.snapshot.quote.costing.employee_charge = 0;
            }
            
            qc.selected.quote.snapshot.quote.costing.employee_original_charge = 0;
            qc.selected.quote.snapshot.quote.costing.employee_cost = 0;
           
                 angular.forEach(qc.selected.employees,function(value,key){
                     value.details.cost = $scope.getEmployeeCostEdit(value);
                     if(!isNaN(value.details.charge) && !isNaN(value.details.cost)){
                         if(value.details.original_charge == value.details.charge){
                              value.details.original_charge = value.details.cost * 1.05;//TODO: Constant
                              value.details.charge = value.details.cost * 1.05;
                         }else{
                              value.details.original_charge = value.details.cost * 1.05;//TODO: Constant
                         }
    
                         value.details.margin = (value.details.charge - value.details.cost)/value.details.charge * 100;
                         
                         if(!chargeModified){ //if the charge has not been modified then update it
                            qc.selected.quote.snapshot.quote.costing.employee_charge += value.details.charge;
                         }
                        //update these either way
                        qc.selected.quote.snapshot.quote.costing.employee_original_charge += value.details.charge;
                        qc.selected.quote.snapshot.quote.costing.employee_cost += value.details.cost;
                     }
                 });
           }
        },true);
             
        //Mix watcher
         $scope.$watch('newQuote.mixes',function(){
             var chargeModified = true;
             if($scope.newQuote.costing.MixDetails.mixCharge == $scope.newQuote.costing.MixDetails.mixChargeOriginal){
                 chargeModified = false;
                 $scope.newQuote.costing.MixDetails.mixCharge = 0;
             }
             
             $scope.newQuote.costing.MixDetails.mixChargeOriginal = 0;
             $scope.newQuote.costing.MixDetails.mixCost = 0;
             
             angular.forEach($scope.newQuote.mixes,function(value,key){
                  if(!isNaN(value.charge) && !isNaN(value.cost) && !isNaN(value.tonnes) && !isNaN(value.thickness) && !isNaN(value.area)){
                    if(value.tonnes == value.original_tonnes){
                        value.tonnes = value.thickness * (value.area/1000) * 2.4;
                    }
                    value.original_tonnes = value.thickness * (value.area/1000) * 2.4;
                    
                    value.cost = value.tonnes * value.price_per_tonne;
                    if(value.charge == value.original_charge){
                        value.charge = value.cost * 1.05;//TODO: Link this up to an external constant
                    }
                    value.original_charge = value.cost * 1.05;
                    value.margin = (value.charge - value.cost)/value.charge * 100;
                    
                    $scope.newQuote.costing.MixDetails.mixChargeOriginal += value.charge;
                    $scope.newQuote.costing.MixDetails.mixCost += value.cost;
                    if(!chargeModified)
                        $scope.newQuote.costing.MixDetails.mixCharge += value.charge;
                  }
             });
         },true);
         //Mix edit mode watcher
         //Mix watcher
         $scope.$watch('qc.selected.mixes',function(){
             if(qc.selected.quote){
                 var chargeModified = true;
                 if(qc.selected.quote.snapshot.quote.costing.mix_charge == qc.selected.quote.snapshot.quote.costing.mix_original_charge){
                     chargeModified = false;
                     qc.selected.quote.snapshot.quote.costing.mix_charge = 0;
                 }
                 
                 qc.selected.quote.snapshot.quote.costing.mix_original_charge = 0;
                 qc.selected.quote.snapshot.quote.costing.mix_cost = 0;
                 
                 angular.forEach(qc.selected.mixes,function(value,key){
                     if(!isNaN(value.costing.charge) && !isNaN(value.costing.cost) && !isNaN(value.details.tonnes) && !isNaN(value.details.thickness) && !isNaN(value.details.area)){
                        if(value.details.tonnes == value.costing.original_tonnes){
                           value.details.tonnes = value.details.thickness * (value.details.area/1000) * 2.4;
                        }
                        value.costing.original_tonnes = value.details.thickness * (value.details.area/1000) * 2.4;
                        value.costing.cost = value.details.tonnes * value.costing.price_per_tonne;
                        if(value.costing.charge == value.costing.original_charge){
                            value.costing.charge = value.costing.cost * 1.05;//TODO: Link this up to an external constant
                        }
                        value.costing.original_charge = value.costing.cost * 1.05;
                        value.costing.margin = (value.costing.charge - value.costing.cost)/value.costing.charge * 100;
                    
                        qc.selected.quote.snapshot.quote.costing.mix_original_charge += value.costing.charge;
                        qc.selected.quote.snapshot.quote.costing.mix_cost += value.costing.cost;
                        if(!chargeModified)
                            qc.selected.quote.snapshot.quote.costing.mix_charge += value.costing.charge;
                    }else{
                        
                    }
                 });
             }
         },true);
         
        //Sub contractor panel watcher
        $scope.$watch('newQuote.contractors',function(){
            var chargeModified = true;
            if($scope.newQuote.costing.ContractorDetails.contractorCharge == $scope.newQuote.costing.ContractorDetails.contractorOriginalCharge){
                chargeModified = false;
                $scope.newQuote.costing.ContractorDetails.contractorCharge = 0;
            }
            
            $scope.newQuote.costing.ContractorDetails.contractorOriginalCharge = 0;
            $scope.newQuote.costing.ContractorDetails.contractorCost = 0;
            
            angular.forEach($scope.newQuote.contractors,function(value,key){
                if(!isNaN(value.cost) && !isNaN(value.charge)){
                    $scope.newQuote.costing.ContractorDetails.contractorOriginalCharge += value.charge;
                    $scope.newQuote.costing.ContractorDetails.contractorCost += value.cost;
                    if(!chargeModified)
                        $scope.newQuote.costing.ContractorDetails.contractorCharge += value.charge;
                }
                if(value.quantity > 0){
                    value.rate = value.charge / value.quantity;
                }else
                    value.rate = 0;
            });
        },true);
        
        //Edit mode sub contractor panel watcher
        $scope.$watch('qc.selected.contractors',function(){
             if(qc.selected.quote){
                var chargeModified = true;
                if(qc.selected.quote.snapshot.quote.costing.contractor_charge == qc.selected.quote.snapshot.quote.costing.contractor_original_charge)
                {
                    chargeModified = false;
                    qc.selected.quote.snapshot.quote.costing.contractor_charge = 0;
                }
                qc.selected.quote.snapshot.quote.costing.contractor_original_charge = 0;
                qc.selected.quote.snapshot.quote.costing.contractor_cost = 0;
                
                angular.forEach(qc.selected.contractors,function(value,key){
                     if(!isNaN(value.details.cost) && !isNaN(value.details.charge)){
                        qc.selected.quote.snapshot.quote.costing.contractor_original_charge += value.details.charge;
                        qc.selected.quote.snapshot.quote.costing.contractor_cost += value.details.cost;
                        
                    if(!chargeModified)
                        qc.selected.quote.snapshot.quote.costing.contractor_charge += value.details.charge;
                     }
                    if(value.details.quantity > 0){
                        value.details.rate = value.details.charge / value.details.quantity;
                    }else{
                        value.details.rate = 0;
                    }
                });
             }
        },true);
        
        //Others watcher
        $scope.$watch('newQuote.other',function(){
            var chargeModified = true;
            if($scope.newQuote.costing.OtherDetails.otherCharge == $scope.newQuote.costing.OtherDetails.otherOriginalCharge){
                chargeModified = false;
                $scope.newQuote.costing.OtherDetails.otherCharge = 0;
            }
                
            $scope.newQuote.costing.OtherDetails.otherOriginalCharge = 0;
            $scope.newQuote.costing.OtherDetails.otherCost = 0;
            
            angular.forEach($scope.newQuote.other,function(value,key){
                if(!isNaN(value.cost) && !isNaN(value.charge)){
                    $scope.newQuote.costing.OtherDetails.otherOriginalCharge += value.charge;
                    $scope.newQuote.costing.OtherDetails.otherCost += value.cost;
                    
                    if(!chargeModified)
                        $scope.newQuote.costing.OtherDetails.otherCharge += value.charge;
                }
            });
        },true);
        //Others watcher EDIT
        $scope.$watch('qc.selected.others',function(){
            if(qc.selected.quote){
                var chargeModified = true;
                if(qc.selected.quote.snapshot.quote.costing.other_charge == qc.selected.quote.snapshot.quote.costing.other_original_charge){
                    chargeModified = false;
                    qc.selected.quote.snapshot.quote.costing.other_charge = 0;
                }
                    
                qc.selected.quote.snapshot.quote.costing.other_original_charge = 0;
                qc.selected.quote.snapshot.quote.costing.other_cost = 0;
                
                angular.forEach(qc.selected.others,function(value,key){
                    if(!isNaN(value.cost) && !isNaN(value.charge)){
                        qc.selected.quote.snapshot.quote.costing.other_original_charge += value.charge;
                        qc.selected.quote.snapshot.quote.costing.other_cost += value.cost;
                        
                        if(!chargeModified)
                            qc.selected.quote.snapshot.quote.costing.other_charge += value.charge;
                    }
                });
            }
        },true);
        //Cartage rate watch and function
        $scope.$watch('newQuote.distance_to_site',function(){
            
            if($scope.newQuote.distance_to_site == undefined)
            {
                $scope.newQuote.costing.cartage = 0;
            }else{
                $scope.getCartage($scope.newQuote.distance_to_site)
            }
        },true);
        $scope.$watch('qc.selected.quote.distance_to_site',function(){
            if(qc.selected.quote){
                if(qc.selected.quote.distance_to_site == undefined)
                {
                    qc.selected.quote.snapshot.quote.cartage = 0;
                }else{
                    $scope.getCartageEdit(qc.selected.quote.distance_to_site)
                }
            }
        },true);
        
        
        //Overall cost watchers
        $scope.$watch('newQuote.costing',function(){
            $scope.updateQuoteMoney();
        },true);
        $scope.$watch('newQuote.visits',function(){
            $scope.updateQuoteMoney();
        },true);
        $scope.$watch('newQuote.hire',function(){
            $scope.updateQuoteMoney();
        },true);
        
        $scope.updateQuoteMoney = function(){
            $scope.newQuote.cost = ($scope.newQuote.costing.EmployeeDetails.employeeCost + $scope.newQuote.costing.ContractorDetails.contractorCost + $scope.newQuote.costing.MixDetails.mixCost + 
            $scope.newQuote.costing.OtherDetails.otherCost + $scope.newQuote.costing.cartage * $scope.getTotalTonnes(false));
            $scope.newQuote.charge = ($scope.newQuote.costing.EmployeeDetails.employeeCharge + $scope.newQuote.costing.ContractorDetails.contractorCharge + $scope.newQuote.costing.MixDetails.mixCharge + 
            $scope.newQuote.costing.OtherDetails.otherCharge + ($scope.newQuote.costing.cartage * $scope.getTotalTonnes(false)));
            
            if($scope.newQuote.hire > 0){
                $scope.newQuote.charge += ($scope.newQuote.hire * $scope.newQuote.visits);
                $scope.newQuote.cost += ($scope.newQuote.hire * $scope.newQuote.visits);
            }
        }
        
        $scope.$watch('qc.selected.quote.snapshot.quote.costing',function(){
            $scope.updateQuoteMoneyEdit();
        },true);
        $scope.$watch('qc.selected.quote.truck_hire',function(){
            $scope.updateQuoteMoneyEdit();
        },true);
        $scope.$watch('qc.selected.quote.visits',function(){
            $scope.updateQuoteMoneyEdit();
        },true);
        
        $scope.updateQuoteMoneyEdit = function(){
            if(qc.selected.quote){
                qc.selected.quote.cost = (qc.selected.quote.snapshot.quote.costing.employee_cost + qc.selected.quote.snapshot.quote.costing.contractor_cost + qc.selected.quote.snapshot.quote.costing.mix_cost + 
                qc.selected.quote.snapshot.quote.costing.other_cost + (qc.selected.quote.snapshot.quote.costing.cartage * $scope.getTotalTonnes(true)));
                qc.selected.quote.charge = (qc.selected.quote.snapshot.quote.costing.employee_charge + qc.selected.quote.snapshot.quote.costing.contractor_charge + qc.selected.quote.snapshot.quote.costing.mix_charge + 
                qc.selected.quote.snapshot.quote.costing.other_charge + (qc.selected.quote.snapshot.quote.costing.cartage * $scope.getTotalTonnes(true)));
                if(qc.selected.quote.truck_hire > 0){
                    qc.selected.quote.charge += (qc.selected.quote.truck_hire * qc.selected.quote.visits);
                    qc.selected.quote.cost += (qc.selected.quote.truck_hire * qc.selected.quote.visits);
                }
            }
        }
        $scope.getCartage = function(distance)
        {
            if(qc.cartageRates == undefined)
            {
                CartageRateService.query().then(function(response){
                    qc.cartageRates = response;
                     $scope.newQuote.costing.cartage =  CartageRateService.getRate(distance,qc.cartageRates);
                 });
            }else{
                  $scope.newQuote.costing.cartage =  CartageRateService.getRate(distance,qc.cartageRates);
            }
        }
        
        $scope.getCartageEdit = function(distance)
        {
            if(qc.cartageRates == undefined)
            {
                CartageRateService.query().then(function(response){
                    qc.cartageRates = response;
                    qc.selected.quote.snapshot.quote.costing.cartage =  CartageRateService.getRate(distance,qc.cartageRates);
                 });
            }else{
                 qc.selected.quote.snapshot.quote.costing.cartage =  CartageRateService.getRate(distance,qc.cartageRates);
            }
        }

        $scope.generatePdf = function (type) {
    $http.post('/generate_quote.pdf',{id:qc.selected.quote.id,quote_pdf_type:type,attention:$scope.attention,pdf_date:$scope.pdfDate,order_list:qc.generation_array}).then(function(response){
                  var file = new Blob([response.data], {
                    type: 'application/pdf'
                  });
                  var fileURL = URL.createObjectURL(file);
                  $window.open(fileURL, '_blank');
             });
        
          // opening in new tab
          
          
          //save as ti window with name
          //saveData(response.data,'sample.pdf','pdf')
    }
        
        
        /*The following method was a quick logic example of how the data is calculated, this will be done server side */
        
        $scope.createQuote = function(){
                var mixes = [];
                var labor = 0;
                var final_mixes = [];
                var additional_tonnage_charge = 0;
                var additional_total_charge = 0;
                
                angular.forEach(qc.selected.mixes,function(value,key){
                        mixes.push({
                            name:value.name,
                            charge_per_tonne:value.costing.charge/value.details.tonnes,
                            tonnes:value.details.tonnes
                        });
                });
                angular.copy(mixes,final_mixes);

                labor = qc.selected.quote.snapshot.quote.costing.employee_charge;
                
                angular.forEach(qc.selected.contractors,function(value,key){
                    switch(value.details.contractor_type){
                        case 0:
                            additional_total_charge += value.details.charge;
                            break;
                        case 1:
                            additional_tonnage_charge += value.details.charge;
                            break;
                        case 2:
                            labor += value.details.charge;
                            break;
                        default:
                             additional_total_charge += value.details.charge;
                            break;
                    }
                });
                angular.forEach(qc.selected.others,function(value,key){
                    switch(value.other_type){
                        case 0:
                            additional_total_charge += value.charge;
                            break;
                        case 1:
                            additional_tonnage_charge += value.charge;
                            break;
                        case 2:
                            labor += value.charge;  
                            break;
                        default:
                         additional_total_charge += value.charge;
                        break;
                    }
                });
                
                //Adding up into the final mixes
                var mix_labor = labor/final_mixes.length;
                var mix_additional_total_charge = additional_total_charge/final_mixes.length;
                angular.forEach(final_mixes,function(value,key){
                    value.charge_per_tonne += mix_labor + (mix_additional_total_charge * value.tonnes);
                });
                
                console.log(final_mixes);
        }
        
        //Methods used to order the list on the quote view tab
        $scope.setOrder = function(order){
            if(qc.current_order == order){
                //If the column is already selected, inverse it
                qc.current_order = ('-' + qc.current_order);
            }else{
                //otherwise either the column is not selected or is inversed, so set it to the order
                qc.current_order = order;
            }
            var orderBy = $filter('orderBy');
            qc.quotes = orderBy(qc.quotes,qc.current_order);
        }
});
    
