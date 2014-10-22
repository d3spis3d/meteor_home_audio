UI.registerHelper('isRemote', function() {
  if (Session.get('client') === 'remote') {
    return 'black';
  }
  return '';
});

UI.registerHelper('isPlayer', function() {
  if (Session.get('client') === 'player') {
    return 'black';
  }
  return '';
});

UI.registerHelper('sideNowPlaying', function() {
  if (Session.get('currentPage') === 'nowPlaying' || Session.get('client') === 'player') {
    return false;
  }
  return true;
});

UI.registerHelper('isPlaying', function() {
  return Session.get('playing');
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
    console.log(song.metadata);
    var nowPlayingCount = NowPlaying.find({}).count();
    var track = {
      title: song.metadata.song,
      url: song.url,
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
    var trackID = $(e.target).data('track');
    var trackNo = $(e.target).data('number');
    NowPlaying.remove({_id: trackID});
    Meteor.call('updateNowPlaying', trackNo);
  },
  'click .button.Play': function() {
    console.log('emitting stream');
    controlStream.emit('play');
    Session.set('playing', true);
  },
  'click .button.Pause': function() {
    console.log('emitting pause stream');
    controlStream.emit('pause');
    Session.set('playing', false);
  }
});

