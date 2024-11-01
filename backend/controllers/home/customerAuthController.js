const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utiles/response')
const { generateOTP } = require('../../utiles/generateOTP')
const { createToken } = require('../../utiles/tokenCreate')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const Otp = require('../../models/OTP')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");


class customerAuthController {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    sendMail = async (email, subject, body) => {
        await this.transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: body
        });
    };
    customer_register = async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || name.trim().length === 0) {
            return responseReturn(res, 400, { error: 'Name is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return responseReturn(res, 400, { error: 'Invalid email format' });
        }

        if (!password || password.length < 6) {
            return responseReturn(res, 400, { error: 'Password must be at least 6 characters long' });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return responseReturn(res, 400, { 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'
            });
        }
    
        try {
            const customer = await customerModel.findOne({ email });
            if (customer) {
                return responseReturn(res, 404, { error: 'Email already exists' });
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'manually'
                });
                await sellerCustomerModel.create({
                    myId: createCustomer.id
                });
                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method
                });
                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                responseReturn(res, 201, { message: 'Register success', token });
            }
        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { message: 'Internal server error' });
        }
    }
    

    customer_login = async (req, res) => {
        const { email, password } = req.body
        try {
            const customer = await customerModel.findOne({ email }).select('+password')
            if (customer) {
                const match = await bcrypt.compare(password, customer.password)
                if (match) {
                    const token = await createToken({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 201, { message: 'Login success', token })
                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    customer_logout = async(req,res)=>{
        res.cookie('customerToken',"",{
            expires : new Date(Date.now())
        })
        responseReturn(res,200,{message : 'Logout success'})
    }
    change_password = async (req, res) => {
        const { email, old_password, new_password } = req.body;

        if (!email || !old_password || !new_password) {
            return responseReturn(res, 400, { error: 'All fields are required' });
        }

        try {
            const customer = await customerModel.findOne({ email }).select('+password');
            if (!customer) {
                return responseReturn(res, 404, { error: 'User not found' });
            }

            const isMatch = await bcrypt.compare(old_password, customer.password);
            if (!isMatch) {
                return responseReturn(res, 400, { error: 'Old password is incorrect' });
            }

            const hashedNewPassword = await bcrypt.hash(new_password, 10);
            customer.password = hashedNewPassword;
            await customer.save();

            responseReturn(res, 200, { message: 'Password updated successfully' });
        } catch (error) {
            console.error(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    };
    // verifyOtp = async (req, res) => {
    //     try {
    //         const { customerId, otp } = req.body;
    //         const customer = await customerModel.findById(customerId);
    //         if (!customer) {
    //             return responseReturn(res, 404, { message: 'Customer not found for OTP verification' });
    //         }

    //         const existingOtp = await Otp.findOne({ user: customer._id });
    //         if (!existingOtp) {
    //             return responseReturn(res, 404, { message: 'OTP not found' });
    //         }

    //         if (existingOtp.expiresAt < new Date()) {
    //             await Otp.findByIdAndDelete(existingOtp._id);
    //             return responseReturn(res, 400, { message: 'OTP has expired' });
    //         }

    //         if (await bcrypt.compare(otp, existingOtp.otp)) {
    //             await Otp.findByIdAndDelete(existingOtp._id);
    //             customer.isVerified = true;
    //             await customer.save();
                
    //             // Send email after successful verification
    //             await sendMail(customer.email, 'Verification Successful', 'Your account has been verified successfully!');
                
    //             return responseReturn(res, 200, { message: 'Customer verified successfully' });
    //         }

    //         responseReturn(res, 400, { message: 'Invalid OTP' });
    //     } catch (error) {
    //         console.log(error);
    //         responseReturn(res, 500, { message: 'Internal server error' });
    //     }
    // }

    // resendOtp = async (req, res) => {
    //     try {
    //         const existingCustomer = await customerModel.findById(req.body.customer);
    //         if (!existingCustomer) {
    //             return res.status(404).json({ message: "Customer not found" });
    //         }

    //         await Otp.deleteMany({ user: existingCustomer._id });

    //         const otp = generateOTP();
    //         const hashedOtp = await bcrypt.hash(otp, 10);

    //         const newOtp = new Otp({
    //             user: existingCustomer._id,
    //             otp: hashedOtp,
    //             expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME)
    //         });
    //         await newOtp.save();

    //         await sendMail(existingCustomer.email, `OTP Verification for Your Account`, `Your OTP is: <b>${otp}</b>.`);

    //         res.status(201).json({ message: "OTP sent" });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: "Error while resending OTP, please try again later" });
    //     }
    // };
    


}

module.exports = new customerAuthController()

