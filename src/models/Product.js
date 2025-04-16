import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, añade un título'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Por favor, añade una descripción'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Por favor, añade un precio'],
    min: [0, 'El precio no puede ser negativo']
  },
  imageUrl: {
    type: String,
    default: 'default-product.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;