!function (window, document, undefined) {
  document.addEventListener('DOMContentLoaded', function () {
    var slider          = document.getElementById('slider'),
        sliderWrapper   = slider.children.item(0),
        screenHeight    = window.innerHeight,
        slides          = document.querySelectorAll('#slider .slides'),
        slidesNumber    = slides.length,
        current         = 0,
        limit           = slidesNumber - 1,
        isTransitionEnd = true;

    slider.style.height = screenHeight + 'px';
    window.addEventListener('resize', function (event) {
      screenHeight = window.innerHeight;
      slider.style.height = screenHeight + 'px';
      limit = (1 - slidesNumber) * screenHeight;
      setStylesTransform();
    }, false);

    function addEventHandler(target, typeArray, handler, isCaptured) {
      var self = target;
      typeArray.split(' ').forEach(function (currentValue, index, array) {
        self.addEventListener(currentValue, handler, isCaptured);
      });
    }

    addEventHandler(sliderWrapper, 'transitionend webkitTransitionEnd', function (event) {
      console.log('transitionend', event.type);
      isTransitionEnd = true;
    }, false);
    
    function setStylesTransform() {
      var styles = ['transform', '-webkit-transform', '-moz-transform', '-ms-transition'];
      for (var i = 0; i < styles.length; i++)
        sliderWrapper.style[styles[i]] = 'translate3d(0px, -' + (current * screenHeight) + 'px, 0px)';
    }
    function applyCorrect(direction){
      // if sliderWapper's transition is still running, return to prevent continue scrolling
      if (!isTransitionEnd) {
        return;
      }
      switch (direction) {
        case 'up' :
          if (current === 0) {return;}
          current--;
          break;
        case 'down' :
          if (current === limit) {return;}
          current++;
          break;
      }
      isTransitionEnd = false;
      setStylesTransform();
    }

    slider.addEventListener('mousewheel', function (event) {
      var self       = this,
          wheelDelta = event.wheelDeltaY,
          direction  = wheelDelta > 0 ? 'up' : 'down';
      applyCorrect(direction);
    }, false);
    var touchStartPoint;
    var touchId = null;
    slider.addEventListener('touchstart', function(evt){
      evt = evt || window.event;
      if(evt.touches.length == 1) {
        var tt = evt.touches[0];
        touchId = tt.identifier || null;
        touchStartPoint = tt.clientY;
      }
    }, false);
    slider.addEventListener('touchmove', function(evt){
      evt = evt || window.event;
      if((!evt.touches.identifiedTouch) || touchId !== null) {
        var tt = (evt.touches.identifiedTouch?evt.touches.identifiedTouch(touchId):evt.touches[0]);
        if(tt) {
            if(Math.abs(tt.clientY - touchStartPoint) > screenHeight*0.4){
              var dir = (tt.clientY<touchStartPoint?'down':'up');
              applyCorrect(dir);
              touchId = null;
            }
        }
      }
    }, false);
  }, false);
}(window, window.document);
