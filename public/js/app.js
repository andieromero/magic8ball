angular.module("magicApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "play.html",
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
        this.postQA = function(qa) {
            return $http.post("/qas", qa).
                then(function(response) {
                    return response;
                }, function(response) {
                  console.log(response);
                    alert("Error saving question and answer ");
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
        this.updateTime = function(qa){
            var url ="/qas/" + qaId;
            return $http.put(url, contact).
                then(function(response){
                    return response;
                }, function(response){
                    alert("Error updating time.");
                });
        }
        this.deleteQA = function(qaId) {
            var url = "/qas/" + qaId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this question and answer.");
                });
        }
    })
    .controller("feedController", function(q_and_a, $scope, Q_and_A, $route) {
        $scope.qas = q_and_a.data;
        q_and_a.data.forEach(function(qa){
            console.log(qa.date);
        });
        // console.log(q_and_a.data);
        // Q_and_A.updateTime(q_and_a);
        $scope.deleteQA = function(qaID){
          Q_and_A.deleteQA(qaID);
          $route.reload();
        }
    })
    .controller("magicController", function($scope, $location, Q_and_A) {
        $scope.magicResponse = function(qa){
          var responses = [
          "It is certain",
          "It is decidedly so",
          "Without a doubt",
          "Yes, definitely",
          "You may rely on it",
          "As I see it, yes",
          "Most likely",
          "Outlook good",
          "Yes",
          "Signs point to yes",
          "Reply hazy try again",
          "Ask again later",
          "Better not tell you now",
          "Cannot predict now",
          "Concentrate and ask again",
          "Don't count on it",
          "My reply is no",
          "My sources say no",
          "Outlook not so good",
          "Very doubtful"
          ];
          var randResponse = responses[Math.floor(Math.random() * responses.length)];
          qa.answer = randResponse;
          // qa.date = moment().format('MMM DO YY, h:mm:ss a');
        }
        $scope.saveQA = function(qa) {
            Q_and_A.postQA(qa).then(function(doc) {
                $location.path("/feed");
            }, function(response) {
                alert(response);
            });
        }
    });
