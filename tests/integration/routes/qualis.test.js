// external packages
const request = require('supertest');
const mongoose = require('mongoose');
// tools
const userUtils = require('../../tools/user-utils');
const qualiUtils = require('../../tools/quali-utils');
const helper = require('../../tools/testing-helper');

describe('/api/qualis', () => {

    let server;

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async () => {
        await server.close();
        await qualiUtils.db.clear();
    });
    
    describe('POST /', () => {
        
        let token,
            title,
            desc,
            body;

        beforeEach(() => {
            token = userUtils.generateAdminToken();

            title = 'title1';
            desc = 'My description';
            body = null;
        });

        const exec = (args = {}) => {
            token = args.token !== undefined ? args.token : token;
            body = args.body || { title, desc };
            return request(server)
            .post('/api/qualis')
            .set('x-auth-token', token)
            .send(body);
        };

        // authorization test
        require('../test_snippets/auth')(exec);

        // admin test
        require('../test_snippets/admin')(exec);

        const postSchema = {
            title: {
                value: 'title1',
                min: 3,
                max: 50,
                required: true,
                type: String
            },
            desc: {
                value: 'My description',
                max: 255,
                type: String
            }
        };
        helper.post.requestBody(postSchema, 400, exec);

        it('should return 400 if request object is invalid', async () => {
            const body = {};
            const res = await exec({ body });

            expect(res.status).toBe(400);
        });

        it('should return 500 if qualification already exists', async () => {
            const quali = await qualiUtils.db.addQuali();
            title = quali.title;
            desc = quali.desc;
            const res = await exec();

            expect(res.status).toBe(500);
        });

        it('should return qualification if request is valid', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(body);
            expect(mongoose.Types.ObjectId.isValid(res.body._id)).toBeTruthy();
        }); 
    });
});