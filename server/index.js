const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const paymentRoutes = require('./routes/paymentRoutes');

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}))


app.use('/api/payment', paymentRoutes);

app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})