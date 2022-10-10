package com.example.demo;
import spring_boot_ws_srdc_hw2.MessageType;
import spring_boot_ws_srdc_hw2.SystemMessageType;
import spring_boot_ws_srdc_hw2.UserType;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.sql.*;
import java.util.ArrayList;
import java.util.GregorianCalendar;

public class DbFuncsRepository {

    public Connection conn;

    public DbFuncsRepository(){
        try{
            Class.forName("org.postgresql.Driver");
            String dbName = "deneme2_srdc_hw2"; //provide here inside the "" database name you have created before
            String username = "postgres"; //provide here inside the "" username for database
            String password = "eu1234"; //provide here inside the "" password for database
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/"+dbName,username,password);
            Statement statement = null;
            if(conn != null){
                System.out.println("Connection established");

                try{
                    DatabaseMetaData dbm = conn.getMetaData();
                    ResultSet rs = dbm.getTables(null,null,"user_info",null);
                    if(rs.next())
                        System.out.println("TABLE ALREADY EXISTS");
                    else
                    {
                        UserType new_user = new UserType();
                        new_user.setUserType("A");
                        new_user.setUsername("admin");
                        new_user.setPassword("admin");
                        new_user.setName("admin");
                        new_user.setSurname("admin");
                        new_user.setGender("F");
                        new_user.setEmail("admin@srdc.hw2.com");

                        GregorianCalendar c = new GregorianCalendar();
                        c.setTime(new Date(2000,12,1));
                        XMLGregorianCalendar date2 = DatatypeFactory.newInstance().newXMLGregorianCalendar(c);

                        new_user.setBirthdate(date2);
                        this.createTable("user_info");
                        this.insert_user(new_user);

                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                try{
                    DatabaseMetaData dbm = conn.getMetaData();
                    ResultSet rs = dbm.getTables(null,null,"message_db",null);
                    if(rs.next())
                        System.out.println("TABLE ALREADY EXISTS");
                    else
                        this.createTable_forMessage("message_db");
                } catch (Exception e) {
                    e.printStackTrace();
                }

                try{
                    DatabaseMetaData dbm = conn.getMetaData();
                    ResultSet rs = dbm.getTables(null,null,"logindb",null);
                    if(rs.next())
                        System.out.println("TABLE ALREADY EXISTS");
                    else
                        this.createTable_forLogindb("logindb");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                String query = String.format("TRUNCATE %s","logindb");
                statement = conn.createStatement();
                statement.executeUpdate(query);
            }
            else{
                System.out.println("Connection failed");
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void connect_to_db(String dbname,String username, String pass){
        try{
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/"+dbname,username,pass);
            Statement statement = null;
            if(conn != null){
                System.out.println("Connection established");
                String query = String.format("TRUNCATE %s","logindb");
                statement = conn.createStatement();
                statement.executeUpdate(query);
            }
            else{
                System.out.println("Connection failed");
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void createTable(String table_name){
        Statement statement;
        try{
            String query = "create table " + table_name +"(userId SERIAL ,userType varchar(200) ,username varchar(200), password varchar(200), name varchar(200),surname varchar(200), birthdate DATE NOT NULL, gender varchar(200),email varchar(200) ,primary key(userId));";
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("table created");

        }catch(Exception e){
            System.out.println(e);
        }
    }

    //create table for holding log information
    public void createTable_forLogindb(String table_name){
        Statement statement;
        try{
            String query = "create table " + table_name +"(userNumber SERIAL, userId varchar(200) ,user_type varchar(200) ,username varchar(200), password varchar(200),primary key(userNumber));";
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("table created");

        }catch(Exception e){
            System.out.println(e);
        }
    }


    public void createTable_forMessage(String table_name){
        Statement statement;
        try{
            String query = "create table " + table_name +"(messageId SERIAL ,sender varchar(200), receiver varchar(200), subject varchar(200),date varchar(200) ,message varchar(500),primary key(messageId));";
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("table created");

        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void insertLoginUser(UserType user){
        Statement statement;
        try{
            String query = String.format("insert into %s(userId,user_type,username,password) values('%s','%s','%s','%s');","logindb",user.getUserId(), user.getUserType(),user.getUsername(),user.getPassword());
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Row Inserted");
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void insert_user(UserType user){
        Statement statement;
        //date should be in the form of YYYY-MM-DD
        try{
            String query = String.format("insert into %s(userType,username,password,name,surname,birthdate,gender,email) values('%s','%s','%s','%s','%s','%s','%s','%s');","user_info",user.getUserType(), user.getUsername(),user.getPassword(),user.getName(),user.getSurname(),user.getBirthdate().toString(),user.getGender(),user.getEmail());
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Row Inserted");
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public UserType read_user_data(String username){
        Statement statement;
        ResultSet rs = null;
        UserType new_user = null;
        try{
            String query = String.format("SELECT * FROM %s where username = '%s'", "user_info",username);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()){

                new_user = new UserType();
                new_user.setUserId(Integer.parseInt(rs.getString("userId")));
                new_user.setUserType(rs.getString("userType"));
                new_user.setUsername(rs.getString("username"));
                new_user.setPassword(rs.getString("password"));
                new_user.setName(rs.getString("name"));
                new_user.setSurname(rs.getString("surname"));

                XMLGregorianCalendar xmlDate = null;

                GregorianCalendar gc = new GregorianCalendar();
                gc.setTime(rs.getDate("birthdate"));
                try {
                    xmlDate = DatatypeFactory.newInstance()
                            .newXMLGregorianCalendar(gc);
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
                new_user.setBirthdate(xmlDate);
                new_user.setGender(rs.getString("gender"));
                new_user.setEmail(rs.getString("email"));
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return new_user;
    }

    public void update(String username, String new_name,String want_to){
        Statement statement;
        try{
            String query = String.format("update %s set " + want_to +  "='%s' where username='%s'","user_info",new_name,username);
            statement = conn.createStatement();
            statement.executeUpdate(query);
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void update_msg(Integer messageId, String new_message){
        Statement statement;
        try{
            String query = String.format("update %s set message='%s' where messageId='%s'","message_db",new_message,messageId.toString());
            statement = conn.createStatement();
            statement.executeUpdate(query);
        }catch(Exception e){
            System.out.println(e);
        }
    }


    public int is_there_such_user(int userId){
        Statement statement;
        ResultSet rs = null;
        int flag  = 0;
        try{
            String query = String.format("select * from %s where userId ='%s'","user_info",((Integer) userId).toString());
            statement = conn.createStatement();
            rs = statement.executeQuery(query);

            if(rs.next()) flag = 100;
        }catch(Exception e){
            System.out.println(e);
        }
        return flag;
    }

    public boolean is_there_such_username(String username){
        Statement statement;
        ResultSet rs = null;
        boolean flag  = false;
        try{
            String query = String.format("select * from %s where username ='%s'","user_info",username);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()) flag = true;
        }catch(Exception e){
            System.out.println(e);
        }
        return flag;
    }

    public boolean is_there_loggedIn_user(String username,String password){
        Statement statement;
        ResultSet rs = null;
        boolean flag  = false;
        try{
            String query = String.format("select * from %s where username ='%s' and password ='%s'","logindb",username,password);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()) flag = true;
        }catch(Exception e){
            System.out.println(e);
        }
        return flag;
    }


    public UserType give_me_UserType(String username){
        Statement statement;
        ResultSet rs = null;
        UserType user = null;
        try{
            String query = String.format("select * from %s where username ='%s'","user_info",username);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()){
                user = new UserType();
                user = create_usertype(rs.getInt("userId"),rs.getString("userType"),rs.getString("username"),rs.getString("password"),rs.getString("name"),rs.getString("surname"),rs.getDate("birthdate"),rs.getString("gender"),rs.getString("email"));
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return user;
    }

    public UserType give_me_UserType(Integer userId){
        Statement statement;
        ResultSet rs = null;
        UserType user = null;
        try{
            String query = String.format("select * from %s where userId ='%s'","user_info",userId.toString());
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()){
                user = new UserType();
                user = create_usertype(rs.getInt("userId"),rs.getString("userType"),rs.getString("username"),rs.getString("password"),rs.getString("name"),rs.getString("surname"),rs.getDate("birthdate"),rs.getString("gender"),rs.getString("email"));
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return user;
    }


    public MessageType give_me_messageType(int msgId){
        Statement statement;
        ResultSet rs = null;
        MessageType msg = null;
        try{
            String query = String.format("select * from %s where messageId ='%s'","message_db",((Integer) msgId).toString());
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()){
                msg = create_messageType(rs.getInt("messageId"),rs.getString("sender"),rs.getString("receiver"),rs.getString("subject"),rs.getString("message"),rs.getString("date"));
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return msg;
    }


    public int search_by_username(String username,String password){
        Statement statement;
        ResultSet rs = null;
        int flag  =-1;
        try{
            String query = String.format("select * from %s where username ='%s' and password ='%s'","user_info",username,password);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);

            if(rs.next()){
                if(rs.getString("userType").equals("A")){
                    flag = 100; //100 means admin user
                }
                else flag = 0;
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return flag;
    }

    public void delete_user(Integer userId){
        Statement statement;
        try{
            String query = null;
            query = String.format("delete from %s where userId = '%s'","user_info", userId.toString());
            statement = conn.createStatement();
            statement.executeUpdate(query);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteLogUser(String username){
        Statement statement;
        try{
            String query = null;
            query = String.format("delete from %s where username = '%s'","logindb", username);
            statement = conn.createStatement();
            statement.executeUpdate(query);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public void delete_message(MessageType msg){
        Statement statement;
        try{
            String query = null;
            query = String.format("delete from %s where messageId = '%s'","message_db",((Integer) msg.getMessageId()).toString());
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Data deleted");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void add_message_to_db(MessageType msg){
        Statement statement;
        try{
            String query = String.format("insert into %s(sender,receiver,subject,date,message) values('%s','%s','%s','%s','%s');","message_db", msg.getSender(),msg.getReceiver(),msg.getSubject(),msg.getDate().toString(),msg.getMessageContent());
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Row Inserted");
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public XMLGregorianCalendar fromDateToXMLGC(Date date){
        XMLGregorianCalendar xmlDate = null;
        GregorianCalendar gc = new GregorianCalendar();
        gc.setTime(date);
        try {
            xmlDate = DatatypeFactory.newInstance()
                    .newXMLGregorianCalendar(gc);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return xmlDate;
    }

    public UserType create_usertype(int userId,String userType,String username,String password,String name,String surname,Date birthdate,String gender,String email){

        UserType new_user = new UserType();
        new_user.setUserId(userId);
        new_user.setUserType(userType);
        new_user.setUsername(username);
        new_user.setPassword(password);
        new_user.setName(name);
        new_user.setSurname(surname);

        XMLGregorianCalendar xmlDate = fromDateToXMLGC(birthdate);
        new_user.setBirthdate(xmlDate);

        new_user.setGender(gender);
        new_user.setEmail(email);
        return new_user;
    }

    public MessageType create_messageType(int messageId,String sender,String receiver,String subject,String msgContent,String date){

        MessageType msg = new MessageType();
        msg.setMessageId(messageId);
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setSubject(subject);
        msg.setMessageContent(msgContent);
        msg.setDate(date);

        //XMLGregorianCalendar xmlDate = fromDateToXMLGC(date);
        //msg.setDate(xmlDate);

        return msg;
    }

    /*----------------------RESULT SET FUNCTIONS-------------------------*/

    public ArrayList<UserType> select_and_create_rs_user(){
        Statement statement;
        ResultSet rs = null;
        ArrayList<UserType> user_list = new ArrayList<UserType>();

        try {
            String query = String.format("select * from %s ", "user_info");
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            while(rs.next()){
                user_list.add(create_usertype(rs.getInt("userId"),rs.getString("userType"),rs.getString("username"),rs.getString("password"),rs.getString("name"),rs.getString("surname"),rs.getDate("birthdate"),rs.getString("gender"),rs.getString("email")));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return user_list;
    }

    public ArrayList<MessageType> select_and_create_rs_message(){
        Statement statement;
        ResultSet rs = null;
        ArrayList<MessageType> msg_list = new ArrayList<MessageType>();

        try {
            String query = String.format("SELECT * FROM %s ", "message_db");
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            while(rs.next()){
                msg_list.add(create_messageType(rs.getInt("messageId"),rs.getString("sender"),rs.getString("receiver"),rs.getString("subject"),rs.getString("message"),rs.getString("date")));
            }
            rs.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return msg_list;
    }


}