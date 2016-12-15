
    $('#shake').click(function () {
        el = $('.element');
        el.addClass('shake');
        el.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function (e) {
            el.removeClass('shake');
        });
    });
