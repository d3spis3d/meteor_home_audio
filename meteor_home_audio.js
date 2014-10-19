if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('client', 'remote');

  Router.configure({
    layoutTemplate: 'applicationTemplate'
  });

  Router.map(function() {
    this.route('nowPlaying', {
      path: '/',
      onRun: function() {
        Session.set('currentPage', 'nowPlaying');
      }
    });

    this.route('upload', {
      onRun: function() {
        Session.set('currentPage', 'upload');
      }
    });

    this.route('artists', {
      onRun: function() {
        Session.set('currentPage', 'artists');
      }
    });

    this.route('genres', {
      onRun: function() {
        Session.set('currentPage', 'genres');
      }
    });
  });

  Template.sidemenu.helpers({
    isRemote: function() {
      if (Session.get('client') === 'remote') {
        return 'black';
      }
      return '';
    },
    isPlayer: function() {
      if (Session.get('client') === 'player') {
        return 'black';
      }
      return '';
    },
    isActiveNowPlaying: function() {
      if (Session.get('currentPage') === 'nowPlaying') {
        return 'active'
      }
      return '';
    },
    isActiveArtists: function() {
      if (Session.get('currentPage') === 'artists') {
        return 'active'
      }
      return '';
    },
    isActiveGenres: function() {
      if (Session.get('currentPage') === 'genres') {
        return 'active'
      }
      return '';
    },
    isActiveUpload: function() {
      if (Session.get('currentPage') === 'upload') {
        return 'active'
      }
      return '';
    }
  });

  Template.sidemenu.events({
    'click #remote': function() {
      Session.set("client", "remote");
    },
    'click #player': function() {
      Session.set("client", "player");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
