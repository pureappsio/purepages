Template.pageEditGeneric.helpers({

    brandOptions: function() {

        var brands = Brands.find({}).fetch();

        var brandOptions = [];

        for (i in brands) {
            brandOptions.push({
                value: brands[i]._id,
                label: brands[i].name
            });
        }

        return brandOptions;

    }
});
