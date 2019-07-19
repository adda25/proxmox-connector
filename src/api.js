'use strict'

module.exports = class ProxmoxApi {
	constructor (connector) {
		this.connector = connector
		return this
	}

	/**
	*	newVmData {
	*		vmid: '',
	*		vmname: '',
	*		network: {
	*			ip: 192.168.1.1
	*			net: 192.168.1.0/24
	*			gw: 192.168.1.254
	*		},
	*		username: '',
	*		password: ''
	*	}
	*/
	async createVM (node, vmcloneid, newVmData) {
		let cloneResponse = await this.cloneVM (node, vmcloneid, newVmData.vmid, newVmData.name)
		let confResponseNetwork = await this.configureVM (node, newVmData.vmid, {
				ipconfig0: 'ip=' + newVmData.network.ip + '/' + newVmData.network.net.split('/')[1] + ',gw=' + newVmData.network.gw
			})
		let confResponseUser = await this.configureVM (node, newVmData.vmid, {
  			ciuser: newVmData.username,
	  		cipassword: newVmData.password
			})
		let confResponseCdrom = await this.configureVM (node, newVmData.vmid, {
  			ide2: 'none,media=cdrom',
			})
		let confResponseCdrom2 = await this.configureVM (node, newVmData.vmid, {
  			ide2: 'local-lvm:cloudinit',
			})
		return [cloneResponse, confResponseUser, confResponseCdrom, confResponseCdrom2]
	}

	async cloneVM (node, vmcloneid, newvmid, newvmname) {
	  	let urlclone = '/nodes/' + node + '/qemu/' + vmcloneid + '/clone'
	  	let dataclone = {
	  		newid: newvmid,
	  		name: newvmname,
	  		target: node
	  	}
	  	return await this.connector.post(urlclone, dataclone)
	}

	async configureVM (node, vmid, vmdata) {
	  	let urlconfig = '/nodes/' + node + '/qemu/' + vmid + '/config'
	  	return await this.connector.post(urlconfig, vmdata)
	}

	async startVM (node, vmid) {		
		return await this.connector.post('/nodes/' + node + '/qemu/' + vmid + '/status/start', {})
	}
	
	async stopVM (node, vmid) {
		return await this.connector.post('/nodes/' + node + '/qemu/' + vmid + '/status/stop', {})
	}

	async deleteVM (node, vmid) {
		return await this.connector.del('/nodes/' + node + '/qemu/' + vmid, {})
	}

	async clusterStatus () {
		return await prox.get('/cluster/status')
	}

	async clusterResources () {
		return await prox.get('/cluster/resources')
	}

	async nodeStatus (node) {
		return await prox.get('/nodes/' + node +'/status')
	}
}

