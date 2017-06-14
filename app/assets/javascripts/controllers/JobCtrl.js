//TODO: add success returns to all return methods aside from index cause fucking eyyyyyy
//TODO: Percentage on the quote screen caps out at 100%
//TODO: Format the time display shit on job and quote
angular
    .module('ARM.job', [])
    .controller('JobCtrl', function(jobs, $scope, $mdToast, $mdDialog, QuoteService, ClientService, EmployeeService, MixService, JobService, $state) {
        $scope.selectedTab = 0;
        $scope.docketTab = 0;
        console.log(jobs);
        var jc = this;
        jc.jobs = jobs;

        $scope.job_types = [{
            name: "Supply & Lay",
            data: 0
        }, {
            name: "Supply & Deliver",
            data: 1
        }, {
            name: "Supply",
            data: 2
        }];

        jc.newJob = {};
        jc.newDocket = {
            tonnes_delivered: 0
        };
        jc.selected = {};
        jc.selectedDocket = {};
        jc.removeDockets = [];
        $scope.jobQuery = {};
        $scope.saveJob = function() {
            jc.newJob.quote = {};
            if (jc.newJob.client_id && jc.newJob.job_type && jc.newJob.quote_id && jc.newJob.job_date) {
                JobService.save(jc.newJob).then(function(response) {
                    console.log(response);
                    $scope.selectedTab = 0;
                    jc.newJob = {};
                    JobService.query().then(function(responseJ) {
                        jc.jobs = responseJ;
                    });
                });
            }
        }
        $scope.editJob = function() {
            jc.selected.remove_dockets = jc.removeDockets;
            $scope.sendJob = {};
            angular.copy(jc.selected,$scope.sendJob);
            $scope.sendJob.quote = {};
            console.log(jc.selected);
            JobService.update($scope.sendJob).then(function(response) {
                console.log(response);
                if (response.success) {
                    $mdToast.showSimple("Job saved successefully!");
                    $scope.selectedTab = 0;
                    jc.selectedDocket = {};
                    jc.selected = {};
                    jc.removeDockets = {};
                    JobService.query().then(function(responseJ) {
                        jc.jobs = responseJ;
                    });
                }
                else {
                    $mdToast.showSimple("Job failed to save!");
                }

            });
        };
        $scope.selectJob = function(id) {
            //TODO: Get dockets for this job here
            JobService.get(id).then(function(response) {
                console.log(response);
                //TODO: Client side checks
                jc.selected = response;
                jc.selected.job_date = new Date(jc.selected.job_date);
                QuoteService.get(jc.selected.quote_id).then(function(response) {
                    jc.selected.quote = response;
                    angular.forEach(jc.selected.docket_list, function(value, key) {
                        value.docket_date = new Date(value.docket_date);
                    });
                });
                $scope.selectedTab = 2;
            });
        };
        $scope.deleteJob = function(id, ev) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure about that?')
                .textContent('Deletion of a job will remove all associated dockets and be irreversible!')
                .ariaLabel('Delete job confirmation')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                JobService.remove(id).then(function(response) {
                    if (response.success) {
                        $mdToast.showSimple("Job Deleted!");
                        console.log(response);
                        JobService.query().then(function(responseJ) {
                            jc.jobs = responseJ;
                        });
                        $scope.selectedTab = 0;
                        jc.selected = {};

                    }
                    else {
                        $mdToast.showSimple("Job failed to delete!");
                    }
                });
            }, function() {
                return false;
            });


        }




        $scope.showImportQuote = function(ev) {
                if (jc.quotes == undefined) {
                    $scope.loadQuotes();
                }

                $mdDialog.show({
                        targetEvent: ev,
                        scope: $scope,
                        templateUrl: 'dialog_templates/_quoteToJobDialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        preserveScope: true
                    })
                    .then(function() {

                        ClientService.get(jc.newJob.quote.quote.client_id).then(function(response) {
                            if (response.name) {
                                jc.newJob.client_name = response.name;
                                jc.newJob.name = jc.newJob.quote.quote.name;
                                jc.newJob.client_id = jc.newJob.quote.quote.client_id;
                                jc.newJob.notes = jc.newJob.quote.quote.notes;
                                jc.newJob.job_type = jc.newJob.quote.quote.quote_type;
                            }
                            else {
                                $mdToast.showSimple("Falsed to load client information!");
                            }

                        });

                    });
            }
            //TODO: Add this back to the quote details area
        $scope.showPickQuote = function(ev) {
            if (jc.quotes == undefined) {
                $scope.loadQuotes();
            }

            $mdDialog.show({
                    targetEvent: ev,
                    scope: $scope,
                    templateUrl: 'dialog_templates/_quoteToJobDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    preserveScope: true
                })
                .then(function() {
                    //console.log("dialog closed");
                });
        }
        $scope.showPickClient = function(ev) {
            if (jc.clients == undefined) {
                $scope.loadClients();
            }

            $mdDialog.show({
                    targetEvent: ev,
                    scope: $scope,
                    templateUrl: 'dialog_templates/_clientToJobDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    preserveScope: true
                })
                .then(function() {
                    //console.log("dialog closed");
                });
        }
        $scope.showPickClientEdit = function(ev) {
            if (jc.clients == undefined) {
                $scope.loadClients();
            }

            $mdDialog.show({
                    targetEvent: ev,
                    scope: $scope,
                    templateUrl: 'dialog_templates/_clientToJobDialogEdit.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    preserveScope: true
                })
                .then(function() {
                    //console.log("dialog closed");
                });
        }
        $scope.showPickEmployee = function(ev) {
            if (jc.employees == undefined) {
                $scope.loadEmployees();
            }

            $mdDialog.show({
                    targetEvent: ev,
                    scope: $scope,
                    templateUrl: 'dialog_templates/_employee_docket_dialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    preserveScope: true
                })
                .then(function() {
                    //console.log("dialog closed");
                });
        }
        $scope.showPickMix = function(ev) {
                if (jc.Mixes == undefined) {
                    $scope.loadMixes();
                }

                $mdDialog.show({
                        targetEvent: ev,
                        scope: $scope,
                        templateUrl: 'dialog_templates/_mix_docket_dialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        preserveScope: true
                    })
                    .then(function() {
                        //console.log("dialog closed");
                    });
            }
            //TODO: Implement this fully as UI redisign is needed
        $scope.showAddDocket = function(ev) {
            $mdDialog.show({
                    targetEvent: ev,
                    scope: $scope,
                    templateUrl: 'dialog_templates/_jobDockets.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    preserveScope: true
                })
                .then(function() {
                    //console.log("dialog closed");
                });
        }
        $scope.close = function() {
            $mdDialog.cancel();
        };
        $scope.done = function() {
            $mdDialog.hide();
        }

        $scope.addQuote = function(quote) { //TODO: Implement a minimal get method to display basic quote info from quotecontroller
            jc.newJob.quote_id = quote.id;
            QuoteService.get(quote.id).then(function(response) {
                jc.newJob.quote = response;
                $scope.done();
                console.log(jc.newJob.quote);
            });

        }
        $scope.loadQuotes = function() {
            QuoteService.query().then(function(response) {
                if (response.success == undefined) {
                    jc.quotes = response;
                }
                else {
                    //error
                }
            })
        }
        $scope.addClient = function(editMode, client) {
            if (!editMode) {
                jc.newJob.client_id = client.id;
                jc.newJob.client_name = client.name;
                $scope.done();
            }
            else {
                jc.selected.client_id = client.id;
                jc.selected.client_name = client.name;
                $scope.done();
            }
        }
        $scope.loadClients = function() {
            ClientService.query().then(function(response) {
                console.log(response);
                if (response.success == undefined) {
                    jc.clients = response;
                }
                else {
                    //error
                }
            });
        }

        $scope.addEmployee = function(employee) {
            jc.newDocket.employee_id = employee.id;
            jc.newDocket.employee_name = (employee.given_names + " " + employee.last_name);
        };
        $scope.loadEmployees = function() {
            EmployeeService.query().then(function(response) {
                jc.employees = response;
            });
        };

        $scope.addMix = function(mix) {
            jc.newDocket.mix_id = mix.id;
            jc.newDocket.mix_name = mix.name;
        };
        $scope.loadMixes = function() {
            MixService.query().then(function(response) {
                jc.mixes = response;
            });
        };

        $scope.addDocket = function() { // It might be worth changing this to automatically save everytime you add a docket but nothing else in the site does this
            if (jc.selected.docket_list == undefined) {
                jc.selected.docket_list = [];
            }

            if ($scope.docketExists(jc.newDocket)) {
                $mdToast.showSimple("Docket number already exists in job!");
            }
            else {
                var temp = {};
                angular.copy(jc.newDocket, temp);
                jc.selected.docket_list.push(temp);
                jc.newDocket.docket_no = undefined;
                jc.newDocket.tonnes_delivered = undefined;
            }

        }
        $scope.docketExists = function(docket) {
            var found = false;
            angular.forEach(jc.selected.docket_list, function(value, key) {
                //Only has one comparison so no need to prevent going in to the body
                if (value.docket_no == docket.docket_no) {
                    found = true;
                }
            });
            if (found)
                return true;
            else
                return false;
        }
        $scope.removeDocket = function(ev, docket) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you wish to delete this docket?')
                .textContent('In order to fully confirm this deletion you will need to save this job once you have finished making changes!')
                .ariaLabel('Delete docket confirmation')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                if (docket.job_id) {
                    jc.removeDockets.push(docket);
                }

                jc.selected.docket_list.splice(jc.selected.docket_list.indexOf(docket), 1);
                $scope.docketTab = 0;
                jc.selectedDocket = {};
            }, function() {
                return false;
            });
        }
        $scope.generateInvoice = function() {
            $state.go('generate_invoice', {
                job_id: jc.selected.id
            })
        }

        $scope.selectDocket = function(docket) {
            jc.selectedDocket = docket;
            $scope.docketErrors = {};
            $scope.docketTab = 2;
        }
        $scope.uploadDocketFile = function() {
            //As angularjs has no data binding for file type input
            console.log("ayy");
            var file = document.getElementById('docketFile').files[0],
                reader = new FileReader();
            reader.onloadend = function(e) {
                var data = e.target.result;
                //send you binary data via $http or $resource or do anything else with it
                JobService.upload_docket(jc.selected.id, data).then(function(response) {
                    console.log(response);
                    if (response.success) {
                        $mdToast.showSimple("Dockets added with no errors!");
                        $scope.selectJob(jc.selected.id);
                    }
                    else {
                        $mdToast.showSimple("Dockets added with errors!");
                        $scope.selectJob(jc.selected.id);
                        $scope.docketErrors = response.errors;
                    }
                })
            }
            reader.readAsBinaryString(file);
        }
    })
