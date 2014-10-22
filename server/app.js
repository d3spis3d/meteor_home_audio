Meteor.methods({
  updateNowPlaying: function(number) {
    var tracks = NowPlaying.find({number: {$gt: number}});
    tracks.forEach(function(track) {
      NowPlaying.update({_id: track._id}, {$inc: {number: -1}});
    });
  }
});