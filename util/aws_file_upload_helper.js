/**
 * Created by Ankit Verma on 05/17/17.
 */
'use strict';
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('../config/config');
const s3Info = config.get('s3');

const s3 = new aws.S3();

const buildUploader = function() {
  const self = this;

  self.buildUserAvatarUploader = function(path, UserService, FileUploadService, constants) {
    const bucket = s3Info.bucket + '/' + s3Info.env + path;

    return multer({
      storage: multerS3({
        s3: s3,
        bucket: bucket,
        acl: 'public-read',
        contentType: function(req, file, cb) {
          return cb(null, 'image/jpeg');
        },
        key: function(req, file, cb) {
          const userId = req.params.userId;
          const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.'));
          const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
          const fileUploadId = req.body.fileUploadId;

          if (!userId) {
            return cb(new Error('No UserID was provided'));
          }

          return UserService.getUserProfileInfo(userId).then(function(fetchedUser) {
            if (!fetchedUser) {
              return cb(new Error('Could not find the user with given userId to upload picture'));
            }

            if (fileUploadId) {
              return FileUploadService.fetchById(fileUploadId).then(function(fileUpload) {
                if (!fileUpload) {
                  return cb(new Error('No fileUpload found by given fileUploadId'));
                }

                const obj = {
                  userId: userId,
                  updatedAt: new Date(),
                  filename: fileName,
                  fileExt: fileExtension
                };

                if (fileExtension != fileUpload.fileExt) {
                  return FileUploadService.updateFileObject(fileUploadId, obj)
                    .then(function(updateFileUpload) {
                      const newFileName = userId + '/' + updateFileUpload.id + fileExtension;
                      const params = {
                        Bucket: s3Info.bucket + '/' + s3Info.env + constants.USER_IMAGES_S3_PATH,
                        Key: userId + '/' + fileUpload.id + fileUpload.fileExt,
                      };

                      s3.deleteObject(params, function(err) {
                        if (err) {
                          console.log(err, err.stack);
                        }
                        req.fileUploadKey = updateFileUpload.id;
                        return cb(null, newFileName);
                      });
                    });
                }

                return FileUploadService.updateFileObject(fileUploadId, obj)
                  .then(function(updateFileUpload) {
                    let newFileName = userId + '/' + updateFileUpload.id + fileExtension;
                    req.fileUploadKey = updateFileUpload.id;
                    return cb(null, newFileName);
                  });
              });
            }

            // Check if an extended profile was included in the initial fetch of ther user
            // profile. If it does not exist, create an empty one for the user then continue
            if (!fetchedUser.extendedProfile) {
              return UserService.updateProfileInfo({ userId: userId }).then((userWithProfile) => {
                return FileUploadService.insertFileObject(userId,
                  userWithProfile.extendedProfile.id,
                  fileName,
                  fileExtension)
                  .then(function(insertedFile) {
                    let newFileName = userId + '/' + insertedFile.id + fileExtension;
                    req.fileUploadKey = insertedFile.id;
                    return cb(null, newFileName);
                  });
              });
            }

            // The fetchedUser has an extended profile so we are good to just insert the new
            // file object
            return FileUploadService.insertFileObject(userId,
              fetchedUser.extendedProfile.id,
              fileName,
              fileExtension)
              .then(function(insertedFile) {
                let newFileName = userId + '/' + insertedFile.id + fileExtension;
                req.fileUploadKey = insertedFile.id;
                return cb(null, newFileName);
              });
          });
        },
      }),
    });
  };

  return self;
};

module.exports = buildUploader;
