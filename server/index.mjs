import http from 'http'

const port = process.env.PORT || 9000

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Signalling Server running on port: ${port}`);
})
