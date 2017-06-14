
angular
   .module('ARM.sub_contractor',[])
   .controller('SubCtrl',function(contractors,SubContractorService,$scope,$mdToast, $mdDialog){
      var cc = this;
      cc.contractors = contractors;
      $scope.selected = {};
      $scope.selectedTab = 0;
      $scope.newContractor = {};
      $scope.queryContractor = {
         name:undefined,
         description:undefined,
         contact_no:undefined,
         email:$scope.undefined
      }
      $scope.selectContractor = function(contractor)
      {
         $scope.selected = contractor;
         $scope.selectedTab = 3;
      }
      
      $scope.addNew = function(){
         var sendContractor = {
            name:$scope.newContractor.name,
            description:$scope.newContractor.description,
            contact_no:$scope.newContractor.contact_no,
            email:$scope.newContractor.email
         }
         SubContractorService.save(sendContractor).then(function(response){
            if(response.success){
               
                $scope.refresh();
                 $scope.newContractor = {};
                $scope.selectedTab = 0;
            }
         })
      }
      $scope.delete = function(id){
         SubContractorService.remove(id).then(function(response){
            if(response.success){
                $scope.selectedTab = 0;
                $scope.selected = {};
                $scope.refresh();
            }
         })
      }
      $scope.edit = function($event){
         SubContractorService.update($scope.selected).then(function(response){
            if(response.success){
                $scope.selectedTab = 0;
                $scope.selected = {};
                $scope.refresh();
            }
         })
      }
      $scope.refresh = function(){
         SubContractorService.query().then(function(result){
            cc.contractors = result;
         })
      }
})