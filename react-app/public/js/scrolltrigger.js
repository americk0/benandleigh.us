window.onload = function onload() {
  var element = document.getElementsByClassName('toFadeInUp')[0];
  console.log(element)
  var state = {
    height: element.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      screen.height,
    active: false,
  };
  console.log(state)

  window.onscroll = function onscroll() {
    var active = false;
    if (window.scrollY >= state.height) {
      active = true;
    }

    if (!state.active && active) {
      console.log('triggered')
      element.className = element.className.replace('toFadeInUp', '');
      element.className += ' fadeInUp';
    } else if (state.active && !active) {
      element.className = element.className.replace('fadeInUp', '');
      element.className += ' toFadeInUp';
    }
    state.active = active;
  }
}
