const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const LecturerHelper = require('../helpers/lecturerHelper');

const listLecturer = async (request, reply) => {
    try {
        const response = await LecturerHelper.getLecturerList();

        return reply
            .status(200)
            .send({
                message: 'Get All Lecturer Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Get All Lecturer Failed!',
                error: error?.message
            });
    };
};

const addLecturer = async (request, reply) => {
    try {
        Validation.lecturerAddValidation(request.body);

        const { name, contact } = request.body;

        const response = await LecturerHelper.addLecturer(name, contact);

        return reply
            .status(200)
            .send({
                message: 'Add Lecturer Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Add Lecturer Failed!',
                error: error?.message
            });
    };
};

const deleteLecturer = async (request, reply) => {
    try {
        const { id } = request.query;

        const response = await LecturerHelper.deleteLecturer(id);

        return reply
            .status(200)
            .send({
                message: 'Delete Lecturer Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Delete Lecturer Failed!',
                error: error?.message
            });
    };
};

const updateLecturer = async (request, reply) => {
    try {
        const { id } = request.query;
        const { name, contact } = request.body;

        const response = await LecturerHelper.updateLecturer(id, name, contact);

        return reply
            .status(200)
            .send({
                message: 'Update Lecturer Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Update Lecturer Failed!',
                error: error?.message
            });
    };
};

Router.get('/list', listLecturer);
Router.post('/add', addLecturer);
Router.delete('/delete', deleteLecturer);
Router.patch('/update', updateLecturer);

module.exports = Router;