const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { engine } = require('express-handlebars')
require('dotenv').config();

// DB
try {
	mongoose.connect(process.env.MONGODB_URL);
	console.log('connected to mongoDB');
} catch (error) {
	console.log(error);
}

const dataRoute = require('./routes/dataRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const paymentRoute = require('./routes/paymentRoute');
const listRoute = require('./routes/listRoute');
const transactionRoute = require('./routes/transactionRoute');
const { verifyToken } = require('./middleware/jwt');

const app = express();
app.use(
	cors({
		origin: process.env.ORIGIN,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./templates/views/"));

app.use('/auth', authRoute);
app.use('/data', verifyToken, dataRoute);
app.use('/user', verifyToken, userRoute);
app.use('/payment', verifyToken, paymentRoute);
app.use('/list', verifyToken, listRoute);
app.use('/transaction', verifyToken, transactionRoute)


app.use((err, req, res, next) => {
	const errorStatus = err.status || 500;
	const errorMessage = err.message || 'Something went wrong';
	return res.status(errorStatus).send(errorMessage);
});

app.listen(5000, () => {
	console.log('server is running on port 5000');
});
