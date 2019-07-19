'use strict'

let ProxConn = require('../index.js')

async function exampleClusterStatus () {
	let proxconn = new ProxConn('ip', '8006', 'root@pam', 'password')
	await proxconn.authorize()
	console.log(await proxconn.get('/cluster/status'))

}

exampleClusterStatus()