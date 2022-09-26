const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
app.use(bodyparser.json());

app.listen(3011, () =>{
    console.log("aplicacion iniciada")
})

var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'admin',
   database: 'sistemas',
});
connection.connect(function(error){
   if(error){
      throw error;
   }else{
      console.log('Conexion correcta.');
   }
});

app.get('/estudiantes', (req, res) => {
   connection.query('SELECT * FROM estudiantes', (err, rows, fields) => {
       if (!err)
           res.send(rows);
       else
           console.log(err);
   })
});

app.get('/estudiantes/:id', (req, res) => {
   connection.query('SELECT * FROM estudiantes where id_estudiante= ?',[req.params.id], (err, rows, fields) => {
       if (!err)
           res.send(rows);
       else
           console.log(err);
   })
});


app.get('/materias', (req, res) => {
   connection.query('SELECT * FROM materias', (err, rows, fields) => {
       if (!err)
           res.send(rows);
       else
           console.log(err);
   })
});

app.get('/incripciones', (req, res) => {
   connection.query('select uno.id_ins, uno.nombre as estudiante,dos.nombre from (SELECT concat( e.nombre ," ", e.apellido) as nombre, i.id_ins FROM incripciones i inner join estudiantes e on i.id_es=e.id_estudiante) uno join (SELECT m.nombre,i.id_ins FROM incripciones i inner join materias m on i.id_ma= m.id) dos on uno.id_ins=dos.id_ins group by uno.id_ins;', (err, rows, fields) => {
       if (!err)
           res.send(rows);
       else
           console.log(err);
   })
});
//post

app.post('/add_estudiante', (req, res) => {
   const params = req.body
        connection.query('INSERT INTO estudiantes SET ?', params, (err, rows) => {
        if (!err) {
            res.send(`estudiante creado.`)
        } else {
            console.log(err)
        }
        

        })
    });
app.post('/add_materia', (req, res) => {
   const params = req.body
        connection.query('INSERT INTO materias SET ?', params, (err, rows) => {
        if (!err) {
            res.send(`materia creada.`)
        } else {
            console.log(err)
        }
        

        })
    });
    app.post('/add_inscripcion', (req, res) => {
      const params = req.body
           connection.query('INSERT INTO incripciones SET ?', params, (err, rows) => {
           if (!err) {
               res.send(`inscripcion realizada.`)
           } else {
               console.log(err)
           }
           
   
           })
    });
//delete
    app.delete('/estudiante/:id', (req, res) => {
        connection.query('DELETE FROM estudiantes WHERE id_estudiante = ?', [req.params.id], (err, rows, fields) => {
            if (!err)
                res.send('borrado satisfactoriamente ');
            else
                console.log(err);
        })
    });
    app.delete('/materia/:id', (req, res) => {
        connection.query('DELETE FROM materias WHERE id = ?', [req.params.id], (err, rows, fields) => {
            if (!err)
                res.send('borrado satisfactoriamente ');
            else
                console.log(err);
        })
    });
    app.delete('/inscripcion/:id', (req, res) => {
        connection.query('DELETE FROM incripciones WHERE id_ins = ?', [req.params.id], (err, rows, fields) => {
            if (!err)
                res.send('borrado satisfactoriamente ');
            else
                console.log(err);
        })
    });
//put
    
    



app.put('/modificar_estudiante', (req, res) => {
       const { id_estudiante,codigo,nombre,apellido,tipo_documento,numero_documento,estado } = req.body
       connection.query('UPDATE estudiantes SET codigo = ?, nombre = ?, apellido = ?, tipo_documento = ?, numero_documento = ?, estado = ? WHERE id_estudiante = ?', [codigo,nombre,apellido,tipo_documento,numero_documento,estado, id_estudiante] , (err, rows) => {
           if(!err) {
               res.send(`el estudiante con el codigo: ${codigo} ha sido modificado`)
           } else {
               console.log(err)
           }
       })
   });

   app.put('/modificar_materia', (req, res) => {
    const { id,codigo_materia,nombre,creditos,cupo,estado } = req.body
    connection.query('UPDATE materias SET codigo_materia = ?, nombre = ?, creditos = ?, cupo = ?, estado = ? WHERE id = ?', [codigo_materia,nombre,creditos,cupo, estado, id] , (err, rows) => {
        if(!err) {
            res.send(` la materia con el codigo: ${codigo_materia} ha sido modificado`)
        } else {
            console.log(err)
        }
    })
});

app.put('/modificar_inscripcion', (req, res) => {
    const { id_ins,id_es,id_ma,fecha } = req.body
    connection.query('UPDATE materias SET id_es = ?, id_ma = ?, fecha = ? WHERE id_ins = ?', [id_es,id_ma,fecha, id_ins] , (err, rows) => {
        if(!err) {
            res.send(` inscripcion modificada`)
        } else {
            console.log(err)
        }
    })
});
