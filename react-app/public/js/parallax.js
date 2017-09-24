(function(){
  window.addEventListener('load', function() {
    var rsvpbgElement = document.querySelector('.rsvpbg');
    var rsvpbgPosition = rsvpbgElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    var heroElement = document.querySelector('#hero');
    var heroImgURL = heroElement.style['background-image'];
    var heroRect = document.getBoundingClientRect();
    var heroPosition = heroRect.top - document.body.getBoundingClientRect().top;
    var heroHeight = heroRect.bottom - heroRect.top;
    var heroWidth = heroRect.right - heroRect.left;
    window.addEventListener('scroll', function() {
      rsvpbgElement.style['background-position-y'] = ((window.scrollY - rsvpbgPosition) * .5) + 'px';
      heroElement.style['background-position-y'] = ((window.scrollY - heroPosition) * .5) - ((heroWidth * h/w) - heroHeight) + 'px';
    });
  });
})()
