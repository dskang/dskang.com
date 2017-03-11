window.addEventListener('scroll', function(e) {
  var siteHeader = document.getElementsByClassName('site-header')[0];
  var fixedHeader = document.getElementsByClassName('fixed-header')[0];
  var siteHeaderHeight = siteHeader.offsetHeight;
  var scrolledPastHeader = document.body.scrollTop - siteHeaderHeight > 0;
  if (scrolledPastHeader) {
    fixedHeader.style.display = 'block';
  } else {
    fixedHeader.style.display = 'none';
  }
});
