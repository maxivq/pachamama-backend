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
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: error.message });
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

// Ya no exportamos getCategories
export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };