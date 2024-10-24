const striptModel = require('../../models/stripeModel')
const sellerModel = require('../../models/seller')
const sellerWallet = require('../../models/sellerWallet')
const myShopWallet = require('../../models/myShopWallet')
const withdrawRequest = require('../../models/withdrawRequest')
const { responseReturn } = require('../../utiles/response')
const { mongo: { ObjectId } } = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const stripe = require('stripe')(process.env.stripe_key)

class paymentController {
    create_stripe_connect_account = async (req, res) => {
        
        const { id } = req
        const uid = uuidv4()

        try {
            const stripInfo = await striptModel.findOne({ sellerId: id })

            if (stripInfo) {
                await striptModel.deleteOne({ sellerId: id })
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await striptModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })
            } else {
                const account = await stripe.accounts.create({ type: 'express' })

                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3001/refresh',
                    return_url: `http://localhost:3001/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                })
                await striptModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                })
                responseReturn(res, 201, { url: accountLink.url })
            }
        } catch (error) {
            console.log('stripe connect account create error ' + error.message)
        }
    }

    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params
        const { id } = req
        try {
            const userStripeInfo = await striptModel.findOne({ code: activeCode })
            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                })
                responseReturn(res, 200, { message: 'payment active' })
            } else {
                responseReturn(res, 404, { message: 'payment active failed' })
            }
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal server error' })
        }
    }

    // sumAmount = (data) => {
    //     let sum = 0;

    //     for (let i = 0; i < data.length; i++) {
    //         sum = sum + data[i].amount
    //     }
    //     return sum
    // }

    // get_seller_payment_details = async (req, res) => {
    //     const { sellerId } = req.params

    //     try {
    //         const payments = await sellerWallet.find({ sellerId })

    //         const pendingWithdrawals = await withdrawRequest.find({
    //             $and: [
    //                 {
    //                     sellerId: {
    //                         $eq: sellerId
    //                     }
    //                 }, {
    //                     status: {
    //                         $eq: 'pending'
    //                     }
    //                 }
    //             ]
    //         })

    //         const successWithdrawals = await withdrawRequest.find({
    //             $and: [
    //                 {
    //                     sellerId: {
    //                         $eq: sellerId
    //                     }
    //                 }, {
    //                     status: {
    //                         $eq: 'success'
    //                     }
    //                 }
    //             ]
    //         })

    //         const pendingAmount = this.sumAmount(pendingWithdrawals)
    //         const withdrawalAmount = this.sumAmount(successWithdrawals)
    //         const totalAmount = this.sumAmount(payments)

    //         let availableAmount = 0;

    //         if (totalAmount > 0) {
    //             availableAmount = totalAmount - (pendingAmount + withdrawalAmount)
    //         }
    //         responseReturn(res, 200, {
    //             totalAmount,
    //             pendingAmount,
    //             withdrawalAmount,
    //             availableAmount,
    //             successWithdrawals,
    //             pendingWithdrawals
    //         })

    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // }

    // withdrawal_request = async (req, res) => {
    //     const { amount, sellerId } = req.body
        
    //     try {
    //         const withdrawal = await withdrawRequest.create({
    //             sellerId,
    //             amount: parseInt(amount)
    //         })
    //         responseReturn(res, 200, { withdrawal, message: 'withdrawal request sent' })
    //     } catch (error) {
    //         responseReturn(res, 500, { message: 'Internal server error' })
    //     }
    // }

    // get_payment_request = async (req, res) => {
    //     try {
    //         const withdrawalRequest = await withdrawRequest.find({ status: 'pending' })
    //         responseReturn(res, 200, { withdrawalRequest })
    //     } catch (error) {
    //         responseReturn(res, 500, { message: 'Internal server error' })
    //     }
    // }

    // payment_request_confirm = async (req, res) => {
    //     const { paymentId } = req.body

    //     try {
    //         const payment = await withdrawRequest.findById(paymentId)
    //         const { stripeId } = await striptModel.findOne({
    //             sellerId: new ObjectId(payment.sellerId)
    //         })

    //         await stripe.transfers.create({
    //             amount: payment.amount * 100,
    //             currency: 'usd',
    //             destination: stripeId
    //         })
    //         await withdrawRequest.findByIdAndUpdate(paymentId, { status: 'success' })
    //         responseReturn(res, 200, { payment, message: 'request confirm success' })
    //     } catch (error) {
    //         console.log(error)
    //         responseReturn(res, 500, { message: 'Internal server error' })
    //     }
    // }
}

module.exports = new paymentController()
