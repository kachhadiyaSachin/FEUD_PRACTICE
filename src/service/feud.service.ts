import { Request, Response } from "express";
import { CustomRequest } from "../interface/user.interface";
import ObjectId from 'mongodb';
import User from "../models/user.model";
import feuds from "../models/feuds.model";
import feudsOptionscount from "../models/Options.model";
import feudsNotification from "../models/notification.model";
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
        // feudUser.externalEmail = externalEmail;
        // feudUser.phoneNumber = phoneNumber;
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


  async myFeud(req: CustomRequest, res:Response) {
    try{
      let feudUser: any = await feuds.find({userId: req.uId});
      if(!feudUser){
        return res.status(400).json({ message: "No feuds found" });
      }
      
      let user: any = await User.find({ _id: req.uId}).select("first_name last_name profilepic badge");
      if(!user){
        return res.status(400).json({ message: "User is not exists" });
      }

      let feudmodeIds = feudUser.map((x: any) => x.inviteModerator).flat();
      let objectIds = feudmodeIds.map((id: string) => {
        new ObjectId(id)
      });


      // let feudmode = feudUser.map((x: any) => {
      //   return x.inviteModerator;
      // });

      let users: any = await User.find({ _id: { $in: objectIds } }).select("first_name last_name profilepic badge");
      //let users: any = await User.find({ _id: {$all: feudmode}}).select("first_name last_name profilepic badge");
      if(!users){
        return res.status(400).json({ message: "User is not exists" });
      }
      console.log(users);
      

      let feudmode = users.map((x: any) => {
        let moderator = {
          profilePic: x.profilepic,
          badge: x.badge,
          name: x.first_name + x.last_name
        };
        return moderator;
      });
      
      let moderators: any = []
      moderators.push(feudmode);
      console.log(moderators);
      

      let feudDatas = feudUser.map((x: any) => {
        let ids = x.inviteModerator;
        
        return {
            feudId: x._id,
            profilePic: user[0].profilepic,
            badge: user[0].badge,
            message: user[0].first_name + user[0].last_name + " Created a Feud",
            title: x.title,
            moderator: moderators
        };
      }); 
    
      return res.status(200).json({ status: true, message: "Feuds fetched successfully!!!", data: feudDatas});
    }
    catch(err){
      console.log(err);
      return res.status(500).json({ status: false, message: "Internal server error!!" });
    }
  }
}