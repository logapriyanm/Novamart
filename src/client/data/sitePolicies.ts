
export const policyContent = {
    // SUPPORT
    'help-center': {
        title: 'Help Center',
        content: `
            <h3 class="text-lg font-bold mb-2">How can we help you?</h3>
            <p class="mb-4">Welcome to the NovaMart Help Center. Here you can find answers to frequently asked questions and guides on how to use our platform.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Account Issues:</strong> Reset password, update profile, verification status.</li>
                <li><strong>Orders:</strong> Tracking, cancellations, bulk orders.</li>
                <li><strong>Payments:</strong> Escrow process, refund timelines, payment methods.</li>
            </ul>
        `
    },
    'contact-us': {
        title: 'Contact Us',
        content: `
            <h3 class="text-lg font-bold mb-2">Get in Touch</h3>
            <p class="mb-4">Our support team is available 24/7 to assist you.</p>
            <div class="space-y-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="font-bold">Email</p>
                    <p class="text-blue-600">support@novamart.com</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="font-bold">Phone</p>
                    <p class="text-blue-600">+91 1800-NOVAMART</p>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="font-bold">Corporate Office</p>
                    <p>Technopolis Knowledge Park, Mahakali Caves Rd, Andheri East, Mumbai, Maharashtra 400093</p>
                </div>
            </div>
        `
    },
    'report-an-issue': {
        title: 'Report an Issue',
        content: `
            <h3 class="text-lg font-bold mb-2">Report a Technical or Safety Issue</h3>
            <p class="mb-4">If you encounter any technical glitches, security vulnerabilities, or suspicious activity, please report it immediately.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Technical Bug:</strong> Describe the steps to reproduce the error.</li>
                <li><strong>Content Violation:</strong> Report listing inaccuracies or prohibited content.</li>
                <li><strong>User Reporting:</strong> Report suspicious behavior or harassment.</li>
            </ul>
            <p class="mt-4 text-sm text-gray-500">All reports are treated confidentially and reviewed by our Trust & Safety team.</p>
        `
    },
    'dispute-resolution': {
        title: 'Dispute Resolution',
        content: `
            <h3 class="text-lg font-bold mb-2">Fair & Transparent Resolution</h3>
            <p class="mb-4">NovaMart acts as a neutral mediator in disputes between Dealers and Manufacturers.</p>
            <h4 class="font-bold mt-4 mb-2">Process:</h4>
            <ol class="list-decimal pl-5 space-y-2">
                <li><strong>Ticket Creation:</strong> Raise a dispute within 48 hours of delivery for damaged/wrong goods.</li>
                <li><strong>Evidence Submission:</strong> Upload photos/videos of the product and packaging.</li>
                <li><strong>Mediation:</strong> NovaMart admin reviews evidence from both parties.</li>
                <li><strong>Resolution:</strong> Binding decision made (Refund, Replacement, or Claim Rejection) based on evidence.</li>
            </ol>
            <p class="mt-4">Escrow funds are held until the dispute is resolved.</p>
        `
    },
    'service-sla': {
        title: 'Service SLA',
        content: `
            <h3 class="text-lg font-bold mb-2">Service Level Agreement</h3>
            <p class="mb-4">Our commitment to performance and reliability.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Platform Uptime:</strong> 99.9% availability guarantee.</li>
                <li><strong>Support Response:</strong> Initial response within 4 hours for Premium members, 24 hours for Standard.</li>
                <li><strong>Order Processing:</strong> Manufacturers generally acknowledge orders within 24 business hours.</li>
                <li><strong>Escrow Release:</strong> Funds released to Manufacturer T+3 days after successful delivery confirmation.</li>
            </ul>
        `
    },

    // LEGAL
    'privacy-policy': {
        title: 'Privacy Policy',
        content: `
            <h3 class="text-lg font-bold mb-2">Your Data Protection</h3>
            <p class="mb-4">We value your privacy and are committed to protecting your personal data.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Data Collection:</strong> We collect info necessary for transactions, verification, and logistics.</li>
                <li><strong>Data Usage:</strong> Used for order processing, identity verification, and platform improvement.</li>
                <li><strong>Third Parties:</strong> Data shared only with logistics partners and payment gateways as required for service fulfillment.</li>
                <li><strong>Security:</strong> All data is encrypted at rest and in transit.</li>
            </ul>
            <p class="mt-4">For full details, please contact our Data Protection Officer at privacy@novamart.com.</p>
        `
    },
    'terms-of-service': {
        title: 'Platform Terms of Service',
        content: `
            <div class="space-y-6">
                <p class="italic font-bold text-foreground/80 mb-6 text-sm">Welcome to NovaMart. These general terms apply to all participants in our ecosystem to ensure safe and transparent trade.</p>
                
                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">1. Fair Usage Policy</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Users must maintain a high standard of professional conduct. Any attempt to circumvent platform escrow or messaging systems will lead to account suspension."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">2. Account Responsibility</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"You are responsible for all activity on your account. Credentials must be stored securely and never shared with unauthorized third parties."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">3. Privacy & Compliance</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"We adhere to strict data localization and protection laws. By using the platform, you agree to our data processing frameworks for order fulfillment."</p>
                </div>
            </div>
        `
    },
    'terms-manufacturer': {
        title: 'Manufacturer Governance Agreement',
        content: `
            <div class="space-y-6">
                <p class="italic font-bold text-foreground/80 mb-6 text-sm">As a Manufacturer on NovaMart, you are the backbone of our supply chain. These terms govern your production and listing standards.</p>
                
                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">1. Inventory Authenticity</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Manufacturers must only list authentic, certified goods. Listing of counterfeit or substandard items results in immediate permanent ban and forfeiture of pending escrow."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">2. Production SLAs</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"You agree to acknowledge orders within 24 hours and ship within the timeline specified in your product listing. Frequent delays impact your trust score."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">3. Quality Assurance</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"All items must meet BIS/ISO standards as mentioned. You are responsible for return costs if a manufacturing defect is verified by an auditor."</p>
                </div>
            </div>
        `
    },
    'terms-dealer': {
        title: 'Dealer Distribution Agreement',
        content: `
            <div class="space-y-6">
                <p class="italic font-bold text-foreground/80 mb-6 text-sm">Dealers act as our trusted retail partners. These terms ensure fair distribution and customer service standards.</p>
                
                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">1. Retail Pricing Integrity</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Dealers must adhere to MSRP guidelines set by manufacturers. Predatory pricing or price-gouging during shortages is strictly prohibited."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">2. Allocation Management</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Allocated inventory must be moved efficiently. Reselling NovaMart-allocated stock to unauthorized B2B entities is a violation of the partnership."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">3. Post-Sale Support</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Dealers are the first point of contact for end-customers. You must handle initial returns and relay verified defects to the manufacturer through the portal."</p>
                </div>
            </div>
        `
    },
    'terms-customer': {
        title: 'Customer Purchase Agreement',
        content: `
            <div class="space-y-6">
                <p class="italic font-bold text-foreground/80 mb-6 text-sm">Welcome to the NovaMart elite shopping experience. These terms protect your purchases and escrow safety.</p>
                
                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">1. Escrow Protection</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Your payments are kept in a secure escrow layer. Funds are only transferred to the seller after you confirm delivery and quality via the portal."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">2. Refund Eligibility</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Refunds are guaranteed for damaged or incorrect goods if reported within 48 hours. 'Change of mind' returns are subject to a restocking fee."</p>
                </div>

                <div class="space-y-2">
                    <h4 class="font-black uppercase tracking-tight text-foreground italic text-sm">3. Identity Verification</h4>
                    <p class="text-[11px] uppercase tracking-widest text-foreground/60 leading-relaxed italic">"Individuals must provide accurate delivery information. Attempting to use fraudulent payment methods will result in immediate law enforcement reporting."</p>
                </div>
            </div>
        `
    },
    'refund-policy': {
        title: 'Refund Policy',
        content: `
            <h3 class="text-lg font-bold mb-2">Returns & Refunds</h3>
            <p class="mb-4">Policies governing returns and financial reversals.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Return Window:</strong> 7 days from delivery for manufacturing defects.</li>
                <li><strong>Condition:</strong> Items must be unused, in original packaging with seals intact.</li>
                <li><strong>Refund Method:</strong> Processed to the original source payment method within 5-7 business days after return verification.</li>
                <li><strong>Shipping Costs:</strong> NovaMart bears return shipping costs for proven defects. Buyer pays for 'change of mind' returns (if applicable).</li>
            </ul>
        `
    },
    'compliance': {
        title: 'Compliance',
        content: `
            <h3 class="text-lg font-bold mb-2">Regulatory Adherence</h3>
            <p class="mb-4">We operate in full compliance with Indian laws and regulations.</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>GST:</strong> All transactions are GST compliant. Valid GSTIN is mandatory for B2B users.</li>
                <li><strong>FSSAI/BIS:</strong> Products must meet relevant safety standards (BIS certification for electronics).</li>
                <li><strong>Data Localization:</strong> All user data is stored on servers located within India.</li>
                <li><strong>Anti-Money Laundering:</strong> We adhere to strict KYC and AML guidelines for high-value transactions.</li>
            </ul>
        `
    }
};

export type PolicyKey = keyof typeof policyContent;
