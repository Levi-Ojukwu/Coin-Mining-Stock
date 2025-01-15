// 'use server'

// import nodemailer from 'nodemailer'

// export async function sendEmail(formData: {
//   name: string
//   email: string
//   subject: string
//   message: string
// }) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   })

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: process.env.OWNER_EMAIL,
//     subject: `New message from ${formData.name}: ${formData.subject}`,
//     text: `
//       Name: ${formData.name}
//       Email: ${formData.email}
//       Subject: ${formData.subject}
//       Message: ${formData.message}
//     `,
//   }

//   try {
//     await transporter.sendMail(mailOptions)
//   } catch (error) {
//     console.error('Error sending email:', error)
//     throw new Error('Failed to send email')
//   }
// }