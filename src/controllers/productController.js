import Product from '../models/Product.js';

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
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las categorías únicas (versión mejorada)
const getCategories = async (req, res) => {
  try {
    // Obtener categorías únicas de todos los productos
    const categories = await Product.distinct('category');
    
    // Filtrar valores nulos o vacíos y asegurar que 'General' esté presente solo una vez
    const validCategories = categories
      .filter(cat => cat && cat.trim() !== '')
      .filter((cat, index, self) => self.indexOf(cat) === index);
    
    // Asegurar que 'General' esté presente
    if (!validCategories.includes('General')) {
      validCategories.push('General');
    }
    
    res.json(validCategories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
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
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    // Asegurarnos de que se incluya la categoría
    if (!req.body.category) {
      req.body.category = 'General';
    }
    
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
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
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
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
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };