const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:86276858-062b-471c-a451-de10960f948e',
  key: 'b4187771-9ffd-46dc-bbcf-fce38a71e392:+ngeNJNGGXuqhgq3+9AFZbs6NflWLnFbYeN5IW7FUiI=',
})

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const {
    username
  } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({
    userId: req.query.user_id
  })
  res.status(authData.status).send(authData.body)
})


const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})