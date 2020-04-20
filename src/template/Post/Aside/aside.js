$(document).ready(function(){
    $(".panel__link").click(function(){
        var current = $(this).parent();
        current.toggleClass('panel__item_active');
        $('.panel__item').not(current).removeClass('panel__item_active');
    });
});