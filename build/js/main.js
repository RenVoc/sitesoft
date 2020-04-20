$(document).ready(function () {
  $('.select2').niceSelect();
  $('#main__form').validate({
    rules: {
      fName: {
        required: true
      },
      lName: {
        required: true
      },
      Email: {
        required: true,
        email: true
      },
      address: {
        required: true
      }
    },
    errorPlacement: function (error, element) {
      $(element).parent().addClass('label__wrapper_alert');
    },
    submitHandler: function (form) {
      return false;
    }
  });
});
$(document).ready(function () {
  $('.tabs__item').on('click', function (e) {
    e.preventDefault();
    var id = $(this).attr('data-tab'),
        content = $('.tabs__contain[data-tab="' + id + '"]');
    $('.tabs__item_active').removeClass('tabs__item_active');
    $(this).addClass('tabs__item_active');
    $('.tabs__contain_active').removeClass('tabs__contain_active');
    content.addClass('tabs__contain_active');
  });
});
$(document).ready(function () {
  $(".panel__link").click(function () {
    var current = $(this).parent();
    current.toggleClass('panel__item_active');
    $('.panel__item').not(current).removeClass('panel__item_active');
  });
});
$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    nav: true,
    dots: true,
    items: 1,
    loop: true
  });
});