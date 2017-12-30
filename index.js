var nconf = require('nconf');
var path = require('path');

nconf.file({
	file : path.resolve(process.argv[2])
});
nconf.env();

/*
 *Setup Kue jobs
 */
var kue = require('nodetopia-kue');
var jobs = kue.jobs;

/*
 *Setup mongodb store
 */
var mongoose = require('nodetopia-model').start(nconf.get('mongodb'));

var Redis = mongoose.Redis;

jobs.process('dns.add', 999, function(job, done) {

	var name = job.data.name.toLowerCase();
	var type = job.data.type.toUpperCase();

	var stringifiedRecord = JSON.stringify(job.data);

	var recordKey = type + ':' + name;

	Redis.getDB('dns', function(next) {
		var db = this;

		db.rpush(recordKey, stringifiedRecord, function() {
			db.lrange(recordKey, 0, -1, next);
		});
	}, done);
});

jobs.process('dns.remove', 999, function(job, done) {
	var name = job.data.name.toLowerCase();
	var type = job.data.type.toUpperCase();

	var stringifiedRecord = JSON.stringify(job.data);
	var recordKey = type + ':' + name;

	Redis.getDB('dns', function(next) {
		this.lrem(recordKey, 0, stringifiedRecord, next);
	}, done);
});

jobs.process('dns.clean', 999, function(job, done) {

	var name = job.data.name.toLowerCase();
	var type = job.data.type.toUpperCase();

	var recordKey = type + ':' + name;

	Redis.getDB('dns', function(next) {
		this.del(recordKey, next);
	}, done);
});

jobs.process('dns.query', 999, function(job, done) {
	var name = job.data.name.toLowerCase();
	var type = job.data.type.toUpperCase();

	var recordKey = type + ':' + name;

	Redis.getDB('dns', function(next) {
		this.lrange(recordKey, 0, -1, next);
	}, done);
});

