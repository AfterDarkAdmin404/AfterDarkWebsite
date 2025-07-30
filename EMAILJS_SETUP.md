# EmailJS Setup Guide

## What is EmailJS?
EmailJS allows you to send emails directly from your website without requiring users to have an email client configured. It's a client-side email service that works with popular email providers.

## Setup Steps:

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```html
Subject: New Contact Form Message - {{subject}}

Hello,

You have received a new message from your website contact form:

**Name:** {{from_name}}
**Email:** {{from_email}}
**Subject:** {{subject}}

**Message:**
{{message}}

---
This message was sent from your website contact form.
```

4. Note down your **Template ID**

### 4. Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

### 5. Update the Contact Form
Replace the placeholder values in `src/app/components/Contact.tsx`:

```typescript
const serviceId = 'YOUR_SERVICE_ID'; // Replace with your actual Service ID
const templateId = 'YOUR_TEMPLATE_ID'; // Replace with your actual Template ID
const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your actual Public Key
```

## Alternative: Simple API Solution

If you prefer not to use EmailJS, you can also create a simple API endpoint. Here's how:

### Option 1: Use a Form Service
- **Formspree**: Free tier available
- **Netlify Forms**: If hosting on Netlify
- **Getform**: Simple form handling

### Option 2: Create Your Own API
Create an API route in your Next.js app:

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Configure your email service here
    const transporter = nodemailer.createTransporter({
      // Your email configuration
    });
    
    await transporter.sendMail({
      from: email,
      to: 'webmaster@joinafterdark.com',
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

## Benefits of EmailJS:
- ✅ **No email client required** - Works on all devices
- ✅ **Direct sending** - Emails sent immediately
- ✅ **Professional** - No popup windows or external apps
- ✅ **Reliable** - Handles delivery and spam protection
- ✅ **Free tier** - 200 emails/month free

## Next Steps:
1. Set up EmailJS account
2. Replace the placeholder credentials in the code
3. Test the form
4. Monitor email delivery in EmailJS dashboard 