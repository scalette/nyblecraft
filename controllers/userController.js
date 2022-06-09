
const {sequelize, UserNew} = require('../models');
const factory = require('./handlerFactory');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { redirect } = require('express/lib/response');
const PDFGenerator = require('pdfkit')
const fs = require('fs')
var stream = require('stream');

const filterObj = (obj, ...allowerdFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowerdFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };

  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images', 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

exports.uploadUserPhoto = upload.single('photo');

exports.createPDF = catchAsync(async (req, res, next) => {
    if (req.file) console.log("got pdf in memory");
    console.log(req.user)
    let theOutput = new PDFGenerator 

    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(fs.createWriteStream('pdfDocument.pdf'))

    // add in a local image and set it to be 250px by 250px
    theOutput.image(req.file.buffer, { fit: [250,250] })
    
    theOutput.text(`\n\n\nUSER FIRST NAME: ${req.user.firstName},\nLAST NAME: ${req.user.lastName},\nEMAIL: ${req.user.email}`, { bold: true,
    })
    
    // write out file
    theOutput.end()

    res.download('./pdfDocument.pdf');

  });


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
    //if (req.file) console.log(filteredBody.pdf = req.file);
    console.log("______end");
    // 2. Update user document
    const {id} = req.user;
    const doc = await UserNew.findByPk(id);
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