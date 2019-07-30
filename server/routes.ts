const fetch = require('node-fetch')

import { screencastServices } from './controllers/screencast-services'
process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  fallbackOption.whiteList.push('/screencast-services', '/screencast')
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  routes.get('/screencast-services', async (context, next) => {
    context.body = {
      success: true,
      screencasts: screencastServices()
    }
  })

  routes.post('/screencast/:serviceName', async (context, next) => {
    let serviceName = context.params.serviceName
    var body = context.request.body || {}
    let url = body.url

    var services = (global as any).screencastServices
    var service = services.find(s => s.name == serviceName)

    var targetIP = service.txt['ip-address']
    var reqBody = {
      url,
      access_token: context.cookies.get('access_token')
    }

    var response = await fetch(`http://${targetIP}:8080/screencast`, { method: 'POST', body: JSON.stringify(reqBody) })
    var json = await response.json()

    context.type = 'application/json'
    context.body = json
  })
})
