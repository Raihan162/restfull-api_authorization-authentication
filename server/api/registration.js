const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const RegistrationHelper = require('../helpers/registrationHelper');
const GeneralHelper = require('../helpers/generalHelper')
const Middleware = require('../middleware/studentMiddleware')

const addRegistration = async (request, reply) => {
    try {
        const { courses_id } = request.body;
        const dataToken = request.body.studentToken;

        const response = await RegistrationHelper.addRegistration(courses_id, dataToken);

        return reply
            .status(200)
            .send({
                message: 'Add Registration Success!',
                response
            });
    } catch (error) {
        return reply
            .send(GeneralHelper.errorResponse(error));
    }
};

const getRegistration = async (request, reply) => {
    try {
        const response = await RegistrationHelper.getRegistration();

        return reply
            .status(200)
            .send({
                message: 'Get Registration Success!',
                response
            });
    } catch (error) {
        return reply
            .send(GeneralHelper.errorResponse(error));
    }
};

const deleteRegistration = async (request, reply) => {
    try {
        const { id } = request.query;

        const response = await RegistrationHelper.deleteRegistration(id);

        return reply
            .status(200)
            .send({
                message: 'Delete Registration Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Delete Registration Failed!',
                error: error?.message
            });
    }
};

const updateRegistration = async (request, reply) => {
    try {
        const { id } = request.query;
        const { courses_id } = request.body;
        const dataToken = request.body.studentToken;

        const response = await RegistrationHelper.updateRegistration(id, dataToken, courses_id);

        return reply
            .status(200)
            .send({
                message: 'Update Registration Success!',
                response
            });
    } catch (error) {
        return reply.send(GeneralHelper.errorResponse(error));
    }
};

Router.post('/add', Middleware.validateToken, addRegistration);
Router.get('/list', getRegistration);
Router.delete('/delete', deleteRegistration);
Router.patch('/update', Middleware.validateToken, updateRegistration);

module.exports = Router;