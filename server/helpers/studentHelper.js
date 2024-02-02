const Boom = require('boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const db = require('../../models');
const GeneralHelper = require('../helpers/generalHelper');

const jwtSecretToken = 'super_strong_key';
const jwtExpiresIn = '24h';
const salt = bcrypt.genSaltSync(10);

// eslint-disable-next-line arrow-body-style
const __hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

// eslint-disable-next-line arrow-body-style
const __comparePassword = (payloadPass, dbPass) => {
    return bcrypt.compareSync(payloadPass, dbPass);
}

// eslint-disable-next-line arrow-body-style
const __generateToken = (data) => {
    return jwt.sign(data, jwtSecretToken, { expiresIn: jwtExpiresIn });
}

const getStudentList = async () => {
    try {
        const response = await db.students.findAll();

        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error);
    };
};

const addStudent = async (dataObject) => {
    const { name, major, contact, email, password } = dataObject;

    try {
        const checkEmail = await db.students.findOne({
            where: { email }
        });
        if (!_.isEmpty(checkEmail)) {
            return Promise.reject(Boom.badRequest('Email already registered'))
        };

        const hashedPass = __hashPassword(password);

        await db.students.create({
            name,
            major,
            contact,
            email,
            password: hashedPass
        });

        return Promise.resolve(true);
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

const loginStudent = async (email, password) => {
    try {
        const student = await db.students.findOne({
            where: { email }
        });
        if (_.isEmpty(student)) {
            return Promise.reject(Boom.notFound('STUDENT_NOT_FOUND'));
        };

        const isPassMatched = __comparePassword(password, student.password);
        console.log(isPassMatched)
        if (!isPassMatched) {
            return Promise.reject(Boom.badRequest('WRONG_CREDENTIALS'));
        };

        const token = __generateToken({
            id: student.id
        })

        return Promise.resolve({ token })
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
    }
};

const detailStudent = async (dataToken) => {
    try {
        const student = await db.students.findOne({
            where: {
                id: dataToken.id
            },
            attributes: { exclude: ['password'] }
        });
        if (!student) {
            return Promise.reject(Boom.badRequest('STUDENT_NOT_FOUND'))
        }

        return Promise.resolve(student);
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
    }
};

module.exports = {
    getStudentList,
    addStudent,
    updateStudent,
    deleteStudent,
    loginStudent,
    detailStudent
};