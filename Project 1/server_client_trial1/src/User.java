import java.util.Date;

public class User{
    String user_type;
    String username;

    Integer user_id;
    String password;
    String name;
    String surname;
    String birthdate;
    String gender;
    String email;

    public User(String user_type){
        this.user_type = user_type;
    }
    public User(String user_type,String username, String password, String name,String surname, String birthdate,String gender, String email){
        this.user_type = user_type;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.gender = gender;
        this.email = email;
    }

    public User(Integer user_id,String user_type,String username, String password, String name,String surname, String birthdate,String gender, String email){
        this.user_id  =user_id;
        this.user_type = user_type;
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.birthdate = birthdate;
        this.gender = gender;
        this.email = email;
    }


    public void setUser_type(String user_type) { this.user_type = user_type;}
    public void setUsername(String username){
        this.username = username;
    }
    public void setPassword(String password){
        this.password = password;
    }
    public void setName(String name){ this.name = name; }
    public void setSurname(String surname){
        this.surname = surname;
    }
    public void setBirthdate(String b){ this.birthdate = b; }
    public void setGender(String gender){
        this.gender = gender;
    }
    public void setEmail(String email){
        this.email = email;
    }

    public String getUsername(String username){
        return username;
    }
    public String getPassword(String password){
        return password;
    }
    public String getName(String name){ return name; }
    public String getSurname(String surname){
        return surname;
    }
    public String getBirthdate(String b){ return b; }
    public String getGender(String gender){
        return gender;
    }
    public String getEmail(String email){
        return email;
    }


}
