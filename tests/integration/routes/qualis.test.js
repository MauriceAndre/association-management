// external packages
const request = require('supertest');
// tools
const userUtils = require('../../tools/user-utils');
const helper = require('../../tools/testing-helper');

describe('/api/qualis', () => {

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
            title,
            desc;

        beforeEach(() => {
            token = userUtils.generateAdminToken();

            title = '';
            desc = '';
        });

        const exec = (args = {}) => {
            token = args.token !== undefined ? args.token : token;
            const body = args.body || { title, desc };
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


        // should return 400 if request object is invalid
        // should return 500 if qualification already exists
        // should return qualification object if request is valid  
    });
});