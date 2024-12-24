export const createMessage= async (req,res)=>{
    try {
        const senderid=req.id;
        const receiverid=req.params.id;
        const message=req.body.message;
       
        let conversation= await Conversation.findOne({
            participants:{$all:[senderid,receiverid]}
        })
        //  creating a new conversation if not exist
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderid,receiverid]
            })
        }
        const newMessage= await Message.create({
            senderid,
            receiverid,
            message
        });
        conversation.message.push(newMessage._id);
        await conversation.save();
        await newMessage.save();

        // implementing socket io to send message to the receiver

        res.status(200).json({message:"message sent", success:true});


    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error"})
    }
}

export const getMessages= async (req, res)=>{
    try {
        const senderid=req.id;
        const receiverid=req.params.id;
        const conversation= await Conversation.findOne({
            participants:{$all:[senderid,receiverid]}
        });
        //  if there is no conversation between the sender and receiver
        if(!conversation){
            return res.status(404).json({message:"conversation not found"});
        }   
        return res.status(200).json({message: conversation?.messages});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error"});      
    }
}