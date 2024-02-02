const db = require('../../models/index')

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

const addRegistration = async (students_id, courses_id) => {
    try {
        const checkStudent = await db.students.findOne({
            where: {
                id: students_id
            }
        });

        if (!checkStudent) {
            throw new Error('Student doesn`t exist')
        };

        const checkCourse = await db.courses.findOne({
            where: {
                id: courses_id
            }
        });

        if (!checkCourse) {
            throw new Error('Course doesn`t exist');
        };

        const response = await db.registrations.create({
            students_id: students_id,
            courses_id: courses_id
        })

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
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
            throw new Error('Registration doesn`t exist');
        };

        await db.registrations.destroy({
            where: {
                id: id
            }
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(error);
    };
};

const updateRegistration = async (id, students_id, courses_id) => {
    try {
        const checkRegistration = await db.registrations.findOne({
            where: {
                id: id
            }
        });

        if (!checkRegistration) {
            throw new Error('Registration ID doesn`t exist');
        };

        if (students_id) {
            const checkStudent = await db.students.findOne({
                where: {
                    id: students_id
                }
            });

            if (!checkStudent) {
                throw new Error('Student doesn`t exist')
            };
        };


        if (courses_id) {
            const checkCourse = await db.courses.findOne({
                where: {
                    id: courses_id
                }
            });

            if (!checkCourse) {
                throw new Error('Course doesn`t exist');
            };
        };

        await db.registrations.update({
            students_id: students_id ? students_id : checkRegistration?.dataValues.id,
            courses_id: courses_id ? courses_id : checkRegistration?.dataValues.id
        }, {
            where: {
                id: id
            }
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(error);
    };
};

module.exports = {
    getRegistration,
    addRegistration,
    deleteRegistration,
    updateRegistration
};