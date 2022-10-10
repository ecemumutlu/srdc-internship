import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

//TODO:kullanıcı görümtüleme


public class Server {


    public static void main(String[] args) throws IOException {

        ServerSocket serverSocket = null;
        try{
            serverSocket = new ServerSocket(1234);
        }catch(Exception e){
            System.out.println(e);
        }

        try{
            while(true){
                //waits for a client connection
                //once connected, socket object is used to communicate with the client
                Socket client = null;
                client = serverSocket.accept();
                System.out.println("new client accepted: server is listening");

                ClientHandler clientSocket = new ClientHandler(client);
                new Thread(clientSocket).start();
            }
        }
        catch (IOException e) {
            e.printStackTrace();
        }
        finally{
            if(serverSocket != null){
                try{
                    serverSocket.close();
                }
                catch(IOException e){
                    e.printStackTrace();
                }
            }
        }
    }


    private static class ClientHandler implements Runnable{
        private final Socket clientSocket;
        public DbFuncs db;
        public ClientHandler(Socket socket){
            this.clientSocket = socket;
        }

        public void run(){
            PrintWriter out = null;
            BufferedReader in = null;

            db = new DbFuncs();

            try{
                in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                out = new PrintWriter(clientSocket.getOutputStream(),true);

                String[] arr_db = in.readLine().split("@#@");
                db.connect_to_db(arr_db[0],arr_db[1],arr_db[2]);

                try{
                    DatabaseMetaData dbm = db.conn.getMetaData();
                    ResultSet rs = dbm.getTables(null,null,"user_info",null);
                    if(rs.next())
                        System.out.println("TABLE ALREADY EXISTS");
                    else
                    {
                        db.createTable("user_info");
                        User admin_cre = new User("A","admin","admin","admin","admin","01-01-2000","M/F","admin@hw1.com");
                        db.insert_row("user_info",admin_cre);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                try{
                    DatabaseMetaData dbm = db.conn.getMetaData();
                    ResultSet rs = dbm.getTables(null,null,"message_db",null);
                    if(rs.next())
                        System.out.println("TABLE ALREADY EXISTS");
                    else
                        db.createTable_forMessage("message_db");


                } catch (Exception e) {
                    e.printStackTrace();
                }


                String user_type = null;
                String line1;
                while((line1 = in.readLine()) != null){
                    switch (line1){
                        case "HELP":
                            break;
                        case "LOGIN":
                            String[] arr = in.readLine().split("@#@");

                            if(arr != null){

                                int flag = db.search_by_username("user_info",arr[0],arr[1]);
                                if(flag == -1){
                                    user_type = "NSU"; //no such user
                                    out.println(user_type);
                                    out.flush();
                                }
                                else if(flag == 0){
                                    user_type = "NA"; //not admin
                                    out.println(user_type);
                                    out.flush();
                                }
                                else if (flag == 100) {
                                    user_type = "A"; //admin
                                    out.println(user_type);
                                    out.flush();
                                }
                            }
                            else{
                                break;
                            }

                            if(user_type.equals("NA")){
                                User new_user = db.read_data("user_info",arr[0]);
                                System.out.println("NO ADMIN");
                                String line;
                                try{
                                    while((line = in.readLine()) != null){

                                        if(line.equals("CONTROL")){
                                            System.out.println(db.is_there_such_user(new_user.username));
                                            if(db.is_there_such_user(new_user.username) == 100){
                                                out.println("EXIST");
                                                out.flush();
                                            }
                                            else{
                                                out.println("DNE");
                                                out.flush();
                                                break;
                                            }
                                            line = in.readLine();
                                            if(line.equals("HELP")){
                                                continue;
                                            }
                                            else if(line.equals("UPDATE")){
                                                String[] received_updated = in.readLine().split("@#@");
                                                //todo:: before updating, first check if there is such a user
                                                db.update(new_user.username, received_updated[0],received_updated[1]);
                                                continue;
                                            }
                                            else if(line.equals("UPDATE_MSG")){
                                                String[] received_updated = in.readLine().split("@#@");
                                                //todo:: before updating, first check if there is such a user
                                                db.update_msg(received_updated[0],received_updated[1],new_user);
                                                continue;
                                            }
                                            else if(line.equals("INBOX")){
                                                ArrayList<Message> msg_list = new ArrayList<Message>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    if(new_user.username.equals(msg_list.get(i).receiver)){
                                                        Message that_user = msg_list.get(i);
                                                        all = all + "@#@ID: " + that_user.message_id.toString() + " SENDER: " +  that_user.sender + " RECEIVER:" + that_user.receiver + " SUBJECT: " + that_user.subject + " DATE: " +
                                                                that_user.date;
                                                    }
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("OUTBOX")){
                                                ArrayList<Message> msg_list = new ArrayList<>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    if(new_user.username.equals(msg_list.get(i).sender)){
                                                        Message that_user = msg_list.get(i);
                                                        all = all + "@#@ID: " + that_user.message_id.toString() + " SENDER: " +  that_user.sender + " RECEIVER:" + that_user.receiver + " SUBJECT: " + that_user.subject + " DATE: " +
                                                                that_user.date;
                                                    }
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("SEND_MSG")){
                                                String[] received_arr = in.readLine().split("@#@");
                                                Message msg = new Message(received_arr[0],new_user.username,received_arr[1],received_arr[2], received_arr[3]);
                                                db.add_message_to_db("message_db",msg);
                                                continue;
                                            }
                                            else if(line.equals("READ_MSG")){
                                                String msg_id = in.readLine();
                                                ArrayList<Message> msg_list = new ArrayList<Message>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    if(msg_list.get(i).message_id.toString().equals(msg_id) && msg_list.get(i).sender.equals(new_user.username)){
                                                        Message msg = msg_list.get(i);
                                                        all = "SUBJECT: " + msg.subject + "@#@SENDER: " +  msg.sender + "@#@MESSAGE: " + msg.message + "@#@DATE: " +
                                                                msg.date;
                                                        break;
                                                    }
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("CANCEL")){
                                                break;
                                            }
                                            else if(line.equals("LOGOUT")){
                                                break;
                                            }
                                            else if(line.equals("EXIT")){
                                                break;
                                            }
                                            else{
                                                System.out.println("elsedeyim");
                                            }
                                        }
                                    }
                                } catch (IOException e) {
                                    throw new RuntimeException(e);
                                }
                                if(line.equals("EXIT"))
                                {
                                    break;
                                }

                            }
                            else if(user_type.equals("A")){
                                //TODO:: ADMİN TÜM MESAJLARI SİLSİN
                                System.out.println("ADMIN");
                                User new_user = db.read_data("user_info",arr[0]);
                                String line;
                                try{
                                    while((line = in.readLine()) != null){

                                        if(line.equals("CONTROL")){
                                            System.out.println(db.is_there_such_user(new_user.username));
                                            if(db.is_there_such_user(new_user.username) == 100){
                                                out.println("EXIST");
                                                out.flush();
                                            }
                                            else{
                                                out.println("DNE");
                                                out.flush();
                                                break;
                                            }
                                            line = in.readLine();
                                            if(line.equals("HELP")){
                                                continue;
                                            }
                                            else if(line.equals("CREATE_USER")){
                                                String[] received_user_cred = in.readLine().split("@#@");
                                                User user_to_be_added = new User(received_user_cred[0],received_user_cred[1],received_user_cred[2],received_user_cred[3],received_user_cred[4],received_user_cred[5],received_user_cred[6],received_user_cred[7]);
                                                if(user_to_be_added != null){
                                                    db.insert_row("user_info",user_to_be_added);
                                                }
                                                continue;
                                            }
                                            else if(line.equals("UPDATE")){
                                                String[] received_updated = in.readLine().split("@#@");
                                                if(db.is_there_such_user(received_updated[0]) == 100){
                                                    db.update(received_updated[0],received_updated[1],received_updated[2]);
                                                    out.println("S"); //SUCCESS
                                                }
                                                else {
                                                    out.println("E"); //ERROR
                                                }
                                                continue;
                                            }
                                            else if(line.equals("UPDATE_MSG")){
                                                String[] received_updated = in.readLine().split("@#@");
                                                //todo:: before updating, first check if there is such a user
                                                if(true){
                                                    db.update_msg(received_updated[0],received_updated[1],new_user);
                                                    out.println("S"); //SUCCESS
                                                }
                                                else {
                                                    out.println("E"); //ERROR
                                                }
                                                continue;
                                            }
                                            else if(line.equals("DELETE_USER")){
                                                //todo: database e bu kullanıcı var mı dşye sor true false al
                                                ArrayList<User> user_list = db.select_and_create_rs_user();
                                                int list_size = user_list.size();
                                                String user_id_received = in.readLine();
                                                for(int i = 0;i<list_size;i++){
                                                    if((user_list.get(i).user_id).toString().equals(user_id_received)){
                                                        db.delete_row("user_info",user_list.get(i).user_id.toString()); //todo:
                                                        break;
                                                    }
                                                }
                                                continue;
                                            }
                                            else if(line.equals("SEE_ALL_USERS")){
                                                ArrayList<User> user_list = new ArrayList<User>(db.select_and_create_rs_user());
                                                int list_size = user_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    User that_user = user_list.get(i);
                                                    all = all + "@#@" +that_user.user_id.toString() + " " +  that_user.user_type + " " + that_user.username + " " + that_user.password + " " +
                                                            that_user.name + " " + that_user.surname + " " + that_user.birthdate + " " + that_user.gender + " " + that_user.email;
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("SEE_ALL_INBOX")){
                                                ArrayList<Message> msg_list = new ArrayList<Message>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    Message that_user = msg_list.get(i);
                                                    all = all + "@#@ID: " + that_user.message_id.toString() + " SENDER: " +  that_user.sender + " RECEIVER:" + that_user.receiver + " SUBJECT: " + that_user.subject + " DATE: " +
                                                            that_user.date;
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("INBOX")){
                                                ArrayList<Message> msg_list = new ArrayList<Message>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    if(new_user.username.equals(msg_list.get(i).receiver)){
                                                        Message that_user = msg_list.get(i);
                                                        all = all + "@#@ID: " + that_user.message_id.toString() + " SENDER: " +  that_user.sender + " RECEIVER:" + that_user.receiver + " SUBJECT: " + that_user.subject + " DATE: " +
                                                                that_user.date;
                                                    }
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("OUTBOX")){
                                                ArrayList<Message> msg_list = new ArrayList<>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    if(new_user.username.equals(msg_list.get(i).sender)){
                                                        Message that_user = msg_list.get(i);
                                                        all = all + "@#@ID: " + that_user.message_id.toString() + " SENDER: " +  that_user.sender + " RECEIVER:" + that_user.receiver + " SUBJECT: " + that_user.subject + " DATE: " +
                                                                that_user.date;
                                                    }
                                                }
                                                if(all.equals("")) all = "Empty OUTBOX.";
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("SEND_MSG")){
                                                String[] received_arr = in.readLine().split("@#@");
                                                Message msg = new Message(received_arr[0],new_user.username,received_arr[1],received_arr[2], received_arr[3]);
                                                db.add_message_to_db("message_db",msg);
                                                continue;
                                            }
                                            else if(line.equals("READ_MSG")){
                                                String msg_id = in.readLine();
                                                ArrayList<Message> msg_list = new ArrayList<Message>(db.select_and_create_rs_message());
                                                int list_size = msg_list.size();
                                                String all = "";
                                                for(int i =0;i<list_size;i++){
                                                    if(msg_list.get(i).message_id.toString().equals(msg_id)){
                                                        Message msg = msg_list.get(i);
                                                        all = "SUBJECT: " + msg.subject + "@#@SENDER: " +  msg.sender + "@#@MESSAGE: " + msg.message + "@#@DATE: " +
                                                                msg.date;
                                                        break;
                                                    }
                                                }
                                                out.println(all);
                                                out.flush();
                                                continue;
                                            }
                                            else if(line.equals("CANCEL")){
                                                break;
                                            }
                                            else if(line.equals("LOGOUT")){
                                                break;
                                            }
                                            else if(line.equals("EXIT")){
                                                break;
                                            }
                                            else{
                                            }
                                        }
                                    }
                                } catch (IOException e) {
                                    throw new RuntimeException(e);
                                }
                                if(line.equals("EXIT"))
                                {
                                    break;
                                }
                            }
                            break;
                        case "EXIT":
                            break;
                        default:
                            System.out.println("INVALID OP");
                            break;
                    }
                    if(line1.equals("EXIT")){
                        out.println("Good bye :)");
                        out.println("BREAK");
                        out.flush();
                        break;
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            finally{
                try{
                    if(out != null) out.close();
                    if(in != null) {
                        in.close();
                        clientSocket.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
