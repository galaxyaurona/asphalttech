angular
    .module('ARM.purchase', ['ARM.helper.services', 'ARM.purchase.services'])
    .controller('PurchaseCtrl', function ($mdToast, $mdMedia, HelperService, PurchaseService, ClientService, $mdSidenav, $mdDialog, purchases) {
        var pcc = this;
        pcc.purchases = purchases;

        var date = new Date();
        pcc.fromDateQuery = new Date(date.getFullYear(), date.getMonth(), 1);
        pcc.toDateQuery = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        pcc.newPurchase = {
            purchase_items: []
        }

        pcc.gridOptions = {
            data: pcc.purchases,
            enableFiltering: true,
            appScopeProvider: pcc,
            columnDefs: [
                {
                    field: 'id',
                    name: 'Purchase number',
                    cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.openSelectedPurchase(row.entity)"><strong>{{row.entity[col.field]}}</strong></a></div>'
                },
                {
                    field: 'order_by'
                },
                {
                    field: 'supplier'
                },
                {
                    field: 'date_ordered',
                    cellFilter: 'date:"dd/MM/yy"',
                    filterCellFiltered: true,
                },
                {
                    field: 'date_of_work',
                    cellFilter: 'date:"dd/MM/yy"',
                    filterCellFiltered: true,
                },
                {
                    field: 'job.invoice_id',
                    name: 'Invoice number'
                },
                {
                    field: 'note'
                },
            ]
        };

        pcc.inRange = function () {
            pcc.toDateQuery.setDate(pcc.toDateQuery.getDate() + 1);
            PurchaseService.inRange(pcc.fromDateQuery, pcc.toDateQuery).then(function (response) {
                if (response.success) {
                    pcc.purchases = response.data;
                    pcc.gridOptions.data = response.data;
                }
                else {
                    $mdToast.showSimple("Some error has occurred,contact developer for more info");
                }
            })
        };
        pcc.openSelectedPurchase = function (purchase) {
            pcc.selectedPurchase = purchase;
            pcc.editMode = false;
            pcc.selectedIndex = 2;
        }

        pcc.orderTypes = [
            {
                label: 'Production',
                value: 'production'
         },
            {
                label: 'Administration',
                value: 'administration'
         },
            {
                label: 'Construction',
                value: 'construction'
         },
      ];

        pcc.addAJob = function (newPurchase, $event) {
            var useFullScreen = $mdMedia('xs')
            $mdDialog.show({
                    controller: pcc.JobDialogController,
                    controllerAs: 'jdc',
                    templateUrl: 'dialog_templates/_add_job_to_purchase.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                })
                .then(function (job) {
                    newPurchase.job = job;
                    newPurchase.job_id = job.id;
                }, function () {
                    console.log('You cancelled the dialog.');
                });
        }
        pcc.JobDialogController = function ($mdDialog, ClientService) {
            var jdc = this;
            jdc.cancel = function () {
                $mdDialog.cancel();
            }
            jdc.searchForJob = function (addAJobForm) {
                addAJobForm.$setSubmitted();

                if (jdc.query != undefined && jdc.query.client_name != undefined) {
                    ClientService.queryClientsJob(jdc.query).then(function (response) {
                        if (response.success) {
                            jdc.queryResults = response.data;
                        }

                        else
                            $mdToast.showSimple("Some error has occurred,contact developer for more info");
                    })
                }
            }
            jdc.selectJob = function (job, $event) {
                $mdDialog.hide(job);
            }

        }

        pcc.create = function (newPurchaseForm) {
            console.log(newPurchaseForm.$invalid);
            if (!newPurchaseForm.$invalid) {
                PurchaseService.save(pcc.newPurchase).then(function (response) {
                    if (response.success) {
                        pcc.purchases.push(response.data);
                        pcc.newPurchase = {
                            purchase_items: []
                        }
                        pcc.newItem = {};
                    }

                })
            }
        }
        pcc.startEdit = function () {
            pcc.editMode = true;
            pcc.editingPurchase = angular.copy(pcc.selectedPurchase);
            console.log('before', pcc.editingPurchase);
            pcc.editingPurchase.date_ordered = new Date(pcc.selectedPurchase.date_ordered);
            pcc.editingPurchase.date_of_work = new Date(pcc.selectedPurchase.date_of_work);

        }
        pcc.cancelEdit = function () {
            pcc.editMode = false;
        }
        pcc.edit = function () {


            PurchaseService.update(pcc.editingPurchase).then(function (response) {
                if (response.success) {
                    var index = pcc.purchases.indexOf(pcc.selectedPurchase);
                    pcc.purchases[index] = response.data
                    pcc.selectedPurchase = pcc.purchases[index];
                    pcc.editMode = false;
                }
                else {
                    $mdToast.showSimple("Some error has occurred,contact developer for more info");
                }
            })
        }
        pcc.delete = function (selectedPurchase) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure ?')
                .textContent('All the purchase items will be deleted and cannot be restore?')
                .ok('Delete')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                PurchaseService.delete(selectedPurchase).then(function (response) {
                    if (response.success) {
                        var index = pcc.purchases.indexOf(selectedPurchase);
                        pcc.purchases.splice(index, 1);
                        pcc.selectedPurchase = undefined;
                        pcc.editMode = false;
                        pcc.selectedIndex = 0;
                    }
                    else {
                        $mdToast.showSimple("Some error has occurred,contact developer for more info");
                    }
                })
            })
        }

        pcc.addNewPurchaseItem = function (form, list, $event) {

            form.item_name.$setDirty();
            form.estimate.$setDirty();
            form.actual.$setDirty();
            console.log(form);
            if (pcc.newItem != undefined && pcc.newItem.item_name != undefined && (pcc.newItem.actual != undefined || pcc.newItem.estimate != undefined)) {
                list.unshift(pcc.newItem);
                pcc.newItem = {};
            }
        }
        pcc.removePurchaseItem = function (list, person) {
            var index = list.indexOf(person)
            list.splice(index, 1);
        }
    })