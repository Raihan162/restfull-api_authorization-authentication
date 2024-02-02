const Boom = require('boom');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Moment = require('moment');

const GeneralHelper = require('../helpers/generalHelper');

const jwtSecretToken = 'super_strong_key';
const fileName = 'server/middlewares/studentMiddleware.js';

// eslint-disable-next-line no-unused-vars
const validateToken = (request, reply, next) => {
    const { authorization } = request.headers;

    try {
        if (_.isEmpty(authorization)) {
            throw Boom.unauthorized();
        }

        const token = authorization.split(' ')[1];
        const verifiedUser = jwt.verify(token, jwtSecretToken);
        if (_.isEmpty(verifiedUser) || !_.has(verifiedUser, 'exp')) {
            throw Boom.unauthorized();
        }

        const isTokenExpired = verifiedUser.exp < Moment().unix();
        if (isTokenExpired) {
            throw Boom.unauthorized();
        }

        request.body.studentToken = verifiedUser

        return next();
    } catch (err) {
        console.log([fileName, 'validateToken', 'ERROR'], { info: `${err}` });
        return reply.send(GeneralHelper.errorResponse(err))
    }
}

module.exports = {
    validateToken
}