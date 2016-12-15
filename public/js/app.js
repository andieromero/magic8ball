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
            var url ="/qas/" + qa._id;
            return $http.put(url, qa).
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
        q_and_a.data.forEach(function(qa, idx, array){
            qa.date = ((new Date()).getTime() - (qa.date)) / 1000;
            Q_and_A.updateTime(qa);
            if (idx === array.length - 1) array[idx].date = "just now";
        });
        // $route.reload();
        // console.log(q_and_a.data);
        // Q_and_A.updateTime(q_and_a);
        $scope.deleteQA = function(qaID){
          Q_and_A.deleteQA(qaID);
          $route.reload();
        }
    })
    .controller("magicController", function($scope, $location, Q_and_A) {
        var shake = function(){
            el = $('.ball');
            el.removeClass('shake');
            el.removeClass('animated');
            el.addClass('shake');
            el.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function (e) {
                el.removeClass('shake');
            });
        };
        $scope.magicResponse = function(qa){
          shake();
          if(qa == undefined) {
            alert("Please ask Magic 8 Ball a question!");
            return;
          }
          var images = ["1.png", "2.png", "3.png", "4.png", "5.png"
        , "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png"
        , "13.png", "14.png", "15.png", "16.png", "17.png", "18.png"
        , "19.png", "20.png"];
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
          var random = Math.floor(Math.random() * responses.length);
          qa.answer = responses[random];
          qa.image = images[random];
          $scope.questionAsked = true;
        }
        $scope.saveQA = function(qa) {
            if($(".form-check-input")[0].checked) {
              qa.player = "Anonymous";
            }
            Q_and_A.postQA(qa).then(function(doc) {
                $location.path("/feed");
            }, function(response) {
                alert(response);
            });
            $(".modal-backdrop").hide();
        }
    });
