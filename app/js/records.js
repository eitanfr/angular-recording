var myModule = angular.module('myModule', ['ui.bootstrap']);

myModule.controller('RecordsCtrl', function RecordsCtrl($scope, $filter, $modal, $http) {

    var hostname = 'http://localhost:9000';

    $scope.recordsList = [];
    var choosenRecords = [];
    $scope.itemPerPage = 15;

    $scope.loaded =false;
    $http.get( hostname +'/hello').success(function (data) {
        $scope.recordsList = data;
        $scope.loaded = true;
    }).error(function(data){
        alert('Error loading records form server: ' +data);
        $scope.loaded = true;
    });

    $scope.records = [];

    $scope.clearChoosen = function(){
        for (var i =0 ; i < $scope.recordsList.length ; i++){
            $scope.recordsList[i].checked = false;

        }
        choosenRecords =[];

    };

    var clearChoosen =  $scope.clearChoosen;



    $scope.totalItems = $scope.recordsList.length;

    var orderBy = $filter('orderBy');

    $scope.order = function (predicate, reverse) {
        $scope.recordsList = orderBy($scope.recordsList, predicate, reverse);

        if (predicate == 'name') {
            $scope.arrowNameClass = 'arrow-true-' + reverse;
            $scope.arrowDateClass = '';
            $scope.arrowSizeClass = '';
        } else if (predicate == 'date') {
            $scope.arrowDateClass = 'arrow-true-' + reverse;
            $scope.arrowNameClass = '';
            $scope.arrowSizeClass = '';
        } else if (predicate == 'size') {
            $scope.arrowSizeClass = 'arrow-true-' + reverse;
            $scope.arrowNameClass = '';
            $scope.arrowDateClass = '';
        }
    };

    $scope.order('name', true);

    $scope.pageChanged = function () {
//        $scope.records = $scope.recordsList.slice(($scope.currentPage -1) *$scope.itemPerPage,$scope.currentPage *$scope.itemPerPage);
//        $scope.recordsList = $scope.recordsList;
    };

    $scope.subArray = function (currentPage) {
        $scope.filteredItems = 0;
        return function (item) {
            $scope.filteredItems++;
            var index = $scope.recordsList.indexOf(item);
            return ($scope.filteredItems <= currentPage * $scope.itemPerPage) && ($scope.filteredItems >= ((currentPage - 1) * $scope.itemPerPage));
        };
    };

    $scope.filteredItems = 0;

    $scope.currentPage = 1;
    $scope.pageChanged();

    $scope.dateRange = function (startDate, startTime, endDate, endTime) {
        return function (item) {

            startDate = (typeof(startDate) == 'undefined' || startDate === null) ? new Date(0) : new Date(startDate);
            endDate = (typeof(endDate) == 'undefined' || endDate === null) ? new Date() : new Date(endDate);

            // Add time
            startDate.setMinutes(startTime.getMinutes());
            startDate.setHours(startTime.getHours());
            endDate.setMinutes(endTime.getMinutes());
            endDate.setHours(endTime.getHours());

            return item.date >= startDate && item.date <= endDate;
        };
    };

    $scope.showZipped = function (show) {
        // maybe in get
        return show ? '' : '!' + 'zip';
    };

    $scope.setChecked = function (record) {
        record.checked = !record.checked;

        if (record.checked) {
            choosenRecords.push(record.name);
        }
        else {
            var indexToRemove = choosenRecords.indexOf(record.name);
            if (indexToRemove >= 0)
                choosenRecords.splice(indexToRemove, 1);
        }
    };
    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: ModalInstanceCtrl

        });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, $http) {


        $scope.ok = function () {
            $scope.showProbar = true;
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.createDownloadUrl = function () {
            var url = hostname+'/download?files=';
            for (var i in choosenRecords) {
                url = url + choosenRecords[i] + ',';
            }

            return url;
        };

        $scope.showProbar = false;
        $scope.ftp = function () {
            $scope.showProbar = true;
            var url = hostname +'/ftp?files=';
            for (var i in choosenRecords) {
                url = url + choosenRecords[i] + ',';
            }

            $http.get(url).success(function (data) {
                $modalInstance.close();
                $scope.showProbar = false;

            }).
                error(function (data) {
                    $modalInstance.close();
                    $scope.showProbar = false;
                    alert(data);
                });
        };

        $scope.downloadNew = function(){
            $scope.showProbar = true;
            var url = hostname +'/download?files=';
            for (var i in choosenRecords) {
                url = url + choosenRecords[i] + ',';
            }

            $http.get(url).success(function (data) {
//                $modalInstance.close();

//                $scope.url = 'data:application/zip,' + data;
                var link = document.createElement('a');
                link.download = 'xxx.zip';
                link.href = 'data:application/zip;charset=UTF-8,' + data;
                link.click();
                $scope.showProbar = false;
            }).
                error(function (data) {
                    $modalInstance.close();
                    $scope.showProbar = false;
                    alert(data);
                });
        };

        $scope.choosenRecords = choosenRecords;

        $scope.disable = function(){
            return (!$scope.radioModel ||  $scope.choosenRecords.length ==0);
        }
    };


    $scope.openStart = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.startOpened = true;
    };
    $scope.startOpened = false;

    $scope.openEnd = function ($event) {

        console.log($scope.startTime);
        $event.preventDefault();
        $event.stopPropagation();

        $scope.endOpened = true;
    };
    $scope.endOpened = false;

    var init = function () {
        $scope.startTime = new Date(0);
        $scope.startTime.setMinutes(0);
        $scope.startTime.setHours(0);

        $scope.endTime = new Date(0);
        $scope.endTime.setMinutes(0);
        $scope.endTime.setHours(new Date().getHours() + 1);

    };

    init();



});