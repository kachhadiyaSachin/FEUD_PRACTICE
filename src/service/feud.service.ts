import { Request, Response } from "express";
import { CustomRequest } from "../interface/user.interface";
import User from "../models/user.model";
import feuds from "../models/feuds.model";
import feudsOptionscount from "../models/feudsOptionscount.model";
import feudsNotification from "../models/createfeudmessage.model";
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
      if(rules.length > 3){
        return res.status(400).json({ message: "Rules should not exceed 3" });
      }
      if(options.length < 2){
        return res.status(400).json({ message: "Options should be atlease 2" });
      }
      if(JoinFeud.length > 4){
        return res.status(400).json({ message: "Join Feud should not exceed 4" });
      }
      if(JoinFeud[0] === 4 || JoinFeud.length > 3){
        if(individual.length < 1 || individual == undefined){
          return res.status(400).json({ message: "Individual invite should not be empty!" });
        }
      }
      if(externalEmail.length < 0 && phoneNumber.length < 0){
        return res.status(400).json({ message: "External email or phone number should not be empty" });
      }
      if(inviteModerator.length < 1 || inviteModerator == undefined){
        return res.status(400).json({ message: "Invite moderator should not be empty" });
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
      if(JoinFeud[0] === 4 || JoinFeud.length > 3){
        feudUser.individual = individual;
        feudUser.externalEmail = externalEmail;
        feudUser.phoneNumber = phoneNumber;
        await feudUser.save();
      }

      for (let index = 0; index < feudUser.options.length; index++) {
        await feudsOptionscount.create({
          feudId: feudUser._id,
          optionId: feudUser.options[index]._id,
        });
      }

      const feudsmessage = await feudsNotification.create({
        userId: feudUser._id,
        profilePic: user.profilepic,
        badge: user.badge,
        message: `${user.first_name} ${user.last_name} Invited you to Moderate a Feud`,
        title: feudUser.title,
      });

      return res.status(200).json({ status: true, message: "Feud created successfully!!!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }
}