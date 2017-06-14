angular
   .module('ARM.navigation.sidenav', ['ngMaterial', 'ui.router'])
   .controller('SideNavCtrl', function ($mdSidenav, $log, $state, $scope, $filter) {
      var snc = this;
      snc.loading = false

      $scope.$on("$stateChangeStart", function (event, toState, fromState) {
         snc.loading = true;
      })

      $scope.$on("$stateChangeSuccess", function (event, toState, fromState) {

         if (snc.selectedItem == undefined) { // initialze select state

            findState(snc.menuItems, $state.current.name);

         }

         snc.loading = false;
      })

      var findState = function (array, state) {
         for (var i = 0; i < array.length; i++) {
            if (array[i].children != undefined) { // object has submenu
               var result = findState(array[i].children, state)

               if (result) { // find state in deeper level not equal false
                  snc.selectedItem = array[i];
                  snc.selectedSubItem = result

                  return array[i]; // break out of loop
               }

            }
            else if (array[i].state == state) { // if object equals
               snc.selectedItem = array[i]; // first level found

               return array[i]; // return object

            }
         }
         snc.selectedItem = undefined;
         return false;
      }

      snc.toggleMenu = function () {

         if ($state.current.name == 'mix') // close the menu
            $mdSidenav('mixesList').close()
         $mdSidenav('leftNav').toggle()
      }
      snc.closeMenu = function () {
            $mdSidenav('leftNav').close()
         }
         // this is the list of menu item available on the nav bar, 
         // format is : label = display name, state = state that will be transition to when clicked
         // only the one with children have arrow and open menu action and do not have state
         // icon , please use font awesome , all the font available at the link belows
         // https://fortawesome.github.io/Font-Awesome/icons/
      snc.menuItems = [
         {
            label: "Home",
            icon: "fa fa-home",
            state: "home"
         },
         {
            label: "Quotes",
            icon: "fa fa-quote-left",
            state: "quotes"
         },
         {
            label: "Jobs",
            icon: "fa fa-industry",
            state: "jobs"
         },
         {
            label: "Callup Register",
            icon: "fa fa-calendar",
            state: "register"
         },
         {
            label: "Cartage Rate",
            icon: "fa fa-truck",
            state: "cartageRate"
         },
         {
            label: "Client",
            icon: "fa fa-building",
            state: "client"
         },
         {
            label: "Purchase",
            icon: "fa fa-shopping-cart",
            state: "purchase"
         },
         {
            label: "Invoice",
            icon: "fa fa-print",
            state: "invoice"
         },
         {
            label: "Natural Resources",
            icon: "fa fa-leaf",
            children: [
               {
                  label: "Materials",
                  icon: "fa fa-cubes",
                  state: "material"
               },
               {
                  label: "Mixes",
                  icon: "fa fa-road",
                  state: "mix"
               },

            ]
         },
         {
            label: "Human Resources",
            icon: "fa fa-user",
            children: [
               {
                  label: "Employees",
                  icon: "fa fa-users",
                  state: "employees"
               },
               {
                  label: "Sub Contractors",
                  state: "contractors",
                  icon: "fa fa-briefcase",
               }


            ]
         },
         {
            label: "Developer options",
            icon: "fa fa-terminal",
            children: [
               {
                  label: "Scheduler Log",
                  state: "schedulerLogs",
                  icon: "fa fa-history",
               }

            ]
         }

      ]


      snc.handleMenuClick = function ($mdOpenMenu, item) {

         if (item.children == undefined || item.children.length == 0) {

            if (snc.parentItem != undefined && $filter('filter')(snc.parentItem.children, item).length > 0) {
               snc.selectedItem = snc.parentItem;
               snc.selectedSubItem = item;
            }
            else {
               snc.selectedItem = item;
               snc.selectedSubItem = null;

            }
            $state.transitionTo(item.state);
            snc.closeMenu();

         }
         else {
            snc.parentItem = item;
            $mdOpenMenu();
         }

      }


   })
