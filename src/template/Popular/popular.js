$(document).ready(function(){
    $('.tabs__item').on('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('data-tab'),
            content = $('.tabs__contain[data-tab="'+ id +'"]');

        $('.tabs__item_active').removeClass('tabs__item_active');
        $(this).addClass('tabs__item_active');

        $('.tabs__contain_active').removeClass('tabs__contain_active');
        content.addClass('tabs__contain_active');
    });
});