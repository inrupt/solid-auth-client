"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = _interopRequireDefault(require("events"));

var _popup = require("./popup");

var _storage = require("./storage");

var _urlUtil = require("./url-util");

var _solidAuthFetcher = require("@inrupt/solid-auth-fetcher");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

class SolidAuthClient extends _events.default {
  async getAuthFetcher(storage) {
    if (storage) {
      const asyncStorage = storage;
      return (0, _solidAuthFetcher.customAuthFetcher)({
        storage: {
          get: key => asyncStorage.getItem(key),
          set: (key, value) => asyncStorage.setItem(key, value),
          delete: key => asyncStorage.removeItem(key)
        }
      });
    } else {
      return (0, _solidAuthFetcher.customAuthFetcher)({});
    }
  }

  async fetch(input, options) {
    const authFetcher = await this.getAuthFetcher();
    this.emit('request', (0, _urlUtil.toUrlString)(input)); // @ts-ignore TODO: reconcile the input type

    return authFetcher.fetch(input, options);
  }

  async login(idp, options) {
    options = _objectSpread(_objectSpread({}, defaultLoginOptions((0, _urlUtil.currentUrlNoParams)())), options);
    const authFetcher = await this.getAuthFetcher(options.storage);
    await authFetcher.login({
      redirect: options.callbackUri,
      clientId: options.clientName,
      oidcIssuer: idp
    });
  }

  async popupLogin(options) {
    options = _objectSpread(_objectSpread({}, defaultLoginOptions()), options);

    if (!/https?:/.test(options.popupUri)) {
      options.popupUri = new URL(options.popupUri || '/.well-known/solid/login', window.location.href).toString();
    }

    if (!options.callbackUri) {
      options.callbackUri = options.popupUri;
    }

    const popup = (0, _popup.openIdpPopup)(options.popupUri);
    const session = await (0, _popup.obtainSession)(options.storage, popup, options);
    this.emit('login', session);
    this.emit('session', session);
    return session;
  }

  async currentSession(storage) {
    const authFetcher = await this.getAuthFetcher(storage);
    const newSession = await authFetcher.getSession();
    return {
      webId: newSession.webId,
      sessionKey: newSession.localUserId
    };
  }

  async trackSession(callback, storage) {
    /* eslint-disable standard/no-callback-literal */
    callback(await this.currentSession(storage));
    this.on('session', callback);
  }

  stopTrackSession(callback) {
    this.removeListener('session', callback);
  }

  async logout(storage) {
    const authFetcher = await this.getAuthFetcher(storage);
    const session = await this.currentSession(storage);

    if (session) {
      try {
        await authFetcher.logout();
        this.emit('logout');
        this.emit('session', null);
      } catch (err) {
        console.warn('Error logging out:');
        console.error(err);
      }
    }
  }

}

exports.default = SolidAuthClient;

function defaultLoginOptions(url) {
  return {
    callbackUri: url ? url.split('#')[0] : '',
    popupUri: '',
    storage: (0, _storage.defaultStorage)()
  };
}