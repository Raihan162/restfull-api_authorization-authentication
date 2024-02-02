const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const RegistrationHelper = require('../helpers/registrationHelper');

const addRegistration = async (request, reply) => {
    try {
        const { students_id, courses_id } = request.body;

        const response = await RegistrationHelper.addRegistration(students_id, courses_id);

        return reply
            .status(200)
            .send({
                message: 'Add Registration Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Add Registration Failed!',
                error: error?.message
            });
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
            .status(400)
            .send({
                message: 'Get Registration Failed!',
                error: error?.message
            });
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
        const { students_id, courses_id } = request.body;

        const response = await RegistrationHelper.updateRegistration(id, students_id, courses_id);

        return reply
            .status(200)
            .send({
                message: 'Update Registration Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Update Registration Failed!',
                error: error?.message
            });
    }
};

Router.post('/add', addRegistration);
Router.get('/list', getRegistration);
Router.delete('/delete', deleteRegistration);
Router.patch('/update', updateRegistration);

module.exports = Router;