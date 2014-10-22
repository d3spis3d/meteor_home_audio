controlStream = new Meteor.Stream('control');

if (Meteor.isClient) {
  controlStream.on('play', function() {
    console.log('heard play');
    Session.set('playing', true);
  });

  controlStream.on('pause', function() {
    console.log('heard pause');
    Session.set('playing', false);
  });
}

if (Meteor.isServer) {
  controlStream.permissions.read(function (eventName) {
    return eventName == 'play' || eventName == 'pause';
  });
  controlStream.permissions.write(function (eventName) {
    return eventName == 'play' || eventName == 'pause';
  });

  controlStream.on('play', function() {
    console.log('heard play');
    ControlState.update({tag: 'playing'}, {$set : {state: true}});
  });
  controlStream.on('pause', function() {
    ControlState.update({tag: 'playing'}, {$set: {state: false}});
  });
}