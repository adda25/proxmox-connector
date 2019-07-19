'use strict'

let querystring = require("querystring")
let exec = require('child_process').exec

module.exports = class ProxmoxConnector {
	constructor (hostname, port, name, pwd) {
		return this.connectToNode(hostname, port, name, pwd)
	}

	connectToNode (hostname, port, name, pwd) {
		this.url = 'https://' + hostname + ':' + port + '/api2/extjs'
		this.auth = 'username=' + name + '&password=' + pwd
		this.token = {
			CSRF: undefined,
			PVEAuth: undefined,
			datetime: undefined
		}
		return this
	}

	async get (path) {
		let str = ''
		str += 'curl -k '
       	str += ('-b ' + 'PVEAuthCookie='+this.token.PVEAuth)
		str += (' ' + this.url + path)
		return await this._safeExecCurl(str)
	}

	async post (path, data) {
		let datastring = querystring.stringify(data)
		let str = 'curl -XPOST -k '
		str += ('-b '+ 'PVEAuthCookie=' + this.token.PVEAuth + ' ')
		str += ('-H ' +'"'+'CSRFPreventionToken:' + this.token.CSRF + '"'+' ')  
		str += ('-d '+'"'+datastring+'"'+' ')
		str += (this.url + path)
		return await this._safeExecCurl(str)
	}

	async postAuth (path, data) {
		let str = 'curl -XPOST -k '
		str += ('-d '+'"'+data+'"'+' ')
		str += (this.url + path)
		return await this._safeExecCurl(str)
	}

	async delete (path) {
		let str = 'curl -X DELETE -k '
        str += ('-b ' + 'PVEAuthCookie='+this.token.PVEAuth + ' ')
		str += ('-H ' +'"'+'CSRFPreventionToken:' + this.token.CSRF + '"'+' ')
		str += (this.url + path)
		return await this._safeExecCurl(str)
	}
	
	async put (path, data) {
		let datastring = querystring.stringify(data)
		let str = 'curl -X PUT -k '
        str += ('-b ' + 'PVEAuthCookie='+this.token.PVEAuth + ' ');
		str += ('-H ' +'"'+'CSRFPreventionToken:' + this.token.CSRF + '"'+' ');	   
		str += ('-d ' + datastring +'  ');
		str += (this.url + path);
	}

  	async authorize() {
    	let response = await this.postAuth('/access/ticket', this.auth)
		let responseParsed = JSON.parse(response)
		this.token.CSRF = responseParsed.data.CSRFPreventionToken
		this.token.PVEAuth = responseParsed.data.ticket
		this.token.timeStamp = new Date().getTime()
  	}

  	async _safeExecCurl (str) {
  		return await this._execCurl(str)
  	}

	async _execCurl(str) {
	 	const exec = require('child_process').exec
	 	return new Promise(function (resolve, reject) {
	  		exec(str, function (error, stdout, stderr) {
	   			if (error) {
	    			console.warn(error)
	   			}
	   			resolve(stdout? stdout : stderr)
	  		}.bind(this))
	 	}.bind(this))
	}
}