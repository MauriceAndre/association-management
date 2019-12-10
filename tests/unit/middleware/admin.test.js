const admin = require('../../../middleware/admin');

describe('admin middleware', () => {

    let req,
        res,
        next;

    beforeEach(() => {
        req = { user: { isAdmin: true } };
        res = {
            status: jest.fn().mockReturnValue({
                send: jest.fn()
            })
        };
        next = jest.fn();
    });

    it('should return 403 if isAdmin is falsy', () => {
        req.user.isAdmin = false;
        admin(req, res, next);

        expect(res.status.mock.calls[0][0]).toBe(403);
        expect(next.mock.calls.length).toBe(0);
    });

    it('should trigger next if isAdmin is truthy', () => {
        admin(req, res, next);

        expect(next.mock.calls.length).toBe(1);
    });
});