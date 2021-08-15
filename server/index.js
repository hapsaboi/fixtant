const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');


//serving up the files
//app.use(express.static('media'));


//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:3000","https://fixtant.netlify.app"],
		credentials: true
	})
);

//db connection
const connection = require('./db');

//Routes
app.use('/api/product', require('./routes/api/product'));
app.use('/api/change', require('./routes/api/change'));
app.use('/api/sale', require('./routes/api/sale'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));

// serve static assets if production
// if(process.env.NODE_ENV === 'production'){
// 	set static folder
// 	app.use(express.static('client/build'));

// 	app.get('*', (req,res)=>{
// 		res.sendFile(path.resolve(__dirname,'client','build','index.html'));
// 	})
// }

const PORT = process.env.PORT || process.env.LocalPort;

const server = app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

// const server = app.listen(PORT, '0.0.0.0', function() {
// 	console.log(`Server started at port ${PORT}`);
// });


process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged Error: ${err}`);
	server.close(() => process.exit(1));
});
