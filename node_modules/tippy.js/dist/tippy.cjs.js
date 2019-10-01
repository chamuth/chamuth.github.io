/**!
* tippy.js v5.0.0
* (c) 2017-2019 atomiks
* MIT License
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('./tippy.chunk.cjs.js');
require('popper.js');

/**
 * Re-uses a single tippy element for many different tippy instances.
 * Replaces v4's `tippy.group()`.
 */

function createSingleton(tippyInstances, optionalProps) {
  if (process.env.NODE_ENV !== "production") {
    index.throwErrorWhen(!Array.isArray(tippyInstances), "The first argument passed to createSingleton() must be an array of tippy\n      instances.\n  \n      The passed value was: " + tippyInstances);
  }

  tippyInstances.forEach(function (instance) {
    instance.disable();
  });
  var currentAria;
  var currentTarget;
  var userProps = {};

  function setUserProps(props) {
    Object.keys(props).forEach(function (prop) {
      userProps[prop] = index.useIfDefined(props[prop], userProps[prop]);
    });
  }

  setUserProps(index._extends({}, index.defaultProps, {}, optionalProps));

  function handleAriaDescribedByAttribute(id, isInteractive, isShow) {
    if (!currentAria) {
      return;
    }

    if (isShow && !isInteractive) {
      currentTarget.setAttribute("aria-" + currentAria, id);
    } else {
      currentTarget.removeAttribute("aria-" + currentAria);
    }
  }

  var references = tippyInstances.map(function (instance) {
    return instance.reference;
  });
  var singleton = index.tippy(document.createElement('div'), index._extends({}, optionalProps, {
    aria: null,
    triggerTarget: references,
    onMount: function onMount(instance) {
      index.preserveInvocation(userProps.onMount, instance.props.onMount, [instance]);
      handleAriaDescribedByAttribute(instance.popperChildren.tooltip.id, instance.props.interactive, true);
    },
    onUntrigger: function onUntrigger(instance, event) {
      index.preserveInvocation(userProps.onUntrigger, instance.props.onUntrigger, [instance, event]);
      handleAriaDescribedByAttribute(instance.popperChildren.tooltip.id, instance.props.interactive, false);
    },
    onTrigger: function onTrigger(instance, event) {
      index.preserveInvocation(userProps.onTrigger, instance.props.onTrigger, [instance, event]);
      var target = event.currentTarget;
      var index$1 = references.indexOf(target);
      currentTarget = target;
      currentAria = userProps.aria;

      if (instance.state.isVisible) {
        handleAriaDescribedByAttribute(instance.popperChildren.tooltip.id, instance.props.interactive, true);
      }

      instance.setContent(tippyInstances[index$1].props.content); // Due to two updates performed upon mount, the second update will use
      // this object

      instance.popperInstance.reference = {
        // @ts-ignore - awaiting popper.js@1.16.0 release
        referenceNode: target,
        clientHeight: 0,
        clientWidth: 0,
        getBoundingClientRect: function getBoundingClientRect() {
          return target.getBoundingClientRect();
        }
      };
    },
    onAfterUpdate: function onAfterUpdate(instance, partialProps) {
      index.preserveInvocation(userProps.onAfterUpdate, instance.props.onAfterUpdate, [instance]);
      setUserProps(partialProps);
    },
    onDestroy: function onDestroy(instance) {
      index.preserveInvocation(userProps.onDestroy, instance.props.onDestroy, [instance]);
      tippyInstances.forEach(function (instance) {
        instance.enable();
      });
    }
  }));
  return singleton;
}

/**
 * Creates a delegate instance that controls the creation of tippy instances
 * for child elements (`target` CSS selector).
 */
function delegate(targets, props) {
  if (process.env.NODE_ENV !== "production") {
    index.throwErrorWhen(!props || !props.target, "You must specify a `target` prop indicating the CSS selector string\n      matching the target elements that should receive a tippy.");
  }

  var listeners = [];
  var childTippyInstances = [];
  var target = props.target;
  var nativeProps = index.removeProperties(props, ['target']);
  var trigger = props.trigger || index.defaultProps.trigger;
  var returnValue = index.tippy(targets, index._extends({}, nativeProps, {
    trigger: 'manual'
  }));

  function onTrigger(event) {
    if (event.target) {
      var targetNode = event.target.closest(target);

      if (targetNode) {
        var instance = index.tippy(targetNode, index._extends({}, nativeProps, {
          showOnCreate: true
        }));

        if (instance) {
          childTippyInstances = childTippyInstances.concat(instance);
        }
      }
    }
  }

  function on(element, eventType, listener, options) {
    if (options === void 0) {
      options = false;
    }

    element.addEventListener(eventType, listener, options);
    listeners.push({
      element: element,
      eventType: eventType,
      listener: listener,
      options: options
    });
  }

  function addEventListeners(instance) {
    var reference = instance.reference;
    index.splitBySpaces(trigger).forEach(function (eventType) {
      switch (eventType) {
        case 'mouseenter':
          {
            on(reference, 'mouseover', onTrigger);
            break;
          }

        case 'focus':
          {
            on(reference, 'focusin', onTrigger);
            break;
          }

        case 'click':
          {
            on(reference, 'click', onTrigger);
          }
      }
    });
  }

  function removeEventListeners() {
    listeners.forEach(function (_ref) {
      var element = _ref.element,
          eventType = _ref.eventType,
          listener = _ref.listener,
          options = _ref.options;
      element.removeEventListener(eventType, listener, options);
    });
    listeners = [];
  }

  function applyMutations(instance) {
    var originalDestroy = instance.destroy;

    instance.destroy = function (shouldDestroyChildInstances) {
      if (shouldDestroyChildInstances === void 0) {
        shouldDestroyChildInstances = true;
      }

      if (shouldDestroyChildInstances) {
        childTippyInstances.forEach(function (instance) {
          instance.destroy();
        });
      }

      childTippyInstances = [];
      removeEventListeners();
      originalDestroy();
    };

    addEventListeners(instance);
    instance.setProps({
      trigger: 'manual'
    });
  }

  if (Array.isArray(returnValue)) {
    returnValue.forEach(applyMutations);
  } else {
    applyMutations(returnValue);
  }

  return returnValue;
}

var animateFill = {
  name: 'animateFill',
  defaultValue: false,
  fn: function fn(instance) {
    var _instance$popperChild = instance.popperChildren,
        tooltip = _instance$popperChild.tooltip,
        content = _instance$popperChild.content;
    var backdrop = instance.props.animateFill && !index.isUCBrowser ? createBackdropElement() : null;

    function addBackdropToPopperChildren() {
      instance.popperChildren.backdrop = backdrop;
    }

    return {
      onCreate: function onCreate() {
        if (backdrop) {
          addBackdropToPopperChildren();
          tooltip.insertBefore(backdrop, tooltip.firstElementChild);
          tooltip.setAttribute('data-animatefill', '');
          instance.setProps({
            animation: 'shift-away',
            arrow: false
          });
        }
      },
      onMount: function onMount() {
        if (backdrop) {
          var transitionDuration = tooltip.style.transitionDuration;
          var duration = Number(transitionDuration.replace('ms', '')); // The content should fade in after the backdrop has mostly filled the
          // tooltip element. `clip-path` is the other alternative but is not
          // well-supported and is buggy on some devices.
          //
          // We don't have access to the real duration that could have been
          // potentially passed as an argument to `.show()` or `.hide()`.

          content.style.transitionDelay = Math.round(duration / 10) + "ms";
          backdrop.style.transitionDuration = transitionDuration;
          setDataState(backdrop, 'visible'); // Warn if the stylesheets are not loaded

          if (process.env.NODE_ENV !== "production") {
            index.warnWhen(getComputedStyle(backdrop).position !== 'absolute', "The `tippy.js/dist/backdrop.css` stylesheet has not been\n              imported!\n              \n              The `animateFill` plugin requires this stylesheet to work.");
            index.warnWhen(getComputedStyle(tooltip).transform === 'none', "The `tippy.js/animations/shift-away.css` stylesheet has not\n              been imported!\n              \n              The `animateFill` plugin requires this stylesheet to work.");
          }
        }
      },
      onShow: function onShow() {
        if (backdrop) {
          backdrop.style.transitionDuration = '0ms';
        }
      },
      onHide: function onHide() {
        if (backdrop) {
          setDataState(backdrop, 'hidden');
        }
      },
      onAfterUpdate: function onAfterUpdate() {
        // With this type of prop, it's highly unlikely it will be changed
        // dynamically. We'll leave out the diff/update logic it to save bytes.
        // `popperChildren` is assigned a new object onAfterUpdate
        addBackdropToPopperChildren();
      }
    };
  }
};

function createBackdropElement() {
  var backdrop = index.div();
  backdrop.className = index.BACKDROP_CLASS;
  setDataState(backdrop, 'hidden');
  return backdrop;
}

function setDataState(element, value) {
  element.setAttribute('data-state', value);
}

var followCursor = {
  name: 'followCursor',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper; // Internal state

    var lastMouseMoveEvent;
    var triggerEvent = null;
    var isInternallySettingControlledProp = false; // These are controlled by this plugin, so we need to store the user's
    // original prop value

    var userProps = instance.props;

    function setUserProps(props) {
      Object.keys(props).forEach(function (prop) {
        userProps[prop] = index.useIfDefined(props[prop], userProps[prop]);
      });
    } // Due to `getVirtualOffsets()`, we need to reverse the placement if it's
    // shifted (start -> end, and vice-versa)


    function setNormalizedPlacement() {
      var placement = userProps.placement;

      if (!placement) {
        return;
      }

      var shift = placement.split('-')[1];
      isInternallySettingControlledProp = true;
      instance.setProps({
        placement: getIsEnabled() && shift ? placement.replace(shift, shift === 'start' ? 'end' : 'start') : placement
      });
      isInternallySettingControlledProp = false;
    }

    function getIsEnabled() {
      return instance.props.followCursor && triggerEvent instanceof MouseEvent && !(triggerEvent.clientX === 0 && triggerEvent.clientY === 0);
    }

    function getIsInitialBehavior() {
      return index.currentInput.isTouch || instance.props.followCursor === 'initial' && instance.state.isVisible;
    }

    function resetReference() {
      if (instance.popperInstance) {
        instance.popperInstance.reference = reference;
      }
    }

    function handleListeners() {
      if (!instance.popperInstance) {
        return;
      } // Popper's scroll listeners make sense for `true` only. TODO: work out
      // how to only listen horizontal scroll for "horizontal" and vertical
      // scroll for "vertical"


      if (getIsEnabled() && (getIsInitialBehavior() || instance.props.followCursor !== true)) {
        instance.popperInstance.disableEventListeners();
      }
    }

    function triggerLastMouseMove() {
      if (getIsEnabled()) {
        onMouseMove(lastMouseMoveEvent);
      }
    }

    function addListener() {
      document.addEventListener('mousemove', onMouseMove);
    }

    function removeListener() {
      document.removeEventListener('mousemove', onMouseMove);
    }

    function onMouseMove(event) {
      var _lastMouseMoveEvent = lastMouseMoveEvent = event,
          clientX = _lastMouseMoveEvent.clientX,
          clientY = _lastMouseMoveEvent.clientY;

      if (!instance.popperInstance || !instance.state.currentPlacement) {
        return;
      } // If the instance is interactive, avoid updating the position unless it's
      // over the reference element


      var isCursorOverReference = index.closestCallback(event.target, function (el) {
        return el === reference;
      });
      var rect = reference.getBoundingClientRect();
      var followCursor = instance.props.followCursor;
      var isHorizontal = followCursor === 'horizontal';
      var isVertical = followCursor === 'vertical';
      var isVerticalPlacement = index.includes(['top', 'bottom'], index.getBasePlacement(instance.state.currentPlacement)); // The virtual reference needs some size to prevent itself from overflowing

      var _getVirtualOffsets = getVirtualOffsets(popper, isVerticalPlacement),
          size = _getVirtualOffsets.size,
          x = _getVirtualOffsets.x,
          y = _getVirtualOffsets.y;

      if (isCursorOverReference || !instance.props.interactive) {
        instance.popperInstance.reference = {
          // These `client` values don't get used by Popper.js if they are 0
          clientWidth: 0,
          clientHeight: 0,
          // This will exist in next Popper.js feature release to fix #532
          // @ts-ignore
          referenceNode: reference,
          getBoundingClientRect: function getBoundingClientRect() {
            return {
              width: isVerticalPlacement ? size : 0,
              height: isVerticalPlacement ? 0 : size,
              top: (isHorizontal ? rect.top : clientY) - y,
              bottom: (isHorizontal ? rect.bottom : clientY) + y,
              left: (isVertical ? rect.left : clientX) - x,
              right: (isVertical ? rect.right : clientX) + x
            };
          }
        };
        instance.popperInstance.update();
      }

      if (getIsInitialBehavior()) {
        removeListener();
      }
    }

    return {
      onAfterUpdate: function onAfterUpdate(_, partialProps) {
        if (!isInternallySettingControlledProp) {
          setUserProps(partialProps);

          if (partialProps.placement) {
            setNormalizedPlacement();
          }
        } // A new placement causes the popperInstance to be recreated


        if (partialProps.placement) {
          handleListeners();
        } // Wait for `.update()` to set `instance.state.currentPlacement` to
        // the new placement


        setTimeout(triggerLastMouseMove);
      },
      onMount: function onMount() {
        triggerLastMouseMove();
        handleListeners();
      },
      onTrigger: function onTrigger(_, event) {
        // Tapping on touch devices can trigger `mouseenter` then `focus`
        if (triggerEvent) {
          return;
        }

        triggerEvent = event;

        if (event instanceof MouseEvent) {
          lastMouseMoveEvent = event;
        } // With "initial" behavior, flipping may be incorrect for the first show


        if (getIsEnabled() && getIsInitialBehavior()) {
          isInternallySettingControlledProp = true;
          instance.setProps({
            flipOnUpdate: true
          });
          isInternallySettingControlledProp = false;
        } else {
          instance.setProps({
            flipOnUpdate: userProps.flipOnUpdate
          });
        }

        setNormalizedPlacement();

        if (getIsEnabled()) {
          // Ignore any trigger events fired immediately after the first one
          // e.g. `focus` can be fired right after `mouseenter` on touch devices
          if (event === triggerEvent) {
            addListener();
          }
        } else {
          resetReference();
        }
      },
      onUntrigger: function onUntrigger() {
        // If untriggered before showing (`onHidden` will never be invoked)
        if (!instance.state.isVisible) {
          removeListener();
          triggerEvent = null;
        }
      },
      onHidden: function onHidden() {
        removeListener();
        triggerEvent = null;
      }
    };
  }
};
function getVirtualOffsets(popper, isVerticalPlacement) {
  var size = isVerticalPlacement ? popper.offsetWidth : popper.offsetHeight;
  return {
    size: size,
    x: isVerticalPlacement ? size : 0,
    y: isVerticalPlacement ? 0 : size
  };
}

// position. This will require the `followCursor` plugin's fixes for overflow
// due to using event.clientX/Y values. (normalizedPlacement, getVirtualOffsets)

var inlinePositioning = {
  name: 'inlinePositioning',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;

    function getIsEnabled() {
      return instance.props.inlinePositioning;
    }

    return {
      onHidden: function onHidden() {
        if (getIsEnabled()) {
          instance.popperInstance.reference = reference;
        }
      },
      onTrigger: function onTrigger() {
        if (!getIsEnabled()) {
          return;
        }

        instance.popperInstance.reference = {
          // @ts-ignore - awaiting popper.js@1.16.0 release
          referenceNode: reference,
          clientWidth: 0,
          clientHeight: 0,
          getBoundingClientRect: function getBoundingClientRect() {
            return getInlineBoundingClientRect(instance.state.currentPlacement && index.getBasePlacement(instance.state.currentPlacement), reference.getBoundingClientRect(), index.arrayFrom(reference.getClientRects()));
          }
        };
      }
    };
  }
};
function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects) {
  // Not an inline element, or placement is not yet known
  if (clientRects.length < 2 || currentBasePlacement === null) {
    return boundingRect;
  }

  var rectToUse;

  switch (currentBasePlacement) {
    case 'top':
    case 'bottom':
      {
        var firstRect = clientRects[0];
        var lastRect = clientRects[clientRects.length - 1];
        var isTop = currentBasePlacement === 'top';
        var top = firstRect.top;
        var bottom = lastRect.bottom;
        var left = isTop ? firstRect.left : lastRect.left;
        var right = isTop ? firstRect.right : lastRect.right;
        var width = right - left;
        var height = bottom - top;
        rectToUse = {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height
        };
        break;
      }

    case 'left':
    case 'right':
      {
        var minLeft = Math.min.apply(Math, clientRects.map(function (rects) {
          return rects.left;
        }));
        var maxRight = Math.max.apply(Math, clientRects.map(function (rects) {
          return rects.right;
        }));
        var measureRects = clientRects.filter(function (rect) {
          return currentBasePlacement === 'left' ? rect.left === minLeft : rect.right === maxRight;
        });
        var _top = measureRects[0].top;
        var _bottom = measureRects[measureRects.length - 1].bottom;
        var _left = minLeft;
        var _right = maxRight;

        var _width = _right - _left;

        var _height = _bottom - _top;

        rectToUse = {
          top: _top,
          bottom: _bottom,
          left: _left,
          right: _right,
          width: _width,
          height: _height
        };
        break;
      }

    default:
      {
        rectToUse = boundingRect;
      }
  }

  return rectToUse;
}

var sticky = {
  name: 'sticky',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper;

    function shouldCheck(value) {
      return instance.props.sticky === true || instance.props.sticky === value;
    }

    var prevRefRect = null;
    var prevPopRect = null;

    function updatePosition() {
      var currentRefRect = shouldCheck('reference') ? reference.getBoundingClientRect() : null;
      var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null; // Schedule an update if the reference rect has changed

      if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
        instance.popperInstance.update();
      }

      prevRefRect = currentRefRect;
      prevPopRect = currentPopRect;

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      }
    }

    return {
      onMount: function onMount() {
        if (instance.props.sticky) {
          updatePosition();
        }
      }
    };
  }
};

function areRectsDifferent(rectA, rectB) {
  if (rectA && rectB) {
    return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
  }

  return true;
}

exports.createTippyWithPlugins = index.createTippyWithPlugins;
exports.default = index.tippy;
exports.hideAll = index.hideAll;
exports.roundArrow = index.ROUND_ARROW;
exports.animateFill = animateFill;
exports.createSingleton = createSingleton;
exports.delegate = delegate;
exports.followCursor = followCursor;
exports.inlinePositioning = inlinePositioning;
exports.sticky = sticky;
//# sourceMappingURL=tippy.cjs.js.map
