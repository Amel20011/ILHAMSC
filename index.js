const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');

const handler = require('./handler');
const config = require('./config');

// Delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function startBot() {
    console.log('🚀 Starting Liviaa Astranica Bot with List Messenger...');
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            browser: ['Liviaa List Bot', 'Chrome', '1.0.0'],
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log('\n══════════════════════════════════════');
                console.log('📱 SCAN QR CODE INI DENGAN WHATSAPP');
                console.log('══════════════════════════════════════\n');
                qrcode.generate(qr, { small: true });
            }
            
            if (connection === 'open') {
                console.log('\n✅ BOT TERHUBUNG!');
                console.log(`🤖 Nama: ${sock.user?.name || 'Liviaa Bot'}`);
                console.log(`📱 Mode: List Messenger`);
            }
            
            if (connection === 'close') {
                console.log('❌ Connection closed, reconnecting...');
                setTimeout(startBot, 5000);
            }
        });
        
        // Handle messages with delay
        sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;
            
            // Add 5 second delay before processing
            await delay(5000);
            
            try {
                await handler(sock, msg, config);
            } catch (error) {
                console.error('Error:', error.message);
            }
        });
        
    } catch (error) {
        console.error('Start failed:', error.message);
        setTimeout(startBot, 10000);
    }
}

startBot();
