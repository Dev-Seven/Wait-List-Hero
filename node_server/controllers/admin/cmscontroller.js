var express = require('express');
var app     = express();
var connection = require('./../../config');

module.exports.get_page=function(req,res){

	connection.query('SELECT * FROM cms_pages ORDER BY id DESC',function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'cms page listing',data:results});
		}
	});
}

module.exports.view_page=function(req,res){

	var id = req.body.id;
	connection.query('SELECT * FROM cms_pages WHERE id = ?',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'cms page data',data:results});
		}
	});
}

module.exports.delete_page=function(req,res){

	var id = req.body.id;
	connection.query('DELETE FROM cms_pages WHERE id = ?',[id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'cms page deleted',data:[]});
		}
	});
}

module.exports.create_page=function(req,res){

	var title = req.body.title;
	var description = req.body.description;
	var slug = req.body.slug;
	var status = req.body.status;

	var sql = 'INSERT INTO cms_pages (title, description, slug, status) VALUES ("'+title+'","'+description+'","'+slug+'","'+status+'")';
	connection.query(sql,function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:error})
		} else {
			res.json({status:true,status_code:200,message:'cms page added',data:[]});
		}
	});
}

module.exports.update_page=function(req,res){

	var title = req.body.title;
	var description = req.body.description;
	var status = req.body.status;
	var id = req.body.id;

	var sql = 'UPDATE cms_pages SET title = ?, description = ?, status = ? WHERE id = ?';
	connection.query(sql,[title, description, status, id],function (error, results, fields) {
		if (error) {
			res.json({status:false,status_code:201,message:'there are some error with query'})
		} else {
			res.json({status:true,status_code:200,message:'cms page updated',data:[]});
		}
	});
}