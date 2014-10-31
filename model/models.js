Files = new FS.Collection("files", {
  stores: [new FS.Store.FileSystem("files",
    {
      path: '~/public/audio',
      beforeWrite: function(fileObj) {
        return {
          extension: 'mp3',
          fileType: 'audio/mp3'
        };
      },
      transformWrite: function(fileObj, readStream, writeStream) {
        ffmpeg(readStream).audioCodec('libmp3lame').format('mp3').pipe(writeStream);
      }
    })]
});

Artists = new Mongo.Collection('artists');

Albums = new Mongo.Collection('albums');

NowPlaying = new Mongo.Collection('nowplaying');

CurrentSong = new Mongo.Collection('currentsong');

ControlState = new Mongo.Collection('state');

Meteor.startup(function() {
  if (Meteor.isServer) {
    console.log('setting server state');
    console.log(ControlState.find({}).count());
    if (ControlState.find({}).count() == 0) {
      ControlState.insert({tag: 'playing', state: false});
    } else {
      ControlState.update({tag: 'playing'}, {$set: {state: false}});
    }

    Meteor.publish('state', function() {
      return ControlState.find({});
    });
    Meteor.publish('artists', function() {
      return Artists.find({});
    });
    Meteor.publish('albums', function() {
      return Albums.find({});
    });
    Meteor.publish('files', function() {
      return Files.find({});
    });
    Meteor.publish('nowplaying', function() {
      return NowPlaying.find({});
    });
    Meteor.publish('currentsong', function() {
      return CurrentSong.find({});
    });
  }
});

if (Meteor.isClient) {
  console.log('set client playing state');
  Meteor.subscribe('state', {
    onReady: function() {
      Session.set('playing', ControlState.findOne({tag: 'playing'}).state);
    }
  });
  Meteor.subscribe('artists');
  Meteor.subscribe('albums');
  Meteor.subscribe('files');
  Meteor.subscribe('nowplaying');
  Meteor.subscribe('currentsong');
}
