Template.mobileArtists.helpers({
  artists: function() {
    return Artists.find({}, {sort: ["name"]});
  }
});

Template.mobileArtists.events({
  'click .button': function(e) {
    var tag = $(e.target).data('tag');
    Router.go('/artists/' + tag);
  }
});

Template.mobileAlbums.events({
  'click .button': function(e) {
    var artist = $(e.target).data('artist');
    var album = $(e.target).data('album');
    Router.go('/artists/' + artist + '/' + album);
  }
});

Template.mobileSongs.events({
  'click .button.Song': function(e) {
    var songID = $(e.target).data('id');
    addToNowPlaying(songID);
  },
  'click .button.All': function() {
    addAlbumToNowPlaying();
  },
  'click .button.PlayAlbum': function() {
    Meteor.call('clearNowPlaying', function(error, result) {
      if (error) {
        console.log(error);
      } else {
        addAlbumToNowPlaying();
      }
    });
  }
});

Template.mobileSidePlaying.helpers({
  songs: function() {
    return NowPlaying.find({}, {sort: {number: 1}});
  }
});

Template.mobileSidePlaying.events({
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
  },
  'click .button.Back': function() {
    controlStream.emit('back');
  },
  'click .button.Next': function() {
    controlStream.emit('next');
  },
  'click .button.Shuffle': function() {
    shuffleNowPlaying();
  }
});

Template.mobileNowPlaying.helpers({

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

Template.mobileNowPlaying.events({
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
        addProgressEventhandler();
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
    if (isPlayer()) {
      checkNextSong();
    } else {
      controlStream.emit('next');
    }
  },
  'click .button.Back': function() {
    if (isPlayer()) {
      backSong();
    } else {
      controlStream.emit('back');
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
      updateBar(0);
    }
  }
});