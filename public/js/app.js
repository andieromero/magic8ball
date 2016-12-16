// ANGULAR APP magicApp


angular.module("magicApp", ['ngRoute'])
    // configure the routes
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
    // Service: Q_and_A, registers all get/post/delete http requests for data
    .service("Q_and_A", function($http) {
        // getQAs: get all questions and answers used for the feed
        this.getQAs = function() {
            return $http.get("/qas").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding questions and answers.");
                });
        }
        // postQA: post a single qa object
        this.postQA = function(qa) {
            return $http.post("/qas", qa).
                then(function(response) {
                    return response;
                }, function(response) {
                  console.log(response);
                    alert("Error saving question and answer ");
                });
        }
        // getQA: get a single qa object
        this.getQA = function(qaId) {
            var url = "/qas/" + qaId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding question and answer.");
                });
        }
        // updateTime: put qa object when updating the time on reload
        this.updateTime = function(qa){
            var url ="/qas/" + qa._id;
            return $http.put(url, qa).
                then(function(response){
                    return response;
                }, function(response){
                    alert("Error updating time.");
                });
        }
        // deleteQA: deletes a single qa object
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
    // declare controllers
    // feedController: Binds qas to scope object as the entire data collection.
    //    Iterates through all qa objects to update the date difference displayed
    //    (i.e. "a few seconds ago", "12 minutes ago"). Also passes a function
    //    to delete a qa object from feed.
    .controller("feedController", function(q_and_a, $scope, Q_and_A, $route) {
        // qas is the entire data collection
        $scope.qas = q_and_a.data;

        // iterate through each object to update date displayed
        q_and_a.data.forEach(function(qa, idx, array){
            var today = new Date();
            var todayDate=[today.getMonth(), today.getUTCDate(), today.getUTCHours(), today.getMinutes()];
            console.log("controller qa date");
            console.log(qa.date);
            // console.log(todayDate);
            // console.log(qa.date);
            // [0] month, [1] day, [2] hour, [3] minutes
            var diffDates = [(todayDate[0] - qa.date[0]), (todayDate[1] - qa.date[1]), (todayDate[2] - qa.date[2]), (todayDate[3] - qa.date[3])];
            qa.dateDiff = diffDates;
            if ((diffDates[0] == 0) && (diffDates[1] == 0) && (diffDates[2] == 0)){
              if(diffDates[3] <= 1) qa.dateDiff = "just now";
              else if(diffDates[3] < 5) qa.dateDiff = "a few minutes ago" ;
              else qa.dateDiff = diffDates[3] + " minutes ago";
            }
            else if((diffDates[0] == 0) && (diffDates[1] == 0)) qa.dateDiff = diffDates[2] + " hour(s) ago";
            else if(diffDates[0] == 0) qa.dateDiff = diffDates[1] + " days(s) ago";
            else qa.dateDiff = diffDates[0] + " months(s) ago";
            // call updateTime to make a put request to server
            Q_and_A.updateTime(qa);
        });
        // declare a delete function on qa when click on x
        $scope.deleteQA = function(qaID){
          Q_and_A.deleteQA(qaID);
          // call a reload on the current route to update view
          $route.reload();
        }
    })
    // magicController: This controls handles user input and gives a random
    //    response to the user. Declares a shake function called when the
    //    'ask' button or ball is clicked. Registers a magicResponse function
    //    that checks for valid user input, calls shake, updates the response.
    //    SaveQA function is used to post to server.
    .controller("magicController", function($scope, $location, Q_and_A) {
        // declare shake animated function which adds and removes a class
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
        // magicResponse: Randomly pics image and corresponding response
        $scope.magicResponse = function(qa){
          shake();
          // check for valid input
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
          // random generation
          var random = Math.floor(Math.random() * responses.length);
          qa.answer = responses[random];
          qa.image = images[random];
          // used to show/hide the "Post your Question" button
          $scope.questionAsked = true;
        }
        // saveQA: Calls to postQA to save user input, including whether they
        //    typed their name or checked Anonymous box to post as anon.
        $scope.saveQA = function(qa) {
            if($(".form-check-input")[0].checked) {
              qa.player = "Anonymous";
            }
            // post request and then change url to feed
            Q_and_A.postQA(qa).then(function(doc) {
                $location.path("/feed");
            }, function(response) {
                alert(response);
            });
            // turn off the modal backdrop
            $(".modal-backdrop").hide();
        }
    });
