var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

//Estableciendo parametros de conexión
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
});

//Probando la conexión
conexion.connect(function(error){
    if(error){
        throw error;
    }
    else{
        console.log("Conexión exitosa a la base de datos!");
    }
});


app.get ('/', function(req,res){
    res.send('Ruta INICIO');
});

//Mostrar todos los articulos
app.get('/api/articulos', (req,res)=>{
    conexion.query('SELECT * FROM articulos', (error,filas)=>{
        if(error){
            throw error;
        }
        else{
            res.send(filas);
        }
    })
});

//Mostrar solo un articulo
app.get('/api/articulos/:id', (req,res)=>{
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error,fila)=>{
        if(error){
            throw error;
        }
        else{
            res.send(fila);
            //res.send(fila[0].descripcion);
        }
    })
});

//Creando un articulo
app.post('/api/articulos', (req,res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "INSERT INTO articulos SET ?" ;
    conexion.query(sql, data, function(error, result){
        if(error){
            throw error;
        }
        else{
            Object.assign(data, {id: result.insertId })  //Se le agrega un ID al objeto data.
            res.send(data);                         //Se envian los valores.
        }
    });
});

//Editando articulo
app.put('/api/articulos/:id', (req, res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock =req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], function(error, result){
        if(error){
            throw error;
        }
        else{
            res.send(result);
        }
    });
});

//Eliminando articulo
app.delete('/api/articulos/:id', (req,res)=>{
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], function(error, filas){
        if(error){
            throw error;
        }
        else{
            res.send(filas);
        }
    });
});


const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Servidor OK en puerto: "+puerto);
});