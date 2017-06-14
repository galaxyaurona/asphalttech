/* globals angular:true */ //tell js hint that angular is defined
angular
   .module('ARM.cartage', ['ARM.helper.services'])
   .controller('CartageRateCtrl', function (cartageRates, CartageRateService,$mdToast,HelperService) {
      var crc = this;
      crc.cartageRates = cartageRates;
      crc.cartageRates.sort(compareKm);
      crc.save = function ($index) {
         CartageRateService.update(crc.cartageRates[$index]).then(function (response) {
            crc.editing[$index] = false;
         })
      }

      crc.delete = function ($index) {
         CartageRateService.delete(crc.cartageRates[$index]).then(function (response) {

            if (response.success) {
               crc.cartageRates.splice($index, 1);
            }
         })
      }

      crc.add = function (newRate) {

         if (HelperService.checkExist(cartageRates,'km',newRate)) {
            $mdToast.showSimple("Rate already exist");
         }
         else {
            CartageRateService.save(newRate).then(function (response) {
               if (response.success) {
                  crc.cartageRates.push(angular.copy(newRate));
                  crc.cartageRates.sort(compareKm);
                  newRate.km = undefined;
                  newRate.rate = undefined;
               }


            })
         }
      }


      //helper function

      function compareKm(rate1, rate2) {
         return rate1.km - rate2.km;
      }
   })