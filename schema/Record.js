var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DNSRecordSchema = new Schema({
	reference : {
		type : Schema.ObjectId
	},
	created_at : {
		type : Date,
		required : true,
		'default' : Date.now
	},
	updated_at : {
		type : Date,
		required : true,
		'default' : Date.now
	},
	name : {
		type : String,
		required : true
	},
	type : {
		type : String,
		required : true,
		'default' : 'A'
	},
	ttl : {
		type : Number,
		required : true,
		'default' : 3600
	},
	data : {
		type : String,
		required : true
	},
	priority : {
		type : Number
	},
	admin : {
		type : String
	},
	serial : {
		type : Number
	},
	refresh : {
		type : Number
	},
	retry : {
		type : Number
	},
	expiration : {
		type : Number
	},
	minimum : {
		type : Number
	}
});

DNSRecordSchema.methods.toRecord = function(id) {
	return {
		id : id ? this._id : undefined,
		name : this.name,
		type : this.type,
		ttl : this.ttl,
		data : this.data,
		priority : this.priority,
		admin : this.admin,
		serial : this.serial,
		refresh : this.refresh,
		retry : this.retry,
		expiration : this.expiration,
		minimum : this.minimum
	};
};

DNSRecordSchema.pre('save', function(next) {
	this.updated_at = new Date();
	next();
});
module.exports = mongoose.model('DNSRecord', DNSRecordSchema);
