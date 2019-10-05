const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const notesRouter = require('./routers/notes')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)
app.use(notesRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const Task = require('./models/notes')
const User = require('./models/user')

const main = async () => {

    const user = await User.findById('5c2e4dcb5eac678a23725b5b')
    await user.populate('notes').execPopulate()
    console.log(user.notes)
}

main()
