const {User} = require('../../../models/user');

describe('user model', () => {

    it('should encrypt password', async () => {
        const password = 'password1';
        const user = new User({ password });
        
        await user.encryptPassword();

        expect(user.password).not.toBe(password);
    });

    it('should compare passwords', async () => {
        const password = 'password1';
        const user = new User({ password });
        await user.encryptPassword();

        const match = await user.comparePassword(password);

        expect(match).toBeTruthy();
    });
});