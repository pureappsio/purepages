Template.pageEdit.helpers({

    isLeadGen: function() {
        console.log(this);
        if (this.model == 'leadgen') {
            return true;
        }
        else {
            return false;
        }
    }

});