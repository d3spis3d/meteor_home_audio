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
