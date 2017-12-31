# service-dns
DNS service

All jobs that this service use are `kue` processes.

## Run
```
node index.js /path/to/config/file.json
```


##dns.add
Add a specific DNS record 
- `name` String DNS record name example.com
- `type` String DNS record type A,AAAA,CNAME..
- `data` Object DNS record data

Data example.
	```
	{//SOA
		"id":"randomid",
		"name":"master.example.com",
		"ttl":600,
		"admin":"hostmaster.example.com",
		"serial":2017030300,
		"refresh":3600,
		"expiration":604800,
		"minimum":1800
	}
	```
	```
	{//A
		"id":"randomid",
		"name":"example.com",
		"ttl":600,
		"data":"127.0.0.1"
	}
	```
##dns.remove
Removes a specific DNS record. Must be the same object structure as when added.
- `name` String DNS record name example.com
- `type` String DNS record type A,AAAA,CNAME..
- `data` Object DNS record data
	```
	{//A
		"id":"randomid",
		"name":"example.com",
		"ttl":600,
		"data":"127.0.0.1"
	}
	```
##dns.clean
No questions asked remove all records with the name and type
- `name` String DNS record name example.com
- `type` String DNS record type A,AAAA,CNAME..

##dns.query
Query name type data in the redis DB.
- `name` String DNS record name example.com
- `type` String DNS record type A,AAAA,CNAME..
