public class Message{
    String message;
    String sender;
    String receiver;
    String subject;
    String date;

    Integer message_id;
    public Message(String message,String sender,String receiver,String subject,String date){
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.subject = subject;
        this.date = date;
    }

    public Message(Integer message_id,String message,String sender,String receiver,String subject,String date){
        this.message_id = message_id;
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.subject = subject;
        this.date = date;
    }

    public Message(String message,String receiver,String subject,String date){
        this.message = message;
        this.receiver = receiver;
        this.subject = subject;
        this.date = date;
    }

    public void setSender(String sender){
        this.sender = sender;
    }


}
