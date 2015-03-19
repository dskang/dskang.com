//= require_tree .

$(document).ready(function() {
  $(".toggle-details").on("click", function() {
    var button = $(this);
    button.blur();
    button.next(".event-details").toggle();
    var text = {
      show: "Show Details",
      hide: "Hide Details"
    };
    if (button.text() === text.show) {
      button.text(text.hide);
    } else {
      button.text(text.show);
    }
  });
});
