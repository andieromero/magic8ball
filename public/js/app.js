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
            var today = new Date();
            var todayDate=[today.getMonth(), today.getDay(), today.getHours(), today.getMinutes()];
            // [0] month, [1] day, [2] hour, [3] minutes
            var diffDates = [(todayDate[0] - qa.date[0]), (todayDate[1] - qa.date[1]), (todayDate[2] - qa.date[2]), (todayDate[3] - qa.date[3])];
            qa.dateDiff = diffDates;
            if (diffDates[0] == diffDates[1] == diffDates[2] == 0){
              if(diffDates[3] < 5) qa.dateDiff = "a few minutes ago";
              else if(diffDates[3] <= 1) qa.dateDiff = "just now" ;
              else qa.dateDiff = diffDates[3] + " minutes ago";
            }
            else if((diffDates[0] == 0) && (diffDates[1] == 0)) qa.dateDiff = diffDates[2] + " hour(s) ago";
            else if(diffDates[0] == 0) qa.dateDiff = diffDates[1] + " days(s) ago";
            else qa.dateDiff = diffDates[0] + " months(s) ago";

            Q_and_A.updateTime(qa);
        });

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
