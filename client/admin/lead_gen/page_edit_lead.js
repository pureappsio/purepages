Template.pageEditLead.helpers({

    fileThemeSelected: function() {

        if (Session.get('selectedTheme')) {
            if (Session.get('selectedTheme') == 'file') {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }

    },
    videoThemeSelected: function() {

        if (Session.get('selectedTheme')) {
            if (Session.get('selectedTheme') == 'video') {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },
    image: function() {
        if (this.message) {
            if (this.message.image) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },
    imageLink: function() {
        if (this.message) {
            if (this.message.image) {
                return Images.findOne(this.message.image).link();
            }
        }

    },
    brands: function() {
        return Brands.find({});
    },
    elements: function() {
        return Elements.find({ pageId: this._id });
    }

});

Template.pageEditLead.events({

    'click #theme, change #theme': function() {

        Session.set('selectedTheme', $('#theme :selected').val());

    },
    'click #add-element': function() {

        var element = {
            title: $('#element-title').val(),
            content: $('#element-content').val(),
            pageId: this._id,
            userId: Meteor.user()._id
        }

        Meteor.call('createElement', element);

    },
    'click #save-page': function() {

        // Base parameters
        var page = {
            name: this.name,
            url: this.url,
            model: this.model,
            userId: this.userId,
            _id: this._id,
        }

        // Brand
        page.brandId = $('#brand-id :selected').val();

        // Sequence
        page.sequenceId = $('#sequence-id :selected').val();

        // Tags
        page.tags = $('#tags-id').val();

        // Theme
        page.theme = $('#theme :selected').val();
        page.optin = $('#optin :selected').val();

        if ($('#theme :selected').val() == 'file') {

            // Header
            page.header = {};
            page.header.title = $('#header-title').val();
            page.header.subtitle = $('#header-subtitle').val();
            if ($('#header-text').val() != "") {
                page.header.text = $('#header-text').val();
            }

            // Main
            page.main = {};
            page.main.text = $('#main-text').summernote('code');
            page.main.emailMessage = $('#main-email-message').val();

            // Message
            page.message = {};
            page.message.message = $('#message-message').summernote('code');
            page.message.signature = $('#signature-message').summernote('code');
            if (this.message) {
                if (this.message.image) {
                    page.message.image = this.message.image
                }
            }

            if (Session.get('fileId')) {
                page.message.image = Session.get('fileId');
            }

            // Bottom
            page.bottom = {};
            page.bottom.message = $('#bottom-text').val();
            page.bottom.button = $('#bottom-button').val();

        }
        if ($('#theme :selected').val() == 'video') {

            // Header
            page.header = {};
            page.header.title = $('#header-title').val();

            // Bottom
            page.bottom = {};
            page.bottom.message = $('#bottom-message').val();

            // Video
            if (this.video) {
                page.video = this.video;
            }
            if (Session.get('fileId')) {
                page.video = Session.get('fileId');
            }

        }

        // Save
        Meteor.call('editPage', page);

    }

});

Template.pageEditLead.onRendered(function() {

    // Set session to false
    Session.set('fileId', false);

    if (this.data) {
        // Init editor
        $('#main-text').summernote({
            height: 150 // set editor height
        });

        $('#message-message').summernote({
            height: 150 // set editor height
        });

        $('#signature-message').summernote({
            height: 100 // set editor height
        });
    }

    if (this.data.main) {
        if (this.data.main.text) {
            $('#main-text').summernote('code', this.data.main.text);
        }
    }

    if (this.data.message) {

        if (this.data.message.message) {
            $('#message-message').summernote('code', this.data.message.message);
        }

        if (this.data.message.signature) {
            $('#signature-message').summernote('code', this.data.message.signature);
        }

    }

    // Init picker
    $('#tags-id').empty();
    $('#tags-id').selectpicker();

    // Init sequence
    if (this.data.brandId) {

        // Set brand
        $("#brand-id").val(this.data.brandId);

        var sequenceId = this.data.sequenceId;
        var pageTags = this.data.tags;

        Meteor.call('getBrandDetails', this.data.brandId, function(err, brand) {

            Meteor.call('getListSequences', brand.listId, function(err, sequences) {

                $('#sequence-id').empty();

                for (i = 0; i < sequences.length; i++) {
                    $('#sequence-id').append($('<option>', {
                        value: sequences[i]._id,
                        text: sequences[i].name
                    }));
                }

                if (sequenceId) {
                    $("#sequence-id").val(sequenceId);
                }

            });

            Meteor.call('getListTags', brand.listId, function(err, tags) {

                for (i = 0; i < tags.length; i++) {
                    $('#tags-id').append($('<option>', {
                        value: tags[i]._id,
                        text: tags[i].name
                    }));
                }

                // Refresh picker
                $('#tags-id').selectpicker('refresh');

                if (pageTags) {
                    $('#tags-id').selectpicker('val', pageTags);
                    $('#tags-id').selectpicker('refresh');
                }


            });

        });

    }

});
