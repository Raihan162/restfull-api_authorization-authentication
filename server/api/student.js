const Router = require('express').Router();

const Validation = require('../helpers/validationHelper');
const StudentHelper = require('../helpers/studentHelper');

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
        const { id } = request.query;
        const { name, major, contact } = request.body;

        const response = await StudentHelper.updateStudent(id, name, major, contact);

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

Router.get('/list', listStudent);
Router.post('/add', addStudent);
Router.delete('/delete', deleteStudent)
Router.patch('/update', updateStudent)

module.exports = Router;