Files = new FS.Collection("files", {
  stores: [new FS.Store.FileSystem("files", {path: '~/public/audio'})]
});

Artists = new Mongo.Collection('artists');