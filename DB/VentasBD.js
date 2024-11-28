const {ventaDB, usuariosDB, productoDB} = require("./Conexion");
const Venta = require("../class/Venta");
var {fechaHora} = require("../middlewares/fecha");

function validar(venta){
    var validar = false;
    if(venta.idUsuario!=undefined&&venta.idProducto!=undefined) {
        validar = true;
    }
    return validar;
}

async function mostrarVentas() {
    const ventas = await ventaDB.where('estatus', '==', 'Vendido').get();
    const ventasValidas = [];
    for (const ventaDoc of ventas.docs) {
        const venta = ventaDoc.data();
        
        // Obtener nombre de producto y usuario
        const producto = await productoDB.doc(venta.idProducto).get();
        const usuario = await usuariosDB.doc(venta.idUsuario).get();
        
        ventasValidas.push({
            id: ventaDoc.id,
            nombreProducto: producto.data().nombre,
            nombreUsuario: usuario.data().nombre,
            precio: producto.data().precio,
            cantidad: venta.cantidad || 1,
            fecha: venta.fecha || 'Fecha no disponible' // Add this line
        });
    }
    return ventasValidas;
}

async function buscarPorId(id) {
    var ventaValida;
    const venta = await ventaDB.doc(id).get();
    const venta1 = new Venta({id:venta.id, ...venta.data()});
    if(validar(venta1.datos)) {
        ventaValida = venta1.datos;
    }
    return ventaValida;
}

async function nuevaVenta(data) {
    data.fecha = fechaHora().fecha+", "+fechaHora().hora+" UTC-6";
    data.estatus="Vendido";
    const venta1 = await new Venta(data);
    var ventaValida={};
    var ventaGuardada=false;
    if(validar(venta1.datos)) {
        ventaValida= venta1.datos;
        await ventaDB.doc().set(ventaValida);
        ventaGuardada= true;
    }
    return ventaGuardada;
}

async function updateVentas(data) {
    data.fechaA = fechaHora().fecha+", "+fechaHora().hora+" UTC-6";
    var ventaAct = false;
    if(await buscarPorId(data.id) != undefined) {
        await ventaDB.doc(data.id).update({
            estatus: "Vendido",
            fecha: data.fechaA,
            idUsuario: data.idUsuario,
            idProducto: data.idProducto,
            cantidad: data.cantidad || 1  // Agregar cantidad
        });
        ventaAct = true;
    }
    return ventaAct;
}

async function borrarVenta(id) {
    var ventaBorrada=false;
    if(await buscarPorId(id)!=undefined) {
        ventaDB.doc(id).delete();
        ventaBorrada = true;
    }
    return ventaBorrada;
}

async function cancelarVenta(id) {
    var ventaCancelada = false;
    if(await buscarPorId(id) != undefined) {
        await ventaDB.doc(id).update({
            estatus: "Cancelado"
        });
        ventaCancelada = true;
    }
    return ventaCancelada;
}

module.exports = {
    mostrarVentas,
    nuevaVenta,
    updateVentas,
    buscarPorId,
    borrarVenta,
    cancelarVenta
}