Meteor.methods({
  updateNowPlaying: function(number) {
    NowPlaying.remove({number: number});
    var tracks = NowPlaying.find({number: {$gt: number}});
    tracks.forEach(function(track) {
      NowPlaying.update({_id: track._id}, {$inc: {number: -1}});
    });
    return true;
  },
  updateCurrentSong: function(name, url) {
    var current = CurrentSong.findOne();
    if (current) {
      CurrentSong.update({_id: current._id}, {$set: {title: name, url: url}});
    } else {
      console.log('inserting');
      var song = {title: name, url: url};
      CurrentSong.insert(song);
    }
    return true;
  },
  shufflePlaying: function(array) {
    var tracks = NowPlaying.find({});
    tracks.forEach(function(track) {
      var newNumber = array.indexOf(track._id) + 1;
      NowPlaying.update({_id: track._id}, {$set: {number: newNumber}});
    });
    return true;
  },
  clearNowPlaying: function() {
    var tracks = NowPlaying.find({});
    tracks.forEach(function(track) {
      NowPlaying.remove({_id: track._id});
    });
    return true;
  }
});