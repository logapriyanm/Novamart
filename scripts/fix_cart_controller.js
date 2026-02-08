import fs from 'fs';

const filePath = 'f:/PROJECTS/Novamart/src/server/controllers/cartController.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find the customer lookup block with flexible whitespace/newlines
const lookupRegex = /\/\/ Find customer\s+const customer = await prisma\.customer\.findUnique\(\{\s+where: \{ userId \}\s+\}\);\s+if \(!customer\) \{\s+return res\.status\(404\)\.json\(\{ success: false, error: 'Customer not found' \}\);\s+\}/g;

// Since we have multiple replacements with different logic, we can use the replacer function for index-based logic or just do them one by one if they are distinct enough.
// Actually, they are almost all similar except getCart and syncCart.
// Let's just replace them all with a robust version that handles role check.

const robustFix = `        // Find/Create customer profile
        let customer = req.user.customer;
        
        if (!customer) {
            if (req.user.role === 'CUSTOMER') {
                customer = await prisma.customer.create({
                    data: { userId, name: req.user.email?.split('@')[0] || 'Customer' }
                });
            } else {
                // Determine response based on function context if needed, 
                // but usually for non-customers, we want success:true with empty data for GET/SYNC, and error for others.
                // To keep it simple and safe for all endpoints:
                if (req.method === 'GET' || req.path === '/sync') {
                    return res.json({ success: true, data: { id: null, items: [], itemCount: 0, mergedCount: 0 } });
                }
                return res.status(403).json({ success: false, error: 'Action restricted to customers' });
            }
        }
`;

content = content.replace(lookupRegex, robustFix);

fs.writeFileSync(filePath, content);
console.log('Fixed cartController.js using Regex');
