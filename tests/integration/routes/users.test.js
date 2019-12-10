// external packages
const request = require('supertest');
// models
const {User} = require('../../../models/user');
// tools
const userUtils = require('../../tools/user-utils');

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
        
        let firstName,
            lastName,
            email,
            password;

        beforeEach(() => {
            firstName = 'Maurice';
            lastName = 'Schmid';
            email = 'maurice.schmid@mail.com';
            password = '123Test456';
        })

        const exec = () => {
            return request(server)
                .post('/api/users')
                .send({
                    firstName,
                    lastName,
                    email,
                    password
                });
        }

        it('should return 400 if request object is invalid', async () => {
            firstName = lastName = email = password = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if firstName is less than 3 chars', async () => {
            firstName = new Array(3).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if firstName is more than 30 chars', async () => {
            firstName = new Array(32).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });
        
        it('should return 400 if lastName is less than 3 chars', async () => {
            lastName = new Array(3).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if lastName is more than 30 chars', async () => {
            lastName = new Array(32).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        // TODO: should return 400 if email is less than 3 chars
        
        it('should return 400 if email is more than 255 chars', async () => {
            email = new Array(255).join('a') + '@mail.com';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if email is not valid', async () => {
            email = 'myEmail';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is less than 6 chars', async () => {
            password = new Array(6).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if password is more than 255 chars', async () => {
            password = new Array(257).join('a');
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
                '_id', 'firstName', 'lastName', 'email'
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

    describe('GET', () => {        
            
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
                token = new User({ isAdmin: true }).generateWebToken();
                url = '/api/users';
            });
                        
            // authorization test
            require('../test snippets/auth')(exec);
    
            // admin test
            require('../test snippets/admin')(exec);
    
            it('should return users if request is valid', async () => {
                await userUtils.db.addManyUsers(2);
    
                const res = await exec();
    
                expect(res.status).toBe(200);
                expect(res.body.length).toBe(2);
            });
        });
    
        describe('/me', () => {

            beforeEach(() => {
                token = new User({ isAdmin: true }).generateWebToken();
                url = '/api/users/me';
            })

            it('should return 400 if user does not exist', async () => {
                const res = await exec();

                expect(res.status).toBe(400);
            });

            // authorization test
            require('../test snippets/auth')(exec);

            it('should return the user object if request is valid', async () => {
                const user = await userUtils.db.addUser();
                token = user.generateWebToken();
                const res = await exec();
                
                expect(res.status).toBe(200);
                expect(res.body._id).toBe(user._id.toHexString());
                expect(Object.keys(res.body))
                    .toEqual(expect.arrayContaining(
                        ['_id', 'firstName', 'lastName', 'email', 'isAdmin', 'createdAt', 'updatedAt']
                    ));
            });
        });
    });
});