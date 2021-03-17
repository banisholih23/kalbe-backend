const productModel = require('../models/product')

module.exports = {
  getAllProduct: async (request, response) => {
    const userData = await productModel.getAllProduct()
    const data = {
      success: true,
      msg: 'List all product',
      data: userData,
    }
    response.status(200).send(data)
  },
}