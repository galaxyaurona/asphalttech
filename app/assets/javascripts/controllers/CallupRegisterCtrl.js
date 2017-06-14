angular
   .module('ARM.callup', ['ARM.helper.services', 'ARM.callup.services'])
   .controller('CallupRegisterCtrl', function ($mdToast, HelperService, CallupRegisterService, callups, $mdSidenav, $mdDialog,uiGridConstants) {
      var curc = this;
      curc.editMode = false;
      curc.callups = callups
      curc.units = ['Week', 'Day', 'Month', 'Year'];
      curc.periods = [
         {
            label: 'Today',
            value: 'today'
         }, {
            label: 'Tomorrow',
            value: 'tomorrow'
         }, {
            label: 'This week',
            value: 'end_of_week'
         }, {
            label: 'Next 7 days',
            value: 'seven_days'
         }, {
            label: 'This month',
            value: 'end_of_week'
         }, {
            label: 'Next 1 month',
            value: 'a_month'
         }, {
            label: 'Next 3 month',
            value: 'three_months'
         }, {
            label: 'Next 6 month',
            value: 'six_months'
         }, {
            label: 'This year',
            value: 'end_of_year'
         }, {
            label: 'Next 1 year',
            value: 'a_year'
         },
         ]
      curc.cachedCallUps = {};
      curc.gridOptions = {
         data: curc.callups,
         enableFiltering: true,
         columnDefs: [
            {
               field: 'name'
            },
            {
               field: 'category'
            },
            {
               field: 'last_triggered_date',
               cellFilter: 'date:"dd/MM/yy"',
               filterCellFiltered: true,
               width: '15%'
            },
            {
               field: 'next_due_date',
               cellFilter: 'date:"dd/MM/yy"',
               filterCellFiltered: true,
               width: '15%'
            },
            {
               field: 'repeat_amount'
            },
            {
               field: 'repeat_unit',
               filter: {
                  type: uiGridConstants.filter.SELECT,
                  selectOptions: [{
                     value: 'day',
                     label: 'Day',
                  }, {
                     value: 'week',
                     label: 'Week',
                  }, {
                     value: 'month',
                     label: 'Month',
                  }, {
                     value: 'year',
                     label: 'Year',
                  },]
               }
            },
            {
               field: 'note'
            },
            ],
         onRegisterApi: function (gridApi) {
            curc.gridApi = gridApi;
         },
      }
      console.log('gridOptions', curc.gridOptions)
      curc.changePeriod = function (period) {
         if (curc.cachedCallUps[period.value] == undefined) {
            CallupRegisterService.period(period.value).then(function (response) {
               if (response.success) {
                  console.log(response);
                  curc.selectedPeriod = period;
                  curc.cachedCallUps[period.value] = response.data;
                  curc.dueCallups = response.data;
               }
               else {
                  $mdToast.showSimple("Some error has occurred,contact developer for more info");
               }
            })
         }
         else {
            curc.selectedPeriod = period;
            curc.dueCallups = curc.cachedCallUps[period.value];
         }
      };
      curc.callupsQuery = {};
      curc.openList = function () {

         $mdSidenav('leftNav').close()
         $mdSidenav('callupList').open();
      }

      curc.closeList = function () {
         $mdSidenav('callupList').close();
      }
      curc.startEdit = function () {

         curc.editingCallup = angular.copy(curc.selectedCallup);
         curc.editingCallup.next_due_date = new Date(curc.selectedCallup.next_due_date);
         curc.editMode = true;
      }
      curc.breakDownSearchString = function () {
         var searchStringToken = curc.searchString.split(':')

         if (searchStringToken.length > 1) {
            curc.callupsQuery.name = searchStringToken[1];
            curc.callupsQuery.category = searchStringToken[0];
         }
         else {
            curc.callupsQuery.category = undefined;
            curc.callupsQuery.name = searchStringToken.length == 1 ? searchStringToken[0] : undefined
         }
      }
      curc.cancelEdit = function () {
         var confirm = $mdDialog.confirm()
            .title('Are you sure to cancel ?')
            .textContent('Call ups will not be saved')
            .ok('Yes I\'m sure')
            .cancel('Continue editing');
         $mdDialog.show(confirm).then(function () {
            curc.editMode = false;
         })
      };
      curc.edit = function (editCallupForm) {
         if (editCallupForm.$valid) {
            CallupRegisterService.update(curc.editingCallup).then(function (response) {
               if (response.success) {
                  console.log(response);
                  $mdToast.showSimple("Successfully update call up");
                  curc.editMode = false;
                  var index = curc.callups.indexOf(curc.selectedCallup);
                  curc.callups[index] = response.data;
                  curc.selectedCallup = curc.callups[index];
               }
               else
                  $mdToast.showSimple("Some error has occurred,contact developer for more info");
            });

         }
      }
      curc.delete = function (selectedCallup) {
         var confirm = $mdDialog.confirm()
            .title('Are you sure to delete ?')
            .textContent('Callup cannot be restored after delete')
            .ok('Delete')
            .cancel('Cancel');
         if (selectedCallup != undefined) {
            $mdDialog.show(confirm).then(function () {
               CallupRegisterService.delete(selectedCallup).then(function (response) {
                  if (response.success) {
                     var index = curc.callups.indexOf(selectedCallup);
                     curc.callups.splice(index, 1);
                     curc.selectedCallup = undefined;
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

      curc.create = function (newCallUpForm) {

         if (newCallUpForm.$valid) {
            CallupRegisterService.save(curc.newCallup).then(function (response) {
               if (response.success) {
                  console.log(response);
                  curc.newCallup = {};
                  curc.callups.unshift(response.data);
                  $mdToast.showSimple("Successfully create new call up");
               }
               else
                  $mdToast.showSimple("Some error has occurred,contact developer for more info");
            });
         }


      }


   })