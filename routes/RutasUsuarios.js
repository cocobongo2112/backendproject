var rutas = require("express").Router();
var {mostrarUsuarios,borrarUsuario,updateUsuarios,buscarPorId,nuevoUsuario} = require("../DB/UsuariosDB");

rutas.get("/usuarios/buscar", async (req, res) => {
    const query = req.query.q.toLowerCase();
    try {
        const usuarios = await mostrarUsuarios();
        const usuariosFiltrados = usuarios.filter(usuario => 
            usuario.nombre.toLowerCase().includes(query)
        );
        res.json(usuariosFiltrados);
    } catch (error) {
        res.status(500).json({ error: "Error buscando usuarios" });
    }
});

rutas.get("/",async (req,res)=>{
    var usuariosValidos = await mostrarUsuarios();
    res.json(usuariosValidos);
});

rutas.get("/buscarPorId/:id",async (req,res)=>{
    var usuarioValido = await buscarPorId(req.params.id);
    res.json(usuarioValido);
});

rutas.post("/nuevoUsuario",async(req,res)=>{
    var usuarioGuardado = await nuevoUsuario(req.body);
    res.json(usuarioGuardado);
});

rutas.post("/updateUsuario",async(req,res)=>{
    var usuarioGuardado = await updateUsuarios(req.body);
    res.json(usuarioGuardado);
});

rutas.delete("/borrarUsuario/:id",async (req,res)=>{
    var usuariBorrado = await borrarUsuario(req.params.id);
    res.json(usuariBorrado);
});

module.exports = rutas;