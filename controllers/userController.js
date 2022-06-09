
const {sequelize, UserNew} = require('../models');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { redirect } = require('express/lib/response');

const filterObj = (obj, ...allowerdFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowerdFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1. Create erroe if user POST password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates',
          400
        )
      );
    };
    // 2. Filtered out unwanted fields names that are not allowd to be updated
    const filteredBody = filterObj(req.body, 'firstName','lastName', 'email');
    // 2. Update user document
    const {id} = req.user;
    console.log(req.params);
    const doc = await UserNew.findByPk(id);
    console.log(doc);
    doc.set(filteredBody);
    doc.save();
    res.status(200).json({
      status: 'success',
      data: {
        user: doc,
      },
    });
  });

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };

exports.deleteMe = catchAsync(async (req, res, next) => {
    req.body.id = req.user.id;
    next();
  });


exports.getAllUsers = factory.getAll(UserNew);
exports.createUser = factory.createOne(UserNew);
exports.deleteUser = factory.deleteOneById(UserNew);
exports.updateUser = factory.updateOne(UserNew);
exports.getUser = factory.getOne(UserNew);