// models
const {User} = require('../../models/user');

const Utils = {
    db: {
        addUser: function (user) {
            user = user || {
                firstName: 'Maurice',
                lastName: 'Schmid',
                email: 'maurice.schmid@mail.com',
                password: 'password1'
            };

            user = new User(user);
            return user.save();
        },

        addManyUsers: function (count = 2) {
            const me = this;
            
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i < count; i++) {
                    await me.addUser({
                        firstName: `Test${i}`,
                        lastName: `User${i}`,
                        email: `test.user${i}@mail.com`,
                        password: `password${i}`
                    });
                }

                resolve();
            });            
        },

        clear: function () {
            return User.remove({});
        }
    },
    generateAdminToken: function () {
        return new User({ isAdmin: true }).generateWebToken();
    },
    generateDefaultToken: function () {
        return new User({ isAdmin: false }).generateWebToken();
    }
}

module.exports = Utils;