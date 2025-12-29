{
  "version": 2,
  "builds": [
    {
      "src": "api/api.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/api.js"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://playjogosgratis.com https://cacapalavras-api.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization, X-Requested-With"
        },
        {
          "key": "Access-Control-Max-Age",
          "value": "86400"
        },
        {
          "key": "Content-Type",
          "value": "application/json"
        }
      ]
    }
  ]
}
