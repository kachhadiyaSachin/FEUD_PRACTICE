import { Request, Response } from "express";
import { CustomRequest } from "../interface/user.interface";
import { ObjectId } from 'mongodb';
import User from "../models/user.model";
import feuds from "../models/feuds.model";
import feudsOptionscount from "../models/Options.model";
import feudsNotification from "../models/notification.model";
import { otpSEND } from "../helper/otpSend.helper";
import { sendEMAIL } from "../helper/emailSend.helper";
import dotenv from 'dotenv';
dotenv.config();

export class feudService {
  async createFeud(req: CustomRequest, res: Response) {
    const { title, pollquestion, options, rules, feudNow, feudLater, FeudDate, FeudTime, JoinFeud, individual, externalEmail, phoneNumber ,inviteModerator} = req.body;
    try {
      let user: any = await User.findOne({ _id: req.uId });
      let feudUser: any = await feuds.findOne({userId: req.uId});
      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }
      if(JoinFeud.includes(4)){
        if(individual.length === 0){
          return res.status(400).json({ message: "Individual invite should not be empty!" });
        }
        // const sendSms = phoneNumber.map((y:any) => {
        //   return otpSEND(y, `${user.first_name} ${user.last_name} invited you to join feud!!`);
        // })
        // const sendEmail = externalEmail.map((z:any) => {
        //   sendEMAIL(
        //     z,
        //     "Hello",
        //     "Invite to join feud",
        //     `${user.first_name} ${user.last_name} invited you to join feud!!`
        //   );
        //   return sendEMAIL;
        // })
      }
      const check = inviteModerator.map((x:any) => {
        if(x === user.id){
          return true;
        }
        return false;
      });
      if(check === true){
        return res.status(400).json({ message: "You cannot invite yourself as a moderator!" });
      }
    
      feudUser = await feuds.create({
        userId: req.uId,
        title: title,
        pollquestion: pollquestion,
        options: options,
        rules: rules,
        feudNow: feudNow,
        feudLater: feudLater,
        FeudDate: FeudDate,
        FeudTime: FeudTime,
        JoinFeud: JoinFeud,
        inviteModerator: inviteModerator
      });
      if(JoinFeud.includes(4)){
        feudUser.individual = individual;
        await feudUser.save();
      }

      for (let index = 0; index < feudUser.options.length; index++) {
        await feudsOptionscount.create({
          feudId: feudUser._id,
          optionId: feudUser.options[index]._id,
        });
      }

      inviteModerator.map((x:any) => {
        feudsNotification.create({
          userId: user._id,
          feudId: feudUser._id,
          message: `${user.first_name} ${user.last_name} Invited you to Moderate a Feud`,
          rcvId: new ObjectId(`${x}`)
        });
      });
      

      return res.status(200).json({ status: true, message: "Feud created successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }


  async myFeud(req: CustomRequest, res: Response) {
    const { page = 1, limit = 10 } = req.body;
    try {
      const skip = (Number(page) - 1) * Number(limit);

      const [feudUser, totalUsers] = await Promise.all([
        feuds.find()
          .select("title")
          .skip(skip)
          .limit(Number(limit))
          .sort({ _id: -1 })
          .populate({
            path: "inviteModerator",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .populate({
            path: "userId",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .lean()
          .exec(),
        feuds.countDocuments().exec()
      ]);
  
      if (feudUser.length === 0) {
        return res.status(400).json({status: false, message: "No feuds found", data: {
          feudUser: [],
          paginationData: {
            totalCount: 0,
            currentPage: Number(page),
            totalPages: 0,
            limit: Number(limit)
          }
        } });
      }
  
      const totalPages = Math.ceil(totalUsers / Number(limit));
  
      return res.status(200).json({
        status: true,
        message: "Feuds fetched successfully!!!",
        data: {
          feudUser,
          paginationData: {
            totalCount: totalUsers,
            currentPage: Number(page),
            totalPages,
            limit: Number(limit)
          }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }


  async getNotification(req: CustomRequest, res: Response) {
    const { page = 1, limit = 10 } = req.body;
    try {
      const skip = (Number(page) - 1) * Number(limit);

      const [Notification, totalNotification] = await Promise.all([
        feudsNotification.find({rcvId: req.uId})
          .select("message")
          .skip(skip)
          .limit(Number(limit))
          .sort({ _id: -1 })
          .populate({
            path: "userId",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .populate({
            path: "feudId",
            select: "title",
            model: "Feuds"
          })
          .lean()
          .exec(),
          feudsNotification.find({rcvId: req.uId}).countDocuments().exec()
      ]);
  
      if (Notification.length === 0) {
        return res.status(400).json({status: false, message: "No feuds found", data: {
          Notification: [],
          paginationData: {
            totalCount: 0,
            currentPage: Number(page),
            totalPages: 0,
            limit: Number(limit)
          }
        }})
      };

      const totalPages = Math.ceil(totalNotification / Number(limit));
  
      return res.status(200).json({
        status: true,
        message: "Notifications fetched successfully!!!",
        data: {
          Notification,
          paginationData: {
            totalCount: totalNotification,
            currentPage: Number(page),
            totalPages,
            limit: Number(limit)
          }
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

}