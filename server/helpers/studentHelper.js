const { sequelize } = require('../../models')

const db = require('../../models/index')

const getStudentList = async () => {
    try {
        const response = await db.students.findAll();

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    };
};

const addStudent = async (dataObject) => {
    const { name, major, contact } = dataObject;
    
    try {
        const response = await db.students.create({
            name: name,
            major: major,
            contact: contact
        });

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    };
};

const updateStudent = async (id, name, major, contact) => {
    try {
        const checkStudent = await db.students.findOne({
            where: {
                id: id
            }
        });

        if (!checkStudent) {
            throw new Error('Student doesn`t exist')
        };

        await db.students.update({
            name: name ? name : checkStudent?.dataValues?.name,
            major: major ? major : checkStudent?.dataValues?.major,
            contact: contact ? contact : checkStudent?.dataValues?.contact
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

const deleteStudent = async (id) => {
    try {
        const checkStudent = await db.students.findOne({
            where: {
                id: id
            }
        });

        if (!checkStudent) {
            throw new Error('Student doesn`t exist')
        };

        await db.students.destroy({
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
    getStudentList,
    addStudent,
    updateStudent,
    deleteStudent
};