$(document).ready(function() {
    var max_fields = 10;
    var wrapper = $(".ansewer-container");
    var add_button = $(".add_form_field");

    var x = 1;
    $(add_button).click(function(e) {
        e.preventDefault();
        if (x < max_fields) {
            x++;
            $(wrapper).append('<div id="answers"><input id="answers" type="text" name="answers" placeholder="Enter short answer" required/><span style="font-size:16px; font-weight:bold;" class="delete">-</span></div>'); //add input box
        } else {
            alert('You Reached the limits')
        }
    });

    $(wrapper).on("click", ".delete", function(e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    })
});