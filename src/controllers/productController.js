import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Debug: Verificar estado de la conexión de MongoDB
console.log('Estado de conexión MongoDB:', mongoose.connection.readyState);
// 0 = desconectado, 1 = conectado, 2 = conectando, 3 = desconectando

// Obtener todos los productos con filtros opcionales
const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    // Filtrar por término de búsqueda
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Filtrar por categoría
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías únicas (versión robusta)
const getCategories = async (req, res) => {
  try {
    console.log('Obteniendo categorías...');
    
    // Verificar si hay productos en la colección
    const countProducts = await Product.countDocuments();
    console.log(`Total de productos en la base de datos: ${countProducts}`);

    if (countProducts === 0) {
      console.log('No hay productos en la base de datos');
      return res.json([]);
    }
    
    // Enfoque alternativo para extraer categorías
    const products = await Product.find({}, 'category');
    console.log(`Productos recuperados para categorías: ${products.length}`);
    
    // Extraer categorías manualmente
    const categoriesSet = new Set();
    products.forEach(product => {
      if (product.category && 
          typeof product.category === 'string' && 
          product.category.trim() !== '' &&
          product.category !== 'General') {
        categoriesSet.add(product.category.trim());
      }
    });
    
    // Convertir Set a Array
    const categoriesArray = Array.from(categoriesSet);
    console.log('Categorías extraídas:', categoriesArray);
    
    return res.json(categoriesArray);
  } catch (error) {
    console.error('Error detallado al obtener categorías:', error);
    console.error('Stack de error:', error.stack);
    return res.status(500).json({ 
      message: 'Error al obtener categorías', 
      error: error.message 
    });
  }
};

// Obtener un producto específico
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al obtener producto específico:', error);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    console.log('Datos recibidos para crear producto:', req.body);
    
    // No asignar "General" como predeterminado
    const product = await Product.create(req.body);
    console.log('Producto creado:', product);
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    console.log(`Actualizando producto ${req.params.id}:`, req.body);
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    
    console.log('Producto actualizado:', product);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };