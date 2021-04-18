const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const register = async(req, res) => {
    const { email, username, password } = req.body;

    //check if all fields are present
    if (!email || !username || !password) {
      return  res.status(400).send('please provide all fields')
    }

    //check if username/email is already in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return  res.status(400).send('email already eixist');
    }
// hashing of password
    const hashPassword = await bcrypt.hash(password, 12);

    //create user
    const user = await User.create({ username, email, password: hashPassword });
    //generate token
    const token = jwt.sign({id:user._id}, '987654321', {expiresIn: '1h'})

    //return response
     res.status(201).json({token})
};




// const login = (req, res) => {
//     const { email, username, password } = req.body
//     if (!email || !password) {
//         res.status().send('please you missed some fileds')
//     }
// }


const login = async (req, res) => {
    const { email, password } = req.body;

    //check if user is in the database
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('invalid credentials')
    }

    //comppare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, '987654321', { expiresIn: '1h' })
    //return response
     res.status(200).json({token})
};

const verifyToken = (req, res, next) => {
    let token = req.headers['Authorization'];
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Not Authorized." });
    }
    
    token = token.split("")[1];
    try {
        let user = jwt.verify(token, '987654321');
        req.user = user.id;
    } catch (error) {
        res.status(401).json({message:"Invalid Token."})
    }
    next();
    
};

module.exports = {
    register,
    login,
    verifyToken,
};