// models
const {User} = require('../../../models/user');

module.exports = function (exec) {

    it('should return 403 if user is not admin', async () => {
        token = new User({ isAdmin: false }).generateWebToken();

        const res = await exec({ token });

        expect(res.status).toBe(403);
    });
}