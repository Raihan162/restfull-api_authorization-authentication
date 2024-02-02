const Boom = require('boom');
const db = require('../../models/index')

const GeneralHelper = require('../helpers/generalHelper');

const getRegistration = async () => {
    try {
        const response = await db.registrations.findAll({
            include: [
                {
                    model: db.students,
                    attributes: ['name', 'major', 'contact']
                },
                {
                    model: db.courses,
                    attributes: ['title'],
                    include: {
                        model: db.lecturers,
                        attributes: ['name', 'contact']
                    }
                }
            ],
            attributes: ['id', 'registration_date']
        });

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    };
};

const addRegistration = async (courses_id, dataToken) => {
    try {

        const checkStudent = await db.students.findOne({
            where: {
                id: dataToken.id
            }
        });

        if (!checkStudent) {
            return Promise.reject(Boom.badRequest('STUDENT_NOT_FOUND'))
        };

        const checkCourse = await db.courses.findOne({
            where: {
                id: courses_id
            }
        });

        if (!checkCourse) {
            return Promise.reject(Boom.badRequest('COURSE_NOT_FOUND'))
        };

        const response = await db.registrations.create({
            students_id: checkStudent.id,
            courses_id: courses_id
        })

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
    };
};

const deleteRegistration = async (id) => {
    try {
        const checkRegistration = await db.registrations.findOne({
            where: {
                id: id
            }
        });

        if (!checkRegistration) {
            return Promise.reject(Boom.badRequest('REGISTRATION_NOT_FOUND'));
        };

        await db.registrations.destroy({
            where: {
                id: id
            }
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
    };
};

const updateRegistration = async (id, dataToken, courses_id) => {
    try {
        const checkRegistration = await db.registrations.findOne({
            where: {
                id: id
            }
        });

        if (!checkRegistration) {
            return Promise.reject(Boom.badRequest('REGISTRATION_NOT_FOUND'));
        };

        const checkStudent = await db.students.findOne({
            where: {
                id: dataToken?.id
            }
        });

        if (!checkStudent) {
            return Promise.reject(Boom.badRequest('STUDENT_NOT_FOUND'));
        };


        if (courses_id) {
            const checkCourse = await db.courses.findOne({
                where: {
                    id: courses_id
                }
            });

            if (!checkCourse) {
                return Promise.reject(Boom.badRequest('COURSE_NOT_FOUND'));
            };
        };

        await db.registrations.update({
            students_id: checkRegistration?.dataValues.id,
            courses_id: courses_id ? courses_id : checkRegistration?.dataValues.id
        }, {
            where: {
                id: id
            }
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
    };
};

module.exports = {
    getRegistration,
    addRegistration,
    deleteRegistration,
    updateRegistration
};