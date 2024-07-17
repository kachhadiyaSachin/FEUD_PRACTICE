import { Request, Response } from "express";
import { CustomRequest } from "../interface/user.interface";
import { ObjectId } from "mongodb";
import User from "../models/user.model";
import Optionscount from "../models/Options.model";
import Notification from "../models/notification.model";
import { otpSEND } from "../helper/otpSend.helper";
import { sendEMAIL } from "../helper/emailSend.helper";
import moment from "moment";
import dotenv from "dotenv";
import feuds from "../models/feuds.model";
dotenv.config();

export class feudService {
  async createFeud(req: CustomRequest, res: Response) {
    const { title, pollquestion, options, rules, feudNow, feudLater, FeudDate, FeudTime, JoinFeud, individual, externalEmail, phoneNumber, inviteModerator} = req.body;
    try {
      let user: any = await User.findOne({ _id: req.uId });
      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }
      if (JoinFeud.includes(4)) {
        if (individual.length === 0) {
          return res
            .status(400)
            .json({ message: "Individual invite should not be empty!" });
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
      const feudUser: any = await feuds.create({
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
        inviteModerator: inviteModerator,
      });
      if (JoinFeud.includes(4)) {
        feudUser.individual = individual;
        await feudUser.save();
      }
      for (let index = 0; index < feudUser.options.length; index++) {
        await Optionscount.create({
          feudId: feudUser._id,
          optionName: feudUser.options[index].option,
          optionId: feudUser.options[index]._id
        });
      }
      inviteModerator.map((x: any) => {
        Notification.create({
          userId: user._id,
          feudId: feudUser._id,
          message: `${user.first_name} ${user.last_name} Invited you to Moderate a Feud`,
          rcvId: new ObjectId(`${x}`),
          title: "Feud join",
          subject: "Feud join invitation.",
          description: `Feud join invitation received by ${user.first_name} ${user.last_name}`,
          read: false,
          type: "Feud",
          role: 0,              
        });
      });

      return res
        .status(200)
        .json({ status: true, message: "Feud created successfully!!!" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error!!" });
    }
  }

  async getAllFeud(req: CustomRequest, res: Response) {
    const { type, date, host ,page = 1, limit = 10 } = req.body;
    try {
      const skip = (Number(page) - 1) * Number(limit);
      const formattedDate = moment().format('YYYY/MM/DD');

      let updateQuery = {};

      if (type === 1) {
        updateQuery = { FeudDate: { $gt: formattedDate } };
      } else if (type === 2) {
        updateQuery = { FeudDate: { $eq: formattedDate } };
      } else if (type === 3) {
        updateQuery = { FeudDate: { $lt: formattedDate } };
      } else if (type === 4 && host === true) {
        updateQuery = { userId : req.uId}
      } else if (type ===4 && host === false) {
        updateQuery = {}
      } else if ( type === 5) {
        updateQuery = { FeudDate: {$eq : date} }
      }
      
      const [feudUser, totalUsers] = await Promise.all([
        feuds
          .find(updateQuery)
          .select("title FeudDate totalUser")
          .skip(skip)
          .limit(Number(limit))
          .sort({ FeudDate: -1 })
          .populate({
            path: "inviteModerator",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .populate({
            path:"userId",
            select: "optIns.beModerator",
            model:"settings"
          })
          .populate({ 
            path: "userId",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .lean()
          .exec(),
        feuds.find(updateQuery).countDocuments().exec(),
        Optionscount.find().select("feudId optionName optionId optionCount voteCount")
      ]);

      const feudsFirstModerator = feudUser.map((feud:any) => {
        if (feud.inviteModerator && feud.inviteModerator.length > 0) {
          feud.inviteModerator = feud.inviteModerator[0];
        } else {
          feud.inviteModerator = null;
        }
        return feud;
      });
      
      if (feudUser.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No feuds found",
          data: {
            feudsFirstModerator: [],
            paginationData: {
              totalCount: 0,
              currentPage: Number(page),
              totalPages: 0,
              limit: Number(limit),
            },
          },
        });
      }

      const optionFind = await Optionscount.find({});
      const feudWithOptionsData = feudsFirstModerator.map((feud: any) => {
        const feudOptions = optionFind.filter((option: any) => option.feudId.toString() === feud._id.toString());

        let totalcount = feudOptions.map((x:any) =>  x.optionCount.length);
        const sum = totalcount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return {
          ...feud,
          optiondata: {
            totalVotes : sum,
            feudOptions
          },
        };
      });
    
      const totalPages = Math.ceil(totalUsers / Number(limit));

      const feud = await feuds.find({});
      return res.status(200).json({
        status: true,
        message: "Feuds fetched successfully!!!",
        data: {
          feudsFirstModerator: feudWithOptionsData,
          paginationData: {
            totalCount: totalUsers,
            currentPage: Number(page),
            totalPages,
            limit: Number(limit),
          },
        },
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error!!" });
    }
  }

  async getNotification(req: CustomRequest, res: Response) {
    const page = req.body.page | 1;
    const limit = req.body.limit | 10;
    try {
      const skip = (page - 1) * limit;

      const [Notifications, totalNotification] = await Promise.all([
        Notification.find({ rcvId: req.uId })
          .select("message isRead")
          .skip(skip)
          .limit(limit)
          .sort({ _id: -1 })
          .populate({
            path: "userId",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .lean()
          .exec(),
        Notification.find({ rcvId: req.uId }).countDocuments().exec(),
      ]);
      
      if (Notifications.length === 0) {
        return res.status(400).json({
          status: false,
          message: "No feuds found",
          data: {
            paginationData: {
              totalCount: 0,
              currentPage: Number(page),
              totalPages: 0,
              limit: Number(limit),
            },
            Notification: [],
          },
        });
      }
  
      const unreadCount = Notifications.reduce((count, notification) => {
        return notification.isRead === false ? count + 1 : count;
      }, 0);

      await Notification.updateMany(
        { rcvId: req.uId },
        { $set: { isRead: true } }
      );

      const totalPages = Math.ceil(totalNotification / Number(limit));

      return res.status(200).json({
        status: true,
        message: "Notifications fetched successfully!!!",
        data: {
          unreadCount,Notifications,
          paginationData: {
            totalCount: totalNotification,
            currentPage: Number(page),
            totalPages,
            limit: Number(limit),
          },
        },
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error!!" });
    }
  }

  async getVotecount(req: CustomRequest, res: Response) {
    const { feudId } = req.body;
    try {
      //const feuduser = await Optionscount.find({feudId: feudId});
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error!!" });
    }
  }
}
