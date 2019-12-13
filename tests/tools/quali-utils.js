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
        }
    }
};

module.exports = Utils;