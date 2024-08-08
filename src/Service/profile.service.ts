import { Response } from "express";
import User from "../Models/user.model";
import Joinfeud from "../Models/joinFeud.model";
import feuds from "../Models/feuds.model";
import { CustomRequest } from "../Interface/user.interface";
import { ObjectId } from "mongodb";
import moment from "moment";
import dotenv from 'dotenv';
dotenv.config();

export class profileService {
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

  async joinFeudsData(req: CustomRequest, res: Response) {
    const userId = new ObjectId(`${req.uId}`);
    try {
        const user: any = await User.findById(req.uId);
        if (!user) {
            return res.status(400).json({ status: false, message: "User does not exist!" });
        }
        if (user.badge <= 2) {
            return res.status(400).json({ message: "Upgrade your badge to access data!" });
        }

        const [feud, joinFeudHost, joinFeudParticipant, joinFeudSpectator] = await Promise.all([
            feuds.find({}),
            Joinfeud.find({ 'participant': { $elemMatch: { 'participantUser': req.uId, 'joinType': 3 } } }),
            Joinfeud.find({ 'participant': { $elemMatch: { 'participantUser': req.uId, 'joinType': 1 } } }),
            Joinfeud.find({ 'spectors.spectorUser': req.uId })
        ]);

        let totalFeud = joinFeudHost.concat(joinFeudParticipant, joinFeudSpectator);
        
        let result = totalFeud.map((x) => {
            let user:any = x.participant
            .filter((y:any) => y.participantUser.equals(userId))
            .map((y:any) => ({
                joinAt: y.JoinAt,
                leaveAt: y.leaveAt
            }));
            let specUser:any = x.spectors
            .filter((y:any) => y.spectorUser.equals(userId))
            .map((y:any) => ({
                joinAt: y.JoinAt,
                leaveAt: y.leaveAt
            }))
            return user.concat(specUser);
        }).flat();
        
        let totalMinutes = result.reduce((sum: any, record: any) => {
            let joinAt = record.joinAt;
            let leaveAt = record.leaveAt;
            let diffInMs = leaveAt - joinAt;
            let diffInMinutes = diffInMs / (1000 * 60);
            return sum + diffInMinutes;
          }, 0);
        const Spenthours = Math.floor(totalMinutes / 60);
        const Spentminutes = Math.floor(totalMinutes % 60);


        const totalLikes = feud.filter((x:any) => x.likeData.includes(req.uId)).length;
        const totalSaves = feud.filter((x:any) => x.saveData.includes(req.uId)).length;


        const totalFeudsHost = feud.filter((x:any) => x.userId.equals(userId));
        const totalHostTimeMinutes = totalFeudsHost.reduce((acc, feud) => {
            const startTime = moment(`${feud.FeudDate} ${feud.FeudTime}`, 'YYYY/MM/DD hh:mm A');
            const endTime = moment(`${feud.endFeudDate} ${feud.endFeudTime}`, 'YYYY/MM/DD hh:mm A');
            return acc + endTime.diff(startTime, 'minutes');
        }, 0);

        const avgHostTimeMinutes = totalFeudsHost.length ? totalHostTimeMinutes / totalFeudsHost.length : 0;
        const hours = Math.floor(avgHostTimeMinutes / 60);
        const minutes = Math.floor(avgHostTimeMinutes % 60);

        const totalFeuds = joinFeudHost.length + joinFeudParticipant.length + joinFeudSpectator.length;
        const calculatePercentage = (count:any) => (totalFeuds > 0 ? (count / totalFeuds) * 100 : 0);

        const joinFeudsData = {
            hostCount: joinFeudHost.length,
            hostPercentage: Math.round(calculatePercentage(joinFeudHost.length)),
            participantCount: joinFeudParticipant.length,
            participantPercentage: Math.round(calculatePercentage(joinFeudParticipant.length)),
            spectorCount: joinFeudSpectator.length,
            spectorPercentage: Math.round(calculatePercentage(joinFeudSpectator.length)),
            totalLikes,
            totalSaves,
            SpentOnFeud: {
                Spenthours,
                Spentminutes
            },
            avgLengthOfFeud: {
                hours,
                minutes
            }
        };
        return res.status(200).json({ status: true, message: "Data fetched successfully!", data: joinFeudsData });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }

  async updateTicker(req: CustomRequest, res: Response) {
    const {ticker, color, speed} = req.body
    try {
      let user:any = await User.findOne({_id: req.uId});
      if(!user){
        return res.status(400).json({status:false, message:"User is not exist!!"});
      }
      if(user.badge === 1){
        return res.status(400).json({ message: "You cannot update ticker upgrade your badge!!" });
      }

      user.ticker.description = ticker;
      user.ticker.textColor = color;
      user.ticker.speed = speed;
      await user.save();

      return res.status(200).json({ status: true, message: "Ticker updated successfully!!"});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  }
}