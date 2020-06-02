import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import EventEmitter from 'events';
import { openIdpPopup, obtainSession } from './popup';
import { defaultStorage } from './storage';
import { toUrlString, currentUrlNoParams } from './url-util';
// $FlowFixMe
import { customAuthFetcher } from '@inrupt/solid-auth-fetcher';

var SolidAuthClient = /*#__PURE__*/function (_EventEmitter) {
  _inherits(SolidAuthClient, _EventEmitter);

  var _super = _createSuper(SolidAuthClient);

  function SolidAuthClient() {
    _classCallCheck(this, SolidAuthClient);

    return _super.apply(this, arguments);
  }

  _createClass(SolidAuthClient, [{
    key: "getAuthFetcher",
    value: function () {
      var _getAuthFetcher = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(storage) {
        var asyncStorage;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!storage) {
                  _context.next = 5;
                  break;
                }

                asyncStorage = storage;
                return _context.abrupt("return", customAuthFetcher({
                  storage: {
                    get: function get(key) {
                      return asyncStorage.getItem(key);
                    },
                    set: function set(key, value) {
                      return asyncStorage.setItem(key, value);
                    },
                    "delete": function _delete(key) {
                      return asyncStorage.removeItem(key);
                    }
                  }
                }));

              case 5:
                return _context.abrupt("return", customAuthFetcher({}));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getAuthFetcher(_x) {
        return _getAuthFetcher.apply(this, arguments);
      }

      return getAuthFetcher;
    }()
  }, {
    key: "fetch",
    value: function () {
      var _fetch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(input, options) {
        var authFetcher;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.getAuthFetcher();

              case 2:
                authFetcher = _context2.sent;
                this.emit('request', toUrlString(input)); // @ts-ignore TODO: reconcile the input type

                return _context2.abrupt("return", authFetcher.fetch(input, options));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch(_x2, _x3) {
        return _fetch.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(idp, options) {
        var authFetcher;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _objectSpread(_objectSpread({}, defaultLoginOptions(currentUrlNoParams())), options);
                _context3.next = 3;
                return this.getAuthFetcher(options.storage);

              case 3:
                authFetcher = _context3.sent;
                _context3.next = 6;
                return authFetcher.login({
                  redirect: options.callbackUri,
                  clientId: options.clientName,
                  oidcIssuer: idp
                });

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function login(_x4, _x5) {
        return _login.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: "popupLogin",
    value: function () {
      var _popupLogin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(options) {
        var popup, session;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _objectSpread(_objectSpread({}, defaultLoginOptions()), options);

                if (!/https?:/.test(options.popupUri)) {
                  options.popupUri = new URL(options.popupUri || '/.well-known/solid/login', window.location.href).toString();
                }

                if (!options.callbackUri) {
                  options.callbackUri = options.popupUri;
                }

                popup = openIdpPopup(options.popupUri);
                _context4.next = 6;
                return obtainSession(options.storage, popup, options);

              case 6:
                session = _context4.sent;
                this.emit('login', session);
                this.emit('session', session);
                return _context4.abrupt("return", session);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function popupLogin(_x6) {
        return _popupLogin.apply(this, arguments);
      }

      return popupLogin;
    }()
  }, {
    key: "currentSession",
    value: function () {
      var _currentSession = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(storage) {
        var authFetcher, newSession;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.getAuthFetcher(storage);

              case 2:
                authFetcher = _context5.sent;
                _context5.next = 5;
                return authFetcher.getSession();

              case 5:
                newSession = _context5.sent;
                return _context5.abrupt("return", {
                  webId: newSession.webId,
                  sessionKey: newSession.localUserId
                });

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function currentSession(_x7) {
        return _currentSession.apply(this, arguments);
      }

      return currentSession;
    }()
  }, {
    key: "trackSession",
    value: function () {
      var _trackSession = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(callback, storage) {
        return _regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.t0 = callback;
                _context6.next = 3;
                return this.currentSession(storage);

              case 3:
                _context6.t1 = _context6.sent;
                (0, _context6.t0)(_context6.t1);
                this.on('session', callback);

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function trackSession(_x8, _x9) {
        return _trackSession.apply(this, arguments);
      }

      return trackSession;
    }()
  }, {
    key: "stopTrackSession",
    value: function stopTrackSession(callback) {
      this.removeListener('session', callback);
    }
  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(storage) {
        var authFetcher, session;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.getAuthFetcher(storage);

              case 2:
                authFetcher = _context7.sent;
                _context7.next = 5;
                return this.currentSession(storage);

              case 5:
                session = _context7.sent;

                if (!session) {
                  _context7.next = 18;
                  break;
                }

                _context7.prev = 7;
                _context7.next = 10;
                return authFetcher.logout();

              case 10:
                this.emit('logout');
                this.emit('session', null);
                _context7.next = 18;
                break;

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7["catch"](7);
                console.warn('Error logging out:');
                console.error(_context7.t0);

              case 18:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[7, 14]]);
      }));

      function logout(_x10) {
        return _logout.apply(this, arguments);
      }

      return logout;
    }()
  }]);

  return SolidAuthClient;
}(EventEmitter);

export { SolidAuthClient as default };

function defaultLoginOptions(url) {
  return {
    callbackUri: url ? url.split('#')[0] : '',
    popupUri: '',
    storage: defaultStorage()
  };
}