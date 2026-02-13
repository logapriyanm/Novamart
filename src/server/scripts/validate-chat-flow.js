
import { io } from 'socket.io-client';

const BASE_URL = 'http://127.0.0.1:5000/api';
const SOCKET_URL = 'http://127.0.0.1:5000';

async function testChatFlow() {
    console.log('🚀 Starting Chat Flow Validation...');
    const timestamp = Date.now();

    // Helper: Register User
    async function registerUser(role) {
        const user = {
            email: `chat_${role.toLowerCase()}_${timestamp}@test.com`,
            password: 'Password123!',
            role: role,
            phone: (role === 'CUSTOMER' ? '92' : role === 'SELLER' ? '90' : '91') + timestamp.toString().slice(-8),
            ...(role === 'MANUFACTURER' ? {
                companyName: 'Chat Mfg',
                registrationNo: `MFG${timestamp}C`,
                factoryAddress: 'Addr',
                gstNumber: `GST${timestamp}C`,
                bankDetails: { accountNumber: '123', ifscCode: 'ABC' }
            } : {}),
            ...(role === 'SELLER' ? {
                businessName: 'Chat Seller',
                gstNumber: `GST${timestamp}S`,
                businessAddress: 'Addr',
                bankDetails: { accountNumber: '123', ifscCode: 'ABC' }
            } : {}),
            ...(role === 'CUSTOMER' ? { name: 'Chat Customer' } : {})
        };

        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (!data.success) throw new Error(`${role} Reg Failed: ` + JSON.stringify(data));
        return { token: data.data.token, id: data.data.user.id }; // Assuming returns user object or I decode token
    }

    try {
        // 1. Setup Users
        const mfg = await registerUser('MANUFACTURER');
        console.log('✅ Manufacturer Registered');

        // Force Activate Mfg
        const mongoose = await import('mongoose');
        const { User } = await import('../models/index.js');
        const dotenv = await import('dotenv');
        dotenv.config();

        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            await User.updateOne({ _id: mfg.id }, { status: 'ACTIVE' }); // Use ID from reg response if available? 
            // Reg response usually has token and user. Let's verify structure if it fails.
            // But actually I need userId. registerUser returns token.
            // Update registerUser to return id.
        }

        const seller = await registerUser('SELLER');
        console.log('✅ Seller Registered');

        const customer = await registerUser('CUSTOMER');
        console.log('✅ Customer Registered');

        // 2. Create Product (Context for Chat)
        // Seller needs to have a product? Actually Chat contextId can be anything for Pre-Purchase?
        // Let's create a real product to be safe.
        const prodRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mfg.token}` },
            body: JSON.stringify({
                name: `Chat Product ${timestamp}`,
                description: 'Chat Test',
                category: 'Electronics',
                basePrice: 100,
                moq: 1,
                availability: 'IN_STOCK',
                status: 'APPROVED',
                isApproved: true
            })
        });
        const prodData = await prodRes.json();
        if (!prodData.success) throw new Error('Product Create Failed');
        const productId = prodData.data._id;
        console.log(`✅ Product Created: ${productId}`);

        // 3. Customer Creates Chat
        console.log('Test 1: Create Chat (Customer -> Seller)');
        const chatRes = await fetch(`${BASE_URL}/chat/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customer.token}` },
            body: JSON.stringify({
                type: 'PRE_PURCHASE',
                contextId: productId,
                receiverId: seller.id, // Does reg return ID? Check logic below.
                receiverRole: 'SELLER'
            })
        });
        const chatData = await chatRes.json();

        // Note: registerUser needs to return ID.
        // Let's assume auth response is { success: true, data: { token, user: { id: ... } } }
        // If not, I'll need to decode token.
        // Looking at authController: res.status(201).json({ success: true, data: { token, user: { ..., id: user._id } } });
        // So yes, it returns user.id (or _id joined).

        if (!chatData.success) throw new Error('Chat Create Failed: ' + JSON.stringify(chatData));
        const chatId = chatData.data._id;
        console.log(`✅ Chat Created: ${chatId}`);

        // 4. Socket Connection & Messaging
        console.log('Test 2: Socket Messaging');

        const clientSocket = io(SOCKET_URL, {
            auth: { token: customer.token }
        });

        const sellerSocket = io(SOCKET_URL, {
            auth: { token: seller.token }
        });

        await new Promise((resolve, reject) => {
            let connectedCount = 0;
            const checkConnected = () => {
                connectedCount++;
                if (connectedCount === 2) resolve();
            };

            clientSocket.on('connect', () => {
                console.log('🔹 Customer Socket Connected');
                checkConnected();
            });

            sellerSocket.on('connect', () => {
                console.log('🔹 Seller Socket Connected');
                checkConnected();
            });

            clientSocket.on('connect_error', (err) => reject('Client Socket Error: ' + err.message));
            sellerSocket.on('connect_error', (err) => reject('Seller Socket Error: ' + err.message));

            setTimeout(() => reject('Socket Connection Timeout'), 5000);
        });

        // 5. Join Room (Server automatically joins user ID room, but explicitly join chat room?)
        // Server: socket.on('join-room', roomId)
        sellerSocket.emit('join-room', chatId);
        clientSocket.emit('join-room', chatId);

        // Wait a bit for join
        await new Promise(r => setTimeout(r, 500));

        // 6. Send/Receive
        const messageText = `Hello Seller ${timestamp}`;

        const messagePromise = new Promise((resolve, reject) => {
            sellerSocket.on('chat:message', (msg) => {
                if (msg.message === messageText) {
                    console.log('✅ Seller Received Message:', msg.message);
                    resolve();
                }
            });
            setTimeout(() => reject('Message Timeout'), 5000);
        });

        clientSocket.emit('chat:message', {
            chatId,
            message: messageText,
            messageType: 'TEXT'
        });

        await messagePromise;

        // Cleanup
        clientSocket.close();
        sellerSocket.close();

    } catch (error) {
        const fs = await import('fs');
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : 'No stack trace';
        fs.writeFileSync('src/server/scripts/chat_error.log', errorMessage + '\n' + errorStack);
        console.error('❌ Chat Flow Error logged to file.');
        process.exit(1);
    }
    console.log('\n🏁 Chat Flow Validation Completed.');
    process.exit(0);
}

testChatFlow();
