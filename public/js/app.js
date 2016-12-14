angular.module("magicApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "index.html",
                controller: "magicController",
            })
            .when("/feed", {
                templateUrl: "feed.html",
                controller: "feedController",
                resolve: {
                    q_and_a: function(Q_and_A) {
                        return Q_and_A.getQAs();
                    }
                }
            })
            // .when("/contact/:contactId", {
            //     controller: "EditContactController",
            //     templateUrl: "contact.html"
            // })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Q_and_A", function($http) {
        this.getQAs = function() {
            return $http.get("/qas").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding questions and answers.");
                });
        }
        this.saveQA = function(qa) {
            return $http.post("/qas", qa).
                then(function(response) {
                    console.log("saving qa");
                    console.log(qa);
                    return response;
                }, function(response) {
                    alert("Error saving question and answer.");
                });
        }
        this.getQA = function(qaId) {
            var url = "/qas/" + qaId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding question and answer.");
                });
        }
        this.deleteQA = function(qaId) {
            var url = "/qas/" + qaId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this question and answer.");
                    console.log(response);
                });
        }
    })
    .controller("feedController", function(q_and_a, $scope) {
        $scope.qas = q_and_a.data;
    })
    .controller("magicController", function($scope, $location, Q_and_A) {

        $scope.saveQA = function(qa) {
            Q_and_A.saveQA(qa).then(function(doc) {
                $location.path("/feed");
            }, function(response) {
                alert(response);
            });
        }
    });
