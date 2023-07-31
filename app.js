(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.searchTerm = '';
        narrowCtrl.found = [];

        narrowCtrl.narrowItDown = function () {
            if (narrowCtrl.searchTerm.trim() === '') {
                narrowCtrl.found = [];
                return;
            }

            MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
                .then(function (foundItems) {
                    narrowCtrl.found = foundItems;
                })
                .catch(function (error) {
                    console.log('Error fetching menu items:', error);
                });
        };

        narrowCtrl.removeItem = function (index) {
            narrowCtrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;
        var apiEndpoint = 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json';

        service.getMatchedMenuItems = function (searchTerm) {
            return $http.get(apiEndpoint)
                .then(function (result) {
                    var menuItems = result.data;
                    var foundItems = [];

                    if (menuItems) {
                        Object.keys(menuItems).forEach(function (key) {
                            var item = menuItems[key];
                            if (item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                                foundItems.push(item);
                            }
                        });
                    }

                    return foundItems;
                })
                .catch(function (error) {
                    console.log('Error fetching menu items:', error);
                    return [];
                });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'E',
            scope: {
                items: '<',
                onRemove: '&'
            },
            templateUrl: 'foundItems.html',
            controller: FoundItemsDirectiveController,
            controllerAs: 'foundCtrl',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var foundCtrl = this;
    }
})();
