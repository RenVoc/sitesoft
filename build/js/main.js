$(document).ready(function(){
    $('.tabs__btn__item').on('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-tab'),
            content = $('.tab__contain[data-tab="'+ id +'"]');

        $('.tabs__btn__item_active').removeClass('tabs__btn__item_active');
        $(this).addClass('tabs__btn__item_active');

        $('.tab__contain_active').removeClass('tab__contain_active');
        content.addClass('tab__contain_active');
    });

    $(".panel__faq__item__link").click(function(){
        var current = $(this).parent();
        current.toggleClass('panel__faq__item_active');
        $('.panel__faq__item').not(current).removeClass('panel__faq__item_active');
    });



});