// models
const {User} = require('../../../models/user');
// tools
const userUtils = require('../../tools/user-utils');

module.exports = function (exec) {

    it('should return 403 if user is not admin', async () => {
        token = userUtils.generateDefaultToken();

        const res = await exec({ token });

        expect(res.status).toBe(403);
    });
}