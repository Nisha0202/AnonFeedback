import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/Message";


export async function POST(request: Request){

    await dbConnect();
    const {username, content} = await request.json();

    try {

        const user = await UserModel.findOne({username});

        if(!user){

            return Response.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 }
            )
        }

        //is user accepting the messages
        if(!user.isAcceptmessages){
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting any message.",
                },
                { status: 403 }
            )
        }
        

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage);
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Sent successful.",
            },
            { status: 200 }
        )


    } catch (error) {
        
        console.log("Unexpected error");

        return Response.json(
            {
                success: false,
                message: "Unexpected error."
            },
            { status: 500 }
        )


    }




}
