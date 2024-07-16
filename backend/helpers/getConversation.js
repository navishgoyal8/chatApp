const {ConversationModel} = require('../models/ConversationModel')

const getConversation = async(currentUserId) => {

           if(currentUserId){
            const currentUserConnection = await ConversationModel.find({
            "$or": [
                {sender: currentUserId},
                {receiver: currentUserId}
            ]
        }).sort({updatedAt: -1}).populate('message').populate('sender').populate('receiver')

        const conversation = currentUserConnection.map((conv) => {

            const countUnseenMsg = conv?.message?.reduce((preve,curr) => {

                const msgByUserId = conv?.msgByUserId?.toString()
                if(msgByUserId !== currentUserId){
                    return preve + (curr?.seen ? 0 : 1)

                }
                else{
                    return preve
                }
            },0)

            return {
                _id: conv?._id,
                sender: conv?.sender,
                receiver: conv?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: conv.message[conv?.message?.length - 1]
            }
        })

        // socket.emit('conversation',conversation)
        return conversation

        }
        else{
            return []
        }
}

module.exports = getConversation;