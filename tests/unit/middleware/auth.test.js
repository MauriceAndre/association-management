// external packages
const mongoose = require('mongoose');
require('dotenv').config();
// middleware
const auth = require('../../../middleware/auth');
// models
const {User} = require('../../../models/user');

describe('auth middleware', () => {

    let req,
        res,
        next,
        token,
        user;

    beforeEach(() => {
        user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        token = new User(user).generateWebToken();
    });
    
    const exec = () => {
        req = { 
            header: jest.fn().mockReturnValue(token)
         };
        res = {
            status: jest.fn().mockReturnValue({
                send: jest.fn()
            })
        };
        next = jest.fn();

        auth(req, res, next);
    };

    it('should return 401 if token is not provided', () => {
        token = '';
        exec();

        expect(res.status.mock.calls[0][0]).toBe(401);
        expect(next.mock.calls.length).toBe(0);
    });    

    it('should return 401 if token is invalid', () => {
        token = 'a';
        exec();

        expect(res.status.mock.calls[0][0]).toBe(401);
        expect(next.mock.calls.length).toBe(0);
    });

    it('should trigger next and populate req.user with the payload of a valid JWT', () => {
        exec();

        expect(req.user).toMatchObject(user);
        expect(next.mock.calls.length).toBe(1);
    });
});