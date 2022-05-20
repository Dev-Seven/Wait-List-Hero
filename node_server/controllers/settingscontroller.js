var jwt = require('jsonwebtoken');
var connection = require('./../config');

module.exports.support_details=function(req,res){

	function buildConditions(params) {
		var conditions = [];
		var values = [];
		var conditionsStr;

		if (typeof params.type !== 'undefined') {
			conditions.push("name = ?");
			values.push(params.type);
		}

		return {
			where: conditions.length ? conditions.join(' AND ') : '1',values: values
		};
	}
	
	var conditions = buildConditions(req.body);
	var sql = 'SELECT * FROM subscription_data WHERE ' + conditions.where;

	connection.query(sql,conditions.values, function (error, results, fields) {
		if (results.length > 0) {
			res.json({status:true,status_code:200,message:'Setting Details.',data:results})
		} else {
			res.json({status:false,status_code:201,message:'Setting not found.'})
		}
	});
}