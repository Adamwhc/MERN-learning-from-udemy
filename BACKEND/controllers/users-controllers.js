const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpEorror = require('../models/http-error');
const User = require('../models/user');

// const DUMMY_USERS = [
//     {
//         id: 'u1',
//         name: 'xxx',
//         email: 'test@test.com',
//         password: 'testers'
//     }
// ]

const getUsers = async (req, res, next) => {
    // res.json({ users: DUMMY_USERS })
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpEorror(
            'Fetching users failed, please try again later',
            500
        );
        return next(error);
    }

    res.json({users: users.map(user => user.toObject({ getters: true }))});
    
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next (new HttpEorror('Invalid signup', 442));
    }

    const { name, email, password } = req.body;
    // console.log('backend',req.body);

    // const hasUser = DUMMY_USERS.find(u => u.email === email);
    // if(hasUser) {
    //     throw new HttpEorror('Could not create already exist user', 442);
    // }
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpEorror(
            'Signing up failed, please try again later',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpEorror(
            'User exists already, please login instead',
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpEorror('Could not create user, please try again', 500));
    }

    const createdUser = new User({
        name,
        email,
        // image: 'https://images.pexels.com/photos/11832019/pexels-photo-11832019.jpeg?cs=srgb&dl=pexels-naae-studio-11832019.jpg&fm=jpg',
        image: 'http://localhost:5000/' + req.file.path,
        password: hashedPassword,
        places: []
    });

    // DUMMY_USERS.push(createdUser);
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpEorror(
            'Signing up failed, please try again',
            500
        );
        return next(error);
    };

    let token;
    try {
        token = jwt.sign({
            userId: createdUser.id,
            email: createdUser.email
            },
            'supersecret_dont_share',
            {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpEorror(
            'Signing up failed, please try again',
            500
        );
        return next(error);
    }

    // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
    res
        .status(201)
        .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    // const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    // if (!identifiedUser || identifiedUser.password !== password) {
    //     throw new HttpEorror('Could not identify user', 401);
    // }
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpEorror(
            'Logging in failed, please try again later',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpEorror(
            'Invalid credentials, please try again later',
            403
        );
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpEorror(
            'Could not log you in, please check your credentials and try again', 
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpEorror(
            'Invalid credentials, please try again later',
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id,
            email: existingUser.email
            },
            'supersecret_dont_share',
            {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpEorror(
            'Logging in failed, please try again',
            500
        );
        return next(error);
    }

    // res.json({ message: 'Logged in', user: existingUser.toObject({ getters: true }) });
    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    })
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;