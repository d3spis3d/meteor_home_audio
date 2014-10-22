Meteor.methods({
  updateNowPlaying: function(number) {
    NowPlaying.remove({number: number});
    var tracks = NowPlaying.find({number: {$gt: number}});
    tracks.forEach(function(track) {
      NowPlaying.update({_id: track._id}, {$inc: {number: -1}});
    });
    return true;
  }
});