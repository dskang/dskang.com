//= require_tree .

$(document).ready(function() {
  // Toggle event details on click
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

  // Fade in event details
  $(window).scroll(function() {
    $(".event-row").each(function() {
      var bottomOfRow = $(this).offset().top + $(this).outerHeight();
      var bottomOfWindow = $(window).scrollTop() + $(window).height();
      if (bottomOfWindow >= bottomOfRow) {
        $(this).find(".fade-in").fadeIn("slow");
      }
    });
  });
});
