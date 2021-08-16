const http = require('http')
const fs = require('fs')
const mySQL = require('mysql')

const port = 3000
const ip = "127.0.0.1"

const dbcon = mySQL.createConnection(
	{
	host:'127.0.0.1',
	port:'3308',
	user:'root',
	password:'',
	database : 'databaseName'
	}
);

dbcon.connect(
	function(error){
		
		if(error){
			throw error;
		}else{
			console.log('Database Connected')
		}
	}
)

const server = http.createServer(
	function(reg,res){
		console.log(reg.method,reg.url)
		res.writeHead(200,{'Content-Type':'text/html'})
		switch(reg.url){
			case '/':{
				
				fs.readFile('./html/index.html',
					function(error,data){
						if(error){
							res.writeHead(404)
							res.write("404 Page not found")
						}else{
							
							res.write(data)
						}
						res.end()
					}
				)
				
				break;
			}
			case '/favicon.ico':{
				
				fs.readFile('./html/favicon.ico',
					function(error,data){
						if(error){
							res.writeHead(404)
							res.write("404 Page not found")
						}else{
							res.writeHead(200,{'Content-Type':'x-icon'})
							res.write(data)
						}
						res.end()
					}
				)
				
				break;
			}
			case '/time':{
				
				res.writeHead(200,{'Content-Type':'json'})
				res.write('{ts:' + Date.now() + '}')
				res.end()
				
				
				var sql = "SELECT MAX(`id`) FROM `time`"
				
				dbcon.query(sql,
					function(err, result){
						
						if (err) throw err;
						//console.log(result[0]['MAX(`id`)']);
						
						var id = result[0]['MAX(`id`)']
						
						if(id == null){
							id = 0;
						}else{
							id++;
						}
						
						sql = "INSERT INTO `time` (`id`,`time`) VALUES ('"+ id +"','" + Date.now() +"')";
						//console.log(sql)
						
						dbcon.query(sql,
							function(err, result){
								
								if (err) throw err;
								console.log("1 record inserted");
							
							}
						)
						
					
					}
				)
				
				break;
			}
			
			default:{
					res.writeHead(404)
					res.write("404 Page not found")	
					res.end()					
				break;
			}
			
		}
		
	}
)


server.listen(port,ip,
	function(error){
		if(error){
			console.log("Server start Error:", error);	
		}else{
			
			console.log("server started on port:",port)
		}
	}
)