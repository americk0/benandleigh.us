(function(){
  window.addEventListener('load', function() {
    var rsvpbgElement = document.querySelector('.rsvpbg');
    var rsvpbgPosition = rsvpbgElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    var heroElement = document.querySelector('#hero');
    var heroPosition = heroElement.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    window.addEventListener('scroll', function() {
      rsvpbgElement.style['background-position-y'] = ((window.scrollY - rsvpbgPosition) * .5) + 'px';
      heroElement.style['background-position-y'] = ((window.scrollY - heroPosition) * .5) + 'px';
    });
  });
})()
