import { Request, Response } from "express";
import { CustomRequest } from "../interface/user.interface";
import { ObjectId } from "mongodb";
import User from "../models/user.model";
import Optionscount from "../models/Options.model";
import Notification from "../models/notification.model";
import feuds from "../models/feuds.model";
import settings from "../models/setting.model";
import Joinfeud from "../models/joinFeud.model";
import Report from "../models/report.model"
import { otpSEND } from "../helper/otpSend.helper";
import { sendEMAIL } from "../helper/emailSend.helper";
import moment from "moment";
import dotenv from "dotenv";
import { stat } from "fs";
dotenv.config();

export class feudService {
  async createFeud(req: CustomRequest, res: Response) {
    const {
      title,
      pollquestion,
      options,
      rules,
      feudNow,
      feudLater,
      FeudDate,
      FeudTime,
      JoinFeud,
      individual,
      externalEmail,
      phoneNumber,
      inviteModerator,
    } = req.body;
    try {
      let user: any = await User.findOne({ _id: req.uId });
      if (!user) {
        return res.status(400).json({ message: "User is not exists" });
      }

      if(user.badge <= 2){
        return res.status(400).json({ message: "You cannot create feud please upgrade your badge!!" });
      }

      if (JoinFeud.includes(4)) {
        if (individual.length === 0) {
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
        externalEmail: externalEmail,
        phoneNumber: phoneNumber,
        JoinFeud: JoinFeud,
        status: 0,
      });
      const joinfeud: any = await Joinfeud.create({
        feudId: feudUser._id,
        inviteModerator: inviteModerator,
        participant : [{
          participantUser : req.uId,
          joinType: 3,
          status: 1
        }]
      });
      if (JoinFeud.includes(4)) {
        feudUser.individual = individual;
        feudUser.JoinFeud = 4;
        await feudUser.save();

        inviteModerator.map((x: any) => {
          Notification.create({
            userId: user._id,
            feudId: feudUser._id,
            rcvId: new ObjectId(`${x}`),
            title: "Feud join",
            subject: "Feud Moderate invitation.",
            description: `Feud join invitation received by ${user.first_name} ${user.last_name}`,
            read: false,
            type: "Moderate Feud",
            role: 0,
          });
        });

        individual.map((x: any) => {
          Notification.create({
            userId: user._id,
            feudId: feudUser._id,
            rcvId: new ObjectId(`${x}`),
            title: "Feud join",
            subject: "Feud join invitation.",
            description: `Feud join invitation received by ${user.first_name} ${user.last_name}`,
            read: false,
            type: "Join Feud",
            role: 0,
          });
        });
      }

      for (let index = 0; index < feudUser.options.length; index++) {
        await Optionscount.create({
          feudId: feudUser._id,
          optionName: feudUser.options[index].option,
          optionId: feudUser.options[index]._id,
        });
      }

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
    const { type, date, host, page = 1, limit = 10 } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const formattedDate = moment().format("YYYY/MM/DD");
  
    let updateQuery: any = {};
    if (type === 1) {
      updateQuery = { FeudDate: { $gt: formattedDate } };
    } else if (type === 2) {
      updateQuery = { FeudDate: { $eq: formattedDate } };
    } else if (type === 3) {
      updateQuery = { FeudDate: { $lt: formattedDate } };
    } else if (type === 4 && host === true) {
      updateQuery = { userId: req.uId, FeudDate: { $eq: date } };
    } else if (type === 4 && host === false) {
      updateQuery = { FeudDate: { $eq: date } };
    } else if (type === 5) {
      updateQuery = {};
    }
  
    try {
      const [feudUser, totalUsers, optionsData, moderators, inviteModerators] = await Promise.all([
        feuds
          .find(updateQuery)
          .select("title FeudDate rules externalEmail phoneNumber totalUser JoinFeud")
          .skip(skip)
          .limit(Number(limit))
          .sort({ FeudDate: -1 })
          .populate({
            path: "userId",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .lean()
          .exec(),
        feuds.countDocuments(updateQuery).exec(),
        Optionscount.find().select("feudId optionName optionId optionCount voteCount").lean().exec(),
        settings.find().lean(),
        Joinfeud
          .find()
          .select("feudId inviteModerator")
          .populate({
            path: "inviteModerator",
            select: "first_name last_name profilepic badge",
            model: "User",
          })
          .lean(),
      ]);
  
      const feudsDetail = feudUser.map((feud: any) => {
        const hasJoinTypeFour = feud.JoinFeud && feud.JoinFeud.some((join: any) => join === 4);
        if (hasJoinTypeFour) {
          const feudModedetail = inviteModerators
            .filter((join: any) => join.feudId.toString() === feud._id.toString())
            .flatMap((join: any) => ({
              ...join,
              inviteModerator: join.inviteModerator
                .slice(0, 1)
                .flatMap((moderator: any) => {
                  const moderatorSettings = moderators.find(
                    (mod: any) => mod.userId.toString() === moderator._id.toString()
                  );
                  return {
                    ...moderator,
                    moderatorType: {
                      modeType: moderatorSettings?.optIns?.beModerator?.moderatorType ?? null,
                      moderatorPrice: moderatorSettings?.optIns?.beModerator?.price ?? null,
                    },
                  };
                }),
            }));
  
          const optiondata = {
            totalVotes: optionsData
              .filter((option) => option.feudId.toString() === feud._id.toString())
              .reduce((acc: number, option: any) => acc + option.optionCount.length, 0),
            feudOptions: optionsData.filter((option: any) => option.feudId.toString() === feud._id.toString()),
          };
  
          return {
            ...feud,
            feudModedetail,
            optiondata,
          };
        } else {
          return {
            ...feud,
            joinFeud: [],
            optiondata: {
              totalVotes: 0,
              feudOptions: [],
            },
          };
        }
      });
  
      const totalPages = Math.ceil(totalUsers / Number(limit));
  
      return res.status(200).json({
        status: true,
        message: "Feuds fetched successfully!!!",
        data: {
          feudsDetail,
          paginationData: {
            totalCount: totalUsers,
            currentPage: Number(page),
            totalPages,
            limit: Number(limit),
          },
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }

  async getNotification(req: CustomRequest, res: Response) {
    const { page = 1, limit = 10 } = req.body;
    try {
      const skip = (page - 1) * limit;

      const [Notifications, totalNotification] = await Promise.all([
        Notification.find({ rcvId: req.uId})
          .select("feudId isRead title subject description type role")
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
        return res.status(200).json({
          status: true,
          message: "Notifications fetched successfully!!!",
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
          unreadCount,
          Notifications,
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

  async acceptModeratorRequest(req: CustomRequest, res: Response) {
    const { notificationId, isAccept, isDecline } = req.body;
    let userId:any = new ObjectId(`${req.uId}`);
    try {

      const notification:any = await Notification.findOne({ _id: notificationId,rcvId: userId, type: "Moderate Feud"});
      if (!notification) {
        return res.status(400).json({ status: false, message: "Notification not found" });
      }
      
      const user:any = await User.findOne({ _id: req.uId });
      if (user.badge <= 2) {
        return res.status(400).json({ message: "You cannot accept the notification. Please upgrade your badge!" });
      }
      
      if (isAccept === true) {

        const join:any = await Joinfeud.findOne({ feudId: notification.feudId });
        if (join.moderator.moderatorUser) {
          return res.status(400).json({ status: false, message: "You can't be a moderator!" });
        }
        
        await Notification.updateOne(
          { _id: notificationId },
          { $set: { isAccept: true }, description : "Feud join invitation request Accepted!!!" }
        );

        Notification.create({
          userId: req.uId,
          feudId: notification.feudId,
          rcvId: notification.userId,
          title: "Accept Feud join",
          subject: "Accept Feud Moderate invitation.",
          description: `${user.first_name} ${user.last_name} has been Accepted your Feud join invitation.`,
          read: false,
          type: "Accept Moderate Feud",
          role: 0,
          isAccept: true
        });
        
        await Joinfeud.updateOne(
          { feudId: notification.feudId, inviteModerator: req.uId },
          { $set: { "moderator.moderatorUser": req.uId }, $pull: { inviteModerator: req.uId }}
        );
        
        return res.status(200).json({ status: true, message: "Notification accepted successfully!" });
      } 
      if (isDecline === false) {
        await Joinfeud.updateOne(
          { feudId: notification.feudId, inviteModerator: req.uId },
          { $pull: { inviteModerator: req.uId }, description : "Feud join invitation request declined." }
        );

        Notification.create({
          userId: req.uId,
          feudId: notification.feudId,
          rcvId: notification.userId,
          title: "Decline Feud join",
          subject: "Decline Feud Moderate invitation.",
          description: `${user.first_name} ${user.last_name} decline your Feud join invitation.`,
          read: false,
          type: "Decline Moderate Feud",
          role: 0,
          isAccept: false
        });

        return res.status(200).json({ status: true, message: "Notification declined successfully!" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error!" });
    }
  }

  async getVotecount(req: CustomRequest, res: Response) {
    const { feudId } = req.body;
    try {
      const feudOptions = await Optionscount.find({ feudId }).select("feudId optionName optionId voteCount");
      if (!feudOptions.length) {
        return res.status(404).json({ status: false, message: "No options found for this feud." });
      }
  
      const joined = await Joinfeud.findOne({ feudId });
      if (!joined) {
        return res.status(404).json({ status: false, message: "Join feud does not exist." });
      }
      
      const totalVotes = feudOptions.reduce((total:any, option:any) => total + option.voteCount, 0);
      const totalParticipants = joined.participant.length;
  
      const feudsFirstModerator = feudOptions.map((option:any) => {
        const percentage = totalParticipants ? Math.round((option.voteCount / totalParticipants) * 100) : 0;
        return { option, percentage };
      });
  
      return res.status(200).json({
        status: true,
        message: "Options fetched successfully!",
        data: { feudsFirstModerator, totalCounts: totalVotes }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async Votecount(req: CustomRequest, res: Response) {
    const { feudId, optionId, isAdd } = req.body;
    const userId: any = req.uId;
    try {
      const joined = await Joinfeud.findOne({ feudId, 'participant.participantUser': userId });
      if (!joined) {
        return res.status(400).json({ message: "You must join the feud first!" });
      }
  
      const user: any = await User.findById(userId);
      if (user.badge <= 2) {
        return res.status(400).json({ message: "You cannot vote, please upgrade your badge!" });
      }
  
      const feudOptions: any = await Optionscount.find({ feudId });
  
      const userVotedOption = feudOptions.find((option: any) => option.optionCount.includes(userId));
      if (userVotedOption) {
        await Optionscount.updateOne(
          { feudId, optionId: userVotedOption.optionId },
          { $pull: { optionCount: userId }, $inc: { voteCount: -1 } }
        );
      }
  
      if (isAdd === false) {
        const updatedFeudOptions: any = await Optionscount.find({ feudId });
        return res.status(200).json({ status: true, message: "Vote removed successfully!", data: updatedFeudOptions });
      }
  
      const updateOperation = { $addToSet: { optionCount: userId }, $inc: { voteCount: 1 } };
  
      const updatedOption = await Optionscount.findOneAndUpdate(
        { feudId, optionId },
        updateOperation,
        { new: true }
      );
  
      if (!updatedOption) {
        return res.status(404).json({ status: false, message: "The selected option does not exist for this feud." });
      }
  
      const updatedFeudOptions: any = await Optionscount.find({ feudId });
  
      return res.status(200).json({ status: true, message: "Vote added successfully!", data: updatedFeudOptions });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }
  
  async joinFeud(req: CustomRequest, res: Response) {
    const { feudId, participant, spector, isNotify } = req.body;
    try {
      let joinfeud: any = await Joinfeud.findOne({ feudId: feudId });
      if (!joinfeud) {
        return res.status(400).json({ status: false, message: "Feud is not exist!!" });
      }
      let user: any = await User.findOne({ _id: req.uId });
      if(user.badge <= 2){
        return res.status(400).json({ message: "You cannot Vote please upgrade your badge!!" });
      }

      let participants = joinfeud.participant;

      if (participant === true) {
        if(participants.length >= 50){
          return res.status(400).json({ status: false, message: "50 Participants Joined out of 50, You can't joined as participant"})
        }
        joinfeud.participant.push({
          participantUser: req.uId,
          joinType:  1,
          status: 1,
        });
      }
      if (spector === true) {
        joinfeud.spectors.push({
          spectorUser: req.uId,
          isAlert: isNotify === false ? false : true,
        });
      }
      await joinfeud.save();

      return res.status(200).json({ status: true, message: "Join feud successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async editFeud(req: CustomRequest, res: Response) {
    const {
      feudId,
      title,
      pollquestion,
      options,
      rules,
      feudNow,
      feudLater,
      FeudDate,
      FeudTime,
      JoinFeud,
      individual,
      externalEmail,
      phoneNumber,
      inviteModerator,
    } = req.body;
    try {

      let curruserId = new ObjectId(`${req.uId}`);
      let editfeud: any = await feuds.findOne({ _id: feudId });
      let joinfeud: any = await Joinfeud.findOne({ feudId: feudId });

      if (!editfeud || !joinfeud) {
        return res.status(400).json({ status: false, message: "Feud or join feud does not exist!" });
      }

      let currUser: any = await User.findOne({ _id: editfeud.userId });

      let existIndividual: any = editfeud.individual;
      let existEmail: any = editfeud.externalEmail;
      let existPhone: any = editfeud.phoneNumber;
      let existModerator: any = joinfeud.inviteModerator;

      if (curruserId.equals(editfeud.userId)) {
        editfeud.userId = req.uId;
        editfeud.title = title;
        editfeud.pollquestion = pollquestion;
        editfeud.options = options;
        editfeud.rules = rules;
        editfeud.feudNow = feudNow;
        editfeud.feudLater = feudLater;
        editfeud.FeudDate = FeudDate;
        editfeud.FeudTime = FeudTime;
        editfeud.externalEmail = externalEmail;
        editfeud.phoneNumber = phoneNumber;
        editfeud.JoinFeud = JoinFeud.includes(4) || JoinFeud > 2 ? 4 : JoinFeud;
        editfeud.individual = individual;
        editfeud.status = 0;
        await editfeud.save();

        joinfeud.inviteModerator = inviteModerator;
        await joinfeud.save();

        await Optionscount.deleteMany({ feudId: { $eq: feudId }});
        for (let index = 0; index < editfeud.options.length; index++) {
          await Optionscount.create({
            feudId: editfeud._id,
            optionName: editfeud.options[index].option,
            optionId: editfeud.options[index]._id,
          });
        }

        let newUser: any = editfeud.individual;
        let user = newUser.filter((x: any) => !existIndividual.includes(x));
        let removeindividual = existIndividual.filter((x: any) => !newUser.includes(x));
        await Notification.deleteMany({
          type: "Join Feud",
          rcvId: removeindividual,
        });

        user.map((x: any) => {
          Notification.create({
            userId: currUser._id,
            feudId: editfeud._id,
            message: `${currUser.first_name} ${currUser.last_name} Invited you to Join a Feud`,
            rcvId: new ObjectId(`${x}`),
            title: "Feud join",
            subject: "Feud join invitation.",
            description: `Feud join invitation received by ${currUser.first_name} ${currUser.last_name}`,
            read: false,
            type: "Join Feud",
            role: 0,
          });
        });

        let newModerator: any = joinfeud.inviteModerator;
        let NewMode = newModerator.filter((x: any) => !existModerator.includes(x));
        let removeNewMode = existModerator.filter((x: any) => !newModerator.includes(x));
        await Notification.deleteMany({
          type: "Moderate Feud",
          rcvId: removeNewMode,
        });

        NewMode.map((x: any) => {
          Notification.create({
            userId: currUser._id,
            feudId: editfeud._id,
            message: `${currUser.first_name} ${currUser.last_name} Invited you to Moderate a Feud`,
            rcvId: new ObjectId(`${x}`),
            title: "Feud join",
            subject: "Feud Moderate invitation.",
            description: `Feud join invitation received by ${currUser.first_name} ${currUser.last_name}`,
            read: false,
            type: "Moderate Feud",
            role: 0,
          });
        });

        // let newEmail:any = editfeud.externalEmail;
        // let NewEmail = newEmail.filter((x:any) => !existEmail.includes(x));
        // NewEmail.map((z:any) => {
        //   sendEMAIL(z, "Hello", "Invite to join feud", `${currUser.first_name} ${currUser.last_name} invited you to join feud!!`);
        //   return sendEMAIL;
        // })

        // let newPhone:any = editfeud.phoneNumber;
        // let NewPhone = newPhone.filter((x:any) => !existPhone.includes(x));
        // NewPhone.map((y:any) => {
        //   return otpSEND(y, `${currUser.first_name} ${currUser.last_name} invited you to join feud!!`);
        // })
      }

      return res.status(200).json({ status: true, message: "Feud edited successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async cancelFeud(req: CustomRequest, res: Response) {
    const { feudId } = req.body;
    try {
      let curruserId = new ObjectId(`${req.uId}`);
      let cancelfeud: any = await feuds.findOneAndDelete({_id: feudId,userId: curruserId,});
      if (!cancelfeud) {
        return res.status(400).json({ status: false, message: "Feud is not exist!!" });
      }
      await Joinfeud.findOneAndDelete({ feudId: feudId });
      await Notification.deleteMany({ feudId: feudId });
      await Optionscount.deleteMany({ feudId: feudId });

      return res.status(200).json({ status: true, message: "Feud Cancel successfully!" });
    } catch (err) {
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async cancelFeudReservation(req: CustomRequest, res: Response) {
    const { feudId, isCancel } = req.body;
    try {
      let curruserId = new ObjectId(`${req.uId}`);
      if(isCancel === true){
        let feudReservation = await Joinfeud.findOneAndUpdate(
          { feudId: feudId, "participant.participantUser": curruserId },
          { $pull: { participant: { participantUser: curruserId } } },
          { new: true }
        );
        if (!feudReservation) {
          return res.status(400).json({ status: false, message: "Feud is not exist!!" });
        }
      }

      return res.status(200).json({status: true,message: "Feud Reservation Canceled successfully!"});
    } catch (err) {
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async FeudsyouHosted(req: CustomRequest, res: Response) {
    try {
      let feud = await feuds.find({ userId: req.uId });
      if (!feud) {
        return res.status(400).json({ status: false, message: "Feud does not exist!!" });
      }
      let user: any = await User.findOne({ _id: req.uId });
      if(user.badge <= 2){
        return res.status(400).json({ message: "You cannot have ant feuds please upgrade your badge!!" });
      }
  
      let joinfeud = await Joinfeud.find({ 'participant.participantUser': req.uId, 'participant.joinType': 3 });
  
      let Participant = joinfeud.map((max: any) => max.participant.length);
      let spectors = joinfeud.map((max: any) => max.spectors.length);
  
      let Participantsum = Participant.reduce((acc: number, curr: number) => acc + curr, 0);
      let Spectorsum = spectors.reduce((acc: number, curr: number) => acc + curr, 0);
  
      let HostedFeuddetails = {
        hostCount: joinfeud.length,
        maxParticipant: Math.max(...Participant),
        minParticipant: Math.min(...Participant),
        avgParticipant: Math.round(Participantsum / Participant.length),
        maxSpecors: Math.max(...spectors),
        minSpecors: Math.min(...spectors),
        avgSpecors: Math.round(Spectorsum / spectors.length)
      };
  
      return res.status(200).json({ status: true, message: "Hosted Feud fetched successfully!!", HostedFeuddetails });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async rentBackskin(req: CustomRequest, res: Response) {
    const {isEnabled, Price, category} = req.body
    try {
      let user:any = await User.findOne({_id: req.uId});
      if(!user){
        return res.status(400).json({status:false, message:"User is not exist!!"});
      }
      if(user.badge === 1){
        return res.status(400).json({ message: "You cannot rent backskin upgrade your badge!!" });
      }

      let setting:any = await settings.findOne({userId: req.uId});
      if(!setting){
        return res.status(400).json({status:false, message:"Settings is not exist!!"});
      }

      let check:any = setting.rentSkin.categories;
      if(isEnabled === true){
        setting.rentSkin.rentprice = Price;
        for (let value of category) {
          if (!check.includes(value)) {
              check.push(value);
          }
        }
        await setting.save();
        return res.status(200).json({ status: true, message: "Backskin rent successfully!!"});
      } else {
        return res.status(400).json({status:false, message:"Rent Backskin has disabled!!"});
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async itemVisibility(req: CustomRequest, res: Response) {
    const {seeItem, individual} = req.body
    try {
      let user:any = await User.findOne({_id: req.uId});
      if(!user){
        return res.status(400).json({status:false, message:"User is not exist!!"});
      }
      if(user.badge === 1){
        return res.status(400).json({ message: "You cannot manage item visibility upgrade your badge!!" });
      }

      let setting:any = await settings.findOne({userId: req.uId});
      if(!setting){
        return res.status(400).json({status:false, message:"Settings is not exist!!"});
      }

      setting.itemVisible.seeItem = seeItem;
      if(seeItem === 6){
        setting.itemVisible.individual = individual;
      }
      await setting.save();

      return res.status(200).json({ status: true, message: "Manage visible item successfully!!"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async kickOutModeratorRule(req: CustomRequest, res: Response) {
    const {iskickout, reason, otherReason, feudId, moderatorId} = req.body
    try {
      let feud:any = await Joinfeud.findOne({'participant.participantUser': req.uId,'moderator.moderatorUser': moderatorId});
      if(!feud){
        return res.status(400).json({status:false, message:"Participant is not exist!!"});
      }
      
      if(iskickout === true){
        await Report.create({
          userId: req.uId,
          ReportedUserId: moderatorId,
          reason: reason,
          otherReason: otherReason,
          feudId: feudId,
          isModerator: true
        });
        feud.moderator.status = 1;
        await feud.save();
      }

      return res.status(200).json({ status: true, message: "Kick out moderator reason added successfully!!"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async getKickoutCount(req: CustomRequest, res: Response) {
    const { feudId, isCancel, isKickout, ModeratorId } = req.body;
    let userId:any = req.uId;
    try {
      let feud: any = await Joinfeud.findOne({ 'participant.participantUser': req.uId, feudId: feudId });
      if (!feud) {
        return res.status(400).json({ status: false, message: "Participant does not exist!!" });
      }
  
      let report: any = await Report.findOne({ feudId: feudId })
        .populate({
          path: "ReportedUserId",
          select: "first_name last_name",
          model: "User",
        });
      if (!report) {
        return res.status(400).json({ status: false, message: "Report does not exist!!" });
      }
  
      let agree: any = feud.moderator.agree;
      let disagree: any = feud.moderator.disagree;
  
      let kickout: any = {
        KickOutModerator: report.ReportedUserId.first_name + report.ReportedUserId.last_name,
        YesCount: agree.length,
        NoCount: disagree.length
      };

      if(agree.length > disagree.length){
        if (isKickout === true) {
          await Joinfeud.updateOne(
            {feudId:feudId, 'participant.participantUser': req.uId, 'participant.joinType': 3 ,'moderator.moderatorUser': ModeratorId},
            { $unset : {'moderator.moderatorUser': ""},
              $set : {
                'moderator.agree': [],
                'moderator.disagree': [],
                'moderator.status': 0,
                'removeModerator.removeModeratorUser' : ModeratorId,
                'removeModerator.removeAt' : Date.now()
              }
            }
          )
        }
      } else if(isCancel === true) {
          await Report.deleteOne({ feudId: feudId });
          await Joinfeud.updateOne(
            {feudId:feudId, 'participant.participantUser': req.uId, 'participant.joinType': 3 ,'moderator.moderatorUser': ModeratorId},
            { $set : {
              'moderator.status': 0,
              'moderator.agree': [],
              'moderator.disagree': []
              }
            }
          )
          return res.status(400).json({status: false, message:"Yes counts is less than to No counts!!"})
      }
    
      return res.status(200).json({ status: true, message: "Get Kick out Vote count successfully!!", kickout });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }
  
  async addKickoutVote(req: CustomRequest, res: Response) {
    const { feudId, isYes, isNo } = req.body;
    try {
      let feud = await Joinfeud.findOne({ 'participant.participantUser': req.uId, feudId: feudId });
      if (!feud) {
        return res.status(400).json({ status: false, message: "Participant does not exist!" });
      }
  
      let report = await Report.findOne({ feudId: feudId });
      if (!report) {
        return res.status(400).json({ status: false, message: "Report does not exist!" });
      }
  
      await Joinfeud.updateOne(
        { feudId: feudId },
        { $pull: { 'moderator.agree': req.uId, 'moderator.disagree': req.uId } }
      );
  
      if (isYes === true) {
        await Joinfeud.updateOne(
          { feudId: feudId },
          { $addToSet: { 'moderator.agree': req.uId } }
        );
      } else if (isNo === true) {
        await Joinfeud.updateOne(
          { feudId: feudId },
          { $addToSet: { 'moderator.disagree': req.uId } }
        );
      }

      const updatedFeud = await Joinfeud.findOne({ feudId: feudId });
  
      return res.status(200).json({ status: true, message: "Kick out moderator vote added successfully!", feud: updatedFeud?.moderator });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async endFeudResponse(req: CustomRequest, res: Response) {
    const { feudId, rate } = req.body;
    try {
      let feud = await Joinfeud.findOne({ 'participant.participantUser': req.uId, feudId: feudId });
      if (!feud) {
        return res.status(400).json({ status: false, message: "Participant does not exist!" });
      }
  
      return res.status(200).json({ status: true, message: "Your rate is submitted successfully!"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }
  
}
