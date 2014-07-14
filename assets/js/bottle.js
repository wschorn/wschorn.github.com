// Generated by CoffeeScript 1.7.1
var animStr, documentKeys, dragBool, event2key, refreshAnimation, resizeFit, setAnimation, staggerBool, staggerInt, toggleDrag, toggleStagger;

dragBool = false;

staggerBool = true;

staggerInt = 20;

event2key = {
  97: "a",
  98: "b",
  99: "c",
  68: "d",
  101: "e",
  102: "f",
  103: "g",
  104: "h",
  105: "i",
  106: "j",
  107: "k",
  108: "l",
  109: "m",
  110: "n",
  111: "o",
  112: "p",
  113: "q",
  114: "r",
  83: "s",
  116: "t",
  117: "u",
  118: "v",
  119: "w",
  120: "x",
  121: "y",
  122: "z",
  37: "left",
  39: "right",
  38: "up",
  40: "down",
  13: "enter"
};

animStr = "callout.bounce";

resizeFit = function(selector) {
  return $(selector).bigtext();
};

setAnimation = function(animationName) {
  console.log("setting " + animationName);
  return animStr = animationName;
};

toggleDrag = function() {
  $(".drag-btn").toggleClass('is-active');
  return dragBool = !dragBool;
};

toggleStagger = function() {
  $(".stagger-btn").toggleClass('is-active');
  staggerBool = !staggerBool;
  return staggerInt = staggerBool ? 200 : 0;
};

documentKeys = function(event) {
  var letter, myKey;
  myKey = event2key[event.which];
  letter = String.fromCharCode(event.charCode);
  console.log(event.type, event.which, event.charCode, myKey, letter);
  switch (myKey) {
    case "enter":
    case "a":
      return refreshAnimation();
    case "left":
    case "s":
      return toggleStagger();
    case "right":
    case "d":
      return toggleDrag();
  }
};

refreshAnimation = function() {
  return $("#bottle div").velocity(animStr, {
    stagger: staggerInt,
    drag: dragBool
  });
};

$(document).ready(function() {
  console.log("Hello 2 world");
  resizeFit("#bottle");
  $(document).on('keyup', documentKeys);
  $("#anim").submit(function(evt) {
    evt.preventDefault();
    setAnimation($("input.anim-box").val());
    return refreshAnimation();
  });
  $("#uiPackEffects").change(function(evt) {
    evt.preventDefault();
    setAnimation($("select option:selected").val());
    return refreshAnimation();
  });
  $(".refresh-btn").click(function() {
    console.log("ref");
    return refreshAnimation();
  });
  return $(".stagger-btn").click(function() {
    console.log("stg");
    return toggleStagger();
  });
});