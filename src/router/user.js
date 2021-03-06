const express = require('express')
const userController = require('../controllers/user')
const passport = require('passport')
const { body } = require('express-validator')
const timeFormat = require('../utils/date')
const methodOverride = require('../middleware/method-override')

const router = new express.Router()

router.get('/signup', userController.getSignup)
router.get('/login', userController.getLogin)
router.get('/logout', userController.getLogout)
router.get('/resetPW', userController.getResetPassword)
router.get('/newPW/:token', userController.getNewPassword)

router.post(
    '/signup',
    [
        body('username').trim().isLength({ min: 1 }).withMessage('Username must be required!'),
        body('email').trim().isEmail().withMessage('Invalid email address!'),
        body('password').custom(value => {
            const regex = /^\S{8,12}$/
            const PWCheck = value.match(regex)
            if (!PWCheck) {
                throw new Error('Invalid password!')
            }
            // if pass the validation, must return true
            return true
        }),
        body('password__recheck').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password__recheck invalid')
            }
            return true
        }),
    ],
    userController.postSignup
)

//By default, if authentication fails, Passport will respond with a 401 Unauthorized status, and any additional route handlers will not be invoked. If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
router.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/user/login',
        failureFlash: true,
    }),
    (req, res) => {
        const formatDate = timeFormat()
        return res.redirect(`/expense?date=${formatDate}`)
    }
)

router.post(
    '/resetPW',
    [body('email').trim().isEmail().withMessage('Invalid email address!')],
    userController.postResetPassword
)

router.post(
    '/newPW',
    [
        body('password').custom(value => {
            const regex = /^\S{8,12}$/
            const PWCheck = value.match(regex)
            if (!PWCheck) {
                throw new Error('Invalid password!')
            }
            // if pass the validation, must return true
            return true
        }),
        body('password__recheck').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password__recheck invalid')
            }
            return true
        }),
    ],
    methodOverride,
    userController.postNewPassword
)

module.exports = router
