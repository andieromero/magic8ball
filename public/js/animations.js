$(function() {
    $(".ask").click(function() {
        animate(".ball", 'shake');
        return false;
    });

});

function animate(element_ID, animation) {
    $(element_ID).addClass(animation);
    var wait = window.setTimeout( function(){
        $(element_ID).removeClass(animation)}, 1300
    );
}
