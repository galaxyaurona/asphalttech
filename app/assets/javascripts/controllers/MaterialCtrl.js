angular
   .module('ARM.material', ['ARM.helper.services'])
   .controller('MaterialCtrl', function ($mdDialog, materials, MaterialService, HelperService, $mdToast, $filter) {
      var mtc = this;


      var orderBy = $filter('orderBy');
      mtc.materials = orderBy(materials, 'name');
      mtc.save = function ($index) {
         if (mtc.materials[$index].losses == "" || mtc.materials[$index].losses == undefined) mtc.materials[$index].losses = 0;
         if (mtc.materials[$index].price_per_tonne == "" || mtc.materials[$index].price_per_tonne == undefined) {
            $mdToast.showSimple()
         }
         else {
            MaterialService.update(mtc.materials[$index]).then(function (response) {
               if (response.success) {
                  mtc.editing[$index] = false;
               }
               else {
                  $mdToast.showSimple(response.msg)
               }

            })
         }

      }

      mtc.delete = function ($index) {
         var confirm = $mdDialog.confirm()
            .title('Are you sure ?')
            .textContent('Material cannot be restored after delete. Some mix might be unabled to be used if contains this material?')
            .ok('Delete')
            .cancel('Cancel');
         $mdDialog.show(confirm).then(function () {
            MaterialService.delete(mtc.materials[$index]).then(function (response) {
               if (response.success) {
                  if (mtc.editing != undefined)
                     mtc.editing[$index] = false;
                  mtc.materials.splice($index, 1);

               }
               else {
                  if (response.msg.length>1)
                     $mdToast.showSimple("Some errors has occurred,contact developer for more info")
                  else
                     $mdToast.showSimple(response.msg)
               }
            })
         }, function () {
            console.log('cancel')
         });
      }

      mtc.add = function (newMaterial) {

         if (HelperService.checkExist(mtc.materials, 'name', newMaterial)) {
            $mdToast.showSimple("Material already exist");
         }
         else {
            //safeguard
            if (newMaterial.losses == undefined) newMaterial.losses = 0;
            MaterialService.save(newMaterial).then(function (response) {
               if (response.success) {
                  mtc.materials.push(angular.copy(response.data));
                  mtc.materials = orderBy(mtc.materials, 'name');
                  newMaterial.price_per_tonne = undefined;
                  newMaterial.name = undefined;
                  newMaterial.losses = undefined;
               }


            })
         }
      }

   })