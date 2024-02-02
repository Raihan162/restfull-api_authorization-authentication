const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const StudentHelper = require('../helpers/studentHelper');
const GeneralHelper = require('../helpers/generalHelper');
const Middleware = require('../middleware/studentMiddleware');

const listStudent = async (request, reply) => {
    try {
        const response = await StudentHelper.getStudentList()

        return reply
            .status(200)
            .send({
                message: 'Get All Student Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Get All Student Failed!',
                error: error?.message
            });
    }
}

const addStudent = async (request, reply) => {
    try {
        Validation.studentAddValidation(request.body);

        const response = await StudentHelper.addStudent(request.body);

        return reply
            .status(200)
            .send({
                message: 'Add Student Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Add Student Failed!',
                error: error?.message
            });
    }
};

const deleteStudent = async (request, reply) => {
    try {
        const { id } = request.query;

        const response = await StudentHelper.deleteStudent(id);

        return reply
            .status(200)
            .send({
                message: 'Delete Student Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Delete Student Failed!',
                error: error?.message
            });
    }
};

const updateStudent = async (request, reply) => {
    try {
        const { name, major, contact, email } = request.body;
        const dataToken = request.body.studentToken;

        const response = await StudentHelper.updateStudent(name, major, contact, email, dataToken);

        return reply
            .status(200)
            .send({
                message: 'Update Student Success!',
                response
            });
    } catch (error) {
        return reply
            .status(400)
            .send({
                message: 'Update Student Failed!',
                error: error?.message
            });
    }
};

const loginStudent = async (request, reply) => {
    try {

        const { email, password } = request.body;
        const response = await StudentHelper.loginStudent(email, password);

        return reply.send({
            message: 'Login Success!',
            response
        });
    } catch (err) {
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const getStudentByID = async (request, reply) => {
    try {
        const dataToken = request.body.studentToken;
        const response = await StudentHelper.detailStudent(dataToken);

        return reply.send({
            message: 'Get Detail Student Succeess!',
            response
        })
    } catch (err) {
        return reply.send(GeneralHelper.errorResponse(err));
    }
};

const changePassword = async (request, reply) => {
    try {
        const { old_password, new_password, new_confirm_password } = request.body;
        const dataToken = request.body.studentToken;
        const response = await StudentHelper.changePassword(dataToken, old_password, new_password, new_confirm_password);

        return reply.send({
            message: 'Change Password Success!',
            response
        })
    } catch (err) {
        return reply.send(GeneralHelper.errorResponse(err));
    }
}

Router.get('/list', listStudent);
Router.post('/register', addStudent);
Router.delete('/delete', deleteStudent);
Router.patch('/update', Middleware.validateToken, updateStudent);
Router.post('/login', loginStudent);
Router.get('/detail-student', Middleware.validateToken, getStudentByID);
Router.patch('/change-password', Middleware.validateToken, changePassword)

module.exports = Router;