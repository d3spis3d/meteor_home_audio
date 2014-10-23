controlStream = new Meteor.Stream('control');

if (Meteor.isClient) {

}

if (Meteor.isServer) {
  controlStream.permissions.read(function (eventName) {
    return true;
  });
  controlStream.permissions.write(function (eventName) {
    return true;
  });

  controlStream.on('play', function() {
    console.log('heard play');
    ControlState.update({tag: 'playing'}, {$set : {state: true}});
  });
  controlStream.on('pause', function() {
    ControlState.update({tag: 'playing'}, {$set: {state: false}});
  });
}