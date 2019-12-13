// external packages
const request = require('supertest');
const mongoose = require('mongoose');
// models
const {User} = require('../../../models/user');
// tools
const userUtils = require('../../tools/user-utils');
const helper = require('../../tools/testing-helper');

describe('api/users', () => {
    jest.setTimeout(30000);

    let server;

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
        await userUtils.db.clear();
    });
    
    describe('POST /', () => {
        
        let token,
            firstName,
            lastName,
            email,
            password,
            qualis;

        beforeEach(async () => {
            token = userUtils.generateAdminToken();

            firstName = 'Maurice';
            lastName = 'Schmid';
            email = 'maurice.schmid@mail.com';
            password = '123Test456';
            qualis = [mongoose.Types.ObjectId().toHexString()];
        });

        const exec = (args = {}) => {
            token = args.token !== undefined ? args.token : token;
            const body = args.body || {
                firstName,
                lastName,
                email,
                password,
                qualis
            };
            return request(server)
                .post('/api/users')
                .set('x-auth-token', token)
                .send(body);
        }        
                        
        // authorization test
        require('../test_snippets/auth')(exec);

        // admin test
        require('../test_snippets/admin')(exec);

        it('should return 400 if request object is invalid', async () => {
            firstName = lastName = email = password = qualis = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        const postSchema = {
            firstName: {
                value: firstName,
                min: 3,
                max: 30,
                required: true,
                type: String
            },
            lastName: {
                value: lastName,
                min: 3,
                max: 30,
                required: true,
                type: String
            },
            password: {
                value: password,
                min: 6,
                max: 255,
                required: true,
                type: String
            },
            email: {
                value: email,
                max: 255,
                required: true,
                type: 'email'
            },
            qualis: { value: qualis }
        };
        helper.post.requestBody(postSchema, 400, exec);

        // TODO: should return 400 if email is less than 3 chars

        it('should return 400 if email is not valid', async () => {
            email = 'myEmail';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if qualis is not an ObjectId array', async () => {
            qualis = ['a']; // invalid ObjectId
            const res = await exec();

            expect(res.status).toBe(400);
        });
        
        it('should return 500 if user is already registred', async () => {
            await new User({ firstName, lastName, email, password }).save();

            const res = await exec();

            expect(res.status).toBe(500);
        });

        it('should return user object and JWT if request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                '_id', 'firstName', 'lastName', 'email', 'qualis'
            ]));
            expect(res.header).toHaveProperty('x-auth-token');
        });

        it('should save user in db if request is valid', async () => {
            const res = await exec();

            const user = await User.findOne({ email });

            expect(user).not.toBeNull();
        });

        it('should save encrypted password in db', async () => {            
            const res = await exec();
            const userDb = await User.findById(res.body._id);

            const match = await userDb.comparePassword(password);
            expect(match).toBeTruthy();
        });        
    });

    describe('GET /', () => {        
            
        let url,
            token;

        const exec = (args = {}) => {
            token = args.token !== undefined ? args.token : token;
            return request(server)
            .get(url)
            .set('x-auth-token', token);
        };

        describe('/', () => {
    
            beforeEach(() => {
                token = userUtils.generateAdminToken();
                url = '/api/users';
            });

            // authorization test
            require('../test_snippets/auth')(exec);
    
            // admin test
            require('../test_snippets/admin')(exec);
    
            it('should return users if request is valid', async () => {
                await userUtils.db.addManyUsers(2);
    
                const res = await exec();
    
                expect(res.status).toBe(200);
                expect(res.body.length).toBe(2);
            });
        });
    
        describe('/me', () => {

            beforeEach(() => {
                token = userUtils.generateDefaultToken();
                url = '/api/users/me';
            })

            it('should return 400 if user does not exist', async () => {
                const res = await exec();

                expect(res.status).toBe(400);
            });

            // authorization test
            require('../test_snippets/auth')(exec);

            it('should return the user object if request is valid', async () => {
                const user = await userUtils.db.addUser();
                token = user.generateWebToken();
                const res = await exec();
                
                expect(res.status).toBe(200);
                expect(res.body._id).toBe(user._id.toHexString());
                expect(Object.keys(res.body))
                    .toEqual(expect.arrayContaining(
                        ['_id', 'firstName', 'lastName', 'email', 'isAdmin', 'createdAt', 'updatedAt', 'qualis']
                    ));
            });
        });
    });
});