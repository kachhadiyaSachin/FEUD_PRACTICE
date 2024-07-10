import { Request, Response } from "express";
import User from "../models/user.model";
import feudUserRequest from "../models/request.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { otpSEND } from "../helper/otpSend.helper";
import { sendEMAIL } from "../helper/emailSend.helper";
import { CustomRequest } from "../interface/user.interface";
import dotenv from 'dotenv';
dotenv.config();

export class userService {
  async login(req: Request, res: Response) {
    const { countrycode, phonenumber } = req.body;
    const PhoneNumber = countrycode + phonenumber;
    try {
      const OTP_NUMBER = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
      const OTPbcryptpass = await bcrypt.hash(OTP_NUMBER, 10);

      let user: any = await User.findOne({ phonenumber: PhoneNumber });
      if (!user) {
        otpSEND(
          PhoneNumber,
          `You just sent an SMS ${OTP_NUMBER} to your number!!`
        );
        user = await User.create({
            phonenumber: PhoneNumber,
            phoneOTP: OTPbcryptpass,
            phoneOTPtimestamp: Date.now(),
            isActive: true,
        });
        return res.status(200).json({ message: "Your account has been created successfully!!!" });
      } else {
        await otpSEND(
          PhoneNumber,
          `You just sent an SMS ${OTP_NUMBER} to your number!!`
        );

        user.phoneOTP = OTPbcryptpass;
        user.phoneOTPtimestamp = Date.now();
        await user.save();

        return res.status(200).json({ message: "Your account OTP has been send successfully login now!!!" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async OTPcompare(req: Request, res: Response) {
    const { phonenumber,phoneOTP } = req.body;
    try {
      let phoneOTPfind: any = await User.findOne({ phonenumber });

      const OTPmatch = await bcrypt.compare(phoneOTP, phoneOTPfind.phoneOTP);
      if (!OTPmatch) {
        return res.status(400).json({ message: "OTP is incorrect" });
      }
      const currentDate = new Date().getTime();
      const OTPtimestamp = phoneOTPfind.phoneOTPtimestamp;
      if (currentDate - OTPtimestamp >= 60000) {
        return res.status(400).json({ message: "OTP is expired" });
      }

      phoneOTPfind.phoneVerify = true;
      await phoneOTPfind.save();

      const payload = {
        _id: phoneOTPfind._id,
      };

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }
      
      if(phoneOTPfind.emailVerify === true){
        let token = jwt.sign(payload, secretKey);
        if (!token) {
          return res.status(500).json({ status: false, message: "Please verify token" });
        }

        return res.status(200).json({ status: true, message: "User otp match successfully...", token: token, });
      }
      else{
        return res.status(200).json({status:true, message:"USer otp match successfully...",token: []});
      }

    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async ResendOTP(req: Request, res: Response) {
    const { phonenumber } = req.body;
    try {
      let user: any = await User.findOne({ phonenumber });
      if (!user) {
        return res.status(400).json({ message: "Phonenumber is not found" });
      }
      const OTP_NUMBER = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
      const OTPbcryptpass = await bcrypt.hash(OTP_NUMBER, 10);
      await otpSEND(
        phonenumber,
        `You just sent an SMS ${OTP_NUMBER} to your number!!`
      );
      user.phoneOTP = OTPbcryptpass;
      user.phoneOTPtimestamp = Date.now();
      await user.save();

      return res.status(200).json({ message: "OTP send successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }


  async signup(req: Request, res: Response) {
    const { phonenumber, first_name, last_name, email, dob } = req.body;
    try {
      let user: any = await User.findOne({ phonenumber });
      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }
      if(user.phoneVerify === false){
        return res.status(400).json({ message: "User phonenumber is not verified" });
      }
      if(email === user.email){
        return res.status(400).json({ message: "Email is already exist" });
      }

      const OTP_EMAIL = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
      const OTPbcryptpass = await bcrypt.hash(OTP_EMAIL, 10);
      await sendEMAIL(
        email,
        "Hello",
        "Hello world!",
        `You just received an EMAIL ${OTP_EMAIL} to your email!!`
      );

      user.first_name = first_name;
      user.last_name = last_name;
      user.email = email;
      user.dob = dob;
      user.emailOTP = OTPbcryptpass;
      user.emailOTPtimestamp = Date.now();
      await user.save();

      return res.status(200).json({ message: "Signup successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async EMAILOTPcompare(req: Request, res: Response) {
    const { email,emailOTP } = req.body;
    try {
      let emailOTPfind: any = await User.findOne({ email });

      const OTPmatch = await bcrypt.compare(emailOTP, emailOTPfind.emailOTP);
      if (!OTPmatch) {
        return res.status(400).json({ message: "OTP is incorrect" });
      }

      const currentDate = Date.now();
      const OTPtimestamp = emailOTPfind.emailOTPtimestamp;
      if (currentDate - OTPtimestamp >= 60000) {
        return res.status(400).json({ message: "OTP is expired" });
      }

      emailOTPfind.emailVerify = true;
      await emailOTPfind.save();

      const payload = {
        _id: emailOTPfind._id,
      };

      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }
      
      if(emailOTPfind.emailVerify === true && emailOTPfind.phoneVerify === true){
        let token = jwt.sign(payload, secretKey);
        if (!token) {
          return res.status(500).json({ status: false, message: "Please verify token" });
        }
        return res.status(200).json({ status: true, message: "User otp match successfully...", token: token, });
      }
      else{
        return res.status(200).json({status:true, message:"USer otp match successfully...",token: []});
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }


  async ResendEMAILOTP(req: Request, res: Response) {
    const { email } = req.body;
    try {
      let user: any = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email is not found" });
      }
      const OTP_EMAIL = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
      const OTPbcryptpass = await bcrypt.hash(OTP_EMAIL, 10);
      await sendEMAIL(
        email,
        "Hello",
        "Hello world!",
        `You just received an EMAIL ${OTP_EMAIL} to your email!!`
      );
      user.emailOTP = OTPbcryptpass;
      user.emailOTPtimestamp = Date.now();
      await user.save();

      return res.status(200).json({ message: "OTP send successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }


  async UPGRADEbadge(req: CustomRequest, res: Response) {
    const { isSkip, is2FA, isQA, securityQA } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId });
      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }
      if (user.badge === 2) {
        return res.status(400).json({ message: "You already have yellow badge" });
      }
      if(isSkip === true){
        user.isSkip = true;
        user.badge = 1;
        user.is2FA = false;
        user.isQA = false;
        user.otp2FA = "";
        user.securityQA = [];
        await user.save();
        return res.status(200).json({ message: "Yellow badge skip successfully!!!" });
      } else {

        if(is2FA === true){
          const OTP_NUMBER = Math.floor(Math.random() * (9999 - 1000) + 1000).toString();
          const OTPbcryptpass = await bcrypt.hash(OTP_NUMBER, 10);
          await otpSEND(
            user.phonenumber,
            `You just sent an SMS ${OTP_NUMBER} to your number!!`
          );
          user.otp2FA = OTPbcryptpass;
          user.OTP2FAtimestamp = Date.now();
          await user.save();
        }

        if(isQA === true){
          if(securityQA.length > 2){
            return res.status(400).json({ message: "Please fill only 2 security questions" });
          }
          user.securityQA = req.body.securityQA;
          await user.save();
        }

        if(is2FA === true && isQA === true){
          user.badge = 2;
          user.is2FA = true;
          user.isQA = true;
          await user.save();
          return res.status(200).json({ message: "Yellow badge upgrade successfully!!!" });
        }
        else{
          user.badge = 1;
          user.otp2FA = "";
          user.OTP2FAtimestamp = "";
          user.securityQA = [];
          await user.save();
          return res.status(400).json({ message: "Sorry your badge is not upgrade!!" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async OTP2FAverify(req: CustomRequest, res: Response) {
    const { otp2FA } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id : uId });
      const OTPmatch = await bcrypt.compare(otp2FA, user.otp2FA);
      if (!OTPmatch) {
        return res.status(400).json({ message: "OTP is incorrect" });
      }
      const currentDate = Date.now();
      const OTPtimestamp = user.OTP2FAtimestamp;
      if (currentDate - OTPtimestamp >= 60000) {
        return res.status(400).json({ message: "OTP is expired" });
      }
      user.is2FAverify = true;
      await user.save();

      return res.status(200).json({status:true, message:"User 2FA verify successfully..."});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async UPGRADEgreenbadge(req: CustomRequest, res: Response) {
    const { greenBADGE } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId });
      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }
      if (user.badge === 3) {
        return res.status(400).json({ message: "You already have green badge" });
      }
      let userReq = await feudUserRequest.findOne({userId: uId});
      if(!userReq){
        userReq = await feudUserRequest.create({
          userId: uId,
          status: 1,
          requestType: 1
        });
      }

      user.greenBADGE = req.body.greenBADGE;
      user.badge = 3;
      await user.save();

      return res.status(200).json({ message: "Green badge upgrade successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async UPGRADEbluebadge(req: CustomRequest, res: Response) {
    const { blueBADGE } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId });
      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }
      if (user.badge === 4) {
        return res.status(400).json({ message: "You already have blue badge" });
      }
      let userReq = await feudUserRequest.findOne({requestType: 2});
      if(!userReq){
        userReq = await feudUserRequest.create({
          userId: uId,
          status: 1,
          requestType: 2
        });
      }
      user.blueBADGE = req.body.blueBADGE;
      user.badge = 4;
      await user.save();
      
      return res.status(200).json({ message: "Blue badge upgrade successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async userProfile(req: CustomRequest, res: Response) {
    const { profilepic, username, gender, country, state, city, bio } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId });
      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }
      if (user.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if(user.isUsername === true){
        return res.status(400).json({ message: "Username is purchased succesfully"});
      }
      user.profilepic = profilepic;
      user.username = username;
      user.gender = gender;
      user.country = country;
      user.state = state;
      user.city = city;
      user.bio = bio;
      await user.save();

      return res.status(200).json({ message: "User profile created successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async usernameCheck(req: CustomRequest, res: Response) {
    const { username } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ username: username });
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      return res.status(200).json({ status: true, message: "Username is available" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async usernameSuggestion(req: CustomRequest, res: Response) {
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId }).select("first_name last_name");
      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }
      let usernames = [];
      for (let i = 0; i < 4; i++) {
        const first_letter = user.first_name.charAt(0);
        const last_letter = user.last_name.charAt(Math.floor(Math.random() * user.last_name.length));
        let usernameNumber = Math.floor(Math.random() * (99 - 10) + 10);
        let firstInitial = first_letter + last_letter + usernameNumber;
        usernames.push(firstInitial);
      }
      return res.status(200).json({ status: true, message: "Username is available", data: usernames });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async usernamePurchase(req: CustomRequest, res: Response) {
    const { username } = req.body;
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId });
      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }
      if(user.username === username){
        return res.status(400).json({ message: "Username already exists" });
      }
      if(username.length <= 4){
        user.isUsername = true;
      } else{
        user.isUsername = false;
        return res.status(400).json({ message: "Username must be 4 characters" });
      }
      user.username = username;
      await user.save();
      return res.status(200).json({ status: true, message: "Username purchase successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async getuserProfile(req: CustomRequest, res: Response) {
    const uId = req.uId;
    try {
      let user: any = await User.findOne({ _id: uId }).select("first_name last_name username email phonenumber profilepic dob gender country state city bio badge blueBADGE"); 
      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }
      return res.status(200).json({ status: true, message: "Username is available", data: user});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }
}
