
$(document).ready(function(){

    var $select2 = $('#language');

    $('#profile-form').validate({
        highlight: function(element) {
            $(element).parent().addClass("form__label_error");
        },
        unhighlight: function(element) {
            $(element).parent().removeClass("form__label_error");
        }
    });

});