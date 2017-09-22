window.addEventListener('load', function onload() {
  var docElements = document.getElementsByClassName('toFadeInUp');
  elements = [];
  states = [];
  for (var i=0; i<docElements.length; i++) {
    var element = docElements[i];
    elements.push(element);
    states.push({
      height: element.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        screen.height,
      active: false,
    });
  }

  window.addEventListener('scroll', function onscroll() {
    for (var i=0; i<elements.length; i++) {
      var element = elements[i];
      var state = states[i];

      var active = false;
      if (window.scrollY >= state.height) {
        active = true;
      }

      if (!state.active && active) {
        element.className += ' fadeInUp';
        element.className = element.className.replace('toFadeInUp', '');
      } else if (state.active && !active) {
        element.className += ' toFadeInUp';
        element.className = element.className.replace('fadeInUp', '');
      }
      state.active = active;
    }
  });
});
