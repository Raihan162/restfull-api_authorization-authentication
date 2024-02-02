const db = require('../../models/index');

const getCourse = async () => {
    try {
        const response = await db.courses.findAll({
            include: {
                model: db.lecturers,
                attributes: ['name', 'contact']
            },
            attributes: ['id', 'title']
        });

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    };
};

const addCourse = async (title, lecturers_id) => {
    try {
        const checkLecturer = await db.lecturers.findOne({
            where: {
                id: lecturers_id
            }
        });

        if (!checkLecturer) {
            throw new Error('Lecturer doesn`t exist');
        };

        await db.courses.create({
            title: title,
            lecturers_id: lecturers_id
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(error);
    };
};

const deleteCourses = async (id) => {
    try {
        const checkCourse = await db.courses.findOne({
            where: {
                id: id
            }
        });

        if (!checkCourse) {
            throw new Error('Course doesn`t exist');
        };

        await db.courses.destroy({
            where: {
                id: id
            }
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(error);
    };
};

const updateCourses = async (id, title, lecturers_id) => {
    try {
        const checkCourse = await db.courses.findOne({
            where: {
                id: id
            }
        });

        if (!checkCourse) {
            throw new Error('Course doesn`t exist');
        };

        if (lecturers_id) {
            const checkLecturer = await db.lecturers.findOne({
                where: {
                    id: lecturers_id
                }
            });

            if (!checkLecturer) {
                throw new Error('Lecturer doesn`t exist');
            };
        };


        await db.courses.update({
            title: title ? title : checkCourse?.dataValues.title,
            lecturers_id: lecturers_id ? lecturers_id : checkCourse?.dataValues.id
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
    getCourse,
    addCourse,
    deleteCourses,
    updateCourses
};