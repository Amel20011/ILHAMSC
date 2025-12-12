const fs = require('fs-extra');

async function handler(sock, msg, config) {
    try {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || from;
        const isGroup = from.endsWith('@g.us');
        
        // Get message text
        let body = '';
        const message = msg.message;
        
        if (message.conversation) {
            body = message.conversation;
        } else if (message.extendedTextMessage?.text) {
            body = message.extendedTextMessage.text;
        }
        
        console.log(`[${new Date().toLocaleTimeString()}] Message: ${body.substring(0, 50)}`);
        
        // Check if it's a list response
        if (message.listResponseMessage) {
            const selectedId = message.listResponseMessage.singleSelectReply.selectedRowId;
            await handleListResponse(sock, from, sender, selectedId, config);
            return;
        }
        
        // Auto send list menu for new messages
        if (!isGroup) {
            await sendListMenu(sock, from, config);
        }
        
    } catch (error) {
        console.error('Handler Error:', error.message);
    }
}

// Function to send List Menu
async function sendListMenu(sock, from, config) {
    const listMessage = {
        title: "Menu Utama Liviaa",
        text: "Selamat datang! Silakan pilih menu di bawah ini untuk memulai.",
        footer: "Pilih salah satu opsi di atas.",
        buttonText: "Pilih Menu",
        sections: [
            {
                title: "Pilihan Bantuan",
                rows: [
                    {
                        title: "OWNER",
                        description: "Informasi kontak pemilik.",
                        rowId: "OWNER_ID"
                    },
                    {
                        title: "SCRIPT",
                        description: "Daftar script/fitur yang tersedia.",
                        rowId: "SCRIPT_ID"
                    },
                    {
                        title: "INFORMASI",
                        description: "Informasi umum dan layanan.",
                        rowId: "INFORMASI_ID"
                    },
                    {
                        title: "MENUALL",
                        description: "Tampilkan semua menu dan produk.",
                        rowId: "MENUALL_ID"
                    },
                    {
                        title: "CARA MENGGUNAKAN",
                        description: "Panduan penggunaan bot.",
                        rowId: "CARA_MENGGUNAKAN_ID"
                    },
                    {
                        title: "Chat CS Halo Livia",
                        description: "Hubungi customer service.",
                        rowId: "CHAT_CS_ID"
                    }
                ]
            }
        ]
    };
    
    try {
        await sock.sendMessage(from, {
            text: listMessage.text,
            footer: listMessage.footer,
            title: listMessage.title,
            buttonText: listMessage.buttonText,
            sections: listMessage.sections
        });
    } catch (error) {
        console.error('Error sending list:', error.message);
        // Fallback to simple text
        await sock.sendMessage(from, {
            text: `🤖 ${config.botName}\n\nKetik:\n• menu - Tampilkan menu\n• owner - Info pemilik\n• script - Lihat produk`
        });
    }
}

// Handle List Response
async function handleListResponse(sock, from, sender, rowId, config) {
    console.log(`List selected: ${rowId}`);
    
    switch(rowId) {
        case 'OWNER_ID':
            await showOwner(sock, from, config);
            break;
            
        case 'SCRIPT_ID':
            await showProducts(sock, from, config);
            break;
            
        case 'INFORMASI_ID':
            await showInfo(sock, from, config);
            break;
            
        case 'MENUALL_ID':
            await showAllMenu(sock, from, config);
            break;
            
        case 'CARA_MENGGUNAKAN_ID':
            await showTutorial(sock, from, config);
            break;
            
        case 'CHAT_CS_ID':
            await showCS(sock, from, config);
            break;
            
        default:
            await sock.sendMessage(from, { text: '❌ Opsi tidak dikenali' });
    }
}

// Handler functions for each menu option
async function showOwner(sock, from, config) {
    const ownerInfo = `👑 *INFORMASI OWNER*\n\n` +
                     `*Nama:* Liviaa Astranica\n` +
                     `*WhatsApp:* +1 (365) 870-0681\n` +
                     `*Instagram:* @liviaastranica\n` +
                     `*Store:* Liviaa Astranica Store\n\n` +
                     `*Jam Operasional:*\n08:00 - 22:00 WIB`;
    
    await sock.sendMessage(from, { text: ownerInfo });
}

async function showProducts(sock, from, config) {
    const products = config.getProducts();
    
    let productList = '🛍️ *DAFTAR PRODUK*\n\n';
    products.forEach((product, index) => {
        productList += `[${index + 1}]. ${product.name} (${product.stock})\n`;
        productList += `   💰 Rp ${product.price.toLocaleString()}\n`;
        productList += `   📝 ${product.description}\n\n`;
    });
    
    productList += `📞 *Cara Order:*\n1. Pilih produk yang diinginkan\n2. Hubungi CS untuk order\n3. Transfer pembayaran\n4. Produk dikirim`;
    
    await sock.sendMessage(from, { text: productList });
}

async function showInfo(sock, from, config) {
    const info = `📢 *INFORMASI TOKO*\n\n` +
                `*Nama Toko:* Liviaa Astranica Store\n` +
                `*Layanan:* Jual Akun Premium Digital\n` +
                `*Produk:* Software, Streaming, VPN, dll\n` +
                `*Metode Bayar:* QRIS, Transfer Bank, E-Wallet\n` +
                `*Garansi:* Replace jika ada masalah\n` +
                `*Jam Layanan:* 08:00 - 22:00 WIB`;
    
    await sock.sendMessage(from, { text: info });
}

async function showAllMenu(sock, from, config) {
    const allMenu = `📋 *SEMUA MENU & PRODUK*\n\n` +
                   `*PRODUK TERLARIS:*\n` +
                   `1. CAPCUT PRO - Rp 10.000 (Stok: 193)\n` +
                   `2. ALIGHT MOTION PREMIUM - Rp 15.000 (Stok: 16)\n` +
                   `3. CHATGPT PLUS - Rp 25.000 (Stok: 32)\n` +
                   `4. VIU PREMIUM - Rp 12.000 (Stok: 94)\n` +
                   `5. ZOOM PRO - Rp 25.000 (Stok: 11)\n\n` +
                   `*LAYANAN:*\n` +
                   `• Jual Akun Premium Digital\n` +
                   `• Garansi Replace\n` +
                   `• Support 24/7\n` +
                   `• Pembayaran Aman\n\n` +
                   `*CARA ORDER:*\n` +
                   `1. Pilih produk\n` +
                   `2. Hubungi CS\n` +
                   `3. Transfer pembayaran\n` +
                   `4. Terima produk`;
    
    await sock.sendMessage(from, { text: allMenu });
}

async function showTutorial(sock, from, config) {
    const tutorial = `📖 *CARA MENGGUNAKAN BOT*\n\n` +
                    `1. *PILIH MENU:* Klik "Pilih Menu" atau ketik apa saja\n` +
                    `2. *LIHAT PRODUK:* Pilih "SCRIPT" untuk lihat produk\n` +
                    `3. *HUBUNGI CS:* Pilih "Chat CS Halo Livia" untuk order\n` +
                    `4. *BAYAR:* Transfer ke rekening yang diberikan CS\n` +
                    `5. *TERIMA PRODUK:* CS akan kirim akun setelah bayar\n\n` +
                    `*NOTE:*\n` +
                    `• Semua produk digital dikirim via chat\n` +
                    `• Garansi replace jika ada masalah\n` +
                    `• Tidak menerima refund/tukar produk`;
    
    await sock.sendMessage(from, { text: tutorial });
}

async function showCS(sock, from, config) {
    const csInfo = `💬 *CUSTOMER SERVICE*\n\n` +
                  `*CS 1:* +1 (365) 870-0681\n` +
                  `*Instagram:* @liviaastranica\n` +
                  `*Jam Operasional:* 08:00 - 22:00 WIB\n\n` +
                  `*LAYANAN CS:*\n` +
                  `• Informasi produk\n` +
                  `• Proses order\n` +
                  `• Konfirmasi pembayaran\n` +
                  `• Pengiriman produk\n` +
                  `• Garansi & komplain`;
    
    await sock.sendMessage(from, { text: csInfo });
}

module.exports = handler;
