import { Request, Response } from "express";
import User from "../models/user.model";
import feuds from "../models/feuds.model";
import Joinfeud from "../models/joinFeud.model";
import { CustomRequest } from "../interface/user.interface";
import dotenv from 'dotenv';
dotenv.config();

export class profileService {
  async joinFeudsData(req: CustomRequest, res: Response) {
    try {
      let user:any = await User.findOne({_id: req.uId});
      if(!user){
        return res.status(400).json({status:false, message:"User is not exist!!"});
      }
      let joinfeudHost:any = await Joinfeud.find({ 'participant': { $elemMatch: { 'participantUser': req.uId, 'joinType': 3 } } });
      let joinfeudparticipant:any = await Joinfeud.find({ 'participant': { $elemMatch: { 'participantUser': req.uId, 'joinType': 1 } } });
      let joinfeudspactor:any = await Joinfeud.find({ 'spectors.spectorUser': req.uId});

      let totalFeuds = joinfeudHost.length + joinfeudparticipant.length + joinfeudspactor.length;

      let hostPercentage = (totalFeuds > 0) ? (joinfeudHost.length / totalFeuds) * 100 : 0;
      let participantPercentage = (totalFeuds > 0) ? (joinfeudparticipant.length / totalFeuds) * 100 : 0;
      let spectorPercentage = (totalFeuds > 0) ? (joinfeudspactor.length / totalFeuds) * 100 : 0;

      let joinFeudsdata:any = {
        hostCount: joinfeudHost.length,
        hostPercentage: Math.round(hostPercentage),
        participantCount: joinfeudparticipant.length,
        participantPercentage: Math.round(participantPercentage),
        spectorCount: joinfeudspactor.length,
        spectorPercentage: Math.round(spectorPercentage)
      }

      return res.status(200).json({ status: true, message: "Data fetched successfully!!",data: joinFeudsdata});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }
}