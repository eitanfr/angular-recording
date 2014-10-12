var myModule = angular.module('myModule',['ui.bootstrap']);

myModule.controller('RecordsCtrl',function RecordsCtrl($scope,$filter,$modal){

    $scope.recordsList = [
        {name: "rec111111", date: new Date("October 13, 1992 11:13:00") , size: 1.5, checked: false},
        {name: "aec2", date: new Date("October 13, 2012 11:13:00") , size: 1.5, checked: false},
        {name: "rec3", date: new Date("October 13, 2010 11:13:00") , size: 1.5, checked: false},
        {name: "rec42", date: new Date("October 13, 2011 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec5", date: new Date() , size: 2, checked: false},
        {name: "rec6", date: new Date("October 13, 1993 11:13:00") , size: 1.5, checked: false},
        {name: "rec12", date: new Date("October 13, 1992 11:13:00") , size: 1.5, checked: false}
    ];

    $scope.records = [];

    $scope.totalItems = $scope.recordsList.length;

    var orderBy = $filter('orderBy');

    $scope.order = function(predicate, reverse) {
        $scope.recordsList = orderBy($scope.recordsList, predicate, reverse);

        if (predicate == 'name'){
            $scope.arrowNameClass='arrow-true-'+ reverse;
            $scope.arrowDateClass = '';
            $scope.arrowSizeClass = '';
        }else if (predicate == 'date'){
            $scope.arrowDateClass='arrow-true-'+ reverse;
            $scope.arrowNameClass='';
            $scope.arrowSizeClass='';
        }else if (predicate == 'size'){
        $scope.arrowSizeClass='arrow-true-'+ reverse;
        $scope.arrowNameClass='';
        $scope.arrowDateClass='';
    }
    };

    $scope.order('name',true);

    $scope.pageChanged = function(){
//        $scope.records = $scope.recordsList.slice(($scope.currentPage -1) *10,$scope.currentPage *10);
        $scope.recordsList = $scope.recordsList;
    };

    $scope.subArray = function(currentPage){
        $scope.filteredItems = 0;
        return function (item){
            $scope.filteredItems++;
          var index = $scope.recordsList.indexOf(item);
          return ($scope.filteredItems <= currentPage *10) && ($scope.filteredItems >= ((currentPage -1)*10));
        };
    };

    $scope.filteredItems = 0;

    $scope.currentPage = 1;
    $scope.pageChanged();

    $scope.dateRange = function(startDate,startTime, endDate,endTime){
        return function( item ) {

             startDate = (typeof(startDate) == 'undefined' || startDate === null) ?  new Date(0) : new Date(startDate);
             endDate =  (typeof(endDate) == 'undefined' || endDate === null) ?  new Date(): new Date(endDate);

            // Add time
            startDate.setMinutes(startTime.getMinutes());
            startDate.setHours(startTime.getHours());
            endDate.setMinutes(endTime.getMinutes());
            endDate.setHours(endTime.getHours());

            return item.date >= startDate && item.date <= endDate;
        };
    };


    $scope.setChecked = function(record){
        record.checked = !record.checked;
    }
    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl

        });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance) {


        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    $scope.openStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.startOpened = true;
    };
    $scope.startOpened = false;

    $scope.openEnd = function($event) {

        console.log($scope.startTime);
        $event.preventDefault();
        $event.stopPropagation();

        $scope.endOpened = true;
    };
    $scope.endOpened = false;

    var init = function(){
        $scope.startTime = new Date(0);
        $scope.startTime.setMinutes(0);
        $scope.startTime.setHours(0);

        $scope.endTime = new Date(0);
        $scope.endTime.setMinutes(0);
        $scope.endTime.setHours(new Date().getHours() +1);

    };

    init();

});