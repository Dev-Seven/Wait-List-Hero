var express = require('express');
var app     = express();
var connection = require('./../../config');

module.exports.get=function(req,res){

	connection.query('SELECT * FROM services ORDER BY id DESC',function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'service listing',data:results});
		}
	});
}

module.exports.find_by_id=function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM services WHERE id = ?',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Service data',data:results});
		}
	});
}

module.exports.delete=function(req,res){

	var id = req.body.id;
	connection.query('DELETE FROM services WHERE id = ?',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Service deleted',data:[]});
		}
	});
}

module.exports.create=function(req,res){

	var name = req.body.name;
	var status = req.body.status;

	var sql = 'INSERT INTO services (name, status) VALUES ("'+name+'","'+status+'")';
	connection.query(sql,function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:error})
		} else {
			res.json({status:true,status_code:200,message:'Service added successfully',data:[]});
		}
	});
}

module.exports.update=function(req,res){

	var name = req.body.name;
	var status = req.body.status;
	var id = req.body.id;

	var sql = 'UPDATE services SET name = ?, status = ? WHERE id = ?';
	connection.query(sql,[name, status, id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'Service updated successfully',data:[]});
		}
	});
}