const express = require('express')
const app = express()
const port = 3003

const {analysisRouter} = require('./routes/analysis')

app.use(express.json())

app.use(express.static('public')) // 기본 호스팅 경로.
app.use('/analysis',analysisRouter)

app.listen(port, ()=>{
    console.log("Server "+port+"is start....")
})
