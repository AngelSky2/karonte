const express = require('express');
const router = express.Router();
const financesController = require('../controllers/financesController');

router.get('/', financesController.getFinances);
router.post('/create', financesController.createFinance);
router.put('/:id', financesController.updateFinance);
// Ruta para borrar todas las finanzas (debe ir antes de la ruta dinámica '/:id')
router.delete('/clear', financesController.clearFinances);
router.delete('/:id', financesController.deleteFinance);
router.get('/summary', financesController.getSummary);

module.exports = router;
