# Proxmox Connector

Simple class that simplify the connection to Proxmox nodes or cluster.
Inspired by [proxmox](https://www.npmjs.com/package/proxmox).

## Usage 

```javascript
let ProxConn = require('proxmox-connector')

async function exampleClusterStatus () {
	let proxconn = new ProxConn('nodeip', '8006', 'root@pam', 'yourpassword')
	await proxconn.authorize()
	let dataCluster = await proxconn.get('/cluster/status')
	console.log('Data Cluster--->', dataCluster)
}

exampleClusterStatus()
```

## Example Methods

```javascript
await proxconn.get(URL)
await proxconn.post(URL, DATAJSON)
await proxconn.put(URL)
await proxconn.delete(URL)
```
