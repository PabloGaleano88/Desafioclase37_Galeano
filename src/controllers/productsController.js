import ProductManager from "../dao/MongoDB/ProductManager.js";
import { productAddErrorInfo } from "../services/errors/info.js";
import CustomError from "../services/errors/customError.js";
import EErrors from "../services/errors/enums.js";
import { logger } from "../utils/logger.js";

const productManager = new ProductManager()

export const getProducts = async (req, res) => {
    try {
        if (req) {
            const { limit, page, sort, query } = req.query
            const product = await productManager.getAll(query, limit, page, sort)
            res.send(product)
        }
        /* esto es para el realtimeproducts ya que usa JS y no utiliza req*/
        else {
            const limit = "100"
            const page = undefined
            const query = undefined
            const sort = undefined
            const product = await productManager.getAll(query, limit, page, sort)
            return product
        }
    }
    catch (error) {
        logger.error(error)
    }
}

export const addProduct = async (req, res) => {
    try {
        const { title, description, price, code, category, stock } = req.body
        if (!req.file || !title || typeof (title) != "string" || !description || !price || typeof (price) != "number" || !code || typeof (code) != "string" || !category || typeof (category) != "string" || !stock || typeof (stock) != "number") {
            CustomError.createError({
                name: "Add Product Error",
                cause: productAddErrorInfo(title, price, code, category, stock),
                message: "Error while tried to add a new product",
                code:EErrors.INVALID_DATA_ERROR
            })
        }
        const thumbnail = req.file.originalname
        await productManager.create(title, description, price, code, category, stock, thumbnail)
        const { payload: products } = await getProducts()
        res.status(200).send(products)
        req.context.socketServer.emit('actualizar_realtimeproducts', products)
    }
    catch (error) {
        res.status(400).send(error)
    }
}

export const getProductById = async (req, res) => {
    const id = req.params.pid
    const productById = await productManager.findById(id)
    res.status(200).send(productById)
}

export const updateProduct = async (req, res) => {
    const id = req.params.pid
    const updateFields = req.body
    const productUpdated = await productManager.updateProduct(id, updateFields)
    res.status(200).send(productUpdated)
}

export const deleteProduct = async (req, res) => {
    const id = req.params.pid
    try {
        await productManager.delete(id)
        const { payload: products } = await getProducts()
        req.context.socketServer.emit('actualizar_realtimeproducts', products)
        res.status(200).send(products)
    }
    catch (error) {
        logger.error(error)
        res.status(400).send(error)

    }
}


