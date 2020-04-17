$(document).ready(function(){
    $(".panel__faq__item__link").click(function(){
        var current = $(this).parent();
        current.toggleClass('panel__faq__item_active');
        $('.panel__faq__item').not(current).removeClass('panel__faq__item_active');
    });
});