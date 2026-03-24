const sqlite3 = require('sqlite3').verbose();
const { mongoose, User, Address, Product, Order } = require('./database');
const path = require('path');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const sqlite = new sqlite3.Database(dbPath);

async function migrateData() {
    console.log("Starting data migration from SQLite to MongoDB Atlas...");
    
    sqlite.all('SELECT * FROM users', async (err, users) => {
        if (err) return console.error('SQLite Users Error:', err);
        
        const userMap = {}; 
        
        for (const u of users) {
             const existingUser = await User.findOne({ email: u.email });
             let newUserId;
             try {
                 if (!existingUser) {
                     const newUser = await User.create({
                         email: u.email,
                         password_hash: u.password_hash,
                         role: u.role
                     });
                     newUserId = newUser._id;
                 } else {
                     newUserId = existingUser._id;
                 }
             } catch (err) {
                 if (err.code === 11000) {
                     const existing = await User.findOne({ email: u.email });
                     newUserId = existing._id;
                 } else {
                     throw err;
                 }
             }
             userMap[u.id] = newUserId;
        }
        console.log("Migrated " + users.length + " users.");
        
        sqlite.all('SELECT * FROM addresses', async (err, addresses) => {
            if (err) return console.error('SQLite Addresses Error:', err);
            
            for (const a of addresses) {
                const mongoUserId = userMap[a.user_id];
                if (mongoUserId) {
                    await Address.create({
                        user_id: mongoUserId,
                        fullName: a.fullName,
                        phone: a.phone,
                        street: a.street,
                        city: a.city,
                        state: a.state,
                        pincode: a.pincode
                    });
                }
            }
            console.log("Migrated " + addresses.length + " addresses.");
            
            sqlite.all('SELECT * FROM orders', async (err, orders) => {
                if (err) return console.error('SQLite Orders Error:', err);
                
                sqlite.all('SELECT * FROM order_items', async (err, items) => {
                    if (err) return console.error('SQLite Order Items Error:', err);
                    
                    for (const o of orders) {
                         const orderItems = items.filter(i => i.order_id === o.id).map(i => ({
                             product_id: i.product_id,
                             product_name: i.product_name,
                             price: i.price,
                             quantity: i.quantity
                         }));
                         
                         const newOrder = new Order({
                             email: o.email,
                             total: o.total,
                             payment_method: o.payment_method,
                             status: o.status,
                             shipping_address: o.shipping_address,
                             user_id: userMap[o.user_id] || undefined,
                             items: orderItems
                         });
                         await newOrder.save();
                    }
                    console.log("Migrated " + orders.length + " orders.");
                    console.log("Migration complete! All older accounts, addresses, and orders have been sent to MongoDB Atlas.");
                    mongoose.disconnect();
                    sqlite.close();
                });
            });
        });
    });
}
migrateData();
