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

const updateStudent = async (name, major, contact, email, dataToken) => {
    try {
        const checkStudent = await db.students.findOne({
            where: {
                id: dataToken.id
            }
        });

        if (!checkStudent) {
            return Promise.reject(Boom.badRequest('STUDENT_NOT_FOUND'));
        };

        await db.students.update({
            name: name ? name : checkStudent?.dataValues?.name,
            major: major ? major : checkStudent?.dataValues?.major,
            contact: contact ? contact : checkStudent?.dataValues?.contact,
            email: email ? email : checkStudent?.dataValues?.email
        }, {
            where: {
                id: checkStudent?.id
            }
        });

        return Promise.resolve([]);
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
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

const changePassword = async (dataToken, old_password, new_password, new_confirm_password) => {
    try {
        const checkStudent = await db.students.findOne({
            where: {
                id: dataToken?.id
            }
        });
        if (!checkStudent) {
            return Promise.reject(Boom.badRequest('STUDENT_NOT_FOUND'))
        };

        if (!old_password || !new_password || !new_confirm_password) {
            return Promise.reject(Boom.badRequest('PLEASE_FILL_ALL_FIELD'))
        };

        const checkPass = __comparePassword(old_password, checkStudent?.password);
        if (!checkPass) {
            return Promise.reject(Boom.badRequest('WRONG_OLD_PASSWORD'));
        };
        if (old_password === new_password) {
            return Promise.reject(Boom.badRequest('NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_THE_OLD_PASSWORD'))
        }
        if (new_password !== new_confirm_password) {
            return Promise.reject(Boom.badRequest('WRONG_CONFIRM_PASSWORD'));
        };

        await db.students.update({
            password: __hashPassword(new_password)
        }, {
            where: {
                id: checkStudent?.id
            }
        });

        await Promise.resolve(true);
    } catch (error) {
        return Promise.reject(GeneralHelper.errorResponse(error));
    }
}

module.exports = {
    getStudentList,
    addStudent,
    updateStudent,
    deleteStudent,
    loginStudent,
    detailStudent,
    changePassword
};