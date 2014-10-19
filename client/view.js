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
  'dropped #dropzone': function(event) {
    console.log('files dropped');
    FS.Utility.eachFile(event, function(file) {
      Files.insert(file, function (err, fileObj) {
        var meta = fileObj.name().split('.')[0].split('-');
        Files.update({_id: fileObj._id}, {$set: {metadata: {artist: meta[1], number: meta[0], album: meta[2], song: [3]}}});
        if (!Artists.find({name: meta[1]}).count()) {
          Artists.insert({name: meta[1], albums: [], tag: meta[1].toLowerCase().replace(/\s/g, '_')});
          console.log('inserting artist');
        }
        if (!Artists.find({name: meta[1], albums: meta[2]}).count()) {
          var artist = Artists.find({name: meta[1]});
          Artists.update({_id: artist._id}, {$push: {albums: meta[2]}});
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
