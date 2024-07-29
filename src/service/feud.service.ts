import { Request, Response } from "express";
import { CustomRequest } from "../interface/user.interface";
import { ObjectId } from "mongodb";
import User from "../models/user.model";
import Optionscount from "../models/Options.model";
import Notification from "../models/notification.model";
import feuds from "../models/feuds.model";
import settings from "../models/setting.model";
import Joinfeud from "../models/joinFeud.model";
import { otpSEND } from "../helper/otpSend.helper";
import { sendEMAIL } from "../helper/emailSend.helper";
import moment from "moment";
import dotenv from "dotenv";
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
        externalEmail: externalEmail,
        phoneNumber: phoneNumber,
        JoinFeud: JoinFeud,
        status: 0,
      });
      const joinfeud: any = await Joinfeud.create({
        feudId: feudUser._id,
        inviteModerator: inviteModerator,
      });
      if (JoinFeud.includes(4)) {
        feudUser.individual = individual;
        feudUser.JoinFeud = 4;
        await feudUser.save();

        inviteModerator.map((x: any) => {
          Notification.create({
            userId: user._id,
            feudId: feudUser._id,
            message: `${user.first_name} ${user.last_name} Invited you to Moderate a Feud`,
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
            message: `${user.first_name} ${user.last_name} Invited you to Join a Feud`,
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
    try {
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
        updateQuery = { userId: req.uId };
      } else if (type === 4 && host === false) {
        updateQuery = {};
      } else if (type === 5) {
        updateQuery = { FeudDate: { $eq: date } };
      }

      const [feudUser, totalUsers, optionsData] = await Promise.all([
        feuds
          .find(updateQuery)
          .select(
            "title FeudDate rules externalEmail phoneNumber totalUser JoinFeud"
          )
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
        Optionscount.find()
          .select("feudId optionName optionId optionCount voteCount")
          .lean()
          .exec(),
      ]);

      const moderators = await settings.find().lean();
      const inviteModerators = await Joinfeud.find()
        .select("feudId inviteModerator")
        .populate({
          path: "inviteModerator",
          select: "first_name last_name profilepic badge",
          model: "User",
        })
        .lean();

      const feudsDetail = feudUser.map((feud: any) => {
        const hasJoinTypeFour =
          feud.JoinFeud && feud.JoinFeud.some((join: any) => join === 4);
        if (hasJoinTypeFour) {
          let feudModedetail = inviteModerators
            .filter(
              (join: any) => join.feudId.toString() === feud._id.toString()
            )
            .map((join: any) => ({
              ...join,
              inviteModerator: join.inviteModerator
                .slice(0, 1)
                .map((moderator: any) => {
                  const moderatorSettings = moderators.find(
                    (mod: any) =>
                      mod.userId.toString() === moderator._id.toString()
                  );
                  return {
                    ...moderator,
                    moderatorType: {
                      modeType:
                        moderatorSettings?.optIns?.beModerator?.moderatorType ??
                        null,
                      moderatorPrice:
                        moderatorSettings?.optIns?.beModerator?.price ?? null,
                    },
                  };
                }),
              optiondata: {
                totalVotes: optionsData
                  .filter(
                    (option) =>
                      option.feudId.toString() === join.feudId.toString()
                  )
                  .reduce(
                    (acc: number, option: any) =>
                      acc + option.optionCount.length,
                    0
                  ),
                feudOptions: optionsData.filter(
                  (option: any) =>
                    option.feudId.toString() === join.feudId.toString()
                ),
              },
            }));
          return {
            ...feud,
            feudModedetail,
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

      if (feudUser.length === 0) {
        return res.status(200).json({
          status: true,
          message: "Failed to fetched feud data!!",
          data: {
            feudsDetail: [],
            paginationData: {
              totalCount: 0,
              currentPage: Number(page),
              totalPages: 0,
              limit: Number(limit),
            },
          },
        });
      }

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
      return res
        .status(500)
        .json({ status: false, message: "Internal server error!!" });
    }
  }

  async getNotification(req: CustomRequest, res: Response) {
    const { page = 1, limit = 10 } = req.body;
    try {
      const skip = (page - 1) * limit;

      const [Notifications, totalNotification] = await Promise.all([
        Notification.find({ rcvId: req.uId })
          .select("feudId message isRead title subject description type role")
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

  async acceptNotification(req: CustomRequest, res: Response) {
    const { notificationId, isAccept } = req.body;
    try {
      let notification: any = await Notification.findOne({
        _id: notificationId,
        type: "Moderate Feud",
      });
      if (!notification) {
        return res
          .status(400)
          .json({ status: false, message: "Notification not found" });
      }

      let updateQuery: any = {};
      if (isAccept === true) {
        notification.isAccept = true;
        await notification.save();
        let join:any = await Joinfeud.findOne({feudId: notification.feudId})
        if (join.moderator.moderatorUser !== undefined) {
          return res.status(400).json({status : false, message: "You can't be moderator!!"})
        }
        updateQuery = {$set: { "moderator.moderatorUser": req.uId },$pull: { inviteModerator: req.uId }};
      } else if (isAccept === false) {
        updateQuery = { $pull: { inviteModerator: req.uId } };
      }

      await Joinfeud.findOneAndUpdate(
        { feudId: notification.feudId, inviteModerator: req.uId },
        updateQuery,
        { new: true }
      );

      return res.status(200).json({ status: true, message: "Notification accept successfully!!!" });
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
      const feudOptions = await Optionscount.find({ feudId: feudId }).select(
        "feudId optionName optionId voteCount"
      );
      if (!feudOptions) {
        return res
          .status(404)
          .json({ status: false, message: "No options found for this feud." });
      }

      let sum: any = 0;
      const feudPercentage = feudOptions.map(
        (percent: any) => percent.voteCount
      );
      feudPercentage.forEach((num) => {
        sum += num;
      });

      const feudsFirstModerator = await feudOptions.map((option: any) => {
        let calculate = (option.voteCount / sum) * 100;
        const percentage =
          option.voteCount !== undefined
            ? Math.round(isNaN(calculate) ? 0 : calculate)
            : 0;

        return {
          option,
          percentage,
        };
      });

      return res
        .status(200)
        .json({
          status: true,
          message: "Options fetched successfully!",
          data: { feudsFirstModerator, totalCounts: sum },
        });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  }

  async Votecount(req: CustomRequest, res: Response) {
    const { feudId, optionId, isAdd } = req.body;
    const userId: any = req.uId;
    try {
      const feudOptions = await Optionscount.find({ feudId: feudId });

      const userVotedOption = feudOptions.find((option) =>
        option.optionCount.includes(userId)
      );
      if (userVotedOption) {
        await Optionscount.updateOne(
          { feudId: feudId, optionId: userVotedOption.optionId },
          { $pull: { optionCount: userId } }
        );
        const remove: any = await Optionscount.findOne({
          feudId: feudId,
          optionId: userVotedOption.optionId,
        });
        if (remove && remove.voteCount > 0) {
          remove.voteCount = remove.voteCount - 1;
          await remove.save();
        }
      }

      const updateOperation =
        isAdd === true
          ? { $addToSet: { optionCount: userId } }
          : { $pull: { optionCount: userId } };
      const updatedOption: any = await Optionscount.findOneAndUpdate(
        { feudId: feudId, optionId: optionId },
        updateOperation,
        { new: true }
      );

      if (!updatedOption) {
        return res
          .status(404)
          .json({
            status: false,
            message: "The selected option does not exist for this feud.",
          });
      }

      if (isAdd === true) {
        updatedOption.voteCount = (updatedOption.voteCount || 0) + 1;
        await updatedOption.save();
      } else if (updatedOption.voteCount > 0) {
        updatedOption.voteCount = updatedOption.voteCount - 1;
        await updatedOption.save();
      }

      const updatedFeudOptions = await Optionscount.find({ feudId: feudId });

      return res
        .status(200)
        .json({
          status: true,
          message: "Vote recorded successfully!",
          data: updatedFeudOptions,
        });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  }

  async joinFeud(req: CustomRequest, res: Response) {
    const { feudId, participant, spector, firstUser, isNotify } = req.body;
    try {
      let joinfeud: any = await Joinfeud.findOne({ feudId: feudId });
      if (!joinfeud) {
        return res
          .status(400)
          .json({ status: false, message: "Feud is not exist!!" });
      }
      let participants = joinfeud.participant;

      if (participant === true) {
        joinfeud.participant.push({
          participantUser: req.uId,
          joinType: participants.length === 0 ? 3 : 1,
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

      return res
        .status(200)
        .json({ status: true, message: "Join feud successfully!" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error." });
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
      if (!editfeud) {
        return res
          .status(400)
          .json({ status: false, message: "Feud is not exist!!" });
      }
      let joinfeud: any = await Joinfeud.findOne({ feudId: feudId });
      if (!joinfeud) {
        return res
          .status(400)
          .json({ status: false, message: "join feud not exist!!" });
      }
      let currUser: any = await User.findOne({ _id: editfeud.userId });

      let existUser: any = editfeud.individual;
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
        if (JoinFeud.includes(4) || JoinFeud > 2) {
          editfeud.JoinFeud = 4;
        } else {
          editfeud.JoinFeud = JoinFeud;
        }
        editfeud.individual = individual;
        editfeud.status = 0;
        await editfeud.save();

        joinfeud.inviteModerator = inviteModerator;
        await joinfeud.save();

        let Opt: any = await Optionscount.deleteMany({
          feudId: { $eq: feudId },
        });
        for (let index = 0; index < editfeud.options.length; index++) {
          await Optionscount.create({
            feudId: editfeud._id,
            optionName: editfeud.options[index].option,
            optionId: editfeud.options[index]._id,
          });
        }

        let newUser: any = editfeud.individual;
        let user = newUser.filter((x: any) => !existUser.includes(x));
        let removeindividual = existUser.filter(
          (x: any) => !newUser.includes(x)
        );
        let removeIndividual: any = await Notification.deleteMany({
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
        let NewMode = newModerator.filter(
          (x: any) => !existModerator.includes(x)
        );
        let removeNewMode = existModerator.filter(
          (x: any) => !newModerator.includes(x)
        );
        let removeMode: any = await Notification.deleteMany({
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
        // const sendEmail = NewEmail.map((z:any) => {
        //   sendEMAIL(z, "Hello", "Invite to join feud", `${currUser.first_name} ${currUser.last_name} invited you to join feud!!`);
        //   return sendEMAIL;
        // })

        // let newPhone:any = editfeud.phoneNumber;
        // let NewPhone = newPhone.filter((x:any) => !existPhone.includes(x));
        // const sendSms = NewPhone.map((y:any) => {
        //   return otpSEND(y, `${currUser.first_name} ${currUser.last_name} invited you to join feud!!`);
        // })
      }

      return res
        .status(200)
        .json({ status: true, message: "Feud edited successfully!" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  }

  async cancelFeud(req: CustomRequest, res: Response) {
    const { feudId } = req.body;
    try {
      let curruserId = new ObjectId(`${req.uId}`);
      let cancelfeud: any = await feuds.findOneAndDelete({
        _id: feudId,
        userId: curruserId,
      });
      if (!cancelfeud) {
        return res
          .status(400)
          .json({ status: false, message: "Feud is not exist!!" });
      }
      await Joinfeud.findOneAndDelete({ feudId: feudId });
      await Notification.deleteMany({ feudId: feudId });
      await Optionscount.deleteMany({ feudId: feudId });

      return res
        .status(200)
        .json({ status: true, message: "Feud Cancel successfully!" });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  }

  async cancelFeudReservation(req: CustomRequest, res: Response) {
    const { feudId } = req.body;
    try {
      let curruserId = new ObjectId(`${req.uId}`);
      let feudReservation = await Joinfeud.findOneAndUpdate(
        { feudId: feudId, "participant.participantUser": curruserId },
        { $pull: { participant: { participantUser: curruserId } } },
        { new: true }
      );
      if (!feudReservation) {
        return res
          .status(400)
          .json({ status: false, message: "Feud is not exist!!" });
      }

      return res
        .status(200)
        .json({
          status: true,
          message: "Feud Reservation Canceled successfully!",
        });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status: false, message: "Internal server error." });
    }
  }

  async FeudsyouHosted(req: CustomRequest, res: Response) {
    try {
      let feud = await feuds.find({ userId: req.uId });
      if (!feud) {
        return res.status(400).json({ status: false, message: "Feud does not exist!!" });
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

      let setting:any = await settings.findOne({userId: req.uId});
      if(!setting){
        return res.status(400).json({status:false, message:"Settings is not exist!!"});
      }
      
      if(isEnabled === true){
        setting.rentSkin.rentprice = Price;
        setting.rentSkin.categories = category;
        await setting.save();
      } else {
        return res.status(400).json({status:false, message:"Rent Backskin has disabled!!"});
      }

      return res.status(200).json({ status: true, message: "Backskin rent successfully!!"});
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
  
}
