import java.io.*;
import java.net.Socket;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Scanner;


public class Client {


    public static void main(String[] args) {
        Socket socket = null;
        InputStreamReader inputStreamReader = null;
        OutputStreamWriter outputStreamWriter = null;
        BufferedReader in = null; //in
        PrintWriter out = null; //out

        try{
            socket = new Socket("localhost",1234);

            inputStreamReader = new InputStreamReader(socket.getInputStream());
            outputStreamWriter = new OutputStreamWriter(socket.getOutputStream());
            in = new BufferedReader(inputStreamReader);
            out = new PrintWriter(outputStreamWriter);


            Scanner scanner = new Scanner(System.in);
            String msg_to_send = null;
            String received = null;

            {
                System.out.println("Provide database name: ");
                String db_name = scanner.nextLine();

                System.out.println("Provide username for database: ");
                String username_db = scanner.nextLine();

                System.out.println("Provide password for database: ");
                String pass_db = scanner.nextLine();

                String all_db = db_name + "@#@" + username_db + "@#@" + pass_db;
                out.println(all_db);
                out.flush();
            }


            while(true){

                System.out.println("Type HELP to see your options.");

                while((msg_to_send = scanner.nextLine())!= null){
                    if(msg_to_send.equals("HELP")){
                        System.out.println("1.HELP");
                        System.out.println("2.LOGIN");
                        System.out.println("3.EXIT");
                        break;
                    }
                    else if (msg_to_send.equals("LOGIN")){
                        out.println(msg_to_send);
                        out.flush();
                        String[] arr = new String[2];
                        System.out.println("Username: "); //todo: client ta implement et
                        arr[0] = scanner.nextLine();
                        if(arr[0].equals("CANCEL"))
                        {
                            System.out.println("Operation cancelled.");
                            System.out.println("Type HELP to see your options.");
                            break;
                        }

                        System.out.println("Password: ");
                        arr[1] = scanner.nextLine();

                        if(arr[1].equals("CANCEL"))
                        {
                            System.out.println("Operation cancelled.");
                            System.out.println("Type HELP to see your options.");
                            break;
                        }

                        String arr_cred = arr[0] + "@#@" +arr[1];
                        out.println(arr_cred);
                        out.flush();

                        received = in.readLine();

                        if(received.equals("NSU"))
                        {
                            System.out.println("Incorrect username or password.");
                            break;
                        }
                        else if(received.equals("NA")){
                            System.out.println("Succesfull operation.");
                            System.out.println("Type HELP to see your options.");


                            String user_control;
                            while((msg_to_send = scanner.nextLine()) != null){
                                out.println("CONTROL");
                                out.flush();
                                user_control = in.readLine();
                                if(user_control.equals("EXIST")) {
                                    //System.out.println("DELETED USER CANNOT OPERATE.");
                                    out.println(msg_to_send);
                                    out.flush();

                                    if(msg_to_send.equals("HELP")){
                                        System.out.println("1.HELP || 2.LOGOUT || 3.EXIT || 4.INBOX || 5.OUTBOX || 6.SEND_MSG || 7.READ_MSG || 8.READ_MSG_OUT || 9.UPDATE || 10.UPDATE_MSG ");
                                    }
                                    else if(msg_to_send.equals("UPDATE")){
                                        System.out.println("What do you want to change?");
                                        String want_to = scanner.nextLine();
                                        if(want_to.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Provide new " + want_to );
                                        String new_want_to = scanner.nextLine();
                                        if(new_want_to.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        String all = new_want_to + "@#@" + want_to;
                                        out.println(all);
                                        out.flush();
                                        System.out.println("USER UPDATED SUCCESSFULLY.");
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("UPDATE_MSG")){
                                        System.out.println("Which message do you want to change? (Provide message_id)");
                                        String msg_id = scanner.nextLine();
                                        if(msg_id.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }


                                        System.out.println("Provide new message" );
                                        String new_message = scanner.nextLine();
                                        if(new_message.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        String all = msg_id + "@#@" + new_message;
                                        out.println(all);
                                        out.flush();
                                        System.out.println("USER UPDATED SUCCESSFULLY.");
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("INBOX")){
                                        String[] msg_arr = in.readLine().split("@#@");
                                        int size = msg_arr.length;
                                        int i = 1;
                                        if(size == 1) System.out.println("Empty INBOX.");
                                        else {
                                            for(;i<size;i++){
                                                System.out.println(msg_arr[i]);
                                            }
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("OUTBOX")){
                                        String[] msg_arr = in.readLine().split("@#@");
                                        int size = msg_arr.length;
                                        int i = 1;
                                        if(size == 1) System.out.println("Empty OUTBOX.");
                                        else {
                                            for(;i<size;i++){
                                                System.out.println(msg_arr[i]);
                                            }
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("SEND_MSG")){
                                        System.out.println("Enter the receiver:");
                                        String receiver =scanner.nextLine();
                                        if(receiver.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Enter the subject:");
                                        String subject = scanner.nextLine();
                                        if(subject.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Provide message. Press Enter to send. ");
                                        String message = scanner.nextLine();
                                        if(message.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
                                        Calendar cal = Calendar.getInstance();
                                        String date = dateFormat.format(cal.getTime());

                                        String all = message + "@#@" + receiver + "@#@" + subject + "@#@" + date;
                                        out.println(all);
                                        out.flush();
                                        System.out.println("MESSAGE SENT SUCCESSFULLY.");
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("READ_MSG")){
                                        System.out.println("Provide the message number: ");
                                        String msg_numstr = scanner.nextLine();
                                        if(msg_numstr.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }
                                        out.println(msg_numstr);
                                        out.flush();
                                        String[] received_arr = in.readLine().split("@#@");
                                        int size = received_arr.length;
                                        if(size == 1) System.out.println("READ OPERATION NOT ALLOWED.");
                                        else{
                                            for(int i=0;i<size;i++){
                                                System.out.println(received_arr[i]);
                                            }
                                        }

                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("LOGOUT")){
                                        break;
                                    }
                                    else if(msg_to_send.equals("EXIT")){
                                        break;
                                    }
                                    else {
                                        System.out.println("INVALID OPERATION.");
                                    }

                                }
                                else
                                {
                                    System.out.println(user_control);
                                    System.out.println("DELETED USER CANNOT OPERATE.");
                                    break;
                                }
                            }
                            if(msg_to_send.equals("EXIT") || msg_to_send.equals("LOGOUT")){
                                break;
                            }
                        }
                        else if(received.equals("A")){

                            System.out.println("Succesfull operation.");
                            System.out.println("Type HELP to see your options.");

                            String user_control = null;

                            while((msg_to_send = scanner.nextLine()) != null){

                                out.println("CONTROL");
                                out.flush();
                                user_control = in.readLine();
                                if(user_control.equals("EXIST")){
                                    out.println(msg_to_send);
                                    out.flush();

                                    if(msg_to_send.equals("HELP")){
                                        System.out.println("1.HELP || 2.LOGOUT || 3.EXIT || 4.CREATE_USER || 5.SEE_ALL_USERS || ");
                                        System.out.println("6.SEE_ALL_INBOX || 7.INBOX || 8.OUTBOX || 9.DELETE_USER ||");
                                        System.out.println("10.SEND_MSG || 11.READ_MSG ||  12.UPDATE || 13.UPDATE_MSG ");
                                    }
                                    else if(msg_to_send.equals("CREATE_USER")){
                                        System.out.println("User type: (NA: not admin or  A: admin) ");
                                        String user_type = scanner.nextLine();
                                        if(user_type.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }
                                        System.out.println("Username: ");
                                        String username = scanner.nextLine();
                                        if(username.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Password: ");
                                        String password = scanner.nextLine();
                                        if(password.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Name: ");
                                        String name = scanner.nextLine();
                                        if(name.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Surname: ");
                                        String surname = scanner.nextLine();
                                        if(surname.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Birthdate: ");
                                        String birthdate = scanner.nextLine();
                                        if(birthdate.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Gender: ");
                                        String gender = scanner.nextLine();
                                        if(gender.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Email: ");
                                        String email = scanner.nextLine();
                                        if(email.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        String all = user_type + "@#@" + username + "@#@" + password + "@#@" + name + "@#@" + surname + "@#@" +birthdate + "@#@" +
                                                gender + "@#@" + email; //todo:
                                        out.println(all);
                                        System.out.println("USER CREATED SUCCESSFULLY."); //todo: kontorl et
                                        System.out.println("Type HELP to see your options.");

                                    }
                                    else if(msg_to_send.equals("UPDATE")){
                                        System.out.println("Which user do you want to change? (Provide username)");
                                        String who = scanner.nextLine();
                                        if(who.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("What do you want to change?");
                                        String want_to = scanner.nextLine();
                                        if(want_to.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Provide new " + want_to );
                                        String new_want_to = scanner.nextLine();
                                        if(new_want_to.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        String all = who + "@#@" + new_want_to + "@#@" + want_to;
                                        out.println(all);
                                        out.flush();
                                        received = in.readLine();
                                        if(received.equals("E"))System.out.println("UNSUCCESSFULL UPDATE OPERATION.");
                                        else if(received.equals("S")) System.out.println("USER UPDATED SUCCESSFULLY.");
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("UPDATE_MSG")){
                                        System.out.println("Which message do you want to change? (Provide message_id)");
                                        String msg_id = scanner.nextLine();
                                        if(msg_id.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }


                                        System.out.println("Provide new message" );
                                        String new_message = scanner.nextLine();
                                        if(new_message.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        String all = msg_id + "@#@" + new_message;
                                        out.println(all);
                                        out.flush();
                                        received = in.readLine();
                                        if(received.equals("E"))System.out.println("UNSUCCESSFULL UPDATE OPERATION.");
                                        else if(received.equals("S")) System.out.println("USER UPDATED SUCCESSFULLY.");
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("DELETE_USER")){
                                        System.out.println("Provide the user id: ");
                                        String user_id = scanner.nextLine();
                                        if(user_id.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }
                                        out.println(user_id);
                                        out.flush();
                                        System.out.println("USER DELETED SUCCESSFULLY.");
                                    }
                                    else if(msg_to_send.equals("SEE_ALL_USERS")){
                                        //NO BREAK
                                        String[] user_arr = in.readLine().split("@#@");
                                        int size = user_arr.length;
                                        for(int i = 0;i<size;i++){
                                            System.out.println(user_arr[i]);
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("SEE_ALL_INBOX")){
                                        String[] msg_arr = in.readLine().split("@#@");
                                        int size = msg_arr.length;
                                        for(int i = 0;i<size;i++){
                                            System.out.println(msg_arr[i]);
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("INBOX")){
                                        String[] msg_arr = in.readLine().split("@#@");
                                        int size = msg_arr.length;
                                        int i = 1;
                                        if(size == 1) System.out.println("Empty INBOX.");
                                        else {
                                            for(;i<size;i++){
                                                System.out.println(msg_arr[i]);
                                            }
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("OUTBOX")){
                                        String[] msg_arr = in.readLine().split("@#@");
                                        int size = msg_arr.length;
                                        int i = 1;
                                        if(size == 1) System.out.println("Empty OUTBOX.");
                                        else {
                                            for(;i<size;i++){
                                                System.out.println(msg_arr[i]);
                                            }
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("SEND_MSG")){
                                        System.out.println("Enter the receiver:");
                                        String receiver =scanner.nextLine();
                                        if(receiver.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Enter the subject:");
                                        String subject = scanner.nextLine();
                                        if(subject.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        System.out.println("Provide message. Press Enter to send. ");
                                        String message = scanner.nextLine();
                                        if(message.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }

                                        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
                                        Calendar cal = Calendar.getInstance();
                                        String date = dateFormat.format(cal.getTime());

                                        String all = message + "@#@" + receiver + "@#@" + subject + "@#@" + date;
                                        out.println(all);
                                        out.flush();
                                        System.out.println("MESSAGE SENT SUCCESSFULLY.");
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("READ_MSG")){
                                        System.out.println("Provide the message number: ");
                                        String msg_numstr = scanner.nextLine();
                                        if(msg_numstr.equals("CANCEL"))
                                        {
                                            System.out.println("Operation cancelled.");
                                            continue;
                                        }
                                        out.println(msg_numstr);
                                        out.flush();
                                        String[] received_arr = in.readLine().split("@#@");
                                        int size = received_arr.length;
                                        for(int i=0;i<size;i++){
                                            System.out.println(received_arr[i]);
                                        }
                                        System.out.println("Type HELP to see your options.");
                                    }
                                    else if(msg_to_send.equals("LOGOUT")){
                                        break;
                                    }
                                    else if(msg_to_send.equals("EXIT")){
                                        break;
                                    }
                                    else {
                                        System.out.println("INVALID OPERATION.");
                                    }
                                }
                                else
                                {
                                    System.out.println("DELETED USER CANNOT OPERATE.");
                                    break;
                                }


                            }
                            if(msg_to_send.equals("EXIT") || msg_to_send.equals("LOGOUT")){
                                break;
                            }
                        }
                    }
                    else if (msg_to_send.equals("EXIT")){
                        break;
                    }

                    else {
                        System.out.println("INVALID OPERATION.");
                    }
                }
                if(msg_to_send.equals("EXIT")){
                    System.out.println("GOOD BYE :)");
                    break;
                }

            }
        }catch (IOException e) {
            e.printStackTrace();
        }finally {
            try{
                if (socket == null) socket.close();
                if (inputStreamReader == null) inputStreamReader.close();
                if (outputStreamWriter == null) outputStreamWriter.close();
                if (in == null) in.close();
                if (out == null) out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

}
