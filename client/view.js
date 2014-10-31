UI.registerHelper('isRemote', function() {
  if (Session.equals('client', 'remote')) {
    return 'black';
  }
  return '';
});

UI.registerHelper('isPlayer', function() {
  if (Session.equals('client', 'player')) {
    return 'black';
  }
  return '';
});

UI.registerHelper('sideNowPlaying', function() {
  return !Session.equals('currentPage', 'nowPlaying');
});

UI.registerHelper('isPlaying', function() {
  return Session.get('playing');
});

UI.registerHelper('isPaused', function() {
  return Session.get('paused');
});

Template.sideMenu.helpers({
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

Template.sideMenu.events({
  'click #remote': function() {
    Session.set("client", "remote");
  },
  'click #player': function() {
    Session.set("client", "player");
  }
});

Template.upload.events({
  'dropped #dropzone': function(event) {
    console.log('files dropped');
    FS.Utility.eachFile(event, function(file) {
      var newFile = new FS.File(file);
      if (newFile.type() == 'audio/x-m4a') {
        newFile.type('audio/mpeg');
      }
      var meta = newFile.name().split('.')[0].split('-');
      newFile.metadata = {artist: meta[1], number: meta[0], album: meta[2], song: meta[3]}
      Files.insert(newFile, function (err, fileObj) {
        var artistTag = meta[1].toLowerCase().replace(/\s/g, '_');
        if (!Artists.find({name: meta[1]}).count()) {
          Artists.insert({name: meta[1], tag: artistTag});
          console.log('inserting artist');
        }
        if (!Albums.find({artist: artistTag, title: meta[2]}).count()) {
          Albums.insert({artist: artistTag, title: meta[2], tag: meta[2].toLowerCase().replace(/\s/g, '_')});
          console.log('inserting album');
        }
      });
    });
  }
});

Template.uploading.helpers({
    files: function() {
      return Files.find();
    }
});

Template.artists.helpers({
  artists: function() {
    return Artists.find({}, {sort: ["name"]});
  }
});

Template.artists.events({
  'click .button': function(e) {
    var tag = $(e.target).data('tag');
    Router.go('/artists/' + tag);
  }
});

Template.albums.events({
  'click .button': function(e) {
    var artist = $(e.target).data('artist');
    var album = $(e.target).data('album');
    Router.go('/artists/' + artist + '/' + album);
  }
});

Template.songs.events({
  'click .button.Song': function(e) {
    var songID = $(e.target).data('id');
    var song = Files.findOne({_id: songID});
    var nowPlayingCount = NowPlaying.find({}).count();
    var track = {
      id: song._id,
      title: song.metadata.song,
      url: song.url(),
      number: nowPlayingCount + 1
    };
    NowPlaying.insert(track);
  }
});

Template.sidePlaying.helpers({
  songs: function() {
    return NowPlaying.find({}, {number: 1});
  }
});

Template.sidePlaying.events({
  'click .button.Playing': function(e) {
    var trackNo = $(e.target).data('number');
    Meteor.call('updateNowPlaying', trackNo);
  },
  'click .button.Play': function() {
    if (NowPlaying.find({}).count()) {
      controlStream.emit('play');
      Session.set('playing', true);
      Session.set('paused', false);
    }
  },
  'click .button.Pause': function() {
    controlStream.emit('pause');
    Session.set('paused', true);
    Session.set('playing', false);
  }
});

Template.nowPlaying.helpers({

  songs: function() {
    return NowPlaying.find({}, {sort: {number: 1}});
  },
  currentSong: function() {
    var song = CurrentSong.findOne();
    if (!song) {
      song = {
        title: '',
        url: ''
      };
    }
    return song;
  }
});

// functions for nowPlaying events ------

var getAudioElement = function() {
  return $('#audio')[0];
};

var playingSongExists = function() {
  return CurrentSong.find({}).count();
};

var triggerPlay = function() {
  //getAudioElement().play();
  getAudioElement().oncanplay = function() {
    getAudioElement().play()
  };
};

var updateCurrentSong = function() {
  var song = NowPlaying.findOne({number: 1});
  Meteor.call('updateCurrentSong', song.title, song.url, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      triggerPlay();
    }
  });
  Meteor.call('updateNowPlaying', 1);
};

var nextSong = function() {
  getAudioElement().pause();
  updateCurrentSong();
};

var playSong = function() {
  if (playingSongExists()) {
    getAudioElement().play();
  } else {
    updateCurrentSong();
  }
};

var shuffle = function(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var shuffleNowPlaying = function() {
  var now = NowPlaying.find({});
  var nowArray = [];
  now.forEach(function(track) {
    nowArray.push(track.id);
  });
  console.log(nowArray);
  shuffle(nowArray);
  console.log(nowArray);
  Meteor.call('shufflePlaying', nowArray, function(error, results) {
    console.log(error);
    console.log(results);
    var tracks = NowPlaying.find({});
    tracks.forEach(function(track) {
      console.log(track.title);
      console.log(track.number);
    });
  });
};

var isPlayer = function() {
  console.log(Session.get('client'));
  return Session.get('client') === 'player';
};

controlStream.on('play', function() {
  Session.set('playing', true);
  Session.set('paused', false);
  if (Session.equals('client', 'player') && Session.equals('currentPage', 'nowPlaying')) {
    playSong();
  }
});

controlStream.on('pause', function() {
  Session.set('paused', true);
  Session.set('playing', false);
  if (Session.equals('client', 'player') && Session.equals('currentPage', 'nowPlaying')) {
    getAudioElement().pause();
  }
});

controlStream.on('stop', function() {
  Session.set('paused', false);
  Session.set('playing', false);
});

controlStream.on('error', function(message) {
  console.log(message);
});

// -------------------------------------

Template.nowPlaying.events({
  'click .button.Playing': function(e) {
    var trackNo = $(e.target).data('number');
    Meteor.call('updateNowPlaying', trackNo);
  },
  'click .button.Play': function() {
    if (NowPlaying.find({}).count() || CurrentSong.find({}).count()) {
      controlStream.emit('play');
      Session.set('playing', true);
      Session.set('paused', false);
      if (isPlayer()) {
        playSong();
      }
    }
  },
  'click .button.Pause': function() {
    controlStream.emit('pause');
    Session.set('paused', true);
    Session.set('playing', false);
    if (isPlayer()) {
      getAudioElement().pause();
    }
  },
  'click .button.Shuffle': function() {
    shuffleNowPlaying();
  },
  'click .button.Next': function() {
    if (NowPlaying.find({}).count()) {
      nextSong();
    } else {
      Session.set('playing', false);
      controlStream.emit('stop');
      var old = CurrentSong.findOne();
      CurrentSong.remove({_id: old._id});
    }
  },
  'click .button.Back': function() {
    getAudioElement().currentTime = 0;
    if (Session.equals('playing', false)) {
      getAudioElement().pause();
    }
  },
  'ended audio': function() {
    if (NowPlaying.find({}).count()) {
      updateCurrentSong();
    } else {
      Session.set('playing', false);
      controlStream.emit('stop');
      var old = CurrentSong.findOne();
      CurrentSong.remove({_id: old._id});
    }
  }
});


