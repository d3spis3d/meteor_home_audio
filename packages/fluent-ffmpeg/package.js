Package.onUse(function(api) {
  api.addFiles('fluent-ffmpeg.js', 'server');
  api.export('ffmpeg', 'server');
});

Npm.depends({
  "fluent-ffmpeg": '2.0.0-rc2'
});