angular
   .module('ARM.mix', ['ARM.mix.services'])
   .controller('MixCtrl', function (mixes, materials, $mdSidenav, $mdToast, $filter, MixService, $mdDialog) {
      var mixc = this;
      mixc.mixes = mixes;
      mixc.materials = angular.copy(materials);

      mixc.newMix = {
         mix_materials: []
      };
      // navigation 
      mixc.openList = function () {

         $mdSidenav('leftNav').close()
         $mdSidenav('mixesList').open();
      }
      mixc.closeList = function () {
         $mdSidenav('mixesList').close();
      }

      
      
      mixc.addNewComponentIfEnter = function($event,addComponentForm){
         if ($event.keyCode == 13){
        
            $event.preventDefault();
            $event.stopPropagation();
            mixc.addComponent(addComponentForm)
         }
      }
      
       mixc.addNewEditingComponentIfEnter = function($event,editComponentForm){
         if ($event.keyCode == 13){
   
            $event.preventDefault();
            $event.stopPropagation();
            mixc.addEditingComponent(editComponentForm)
         }
      } 
      mixc.recalculateEditingCost = recalculateEditingCost;
      mixc.changeMixDisplay = function (mix) {

            angular.forEach(mix.mix_materials, function (value, key) {
               if (value.name == undefined) {
                  value.name = value.material.name;
                  // dont nullified this, for dropdown item removal purpose later
                  ///value.material = undefined;
               }

            })

            mixc.selectedMix = mix;

         }
         //----- view tab -----------
      mixc.edit = function (editingMixForm) {
         var valid = true;
         var errorMsg = '';
         if (mixc.editingMix.name == undefined || mixc.editingMix.name.trim() == '') {
            valid = false;
            errorMsg += '\nMix name cannot be empty';
         }
         if (valid) {
            MixService.update(mixc.editingMix).then(function (response) {
               if (response.success) {
                  mixc.editMode = false;
                  var index = mixc.mixes.indexOf(mixc.selectedMix);
                  mixc.mixes[index] = response.data;
                  mixc.changeMixDisplay(response.data);
               }
               else
                  $mdToast.showSimple("Some error has occurred,contact developer for more info");
            });
         }
         else {
            $mdToast.showSimple(errorMsg)
         }


      }
      
      mixc.saveAs = function (editingMixForm) {
         var valid = true;
         var errorMsg = '';
         if (mixc.editingMix.name == undefined || mixc.editingMix.name.trim() == '') {
            valid = false;
            errorMsg += '\nMix name cannot be empty';
         }
         if (valid) {
            MixService.save(mixc.editingMix).then(function (response) {
               if (response.success) {
                  mixc.editMode = false;
                  mixc.mixes.unshift(response.data);
                  mixc.materials = angular.copy(materials);
                  $mdToast.showSimple("Successfully save as new mix");
                  mixc.changeMixDisplay(response.data);
               }
               else
                  $mdToast.showSimple("Some error has occurred,contact developer for more info");
            });
         }
         else {
            $mdToast.showSimple(errorMsg)
         }


      }
      
      mixc.delete = function (selectedMix) {
         var confirm = $mdDialog.confirm()
            .title('Are you sure to delete ?')
            .textContent('Mix cannot be restored after delete')
            .ok('Delete')
            .cancel('Cancel');
         if (selectedMix != undefined) {
            $mdDialog.show(confirm).then(function () {
               MixService.delete(selectedMix).then(function (response) {
                  if (response.success) {
                     var index = mixc.mixes.indexOf(selectedMix);
                     mixc.mixes.splice(index, 1);
                     mixc.selectedMix = undefined;
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
      mixc.startEdit = function () {

         mixc.editingMix = angular.copy(mixc.selectedMix);
         mixc.editingMaterials = angular.copy(materials);
          recalculateEditingCost()
         for (var i = 0; i < mixc.editingMix.mix_materials.length; i++) {
            // remove existing material from dropdown

            var index = indexOfMaterial(mixc.editingMaterials, mixc.editingMix.mix_materials[i].material)

            if (index != -1)
               mixc.editingMaterials.splice(index, 1);


         }
         mixc.editMode = true;
      }

      function indexOfMaterial(materials, material) {
         for (var i = 0; i < materials.length; i++) {
            if (materials[i].name == material.name)
               return i
         }
         return -1;
      }


      mixc.cancelEdit = function () {
         var confirm = $mdDialog.confirm()
            .title('Are you sure to cancel ?')
            .textContent('Mix will not be saved')
            .ok('Yes I\'m sure')
            .cancel('Continue editing');
         $mdDialog.show(confirm).then(function () {
            mixc.editMode = false;
         })
      }


      mixc.addEditingComponent = function (addEditingComponenForm) {

         addEditingComponenForm.$submitted = true;
         if (addEditingComponenForm.$valid) {
            // processing material
            var index = indexOfMaterial(mixc.editingMaterials, mixc.newEditingComponent.material)
            if (mixc.aggregateEditing)
               mixc.newEditingComponent.percent = undefined;
            else
               mixc.newEditingComponent.aggregate = undefined;
            //TODO: calculate percent and cost


            mixc.editingMaterials.splice(index, 1);
            mixc.newEditingComponent.name = mixc.newEditingComponent.material.name;
            mixc.editingMix.mix_materials.push(angular.copy(mixc.newEditingComponent));
            recalculateEditingCost()
            mixc.newEditingComponent = {};
            addEditingComponenForm.$submitted = false;
            addEditingComponenForm.$setPristine();
         }
         else {
            $mdToast.showSimple("Cannot add editing mix's materials, please check the fields for errors");
         }
      }

      mixc.removeEditingComponent = function (mix_material) {

         var index = mixc.editingMix.mix_materials.indexOf(mix_material);
         if (index != -1) {

            mixc.editingMaterials.push(mix_material.material);
            mixc.editingMix.mix_materials.splice(index, 1);
            recalculateEditingCost();
         }

      }

      function recalculateEditingCost() {
         var mix_materials = mixc.editingMix.mix_materials;
         mixc.fixedEditingPercent = 0;
         mixc.editingMix.price_per_tonne = 0;
         mixc.totalEditingAgg = 0;
         mixc.totalEditingPercent = 0;
         for (var i = 0; i < mix_materials.length; i++) {
            if (mix_materials[i].aggregate == undefined) {
               mixc.fixedEditingPercent += mix_materials[i].percent;
               var ppt_with_losses = (mix_materials[i].material.price_per_tonne * (1 + mix_materials[i].material.losses / 100));
               mix_materials[i].cost = mix_materials[i].percent / 100 * ppt_with_losses;
               mixc.editingMix.price_per_tonne += mix_materials[i].cost;

            }
         }
         // fix precision errors
         mixc.fixedEditingPercent = Math.round(mixc.fixedEditingPercent * 1000) / 1000;

         mixc.totalEditingPercent = mixc.fixedEditingPercent;
         if (mixc.fixedEditingPercent >= 100) { // error from user input
            for (var i = 0; i < mix_materials.length; i++) {
               if (mix_materials[i].aggregate != undefined) {
                  mixc.totalEditingAgg += mix_materials[i].aggregate;
                  mix_materials[i].percent = 0;
                  mix_materials[i].cost = 0;

               }
            }
         }
         else { // calculate normally
            for (var i = 0; i < mix_materials.length; i++) {
               if (mix_materials[i].aggregate != undefined) {
                  mixc.totalEditingAgg += mix_materials[i].aggregate;
                  mix_materials[i].percent = mix_materials[i].aggregate / 100 * (100 - mixc.fixedEditingPercent);
                  mixc.totalEditingPercent += mix_materials[i].percent;
                  mix_materials[i].cost = (mix_materials[i].percent * (mix_materials[i].material.price_per_tonne * (1 + mix_materials[i].material.losses / 100))) / 100
                  mixc.editingMix.price_per_tonne += mix_materials[i].cost;

               }
            }

         }
         mixc.totalEditingPercent = Math.round(mixc.totalEditingPercent * 1000) / 1000;
         mixc.totalEditingAgg = Math.round(mixc.totalEditingAgg * 1000) / 1000;
      }
      mixc.uncorruptedMix = function () {
         MixService.uncorrupted(mixc.selectedMix).then(function (response) {
            if (response.success) {
               mixc.selectedMix.corrupted = false;
               $mdToast.showSimple("Ok. We got it ");
            }
            else
               $mdToast.showSimple("Some error has occurred,contact developer for more info");
         })
      }

      //----------------- new tab------------------
      mixc.create = function (newMixForm) {
         var valid = true;
         var errorMsg = '';
         if (mixc.newMix.name == undefined || mixc.newMix.name.trim() == '') {
            valid = false;
            errorMsg += '\nMix name cannot be empty';
         }
         if (valid) {
            MixService.save(mixc.newMix).then(function (response) {
               if (response.success) {
                  mixc.newMix = {
                     mix_materials: []
                  };
                  recalculateCost();
                  mixc.mixes.unshift(response.data);
                  mixc.materials = angular.copy(materials);
                  $mdToast.showSimple("Successfully create new mix");
               }
               else
                  $mdToast.showSimple("Some error has occurred,contact developer for more info");
            });
         }
         else {
            $mdToast.showSimple(errorMsg)
         }


      }



      mixc.removeComponent = function (material) {

         var index = mixc.newMix.mix_materials.indexOf(material);
         if (index != -1) {
            mixc.materials.push(material.material);
            mixc.newMix.mix_materials.splice(index, 1);
            recalculateCost();
         }

      }
      mixc.addComponent = function (addComponentForm) {

         addComponentForm.$submitted = true;
         if (addComponentForm.$valid) {
            // processing material
            var index = mixc.materials.indexOf(mixc.newComponent.material);
            if (mixc.aggregate)
               mixc.newComponent.percent = undefined;
            else
               mixc.newComponent.aggregate = undefined;



            mixc.materials.splice(index, 1);
            mixc.newMix.mix_materials.push(angular.copy(mixc.newComponent));
            recalculateCost()
            mixc.newComponent = {};
            addComponentForm.$submitted = false;
            addComponentForm.$setPristine();
         }
         else {
            $mdToast.showSimple("Cannot add new mix's materials, please check the fields for errors");
         }
      }

      function recalculateCost() {
         var mix_materials = mixc.newMix.mix_materials;
         mixc.fixedPercent = 0;
         mixc.newMix.price_per_tonne = 0;
         mixc.totalAgg = 0;
         mixc.totalPercent = 0;
         for (var i = 0; i < mix_materials.length; i++) {
            if (mix_materials[i].aggregate == undefined) {
               mixc.fixedPercent += mix_materials[i].percent;
               var ppt_with_losses = (mix_materials[i].material.price_per_tonne * (1 + mix_materials[i].material.losses / 100));
               mix_materials[i].cost = mix_materials[i].percent / 100 * ppt_with_losses;
               mixc.newMix.price_per_tonne += mix_materials[i].cost;

            }
         }
         // fix precision errors
         mixc.fixedPercent = Math.round(mixc.fixedPercent * 1000) / 1000;

         mixc.totalPercent = mixc.fixedPercent;
         if (mixc.fixedPercent >= 100) { // error from user input
            for (var i = 0; i < mix_materials.length; i++) {
               if (mix_materials[i].aggregate != undefined) {
                  mixc.totalAgg += mix_materials[i].aggregate;
                  mix_materials[i].percent = 0;
                  mix_materials[i].cost = 0;

               }
            }
         }
         else { // calculate normally
            for (var i = 0; i < mix_materials.length; i++) {
               if (mix_materials[i].aggregate != undefined) {
                  mixc.totalAgg += mix_materials[i].aggregate;
                  mix_materials[i].percent = mix_materials[i].aggregate / 100 * (100 - mixc.fixedPercent);
                  mixc.totalPercent += mix_materials[i].percent;
                  mix_materials[i].cost = (mix_materials[i].percent * (mix_materials[i].material.price_per_tonne * (1 + mix_materials[i].material.losses / 100))) / 100
                  mixc.newMix.price_per_tonne += mix_materials[i].cost;

               }
            }

         }
         // fix precision errors
         mixc.totalPercent = Math.round(mixc.totalPercent * 1000) / 1000;
         mixc.totalAgg = Math.round(mixc.totalAgg * 1000) / 1000;
      }





   })