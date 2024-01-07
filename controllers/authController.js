import { camparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"


const cookieOptions = {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true
}

//user register
export const userRegister = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validation
        if (!name || !email || !password || !phone || !address || !answer) {
            return res.status(500).send({ message: "All fields are requred" })
        }

        //check user
        const exisitingUser = await userModel.findOne({ email });

        //exisiting user
        if (exisitingUser) {
            res.status(400).send({
                success: false,
                message: "Already Register please login",
            })
        }

        //register user

        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({ name, email, phone, address, answer, password: hashedPassword }).save()
        res.status(200).send({
            success: true,
            message: "User Register Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in registeration",
            error
        })
    }
}

//user login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(404).send({ error: "All fields are requred" })
        }

        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        const match = await camparePassword(password, user.password)

        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie('token', token);
        res.status(200).send({
            success: true,
            message: "User Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })
    }
}

//forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(500).send({
                message: "Email is required"
            })
        }
        if (!answer) {
            res.status(500).send({
                message: "Answer is required"
            })
        }
        if (!newPassword) {
            res.status(500).send({
                message: "New Password is required"
            })
        }

        //check
        const user = await userModel.findOne({ email, answer })

        //validation
        if (!user) {
            res.status(500).send({
                success: false,
                message: "New Password is required"
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}


//logout
export const logout = (req, res) => {
    res.cookie("token", null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).send({
        success: true,
        message: "User Logged out successfully"
    })
}


//UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //PASSWORD
        if (password && password.length < 6) {
            res.send({ error: "Password is requred and 6 charater long" })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });
    }
}

//test
export const test = async (req, res) => {
    res.send({
        message: "Test"
    })
}