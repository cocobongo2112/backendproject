const rutas = require("express").Router();
const {mostrarVentas, nuevaVenta, updateVentas, buscarPorId, borrarVenta, cancelarVenta} = require("../DB/VentasBD");

rutas.get("/ventas", async (req, res) => {
    var ventasValidas = await mostrarVentas();
    res.json(ventasValidas);
});

rutas.get("/ventas/buscarPorId/:id", async (req, res) => {
    var ventaValida = await buscarPorId(req.params.id);
    res.json(ventaValida);
});

rutas.post("/ventas/nuevaVenta", async (req, res) => {
    var ventaNueva = await nuevaVenta(req.body);
    res.json(ventaNueva);
});

rutas.post("/ventas/updateVentas", async (req, res) => {
    var ventasUpdate = await updateVentas(req.body);
    res.json(ventasUpdate);
});

rutas.get("/ventas/buscarPorId/:id", async (req, res) => {
    try {
        var ventaValida = await buscarPorId(req.params.id);
        if (ventaValida) {
            res.json(ventaValida);
        } else {
            res.status(404).json({ message: "Venta no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al buscar la venta", error: error.message });
    }
});

rutas.put("/ventas/cancelar/:id", async (req, res) => {
    var ventaCancelada = await cancelarVenta(req.params.id);
    res.json(ventaCancelada);
});

module.exports = rutas;