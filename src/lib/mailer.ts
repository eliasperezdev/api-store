import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendOrderEmail = async (toEmail: string, orderId: string, items: any[], total: number) => {
  
  const productsHtml = items.map(item => `
    <li>
      <strong>${item.quantity}x ${item.product ? item.product.name : 'Producto'}</strong> 
      - $${item.price} c/u
    </li>
  `).join('');

  const mailOptions = {
    from: `"Mi Tienda Web 🛒" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `¡Compra Confirmada! Orden #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #2e7d32;">¡Gracias por tu compra! 🎉</h1>
        <p>Hemos recibido tu pago correctamente.</p>
        
        <h3>Resumen del pedido (#${orderId}):</h3>
        <ul>
          ${productsHtml}
        </ul>
        
        <h3>Total Pagado: $${total}</h3>
        
        <hr>
        <p>Esperamos que disfrutes tus productos.</p>
        <a href="${process.env.FRONTEND_URL}">Volver a la tienda</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo enviado a ${toEmail}`);
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
  }
};