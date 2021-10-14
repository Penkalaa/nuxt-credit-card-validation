/*!
 * nuxt-credit-card-validation v1.0.0
 * (c) Penkalaa
 * Released under the MIT License.
 */
'use strict';

var cards = [{
  type: 'maestro',
  patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67, 633],
  format: /(\d{1,4})/g,
  length: [12, 13, 14, 15, 16, 17, 18, 19],
  cvcLength: [3],
  luhn: true
}, {
  type: 'forbrugsforeningen',
  patterns: [600],
  format: /(\d{1,4})/g,
  length: [16],
  cvcLength: [3],
  luhn: true
}, {
  type: 'dankort',
  patterns: [5019],
  format: /(\d{1,4})/g,
  length: [16],
  cvcLength: [3],
  luhn: true
}, // Credit cards
{
  type: 'visa',
  patterns: [4],
  format: /(\d{1,4})/g,
  length: [13, 16],
  cvcLength: [3],
  luhn: true
}, {
  type: 'mastercard',
  patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
  format: /(\d{1,4})/g,
  length: [16],
  cvcLength: [3],
  luhn: true
}, {
  type: 'amex',
  patterns: [34, 37],
  format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
  length: [15, 16],
  cvcLength: [3, 4],
  luhn: true
}, {
  type: 'dinersclub',
  patterns: [30, 36, 38, 39],
  format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
  length: [14],
  cvcLength: [3],
  luhn: true
}, {
  type: 'discover',
  patterns: [60, 64, 65, 622],
  format: /(\d{1,4})/g,
  length: [16],
  cvcLength: [3],
  luhn: true
}, {
  type: 'unionpay',
  patterns: [62, 88],
  format: /(\d{1,4})/g,
  length: [16, 17, 18, 19],
  cvcLength: [3],
  luhn: false
}, {
  type: 'jcb',
  patterns: [35],
  format: /(\d{1,4})/g,
  length: [16],
  cvcLength: [3],
  luhn: true
}];

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var validation = {
  cardExpiryVal: function cardExpiryVal(value) {
    var _Array$from = Array.from(value.split(/[\s\/]+/, 2)),
        _Array$from2 = _slicedToArray(_Array$from, 2),
        month = _Array$from2[0],
        year = _Array$from2[1]; // Allow for year shortcut


    if ((year != null ? year.length : undefined) === 2 && /^\d+$/.test(year)) {
      var prefix = new Date().getFullYear();
      prefix = prefix.toString().slice(0, 2);
      year = prefix + year;
    }

    month = parseInt(month, 10);
    year = parseInt(year, 10);
    return {
      month: month,
      year: year
    };
  },
  validateCardNumber: function validateCardNumber(num) {
    num = (num + '').replace(/\s+|-/g, '');

    if (!/^\d+$/.test(num)) {
      return false;
    }

    var card = cardFormatUtils.cardFromNumber(num);

    if (!card) {
      return false;
    }

    return Array.from(card.length).includes(num.length) && (card.luhn === false || cardFormatUtils.luhnCheck(num));
  },
  validateCardExpiry: function validateCardExpiry(month, year) {
    if (!month) {
      return false;
    }

    if (!year) {
      var _validation$cardExpir = validation.cardExpiryVal(month);

      month = _validation$cardExpir.month;
      year = _validation$cardExpir.year;
    } // Allow passing an object


    if (_typeof(month) === 'object' && 'month' in month) {
      var _month = month;
      month = _month.month;
      year = _month.year;
    }

    if (!month || !year) {
      return false;
    }

    month = month.toString().trim();
    year = year.toString().trim();

    if (!/^\d+$/.test(month)) {
      return false;
    }

    if (!/^\d+$/.test(year)) {
      return false;
    }

    if (!(1 <= month && month <= 12)) {
      return false;
    }

    if (year.length === 2) {
      if (year < 70) {
        year = "20".concat(year);
      } else {
        year = "19".concat(year);
      }
    }

    if (year.length !== 4) {
      return false;
    }

    var expiry = new Date(year, month);
    var currentTime = new Date(); // Months start from 0 in JavaScript

    expiry.setMonth(expiry.getMonth() - 1); // The cc expires at the end of the month,
    // so we need to make the expiry the first day
    // of the month after

    expiry.setMonth(expiry.getMonth() + 1, 1);
    return expiry > currentTime;
  },
  validateCardCVC: function validateCardCVC(cvc, type) {
    if (!cvc) {
      return false;
    }

    cvc = cvc.toString().trim();

    if (!/^\d+$/.test(cvc)) {
      return false;
    }

    var card = cardFormatUtils.cardFromType(type);

    if (card != null) {
      // Check against a explicit card type
      return Array.from(card.cvcLength).includes(cvc.length);
    } else {
      // Check against all types
      return cvc.length >= 3 && cvc.length <= 4;
    }
  },
  cardType: function cardType(num) {
    if (!num) {
      return null;
    }

    return cardFormatUtils.__guard__(cardFormatUtils.cardFromNumber(num), function (x) {
      return x.type;
    }) || null;
  },
  formatCardNumber: function formatCardNumber(num) {
    num = num.toString().replace(/\D/g, '');
    var card = cardFormatUtils.cardFromNumber(num);

    if (!card) {
      return num;
    }

    var upperLength = card.length[card.length.length - 1];
    num = num.slice(0, upperLength);

    if (card.format.global) {
      return cardFormatUtils.__guard__(num.match(card.format), function (x) {
        return x.join(' ');
      });
    } else {
      var groups = card.format.exec(num);

      if (groups == null) {
        return;
      }

      groups.shift(); // @TODO: Change to native filter()
      //groups = grep(groups, n => n); // Filter empty groups

      return groups.join(' ');
    }
  },
  formatExpiry: function formatExpiry(expiry) {
    var parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);

    if (!parts) {
      return '';
    }

    var mon = parts[1] || '';
    var sep = parts[2] || '';
    var year = parts[3] || '';

    if (year.length > 0) {
      sep = ' / ';
    } else if (sep === ' /') {
      mon = mon.substring(0, 1);
      sep = '';
    } else if (mon.length === 2 || sep.length > 0) {
      sep = ' / ';
    } else if (mon.length === 1 && !['0', '1'].includes(mon)) {
      mon = "0".concat(mon);
      sep = ' / ';
    }

    return mon + sep + year;
  }
};

var cardFormatUtils = {
  cardFromNumber: function cardFromNumber(num) {
    num = (num + '').replace(/\D/g, '');

    for (var i in cards) {
      for (var j in cards[i].patterns) {
        var p = cards[i].patterns[j] + '';

        if (num.substr(0, p.length) === p) {
          return cards[i];
        }
      }
    }
  },
  cardFromType: function cardFromType(type) {
    for (var i in cards) {
      if (cards[i].type === type) {
        return cards[i];
      }
    }
  },
  luhnCheck: function luhnCheck(num) {
    var odd = true;
    var sum = 0;
    var digits = (num + '').split('').reverse();

    for (var i in digits) {
      var digit = parseInt(digits[i], 10);

      if (odd = !odd) {
        digit *= 2;
      }

      if (digit > 9) {
        digit -= 9;
      }

      sum += digit;
    }

    return sum % 10 === 0;
  },
  hasTextSelected: function hasTextSelected(target) {
    // If some text is selected
    if (target.selectionStart != null && target.selectionStart !== target.selectionEnd) {
      return true;
    } // If some text is selected in IE


    if (cardFormatUtils.__guard__(typeof document !== 'undefined' && document !== null ? document.selection : undefined, function (x) {
      return x.createRange;
    }) != null) {
      if (document.selection.createRange().text) {
        return true;
      }
    }

    return false;
  },
  // Private
  // Safe Val
  safeVal: function safeVal(value, target, e) {
    if (e.inputType === 'deleteContentBackward') {
      return;
    }

    var cursor;

    try {
      cursor = target.selectionStart;
    } catch (error) {
      cursor = null;
    }

    var last = target.value;
    target.value = value;
    value = target.value;

    if (cursor !== null && document.activeElement == target) {
      if (cursor === last.length) {
        cursor = target.value.length;
      } // This hack looks for scenarios where we are changing an input's value such
      // that "X| " is replaced with " |X" (where "|" is the cursor). In those
      // scenarios, we want " X|".
      //
      // For example:
      // 1. Input field has value "4444| "
      // 2. User types "1"
      // 3. Input field has value "44441| "
      // 4. Reformatter changes it to "4444 |1"
      // 5. By incrementing the cursor, we make it "4444 1|"
      //
      // This is awful, and ideally doesn't go here, but given the current design
      // of the system there does not appear to be a better solution.
      //
      // Note that we can't just detect when the cursor-1 is " ", because that
      // would incorrectly increment the cursor when backspacing, e.g. pressing
      // backspace in this scenario: "4444 1|234 5".


      if (last !== value) {
        var prevPair = last.slice(cursor - 1, +cursor + 1 || undefined);
        var currPair = target.value.slice(cursor - 1, +cursor + 1 || undefined);
        var digit = value[cursor];

        if (/\d/.test(digit) && prevPair === "".concat(digit, " ") && currPair === " ".concat(digit)) {
          cursor = cursor + 1;
        }
      }

      target.selectionStart = cursor;
      return target.selectionEnd = cursor;
    }
  },
  // Replace Full-Width Chars
  replaceFullWidthChars: function replaceFullWidthChars(str) {
    if (str == null) {
      str = '';
    }

    var fullWidth = "\uFF10\uFF11\uFF12\uFF13\uFF14\uFF15\uFF16\uFF17\uFF18\uFF19";
    var halfWidth = '0123456789';
    var value = '';
    var chars = str.split(''); // Avoid using reserved word `char`

    for (var i in chars) {
      var idx = fullWidth.indexOf(chars[i]);

      if (idx > -1) {
        chars[i] = halfWidth[idx];
      }

      value += chars[i];
    }

    return value;
  },
  // Format Numeric
  reFormatNumeric: function reFormatNumeric(e) {
    var target = e.currentTarget;
    return setTimeout(function () {
      var value = target.value;
      value = cardFormatUtils.replaceFullWidthChars(value);
      value = value.replace(/\D/g, '');
      return cardFormatUtils.safeVal(value, target, e);
    });
  },
  // Format Card Number
  reFormatCardNumber: function reFormatCardNumber(e) {
    var target = e.currentTarget;
    return setTimeout(function () {
      var value = target.value;
      value = cardFormatUtils.replaceFullWidthChars(value);
      value = validation.formatCardNumber(value);
      return cardFormatUtils.safeVal(value, target, e);
    });
  },
  formatCardNumber: function formatCardNumber(e) {
    // Only format if input is a number
    var re;
    var digit = String.fromCharCode(e.which);

    if (!/^\d+$/.test(digit)) {
      return;
    }

    var target = e.currentTarget;
    var value = target.value;
    var card = cardFormatUtils.cardFromNumber(value + digit);
    var length = value.replace(/\D/g, '') + digit;
    var upperLength = 16;

    if (card) {
      upperLength = card.length[card.length.length - 1];
    }

    if (length >= upperLength) {
      return;
    } // Return if focus isn't at the end of the text


    if (target.selectionStart != null && target.selectionStart !== value.length) {
      return;
    }

    if (card && card.type === 'amex') {
      // AMEX cards are formatted differently
      re = /^(\d{4}|\d{4}\s\d{6})$/;
    } else {
      re = /(?:^|\s)(\d{4})$/;
    } // If '4242' + 4


    if (re.test(value + digit)) {
      e.preventDefault();
      return setTimeout(function () {
        return target.value = value + ' ' + digit;
      }); // If '424' + 2
    } else if (re.test(value + digit)) {
      e.preventDefault();
      return setTimeout(function () {
        return target.value = value + digit + ' ';
      });
    }
  },
  formatBackCardNumber: function formatBackCardNumber(e) {
    var target = e.currentTarget;
    var value = target.value; // Return unless backspacing

    if (e.which !== 8) {
      return;
    } // Return if focus isn't at the end of the text


    if (target.selectionStart != null && target.selectionStart !== value.length) {
      return;
    } // Remove the digit + trailing space


    if (/\d\s$/.test(value)) {
      e.preventDefault();
      return setTimeout(function () {
        return target.value = value.replace(/\d\s$/, '');
      }); // Remove digit if ends in space + digit
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      return setTimeout(function () {
        return target.value = value.replace(/\d$/, '');
      });
    }
  },
  // Format Expiry
  reFormatExpiry: function reFormatExpiry(e) {
    var target = e.currentTarget;
    return setTimeout(function () {
      var value = target.value;
      value = cardFormatUtils.replaceFullWidthChars(value);
      value = validation.formatExpiry(value);
      return cardFormatUtils.safeVal(value, target, e);
    });
  },
  formatExpiry: function formatExpiry(e) {
    // Only format if input is a number
    var digit = String.fromCharCode(e.which);

    if (!/^\d+$/.test(digit)) {
      return;
    }

    var target = e.currentTarget;
    var val = target.value + digit;

    if (/^\d$/.test(val) && !['0', '1'].includes(val)) {
      e.preventDefault();
      return setTimeout(function () {
        return target.value = "0".concat(val, " / ");
      });
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      return setTimeout(function () {
        // Split for months where we have the second digit > 2 (past 12) and turn
        // that into (m1)(m2) => 0(m1) / (m2)
        var m1 = parseInt(val[0], 10);
        var m2 = parseInt(val[1], 10);

        if (m2 > 2 && m1 !== 0) {
          return target.value = "0".concat(m1, " / ").concat(m2);
        } else {
          return target.value = "".concat(val, " / ");
        }
      });
    }
  },
  formatForwardExpiry: function formatForwardExpiry(e) {
    var digit = String.fromCharCode(e.which);

    if (!/^\d+$/.test(digit)) {
      return;
    }

    var target = e.currentTarget;
    var val = target.value;

    if (/^\d\d$/.test(val)) {
      return target.value = "".concat(val, " / ");
    }
  },
  formatForwardSlashAndSpace: function formatForwardSlashAndSpace(e) {
    var which = String.fromCharCode(e.which);

    if (which !== '/' && which !== ' ') {
      return;
    }

    var target = e.currentTarget;
    var val = target.value;

    if (/^\d$/.test(val) && val !== '0') {
      return target.value = "0".concat(val, " / ");
    }
  },
  formatBackExpiry: function formatBackExpiry(e) {
    var target = e.currentTarget;
    var value = target.value; // Return unless backspacing

    if (e.which !== 8) {
      return;
    } // Return if focus isn't at the end of the text


    if (target.selectionStart != null && target.selectionStart !== value.length) {
      return;
    } // Remove the trailing space + last digit


    if (/\d\s\/\s$/.test(value)) {
      e.preventDefault();
      return setTimeout(function () {
        return target.value = value.replace(/\d\s\/\s$/, '');
      });
    }
  },
  // Adds maxlength to Expiry field
  handleExpiryAttributes: function handleExpiryAttributes(e) {
    e.setAttribute('maxlength', 9);
  },
  // Format CVC
  reFormatCVC: function reFormatCVC(e) {
    var target = e.currentTarget;
    return setTimeout(function () {
      var value = target.value;
      value = cardFormatUtils.replaceFullWidthChars(value);
      value = value.replace(/\D/g, '').slice(0, 4);
      return cardFormatUtils.safeVal(value, target, e);
    });
  },
  // Restrictions
  restrictNumeric: function restrictNumeric(e) {
    // Key event is for a browser shortcut
    if (e.metaKey || e.ctrlKey) {
      return true;
    } // If keycode is a space


    if (e.which === 32) {
      return false;
    } // If keycode is a special char (WebKit)


    if (e.which === 0) {
      return true;
    } // If char is a special char (Firefox)


    if (e.which < 33) {
      return true;
    }

    var input = String.fromCharCode(e.which); // Char is a number or a space

    return !!/[\d\s]/.test(input) ? true : e.preventDefault();
  },
  restrictCardNumber: function restrictCardNumber(e) {
    var target = e.currentTarget;
    var digit = String.fromCharCode(e.which);

    if (!/^\d+$/.test(digit)) {
      return;
    }

    if (cardFormatUtils.hasTextSelected(target)) {
      return;
    } // Restrict number of digits


    var value = (target.value + digit).replace(/\D/g, '');
    var card = cardFormatUtils.cardFromNumber(value);

    if (card) {
      return value.length <= card.length[card.length.length - 1];
    } else {
      // All other cards are 16 digits long
      return value.length <= 16;
    }
  },
  restrictExpiry: function restrictExpiry(e) {
    var target = e.currentTarget;
    var digit = String.fromCharCode(e.which);

    if (!/^\d+$/.test(digit)) {
      return;
    }

    if (cardFormatUtils.hasTextSelected(target)) {
      return;
    }

    var value = target.value + digit;
    value = value.replace(/\D/g, '');

    if (value.length > 6) {
      return false;
    }
  },
  restrictCVC: function restrictCVC(e) {
    var target = e.currentTarget;
    var digit = String.fromCharCode(e.which);

    if (!/^\d+$/.test(digit)) {
      return;
    }

    if (cardFormatUtils.hasTextSelected(target)) {
      return;
    }

    var val = target.value + digit;
    return val.length <= 4;
  },
  setCardType: function setCardType(e) {
    var target = e.currentTarget;
    var val = target.value;
    var cardType = validation.cardType(val) || 'unknown';

    if (target.className.indexOf(cardType) === -1) {
      var _target$classList;

      var allTypes = [];

      for (var i in cards) {
        allTypes.push(cards[i].type);
      }

      target.classList.remove('unknown');
      target.classList.remove('identified');

      (_target$classList = target.classList).remove.apply(_target$classList, allTypes);

      target.classList.add(cardType);
      target.dataset.cardBrand = cardType;

      if (cardType !== 'unknown') {
        target.classList.add('identified');
      }
    }
  },
  __guard__: function __guard__(value, transform) {
    return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
  }
};

var format = {
  validateCardNumber: validation.validateCardNumber,
  validateCardCVC: validation.validateCardCVC,
  validateCardExpiry: validation.validateCardExpiry,
  setCardType: function setCardType(el) {
    cardFormatUtils.setCardType(el);
    setTimeout(function () {
      el.currentTarget.dispatchEvent(new Event('keyup'));
      el.currentTarget.dispatchEvent(new Event('change'));
    }, 100);
  },
  formatCardCVC: function formatCardCVC(el) {
    el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
    el.addEventListener('keypress', cardFormatUtils.restrictCVC);
    el.addEventListener('paste', cardFormatUtils.reFormatCVC);
    el.addEventListener('change', cardFormatUtils.reFormatCVC);
    el.addEventListener('input', cardFormatUtils.reFormatCVC);
    return this;
  },
  formatCardExpiry: function formatCardExpiry(el) {
    cardFormatUtils.handleExpiryAttributes(el);
    el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
    el.addEventListener('keypress', cardFormatUtils.formatExpiry);
    el.addEventListener('keypress', cardFormatUtils.formatForwardSlashAndSpace);
    el.addEventListener('keypress', cardFormatUtils.formatForwardExpiry);
    el.addEventListener('keydown', cardFormatUtils.formatBackExpiry);
    el.addEventListener('change', cardFormatUtils.reFormatExpiry);
    el.addEventListener('input', cardFormatUtils.reFormatExpiry);
    el.addEventListener('blur', cardFormatUtils.reFormatExpiry);
    return this;
  },
  formatCardNumber: function formatCardNumber(el) {
    el.maxLength = 19;
    el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
    el.addEventListener('keypress', cardFormatUtils.restrictCardNumber);
    el.addEventListener('keypress', cardFormatUtils.formatCardNumber);
    el.addEventListener('keydown', cardFormatUtils.formatBackCardNumber);
    el.addEventListener('keyup', cardFormatUtils.setCardType);
    el.addEventListener('paste', cardFormatUtils.reFormatCardNumber);
    el.addEventListener('change', cardFormatUtils.reFormatCardNumber);
    el.addEventListener('input', cardFormatUtils.reFormatCardNumber);
    el.addEventListener('input', cardFormatUtils.setCardType);
    return this;
  },
  restrictNumeric: function restrictNumeric(el) {
    el.addEventListener('keypress', cardFormatUtils.restrictNumeric);
    el.addEventListener('paste', cardFormatUtils.restrictNumeric);
    el.addEventListener('change', cardFormatUtils.restrictNumeric);
    el.addEventListener('input', cardFormatUtils.restrictNumeric);
    return this;
  }
};

var NuxtCardFormat = {
  install: function install(vue, opts) {
    // provide plugin to Vue
    vue.prototype.$cardFormat = format; // provide directive

    vue.directive('cardformat', {
      bind: function bind(el, binding, vnode) {
        // see if el is an input
        if (el.nodeName.toLowerCase() !== 'input') {
          el = el.querySelector('input');
        } // call format function from prop


        var method = Object.keys(format).find(function (key) {
          return key.toLowerCase() === binding.arg.toLowerCase();
        });
        format[method](el, vnode); // update cardBrand value if available

        if (method == 'formatCardNumber' && typeof vnode.context.cardBrand !== 'undefined') {
          el.addEventListener('keyup', function () {
            if (el.dataset.cardBrand) {
              vnode.context.cardBrand = el.dataset.cardBrand;
            }
          });
        }
      }
    });
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NuxtCardFormat);
}

module.exports = NuxtCardFormat;
