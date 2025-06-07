const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authenticated=require('./middleware/authenticated')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const userRoutes=require('./routes/authRoutes')
const User=require('./model/user')


dotenv.config()
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173',
  'https://shopify-omega-seven.vercel.app'],  // Must match frontend origin exactly
  credentials: true                 // Allow cookies, authorization headers, etc.
}));


app.use('/api', apiRoutes);
app.use('/auth', userRoutes)
app.get('/protected', authenticated, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password'); // Exclude sensitive fields
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    message: 'User authenticated',
    user,
  });
});
app.get('/', (req, res) => {
    res.send('Welcome to the API');
  });
  

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
