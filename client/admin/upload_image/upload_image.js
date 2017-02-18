Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }

  // files: function(){
  //      return S3.collection.find();
  // },
  // uploadedImage: function() {
  //   if (Session.get('uploadedFile')) {
  //     return Session.get('uploadedFile');
  //   }
  //   else {
  //     return "default.jpg";
  //   }
  // },
  // imageUploaded: function() {
  //   if (Session.get('uploadedFile')) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

});

Template.uploadForm.events({


  // "click button.upload": function() {

  //     // Get files
  //     var files = $("input.file_bag")[0].files

  //     // Upload
  //     S3.upload({
  //       files: files,
  //       path: "pictures"
  //     }, function(e,r){
  //       console.log('Callback: ');
  //       console.log(r);
  //       Session.set('uploadedFile', r.url);
  //     });
  // }

  'change #fileInput': function (e, template) {

    if (this.imageId) {
      var imageId = this.imageId;
    }
    else {
      var imageId = "";
    }

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        transport: 'http'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          console.log('Error during upload: ' + error);
        } else {
          console.log('File "' + fileObj.name + '" successfully uploaded');
          console.log(fileObj);
          if (imageId != "") {
            Session.set(imageId, fileObj._id);
          }
          else {
            Session.set('fileId', fileObj._id);
          }
          
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});