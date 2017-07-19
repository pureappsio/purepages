import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

// Collections
Pages = new Mongo.Collection('pages');
Elements = new Mongo.Collection('elements');
Brands = new Mongo.Collection('brands');
Caches = new Mongo.Collection('caches');

Funnels = new Mongo.Collection('funnels');

Sessions = new Mongo.Collection('sessions');

Integrations = new Mongo.Collection('integrations');

const Schemas = {};
Schemas.Pages = new SimpleSchema({
    name: {
        type: String,
        label: "Name"
    },
    url: {
        type: String,
        label: "Url"
    },
    model: {
        type: String,
        label: "Model"
    },
    brandId: {
        type: String,
        label: "Brand"
    },
    userId: {
        type: String,
        label: "User ID"
    },
    webinarId: {
        optional: true,
        type: String,
        label: "Webinar"
    },
    header: {
        type: Object,
        label: "Header"
    },
    'header.title': {
        type: String,
        label: "Title"
    },
    'header.headline': {
        type: String,
        label: "Headline"
    },
    'header.subheadline': {
        type: String,
        label: "Sub Headline"
    },
    'header.disclaimer': {
        type: String,
        label: "Disclaimer"
    },
    author: {
        type: Object,
        label: "Author"
    },
    'author.name': {
        type: String,
        label: "Name"
    },
    'author.description': {
        type: String,
        label: "Description"
    },
    main: {
        type: Object,
        label: "Header"
    },
    'main.headline': {
        type: String,
        label: "Headline"
    },
    'main.secrets': {
        type: Array
    },
    'main.secrets.$': Object,
    'main.secrets.$.title': String,
    'main.secrets.$.content': String,
    'main.message': {
        type: String,
        label: "Message"
    },
    html: {
        type: String,
        label: "HTML"
    },
    liveHtml: {
        type: String,
        label: "Live HTML"
    },
    cached: {
        type: Boolean
    }

});

Pages.attachSchema(Schemas.Pages);
