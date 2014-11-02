Router.configure({
  layoutTemplate: 'applicationTemplate'
});

Router.map(function() {
  this.route('nowPlaying', {
    path: '/',
    onAfterAction: function() {
      Session.set('currentPage', 'nowPlaying');
    },
    action: function() {
      if (Session.equals('device-screensize', 'small') || Session.equals('device-screensize', 'medium')) {
        this.layout('mobileApplicationTemplate');
        this.render('mobileNowPlaying');
      } else {
        this.render();
      }
    }
  });

  this.route('upload', {
    onAfterAction: function() {
      Session.set('currentPage', 'upload');
    },
    action: function() {
      this.render();
    }
  });

  this.route('genres', {
    onAfterAction: function() {
      Session.set('currentPage', 'genres');
    },
    action: function() {
      if (Session.equals('device-screensize', 'small') || Session.equals('device-screensize', 'medium')) {
        this.layout('mobileApplicationTemplate');
        this.render('mobileGenres');
      } else {
        this.render();
      }
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
    },
    action: function() {
      if (Session.equals('device-screensize', 'small') || Session.equals('device-screensize', 'medium')) {
        this.layout('mobileApplicationTemplate');
        this.render('mobileSongs');
      } else {
        this.render();
      }
    }
  });

  this.route('albums', {
    path: '/artists/:tag',
    data: function() {
      return {
        artist: Artists.findOne({tag: this.params.tag}),
        albums: Albums.find({artist: this.params.tag}, {title: 1})
      };
    },
    action: function() {
      if (Session.equals('device-screensize', 'small') || Session.equals('device-screensize', 'medium')) {
        this.layout('mobileApplicationTemplate');
        this.render('mobileAlbums');
      } else {
        this.render();
      }
    }
  });

  this.route('artists', {
    onAfterAction: function() {
      Session.set('currentPage', 'artists');
    },
    action: function() {
      if (Session.equals('device-screensize', 'small') || Session.equals('device-screensize', 'medium')) {
        this.layout('mobileApplicationTemplate');
        this.render('mobileArtists');
      } else {
        this.render();
      }
    }
  });
});
