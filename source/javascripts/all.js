window.addEventListener('scroll', function(e) {
  var siteHeader = document.getElementById('site-header');
  var fixedHeader = document.getElementById('fixed-header');
  var siteHeaderHeight = siteHeader.offsetHeight;
  var scrolledPastHeader = document.body.scrollTop - siteHeaderHeight > 0;
  if (scrolledPastHeader) {
    fixedHeader.style.display = 'block';
  } else {
    fixedHeader.style.display = 'none';
  }
});
