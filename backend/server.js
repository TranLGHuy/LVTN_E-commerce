const express = require('express')
const {dbConnect} = require('./utiles/db')
const app = express()
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const socket = require('socket.io')
const { error } = require('console')

const server = http.createServer(app)

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}))

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true
    }
})


var allCustomer = []
var allSeller = []

const addUser = (customerId, socketId, userInfo) => {
    const checkUser = allCustomer.some(u => u.customerId === customerId)
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        })
    }
}


const addSeller = (sellerId, socketId, userInfo) => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId)
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        })
    }
}


const findCustomer = (customerId) => {
    return allCustomer.find(c => c.customerId === customerId)
}
const findSeller = (sellerId) => {
    return allSeller.find(c => c.sellerId === sellerId)
}

const remove = (socketId) => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId)
    allSeller = allSeller.filter(c => c.socketId !== socketId)
}

let admin = {}

const removeAdmin = (socketId) => {
    if (admin.socketId === socketId) {
        admin = {}
    }
}

io.on('connection', (soc) => {
    console.log(`User connected with socket ID: ${soc.id}`);

    soc.on('add_user', (customerId, userInfo) => {
        console.log('Adding customer:', { customerId, userInfo });
        addUser(customerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
    });

    soc.on('disconnect', () => {
        console.log(`User disconnected: ${soc.id}`);
        remove(soc.id);
        removeAdmin(soc.id);
        io.emit('activeAdmin', { status: false });
        io.emit('activeSeller', allSeller);
        io.emit('activeCustomer', allCustomer);
    });

    const userExists = allCustomer.some(c => c.socketId === soc.id) || 
    allSeller.some(s => s.socketId === soc.id) || 
    (admin.socketId === soc.id);

    if (userExists) {
    console.log('Removing user with socket ID:', soc.id);
    remove(soc.id);
    removeAdmin(soc.id);
    } else {
    console.log('Socket ID not found:', soc.id);
    }

    // soc.on('add_admin', (adminInfo) => {
    //     delete adminInfo.email
    //     admin = adminInfo
    //     admin.socketId = soc.id
    //     io.emit('activeSeller', allSeller)
    //     io.emit('activeAdmin', { status: true })

    // })
    soc.on('add_admin', (adminInfo) => {
        try {
            if (adminInfo) {
                delete adminInfo.email;
                admin = adminInfo;
                admin.socketId = soc.id;
                io.emit('activeSeller', allSeller);
                io.emit('activeAdmin', { status: true });
            } else {
                throw new Error('adminInfo is undefined');
            }
        } catch (err) {
            console.error('Error in add_admin event:', {
                message: err.message,
                stack: err.stack,
            });
        }
    });
    
    
    soc.on('send_seller_message', (msg) => {
        try {
            const customer = findCustomer(msg.receiverId);
            if (!customer) throw new Error(`Customer with ID ${msg.receiverId} not found`);
            soc.to(customer.socketId).emit('seller_message', msg);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] Error in send_seller_message:`, {
                message: err.message,
                stack: err.stack,
                msg,
            });
        }
    });
    

    soc.on('send_customer_message', (msg) => {
        const seller = findSeller(msg.receiverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg)
        }
    })

    soc.on('send_message_admin_to_seller', msg => {
        const seller = findSeller(msg.receiverId)
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('received_admin_message', msg)
        }
    })


    soc.on('send_message_seller_to_admin', msg => {

        if (admin.socketId) {
            soc.to(admin.socketId).emit('received_seller_message', msg)
        }
    })


    soc.on('disconnect', () => {
        console.log('user disconnect')
        remove(soc.id)
        removeAdmin(soc.id)
        io.emit('activeAdmin', { status: false })
        io.emit('activeSeller', allSeller)
        io.emit('activeCustomer', allCustomer)

    })
})
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api', require('./routes/chatRoutes'))
app.use('/api', require('./routes/dashboard/dashboardIndexRoutes'))
app.use('/api', require('./routes/paymentRoutes'))
app.use('/api',require('./routes/authRoutes'))
app.use('/api', require('./routes/order/orderRoutes'))
app.use('/api', require('./routes/dashboard/categoryRoutes'))
app.use('/api', require('./routes/dashboard/productRoutes'))
app.use('/api', require('./routes/home/cartRoutes'))
app.use('/api', require('./routes/dashboard/sellerRoutes'))
app.use('/api/home',require('./routes/home/homeRoutes'))
app.use('/api', require('./routes/home/customerAuthRoutes'))

app.get('/',(req,res) => res.send('Hello World!'))
const port = process.env.PORT
dbConnect()
server.listen (port, () => console.log(`Server is running on port ${port}!`) )