import { Application } from "../models/application.model";

export const applyJob = async(req,res) =>{
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if(!jobId){
            return res.status(400).json({
                message : 'Job-id is required',
                success : true
            })
        }

        // if already applied

        const alreadyApplied= await Application.findOne({job : jobId , applicant : userId});
        if(alreadyApplied){
            return res.status(400).json({
                message : 'You have Already applied for this job',
                success : false
            })
        }

        //create new application

        const newApplication = await Application.create({
            job : jobId,
            applicant : userId
        })
        job.application.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message : 'Job Applied Successfully...',
            success : true
        })

    } catch (error) {
        console.log(error);
    }
}

export 