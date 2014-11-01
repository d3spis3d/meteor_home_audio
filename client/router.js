Router.configure({
  layoutTemplate: 'applicationTemplate'
});

Router.map(function() {
  this.route('nowPlaying', {
    path: '/',
    onRun: function() {
      Session.set('currentPage', 'nowPlaying');
    },
    action: function() {
      console.log('session size: ', Session.get('device-screensize'));
      if (Session.equals('device-screensize', 'small') || Session.equals('device-screensize', 'medium')) {
        this.render('mobileNowPlaying');
      } else {
        this.render();
      }
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

  this.route('songs', {
    path: '/artists/:tag/:album',
    data: function() {
      var artist = Artists.findOne({tag: this.params.tag});
      var album = Albums.findOne({artist: this.params.tag, tag: this.params.album});
      return {
        artist: artist,
        album: album,
        songs: Files.find({'metadata.artist': artist.name, 'metadata.album': album.title}, {'metadata.number': 1})
      };
    }
  });

  this.route('albums', {
    path: '/artists/:tag',
    data: function() {
      return {
        artist: Artists.findOne({tag: this.params.tag}),
        albums: Albums.find({artist: this.params.tag}, {title: 1})
      };
    }
  });
});
