/*global app, alert*/
var log = require('bows')('users');
var auth = require('client/js/auth');
var UserView = require('client/js/pages/users/view');
var templates = require('client/js/templates');
var validateResponse = require('client/js/helpers/validateResponse');
var tickets = require('client/js/helpers/tickets');
var SessionsView = require('client/js/views/users/userSessions');

module.exports = UserView.extend({
  pageTitle: 'View me',
  template: templates.pages.users.me,
  events: {
    'click [data-hook=facebook-add]': 'addFacebook',
    'click [data-hook=google-add]': 'addGoogle',
    'click [data-hook=fenix-add]': 'addFenix',
  },
  addFacebook: function () {
    var self = this;
    auth.login('facebook', true, function(){
      self.handleLogin.apply(self, arguments);
    });
  },
  addGoogle: function () {
    var self = this;
    auth.login('google', true, function(){
      self.handleLogin.apply(self, arguments);
    });
  },
  addFenix: function () {
    var self = this;
    auth.login('fenix', true, function(){
      self.handleLogin.apply(self, arguments);
    });
  },
  handleLogin: function(err, authDetails) {
    var self = this;
    validateResponse(err, function(err){
      var elem = self.queryByHook('message-text');
      if(err) {
        elem.classList.add('error');
        if(err.statusCode == 409){
          elem.textContent = 'Account already associated to you';
        }
        else{
          elem.textContent = 'Error associating account';
        }
        log({err: err});
      }
      else{
        elem.classList.add('valid');
        elem.textContent = 'Account sucessfully added!';
      }
      app.fetchUserData();
    });
  },
  initialize: function (spec) {
    var self = this;

    return self.render();
  }
});
