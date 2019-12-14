// models
const {Qualification} = require('../../models/qualification');

const Utils = {
    db: {
        addQuali: function () {
            let quali = {
                title: 'quali1',
                desc: 'My quali description'
            };
            quali = new Qualification(quali);
            return quali.save();
        },
        clear: function () {
            return Qualification.remove({});
        }
    }
};

module.exports = Utils;