angular
   .module('ARM.client', ['ARM.helper.services', 'ARM.client.services'])
   .controller('ClientCtrl', function ($mdToast, $mdMedia, HelperService, ClientService, $mdSidenav, $mdDialog, clients) {
      var clc = this;

      clc.clients = angular.copy(clients);
      clc.newClient = {
         contact_people: []
      };

      function DialogController($mdDialog) {
         var dc = this;
         dc.cancel = function () {
            $mdDialog.cancel();
         }
         dc.adding = function (addNewContactPersonForm, contactPerson) {
            addNewContactPersonForm.$submitted = true;
            if (addNewContactPersonForm.$invalid || contactPerson == undefined || contactPerson.name == undefined || contactPerson.name.trim() == '') {

            }
            else
               $mdDialog.hide(contactPerson);
         }
      }

      clc.openList = function () {

         $mdSidenav('leftNav').close()
         $mdSidenav('clientList').open();
      }
      clc.clientTypesTranslator = function (type) {
         if (type == 'one_off') {
            return 'One off/small time customer'
         }
         else if (type == 'contractor') {
            return 'Civil Contractors/Asphalt layers'
         }
         else if (type == 'government') {
            return 'Government';
         }
         else {
            return 'Unknown'
         }

      }

      clc.closeList = function () {
         $mdSidenav('clientList').close();
      }
      clc.clientTypes = [
         {
            label: 'Government',
            value: 'government'
         },
         {
            label: 'Civil Contractors/Asphalt layers',
            value: 'contractor'
         },
         {
            label: 'One off/small time customer',
            value: 'one_off'
         },
      ];

      clc.create = function (newClientForm) {
         console.log(newClientForm.$invalid);
         if (!newClientForm.$invalid) {
            ClientService.save(clc.newClient).then(function (response) {
               if (response.success) {
                  clc.clients.unshift(response.data)
                  clc.newClient = {
                     contact_people: []
                  };
               }

            })
         }
      }
      clc.startEdit = function () {
         clc.editMode = true;
         clc.editingClient = angular.copy(clc.selectedClient);
      }
      clc.cancelEdit = function () {
         clc.editMode = false;
      }
      clc.changeClientDisplay = function (client) {
         clc.selectedClient = client;
      }
      clc.edit = function (editingClientForm) {
         if (!editingClientForm.$invalid) {
            ClientService.update(clc.editingClient).then(function (response) {
               if (response.success) {
                  var index = clc.clients.indexOf(clc.selectedClient);
                  clc.clients[index] = response.data;
                  clc.selectedClient = clc.clients[index];
                  clc.editMode = false;
               }

            })
         }
      }

      clc.addNewContactPerson = function (list, $event) {
         var useFullScreen = $mdMedia('xs')
         $mdDialog.show({
               controller: DialogController,
               controllerAs: 'dc',
               templateUrl: 'dialog_templates/_add_contact_person.html',
               parent: angular.element(document.body),
               targetEvent: $event,
               clickOutsideToClose: false,
               fullscreen: useFullScreen
            })
            .then(function (contactPerson) {
               list.unshift(contactPerson);
            }, function () {
               console.log('You cancelled the dialog.');
            });
      }
      clc.removeContactPerson = function (list, person) {
         var index = list.indexOf(person)
         list.splice(index, 1);
      }
      clc.delete = function (selectedClient) {
         var confirm = $mdDialog.confirm()
            .title('Are you sure to delete ?')
            .textContent('Client info along with jobs,quote associate with it, cannot be restored after delete')
            .ok('Delete')
            .cancel('Cancel');
         if (selectedClient != undefined) {
            $mdDialog.show(confirm).then(function () {
               ClientService.delete(selectedClient).then(function (response) {
                  if (response.success) {
                     var index = clc.clients.indexOf(selectedClient);
                     clc.clients.splice(index, 1);
                     clc.selectedClient = undefined;
                  }
                  else {
                     $mdToast.showSimple("Some error has occurred,contact developer for more info");
                  }
               })
            }, function () {
               console.log('cancel')
            });
         }
      }
   })
