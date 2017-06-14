angular
    .module('ARM.invoice', ['ARM.helper.services', 'ARM.invoice.services'])
    .controller('InvoiceCtrl', function ($mdToast, $mdMedia, HelperService, InvoiceService, ClientService, $mdSidenav, $mdDialog) {
        var ivc = this;
        ivc.helloWorld = "helloWorld"
        var date = new Date();

    })
    .controller('GenerateInvoiceCtrl', function ($filter, $window, $http, $mdToast, $mdMedia, HelperService, InvoiceService, JobService, $mdSidenav, $mdDialog, job, cartageRates) {
        var gic = this;
        gic.job = job;
        gic.beautifiedJob = JSON.stringify(gic.job, null, 4);
        console.log(gic.beautifiedJob);
        gic.client = job.client;
        gic.dockets = job.dockets;
        gic.quote = job.quote;
        gic.cartageRates = cartageRates.reduce(function (map, currentValue) {
            map[currentValue.km] = currentValue.rate;
            return map;

        }, {})


        gic.job_types = [{
            name: "Supply & Lay",
            data: 0
        }, {
            name: "Supply & Deliver",
            data: 1
        }, {
            name: "Supply",
            data: 2
        }];
        gic.columns = [];
        gic.job_type = job.job_type;
        gic.newInvoice = {
            items: [],

        };
        gic.job_type_changed = function () {
            if (gic.job_type == '1') {
                gic.colspan = 11;
                gic.newInvoice.subtotal = gic.newInvoice.subtotal + gic.newInvoice.total_waiting_time_backup * gic.newInvoice.waiting_time_rate_backup;
            }
            else {
                gic.newInvoice.subtotal = gic.newInvoice.subtotal - gic.newInvoice.total_waiting_time_backup * gic.newInvoice.waiting_time_rate_backup;
                gic.colspan = 6;
            }
        }
        gic.job_type_changed();

        gic.newInvoice.type = gic.job.type;
        gic.newInvoice.client = gic.client;
        gic.newInvoice.job_type = gic.job.job_type;
        gic.newInvoice.subtotal = 0;
        gic.newInvoice.gst = 0;
        gic.newInvoice.total = 0;
        gic.newInvoice.total_waiting_time_backup = 0;
        gic.newInvoice.waiting_time_rate_backup = 0;
        gic.generateInvoice = function (newInvoiceForm) {
            gic.newInvoice.job_type = gic.job_type;
            gic.newInvoice.columns = gic.columns;
            if (gic.newInvoice.waiting_time_rate == undefined) {
                gic.newInvoice.waiting_time_rate = 0;
            }
            if (gic.newInvoice.total_waiting_time == undefined) {
                gic.newInvoice.total_waiting_time = 0;
            }
            if (newInvoiceForm.$valid) {
                console.log('valid')
                $http.post('/preview_invoice.pdf', gic.newInvoice).then(function (response) {
                    var file = new Blob([response.data], {
                        type: 'application/pdf'
                    });
                    var fileURL = URL.createObjectURL(file);
                    $window.open(fileURL, '_blank');
                }, function (error) {
                    console.log(error);
                })
            }

        }
        gic.addingToTotal = function (item, column) {
            console.log(item, column);
            if (item.total == undefined) {
                item.total = 0;
            }
            if (item.backup == undefined) {
                item.backup = [];
            }
            if (item.backup[column.name] == undefined) {
                item.backup[column.name] = 0;
            }
            item.total = item.total - item.backup[column.name] + item[column.name];
            item.backup[column.name] = item[column.name];
        }
        gic.calculateTotal = function (item) {
            if (item.total == undefined) {
                item.total = 0;
            }
            if (item.backup == undefined) {
                item.backup = [];
            }
            if (item.rate == undefined) {
                item.rate = 0;
                item.backup.rate = 0;
            }
            if (item.backup.rate == undefined) {

                item.backup.rate = 0;
            }
            if (item.qty == undefined) {
                item.qty = 0;
                item.backup.qty = 0;
            }
            if (item.backup.qty == undefined) {
                item.backup.qty = 0;
            }
            gic.newInvoice.subtotal = gic.newInvoice.subtotal - item.total;
            item.total = item.rate * item.qty + item.total - (item.backup.rate * item.backup.qty);
            gic.newInvoice.subtotal = gic.newInvoice.subtotal + item.total;
            gic.newInvoice.gst = gic.newInvoice.subtotal * 10 / 100;
            gic.newInvoice.total = gic.newInvoice.subtotal + gic.newInvoice.gst;
            item.backup.rate = item.rate;
            item.backup.qty = item.qty;
        }
        gic.addNewColumn = function () {
            var index = -1;
            if (gic.new_column == undefined || gic.new_column.name == undefined || gic.new_column.name.trim == '') {
                gic.column_name_empty = true;
                gic.columns_exist = false;
            }
            else {
                gic.column_name_empty = false;
                for (var i = 0; i < gic.columns.length; i++) {
                    if (gic.columns[i].name == gic.new_column.name) {
                        index = i;
                        break;
                    }
                }

                if (index != -1) {
                    gic.columns_exist = true;
                }
                else {
                    gic.columns_exist = false;
                    gic.columns.push(angular.copy(gic.new_column));
                    gic.new_column = {};
                }
            }


        }
        gic.calculateCartage = function (item, type) {
            if (gic.job_type == 1) {
                if (item.backup == undefined) {
                    item.backup = [];
                }
                if (item.backup.cartage == undefined) {
                    item.backup.cartage = 0;
                }
                if (item.total == undefined) {
                    item.total = 0;
                }
                if (type == 'km') {
                    item.cartage = gic.cartageRates[item.km] || 0;
                } else {
                    if (item.cartage == undefined)
                        item.cartage = 0;
                }
                gic.newInvoice.subtotal = gic.newInvoice.subtotal - item.total;
                item.total = item.total - item.backup.cartage + item.cartage;
                item.backup.cartage = item.cartage;
                gic.newInvoice.subtotal = gic.newInvoice.subtotal + item.total;
                gic.newInvoice.gst = gic.newInvoice.subtotal * 10 / 100;
                gic.newInvoice.total = gic.newInvoice.subtotal + gic.newInvoice.gst;
            }
        }
        gic.groupedDockets = $filter('groupBy')(gic.job.dockets, 'mix.id');
        gic.processedDockets = [];
        angular.forEach(gic.groupedDockets, function (value, key) {

            var backup = angular.copy(value)
            value = {
                name: backup[0].mix.name,
                list: backup
            }
            value.sum_qty = value.list.map(function (currentValue, index, array) {
                currentValue.qty = currentValue.tonnes_delivered;
                currentValue.item_date = new Date(currentValue.docket_date);
                currentValue.rate = currentValue.mix.price_per_tonne;
                currentValue.unit = 't';
                return currentValue.tonnes_delivered;
            })
            value.sum_qty = $filter('sum')(value.sum_qty);
            value.mix_id = key;
            gic.processedDockets.push(value);
        })

        function AddHeaderDialogController($mdDialog, processedDockets) {

            var ahdc = this;
            ahdc.processedDockets = processedDockets;
            ahdc.noMix = false;
            ahdc.cancel = function () {
                $mdDialog.cancel();
            }
            ahdc.logMix = function () {
                ahdc.noMix = false;
                console.log(ahdc.selectedMix);
            }
            ahdc.changeSelectAll = function () {
                if (ahdc.selectedMix.name !== undefined) {
                    for (var i = 0; i < ahdc.selectedMix.list.length; i++) {
                        ahdc.selectedMix.list[i].selected = ahdc.selectedMix.selectAll;
                    }
                }
            }

            ahdc.addingSimple = function () {
                $mdDialog.hide({
                    name: 'New header',
                    type: 'header'
                });
            }
            ahdc.addingFromSelection = function (addNewContactPersonForm, contactPerson) {
                if (ahdc.selectedMix != undefined) {
                    ahdc.noMix = false;

                    ahdc.selectedMix.type = 'mix';
                    $mdDialog.hide(ahdc.selectedMix);
                }
                else {
                    ahdc.noMix = true;
                }

            }
        }

        function AddItemDialogController($mdDialog, processedDockets, freeDockets) {

            var aidc = this;
            aidc.processedDockets = processedDockets;

            aidc.noMix = false;
            aidc.cancel = function () {
                $mdDialog.cancel();
            }
            aidc.logMix = function () {
                aidc.noMix = false;
                console.log(aidc.selectedMix);
            }
            aidc.changeSelectAll = function () {
                if (aidc.selectedMix.name !== undefined) {
                    for (var i = 0; i < aidc.selectedMix.list.length; i++) {
                        aidc.selectedMix.list[i].selected = aidc.selectedMix.selectAll;
                    }
                }
            }

            aidc.addingSimple = function () {
                $mdDialog.hide({
                    description: 'New item',
                    type: 'item',
                    has_attachment: false
                });
            }
            aidc.addingFromSelection = function (addNewContactPersonForm, contactPerson) {
                if (aidc.selectedMix != undefined) {
                    aidc.noMix = false;
                    aidc.selectedDockets = $filter('filter')(aidc.selectedMix.list, {
                        selected: true
                    })
                    if (aidc.selectedDockets.length == 0) {
                        aidc.noDockets = true;
                    }
                    else {
                        aidc.noDockets = false;
                        if (aidc.selectedDockets.length == 1) {
                            aidc.selectedDockets[0].has_attachment = false;
                            $mdDialog.hide(
                                aidc.selectedDockets[0]
                            );
                        }
                        else {
                            aidc.selectedDockets[0].has_attachment = true;
                            $mdDialog.hide({
                                description: 'New item',
                                type: 'item',
                                has_attachment: true,
                                list: aidc.selectedDockets
                            });
                        }
                    }
                    console.log('selected docket', aidc.selectedDockets)
                        //aidc.selectedMix.type = 'mix';
                        //$mdDialog.hide(aidc.selectedMix);
                }
                else {
                    aidc.noMix = true;
                    aidc.noDockets = false;
                }

            }
        }

        gic.freeDockets = []

        gic.addHeader = function ($event) {
            $mdDialog.show({
                    controller: AddHeaderDialogController,
                    controllerAs: 'ahdc',
                    templateUrl: 'dialog_templates/invoice/_add_header.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    fullscreen: false,
                    locals: {
                        processedDockets: gic.processedDockets
                    }
                })
                .then(function (item) {
                    gic.newInvoice.items.push(angular.copy(item));
                    if (item.type == 'mix') {
                        for (var i = item.list.length; i--;) {
                            if (item.list[i].selected) {
                                item.list[i].type = 'item';

                                gic.calculateTotal(item.list[i]);
                                gic.newInvoice.items.push(item.list[i]);
                                gic.processedDockets[gic.processedDockets.indexOf(item)].list.splice(i, 1);
                            }
                            else
                                gic.freeDockets.push(item.list[i])
                        }
                        item.selectAll = undefined;

                    }
                }, function () {
                    console.log('You cancelled the dialog.');
                });
        }
        gic.addNewItem = function ($index, $event) {
            console.log($index);

            $mdDialog.show({
                    controller: AddItemDialogController,
                    controllerAs: 'aidc',
                    templateUrl: 'dialog_templates/invoice/_add_item.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    fullscreen: false,
                    locals: {
                        processedDockets: gic.processedDockets,
                        freeDockets: gic.freeDockets
                    }
                })
                .then(function (item) {

                    item.type = 'item';

                    if (item.has_attachment) {
                        item.qty = 0;
                        item.rate = item.list[0].mix.price_per_tonne;
                        item.unit = 't';
                        var index = -1;
                        for (var i = 0; i < gic.processedDockets.length; i++) {
                            if (gic.processedDockets[i].mix_id == item.list[0].mix_id) {
                                index = i;
                                break;
                            }

                        }
                        var attachment_string = "Dockets:"
                            // finding qty
                        console.log('index', index);
                        for (var i = 0; i < item.list.length; i++) {
                            attachment_string += ', ' + item.list[i].docket_no;
                            item.qty += item.list[i].qty;
                            gic.processedDockets[index].list.splice(gic.processedDockets[index].list.indexOf(item.list[i]), 1);
                        }

                        gic.newInvoice.items.splice($index + 1, 0, {
                            name: attachment_string,
                            type: 'attachment',
                        })

                    }
                    else {
                        gic.calculateTotal(item);
                    }
                    gic.calculateTotal(item);
                    gic.newInvoice.items.splice($index + 1, 0, item)

                }, function () {
                    console.log('You cancelled the dialog.');
                });
        }
        gic.recalculateSubtotalOnWaitingTimeRate = function () {
            if (gic.job_type == '1') {

                gic.newInvoice.subtotal = gic.newInvoice.subtotal - gic.newInvoice.total_waiting_time_backup * gic.newInvoice.waiting_time_rate_backup;

                gic.newInvoice.waiting_time_rate_backup = gic.newInvoice.waiting_time_rate;
                gic.newInvoice.subtotal = gic.newInvoice.subtotal + gic.newInvoice.total_waiting_time_backup * gic.newInvoice.waiting_time_rate_backup;

            }
        }
        gic.recalculateWaitingTime = function () {
            gic.newInvoice.total_waiting_time = 0;
            if (gic.job_type == '1') {
                for (var i = 0; i < gic.newInvoice.items.length; i++) {
                    if (gic.newInvoice.items[i].type == "item")
                        gic.newInvoice.total_waiting_time += gic.newInvoice.items[i].waiting_time || 0;

                }

                gic.newInvoice.subtotal = gic.newInvoice.subtotal - gic.newInvoice.total_waiting_time_backup * gic.newInvoice.waiting_time_rate_backup;
                gic.newInvoice.total_waiting_time /= 60;
                gic.newInvoice.total_waiting_time_backup = gic.newInvoice.total_waiting_time;
                gic.newInvoice.subtotal = gic.newInvoice.subtotal + gic.newInvoice.total_waiting_time_backup * gic.newInvoice.waiting_time_rate_backup;
            }
        }
        gic.removeItem = function ($index, item) {
            // var $index = gic.newInvoice.items.indexOf(item);


            if (item.has_attachment) {
                gic.newInvoice.items.splice($index, 2);
                var index = -1;
                for (var i = 0; i < gic.processedDockets.length; i++) {
                    if (gic.processedDockets[i].mix_id == item.list[0].mix_id) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    gic.processedDockets[index].list = gic.processedDockets[index].list.concat(item.list);
                }
            }
            else {
                gic.newInvoice.items.splice($index, 1);
                if (item.mix != undefined) {
                    for (var i = 0; i < gic.processedDockets.length; i++) {
                        if (gic.processedDockets[i].mix_id == item.mix_id) {
                            gic.processedDockets[i].list.push(item);
                        }
                    }
                }
            }
            gic.newInvoice.subtotal -= item.total;
            gic.newInvoice.gst = gic.newInvoice.subtotal * 10 / 100;
            gic.newInvoice.total = gic.newInvoice.subtotal + gic.newInvoice.gst;

        }
        gic.removeHeader = function ($index) {
            console.log('header', $index);
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete the entire category/section')
                .textContent('All these item will be deleted, simple item will not be able to be restored')
                .ariaLabel('Delete')
                .ok("Delete")
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                gic.newInvoice.items.splice($index, 1);
                while (gic.newInvoice.items[$index].type == 'item') {
                    gic.removeItem($index, gic.newInvoice.items[$index])
                }
            }, function () {
                console.log('cancel')
            });

        }
    })