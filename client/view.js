Template.sidemenu.helpers({
  isRemote: function() {
    if (Session.get('client') === 'remote') {
      return 'black';
    }
    return '';
  },
  isPlayer: function() {
    if (Session.get('client') === 'player') {
      return 'black';
    }
    return '';
  },
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

Template.sidemenu.events({
  'click #remote': function() {
    Session.set("client", "remote");
  },
  'click #player': function() {
    Session.set("client", "player");
  }
});

Template.upload.events({
  'dropped #dropzone': function(event, temp) {
    console.log('files dropped');
    FS.Utility.eachFile(event, function(file) {
      Files.insert(file, function (err, fileObj) {
        console.log(err);
        console.log(fileObj);
        //If !err, we have inserted new doc with ID fileObj._id, and
        //kicked off the data upload using HTTP
      });
    });
  }
});

Template.uploading.helpers({
    files: function() {
      return Files.find();
    }
});
