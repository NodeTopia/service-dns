var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DNSZoneSchema = new Schema({
	organization : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Organization'
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
	zone : {
		type : String,
		unique : true,
		required : true
	},
	records : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'DNSRecord'
	}]
});

DNSZoneSchema.pre('save', function(next) {
	this.updated_at = new Date();
	if (this.isNew) {

	}
	next();
});
var autoPopulateLead = function(next) {
	this.populate('records');
	next()
};

DNSZoneSchema.pre('findOne', autoPopulateLead);
DNSZoneSchema.pre('find', autoPopulateLead);

module.exports = mongoose.model('DNSZone', DNSZoneSchema);
