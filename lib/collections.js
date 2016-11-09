// Collections
Pages = new Mongo.Collection('pages');
Elements = new Mongo.Collection('elements');
Brands = new Mongo.Collection('brands');

Integrations = new Mongo.Collection('integrations');

// Files
this.Images = new Meteor.Files({
  debug: true,
  // storagePath: '/images',
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024*1024*10 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});
