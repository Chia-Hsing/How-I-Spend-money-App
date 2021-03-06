const express = require('express')
const expenseController = require('../controllers/expense')
const { body } = require('express-validator')
const isAuthenticated = require('../middleware/auth')
const methodOverride = require('../middleware/method-override')
require('../db/mongoose')

const router = new express.Router()

router.get('/', isAuthenticated, expenseController.getDailyExpense)

router.get('/newExpense', expenseController.getNewExpense)

router.get('/edit/:expenseId', expenseController.getEditExpense)

router.post(
    '/newExpense',
    [
        body('name').trim().isLength({ min: 1 }).withMessage('Expense name field is required!'),
        body('amount').trim().isInt({ min: 1 }).withMessage('Amount field must be a positive integer!'),
        // body('date').isISO8601().withMessage('Invalid date value!'),
        body('category')
            .isIn([
                'food',
                'entertaining',
                'clothes',
                'knowledge',
                'transportation',
                'home_supplies',
                'healthcare',
                'housing',
            ])
            .withMessage('Please provide a valid category!'),
    ],
    expenseController.postNewExpense
)

// use methodOverride overwrite the post method to patch method
router.post('/edit/:expenseId', methodOverride, expenseController.patchExpense)

router.delete('/delete/:expenseId', expenseController.deleteExpense)

module.exports = router
