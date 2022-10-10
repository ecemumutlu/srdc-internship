
import java.sql.*;
import java.util.ArrayList;


public class DbFuncs{

    public Connection conn;

    public DbFuncs(){
        conn = null;
    }
    //Connection conn = connect_to_db("srdc.hw1.db","postgres","eu1234");

    public void connect_to_db(String dbname,String username, String pass){
        try{
            Class.forName("org.postgresql.Driver");
            conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/"+dbname,username,pass);
            if(conn != null){
                System.out.println("Connection established");
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
            String query = "create table " + table_name +"(user_id SERIAL ,user_type varchar(200) ,username varchar(200), password varchar(200), name varchar(200),surname varchar(200), birthdate DATE NOT NULL, gender varchar(200),email varchar(200) ,primary key(user_id));";
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
            String query = "create table " + table_name +"(message_id SERIAL ,sender varchar(200), receiver varchar(200), subject varchar(200),date varchar(200) ,message varchar(500),primary key(message_id));";
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("table created");

        }catch(Exception e){
            System.out.println(e);
        }
    }
    public void insert_row(String table_name, User user){
        Statement statement;
        try{
            String query = String.format("insert into %s(user_type,username,password,name,surname,birthdate,gender,email) values('%s','%s','%s','%s','%s','%s','%s','%s');",table_name,user.user_type, user.username,user.password,user.name,user.surname,user.birthdate,user.gender,user.email);
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Row Inserted");
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public User read_data(String table_name, String username){
        Statement statement;
        ResultSet rs = null;
        User new_user = null;
        try{
            String query = String.format("SELECT * FROM %s where username = '%s'", table_name,username);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            if(rs.next()){
                new_user = new User(rs.getString("user_type"),rs.getString("username"),rs.getString("password"),rs.getString("name"),rs.getString("surname"),rs.getString("birthdate"),rs.getString("gender"),rs.getString("email"));
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
            System.out.println("Data updated");
        }catch(Exception e){
            System.out.println(e);
        }
    }
    public void update_msg(String id, String new_message,User user){
        Statement statement;
        try{
            if(user.user_type.equals("NA")){
                String query = String.format("update %s set message='%s' where message_id='%s' and sender = '%s'","message_db",new_message,id,user.username);
                statement = conn.createStatement();
                statement.executeUpdate(query);
                System.out.println("Data updated");
            }
            else{
                String query = String.format("update %s set message='%s' where message_id='%s'","message_db",new_message,id);
                statement = conn.createStatement();
                statement.executeUpdate(query);
                System.out.println("Data updated");
            }


        }catch(Exception e){
            System.out.println(e);
        }
    }

    public int is_there_such_user(String username){
        Statement statement;
        ResultSet rs = null;
        int flag  = 0;
        try{
            String query = String.format("select * from %s where username ='%s'","user_info",username);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);

            if(rs.next()) flag = 100;
        }catch(Exception e){
            System.out.println(e);
        }
        return flag;

    }

    public int search_by_username(String table_name, String username,String password){
        Statement statement;
        ResultSet rs = null;
        int flag  =-1;
        try{
            String query = String.format("select * from %s where username ='%s' and password ='%s'",table_name,username,password);
            statement = conn.createStatement();
            rs = statement.executeQuery(query);

            if(rs.next()){
                if(rs.getString("user_type").equals("A")){
                    flag = 100; //100 means admin user
                }
                else flag = 0;
            }
        }catch(Exception e){
            System.out.println(e);
        }
        return flag;
    }

    public void delete_row(String table_name,String id){
        Statement statement;
        try{
            String query = null;
            if(table_name.equals("message_db")){
                query = String.format("delete from %s where message_id = '%s'",table_name,id);
            }
            else if(table_name.equals("user_info")){
                query = String.format("delete from %s where user_id = '%s'",table_name,id);
            }
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Data deleted");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void add_message_to_db(String table_name, Message msg){
        Statement statement;
        try{
            String query = String.format("insert into %s(sender,receiver,subject,date,message) values('%s','%s','%s','%s','%s');",table_name, msg.sender,msg.receiver,msg.subject,msg.date,msg.message);
            statement = conn.createStatement();
            statement.executeUpdate(query);
            System.out.println("Row Inserted");
        }catch(Exception e){
            System.out.println(e);
        }
    }


    /*----------------------RESULT SET FUNCTIONS-------------------------*/
    public ArrayList<User> select_and_create_rs_user(){
        Statement statement;
        ResultSet rs = null;
        ArrayList<User> user_list = new ArrayList<User>();

        try {
            String query = String.format("select * from %s ", "user_info");
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            while(rs.next()){
                user_list.add(new User(rs.getInt("user_id"),rs.getString("user_type"),rs.getString("username"),rs.getString("password"),rs.getString("name"),rs.getString("surname"),rs.getString("birthdate"),rs.getString("gender"),rs.getString("email")));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return user_list;
    }

    public ArrayList<Message> select_and_create_rs_message(){
        Statement statement;
        ResultSet rs = null;
        ArrayList<Message> msg_list = new ArrayList<Message>();

        try {
            String query = String.format("SELECT * FROM %s ", "message_db");
            statement = conn.createStatement();
            rs = statement.executeQuery(query);
            while(rs.next()){
                Message nw_to_send = new Message(rs.getInt("message_id"),rs.getString("message"),rs.getString("sender"),rs.getString("receiver"),rs.getString("subject"),rs.getString("date"));
                msg_list.add(nw_to_send);
            }
            rs.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return msg_list;
    }

}


