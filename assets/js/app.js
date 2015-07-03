
var myApp = angular.module('myApp',[]);

myApp.controller('MainCtrl',function ($scope) {

    console.log('main controller');

    $scope.index = 0;

   $scope.images = [
     '/assets/images/1.jpg',
     '/assets/images/2.jpg',
     '/assets/images/3.jpg',
     '/assets/images/4.jpg',
     '/assets/images/5.jpg'
   ];

   // callbacks for change in slides
  $scope.eventOnPrevious = function() {
    // event on Previous button click
    console.log('event on Previous');
  };
  $scope.eventOnNext = function() {
    // event on Next button click
    console.log('event on NEXT ');
  };

  $scope.animation = 'slide';


});


myApp.directive('ngphotoslider', function() {
  return {
    restrict: 'EA',
    templateUrl: 'views/ngPhotoSlider.tpl.html',
    replace: true,
    transclude: true,
    scope: {
      images: '=',
      animation: '@',
      currentItemIndex: '=',
      onNext: '&',
      onPrevious: '&'

    },
    controller: function($scope, $timeout) {

       $scope.itemClasses = [];

       $scope.$watch('images', function(images) {
         if (images.length) {
           getItem(0);
         }
       });

      //  $scope.$watch('itemClasses', function(itemClasses) {
      //    console.log('itemClasses', itemClasses);
      //  });


       if ($scope.animation) {

         //$scope.animationClass = 'animated ' + $scope.animation;
         $scope.animationClass = $scope.animation;
       }

       var displayOptions  = {
        //  btnPreviousClass: 'ngphotoslider-slider-btn--previous',
        //  btnNextClass: 'ngphotoslider-slider-btn--next',
         itemClass: 'ngphotoslider-slider-item',
         currentItemClass: 'ngphotoslider-slider-item--current',
         showPreviousClass: '',
         showNextClass: '',
         hidePreviousClass: '',
         hideNextClass: ''
       };


       function nextDisabled() {
         console.log('$scope.currentItemIndex', $scope.currentItemIndex, $scope.images.length);

         return ($scope.currentItemIndex + 1) === $scope.images.length;
       }
       function prevDisabled() {
         return !$scope.currentItemIndex;
       }
       function updatePagination() {
         $scope.nextDisabled = nextDisabled();
         $scope.prevDisabled = prevDisabled();
       }



       // go to slide
       function getItem(index) {

         if (index >= $scope.images.length || index < 0 || index === $scope.currentItemIndex) {

           if (!index) {
             $scope.itemClasses[0] = displayOptions.currentItemClass;
             console.log($scope.itemClasses);
           }
           return;
         }

         //clearClasses();

         $scope.itemClasses[$scope.currentItemIndex] = (index > $scope.currentItemIndex) ? displayOptions.hidePreviousClass : displayOptions.hideNextClass;

         var currentClass = (index > $scope.currentItemIndex) ? displayOptions.showNextClass : displayOptions.showPreviousClass;
         $scope.itemClasses[index] = displayOptions.currentItemClass + ' ' + currentClass;

         $scope.currentItemIndex = index;

         updatePagination();

       }

       // button event handlers
       // consider using the ng-tap directive to remove delay
       $scope.onPrevButtonClicked = function () {
         getItem($scope.currentItemIndex - 1);
       };
       $scope.onNextButtonClicked = function () {
         getItem($scope.currentItemIndex + 1);
       };

       $scope.$watch('currentItemIndex', function(newVal, oldVal) {
         if (oldVal > newVal) {
           if (typeof $scope.onPrevious === 'function') {
             $scope.onPrevious();
           }
         } else {
           if (typeof $scope.onNext === 'function') {
             $scope.onNext();
           }
         }
       });

     }

  };
});
