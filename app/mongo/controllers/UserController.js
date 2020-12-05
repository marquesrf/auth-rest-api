// packages imports
import MongoModels from "../db/models/index";
import { MessageProvider, Messages } from "../../../core";
import UserModel from "../db/models/UserModel";

const User = MongoModels.UserModel;

/**
 * Check for required properties
 * @param {*} request
 * @return {boolean}
 */
const isValidUser = (request) => {
  if (request) {
    const email = request.body.email || "";
    const username = request.body.username || "";
    const password = request.body.password || "";
    const firstName = request.body.firstName || "";
    const lastName = request.body.lastName || "";
    if (email && username && password && firstName && lastName) {
      return true;
    }
  }
  return false;
};

/**
 * Retrieve user from request
 * @param {*} request
 * @return {object} user or null
 */
const userFromRequest = (request) => {
  if (isValidUser(request)) {
    return new User(request.body);
  }
  return null;
};

/**
 * Retrieve all users
 * @param {*} request
 * @param {*} response
 */
const find = (request, response) => {
  User.find((error, users) => {
    if (!error) {
      response.status(200).send({
        success: true,
        users: users,
      });
    } else {
      response.status(401).send({
        success: false,
        message: error.message,
      });
    }
  });
};

/**
 * Add user if it does not exists
 * @param {*} request
 * @param {*} response
 * @return {*}
 */
const addIfNotExists = (request, response) => {
  // insert only if required data is present
  if (isValidUser(request)) {
    const email = request.body.email || "";
    User.findOne({ email: email }, (error, user) => {
      // insert only if user does not exists
      if (error) {
        response.status(401).send({
          success: false,
          message: error.message,
        });
      } else {
        if (!user) {
          const userModel = userFromRequest(request);
          userModel.save((error) => {
            if (error) {
              response.status(401).send({
                success: false,
                message: error.message,
              });
            } else {
              response.status(200).send({
                success: true,
                users: userModel,
              });
            }
          });
        } else {
          response.status(401).send({
            success: false,
            message: MessageProvider.messageByKey(
              Messages.KEYS.USER_ALREADY_EXISTS
            ),
          });
        }
      }
    });
  } else {
    response.status(401).send({
      success: false,
      message: MessageProvider.messageByKey(
        Messages.KEYS.VERIFY_REQUIRED_INFORMATION
      ),
    });
  }
};

/**
 * Update user if exists
 * @param {*} request
 * @param {*} response
 */
const updateIfExists = (request, response) => {
  // TODO
};

/**
 * Delete user if exists
 * @param {*} request
 * @param {*} response
 */
const deleteIfExists = (request, response) => {
  // TODO
};

const UserController = {
  userFromRequest,
  isValidUser,
  find,
  addIfNotExists,
  updateIfExists,
  deleteIfExists,
};

export default UserController;
