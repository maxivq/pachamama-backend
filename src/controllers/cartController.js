import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const STORE_PHONE = '5493764809283';

// Obtener carrito por ID de sesión
const getCart = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    let cart = await Cart.findOne({ sessionId }).populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

// Añadir productos al carrito
const addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity } = req.body;
    
    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    // Encontrar o crear carrito
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }
    
    // Verificar si el producto ya está en el carrito
    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      // Si ya existe, actualizar cantidad
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Si no existe, añadir nuevo item
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    
    // Retornar el carrito con datos de productos
    cart = await Cart.findOne({ sessionId }).populate('items.product');
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

// Servicio de WhatsApp para finalizar compra
const checkoutToWhatsApp = async (req, res) => {
  try {
    const { sessionId, customerName, customerAddress, customerPhone, additionalInfo } = req.body;
    
    const cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Carrito vacío'
      });
    }
    
    // Construir mensaje para WhatsApp
    let message = `🛍️ *NUEVO PEDIDO - PACHAMAMA* 🛍️\n\n`;
    
    // Información del cliente
    if (customerName) {
      message += `*Cliente:* ${customerName}\n`;
    }
    
    if (customerAddress) {
      message += `*Dirección:* ${customerAddress}\n`;
    }
    
    if (customerPhone) {
      message += `*Teléfono:* ${customerPhone}\n`;
    }
    
    message += `\n*PRODUCTOS SELECCIONADOS:*\n`;
    
    let total = 0;
    
    // Formato de cada producto en el carrito
    cart.items.forEach((item, index) => {
      const subtotal = item.quantity * item.product.price;
      total += subtotal;
      message += `${index + 1}. *${item.product.title}*\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio: $${item.product.price.toFixed(2)}\n`;
      message += `   - Subtotal: $${subtotal.toFixed(2)}\n\n`;
    });
    
    // Información del total
    message += `\n*TOTAL:* $${total.toFixed(2)}\n\n`;
    
    // Información adicional
    if (additionalInfo) {
      message += `*Comentarios:* ${additionalInfo}\n\n`;
    }
    
    message += `Gracias por tu compra en Pachamama! 🙏\n`;
    
    // URL de WhatsApp con mensaje predefinido dirigido al número de la tienda
    const whatsappUrl = `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(message)}`;
    
    res.status(200).json({
      success: true,
      data: {
        whatsappUrl,
        message
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor',
      message: error.message
    });
  }
};

// Eliminar un producto del carrito
const removeFromCart = async (req, res) => {
  try {
    const { sessionId, productId } = req.body;
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Carrito no encontrado'
      });
    }
    
    // Filtrar el producto a eliminar
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    
    // Devolver el carrito actualizado con los productos populados
    const updatedCart = await Cart.findOne({ sessionId }).populate('items.product');
    
    res.status(200).json({
      success: true,
      data: updatedCart
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor',
      message: error.message
    });
  }
};

// Vaciar completamente el carrito
const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Carrito no encontrado'
      });
    }
    
    // Vaciar los items del carrito
    cart.items = [];
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor',
      message: error.message
    });
  }
};

export { getCart, addToCart, removeFromCart, clearCart, checkoutToWhatsApp };