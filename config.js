const fs = require('fs-extra');
const path = require('path');

class Config {
    constructor() {
        this.ownerNumber = '13658700681@s.whatsapp.net';
        this.botName = 'Liviaa Astranica';
        this.csNumber = '13658700681@s.whatsapp.net';
        
        // Database path
        this.dbPath = path.join(__dirname, 'database');
        this.initDB();
    }
    
    initDB() {
        if (!fs.existsSync(this.dbPath)) {
            fs.mkdirSync(this.dbPath, { recursive: true });
        }
        
        const files = {
            'users.json': [],
            'products.json': [
                {
                    "id": "PROD001",
                    "name": "ALIGHT MOTION PREMIUM",
                    "price": 15000,
                    "stock": 16,
                    "description": "Alight Motion Premium - Full fitur tanpa watermark"
                },
                {
                    "id": "PROD002",
                    "name": "CANVA LIFETIME",
                    "price": 20000,
                    "stock": 8,
                    "description": "Canva Lifetime - Akun Canva Pro seumur hidup"
                },
                {
                    "id": "PROD003", 
                    "name": "CANVA PRO",
                    "price": 15000,
                    "stock": 13,
                    "description": "Canva Pro - Akun Canva Pro 1 tahun"
                },
                {
                    "id": "PROD004",
                    "name": "CAPCUT PRO",
                    "price": 10000,
                    "stock": 193,
                    "description": "CapCut Pro - Full fitur premium"
                },
                {
                    "id": "PROD005",
                    "name": "CAPCUT PRO HEAD",
                    "price": 12000,
                    "stock": 20,
                    "description": "CapCut Pro Head - Versi terbaru"
                },
                {
                    "id": "PROD006",
                    "name": "CHATGPT PLUS",
                    "price": 25000,
                    "stock": 32,
                    "description": "ChatGPT Plus - Akses premium AI"
                },
                {
                    "id": "PROD007",
                    "name": "PICSART PRO",
                    "price": 15000,
                    "stock": 4,
                    "description": "PicsArt Pro - Editor foto premium"
                },
                {
                    "id": "PROD008",
                    "name": "PRIME VIDEO",
                    "price": 12000,
                    "stock": 4,
                    "description": "Prime Video - Akun streaming premium"
                },
                {
                    "id": "PROD009",
                    "name": "SCRIBD PREMIUM",
                    "price": 10000,
                    "stock": 0,
                    "description": "Scribd Premium - Akses ebook unlimited"
                },
                {
                    "id": "PROD010",
                    "name": "SPOTIFY PREMIUM",
                    "price": 15000,
                    "stock": 0,
                    "description": "Spotify Premium - Musik tanpa iklan"
                },
                {
                    "id": "PROD011",
                    "name": "VIU PREMIUM",
                    "price": 12000,
                    "stock": 94,
                    "description": "Viu Premium - Streaming drama Asia"
                },
                {
                    "id": "PROD012",
                    "name": "VPN EXPRESS",
                    "price": 20000,
                    "stock": 4,
                    "description": "VPN Express - VPN premium cepat"
                },
                {
                    "id": "PROD013",
                    "name": "VPN HMA",
                    "price": 18000,
                    "stock": 4,
                    "description": "VPN HMA - VPN aman dan private"
                },
                {
                    "id": "PROD014",
                    "name": "YOUTUBE PREMIUM",
                    "price": 20000,
                    "stock": 0,
                    "description": "YouTube Premium - No ads + YouTube Music"
                },
                {
                    "id": "PROD015",
                    "name": "ZOOM PRO",
                    "price": 25000,
                    "stock": 11,
                    "description": "Zoom Pro - Meeting unlimited peserta"
                }
            ],
            'orders.json': []
        };
        
        for (const [file, data] of Object.entries(files)) {
            const filePath = path.join(this.dbPath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeJsonSync(filePath, data, { spaces: 2 });
            }
        }
    }
    
    // Simple file operations
    readJSON(file) {
        try {
            return fs.readJsonSync(path.join(this.dbPath, file));
        } catch {
            return file.includes('json') ? [] : {};
        }
    }
    
    getUsers() { return this.readJSON('users.json'); }
    saveUsers(users) { 
        fs.writeJsonSync(path.join(this.dbPath, 'users.json'), users, { spaces: 2 });
    }
    
    getUser(jid) {
        return this.getUsers().find(u => u.jid === jid);
    }
    
    registerUser(jid, name) {
        const users = this.getUsers();
        let user = users.find(u => u.jid === jid);
        
        if (!user) {
            user = { jid, name, verified: true };
            users.push(user);
            this.saveUsers(users);
        }
        
        return user;
    }
    
    isRegistered(jid) {
        const user = this.getUser(jid);
        return user && user.verified;
    }
    
    getProducts() { return this.readJSON('products.json'); }
    getOrders() { return this.readJSON('orders.json'); }
    saveOrders(orders) { 
        fs.writeJsonSync(path.join(this.dbPath, 'orders.json'), orders, { spaces: 2 });
    }
    
    isOwner(jid) {
        return jid === this.ownerNumber;
    }
}

module.exports = new Config();
