// external packages
const request = require('supertest');
const _ = require('lodash');
// models
const {User} = require('../../../models/user');
// tools
const userUtils = require('../../tools/user-utils');

describe('/api/auth', () => {
    
    let server;

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
        await userUtils.db.clear();
    });

    describe('POST /', () => {

        let user,
            password;

        beforeEach(async () => {
            user = await userUtils.db.addUser();
            password = user.password;
            await user.encryptPassword();
            await user.save();            
        });

        const exec = () => {
            return request(server)
                .post('/api/auth')
                .send(_.pick(user, ['email', 'password']));
        };

        it('should return 401 if email is invalid', async () => {
            // invalid email
            user.email = 'invalid@mail.com';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 401 if password is invalid', async () => {
            // invalid password
            user.password = 'a';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return the same message if email or password is invalid', async () => {
            const email = user.email;
            user.email = 'invalid@mail.com'
            const emailRes = await exec();

            user.password = 'a';
            user.email = email;
            const passwordRes = await exec();

            expect(emailRes.text).toBe(passwordRes.text);
        });

        it('should return JWT if request valid', async () => {
            user.password = password;

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.text).not.toBeNull();
            expect(User.verifyWebToken(res.text)).toBeTruthy();
        });
    });

});