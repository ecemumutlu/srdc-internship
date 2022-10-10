package com.example.demo;


import spring_boot_ws_srdc_hw2.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import javax.xml.datatype.XMLGregorianCalendar;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

@Endpoint
public class UserEndpoint {
    private static final String NAMESPACE_URI = "http://spring_boot_ws_srdc_hw2";

    private final DbFuncsRepository dbFuncsRepository;

    @Autowired
    public UserEndpoint(DbFuncsRepository dbFuncsRepository) {
        this.dbFuncsRepository = dbFuncsRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getLoginRequest")
    @ResponsePayload
    public GetLoginResponse getLogin(@RequestPayload GetLoginRequest request) {
        GetLoginResponse response = new GetLoginResponse();

        if(request.getIdentifyingKey().equals("Client")){
            int flag = dbFuncsRepository.search_by_username(request.getUsername(),request.getPassword());

            if(flag == -1){
                response.setSystemMessage(SystemMessageType.NO_SUCH_USER);
            }
            else if(flag == 0){
                UserType user = dbFuncsRepository.give_me_UserType(request.getUsername());
                dbFuncsRepository.insertLoginUser(user);
                response.setSystemMessage(SystemMessageType.USER_CONNECTED);
            }
            else if (flag == 100) {
                UserType user = dbFuncsRepository.give_me_UserType(request.getUsername());
                dbFuncsRepository.insertLoginUser(user);
                response.setSystemMessage(SystemMessageType.ADMIN_CONNECTED);
            }
            return response;
        }
        else if(request.getIdentifyingKey().equals("User")){
            boolean is_there = dbFuncsRepository.is_there_loggedIn_user(request.getUsername(),request.getPassword());
            if(is_there){
                response.setSystemMessage(SystemMessageType.USER_ALREADY_LOGGED_IN); //this user already logged in
            }
            else{
                response.setSystemMessage(SystemMessageType.USER_IS_LOGGED_OUT);
            }
        }
        return response;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getLogoutRequest")
    @ResponsePayload
    public GetLogoutResponse getLogout(@RequestPayload GetLogoutRequest request) {

        GetLogoutResponse response = new GetLogoutResponse();

        dbFuncsRepository.deleteLogUser(request.getUsername());
        response.setSystemMessage(SystemMessageType.OPERATION_SUCCESSFUL);
        return response;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getDeleteUserRequest")
    @ResponsePayload
    public GetDeleteUserResponse getDeleteUser(@RequestPayload GetDeleteUserRequest request) {

        GetDeleteUserResponse response = new GetDeleteUserResponse();
        UserType user = dbFuncsRepository.give_me_UserType(request.getUserId());
        dbFuncsRepository.deleteLogUser(user.getUsername());
        dbFuncsRepository.delete_user(request.getUserId());

        SystemMessageType systemMessageType = null;
        if(dbFuncsRepository.is_there_such_user(request.getUserId()) == 0){
            systemMessageType = SystemMessageType.OPERATION_SUCCESSFUL;
        }
        else{
            systemMessageType = SystemMessageType.OPERATION_FAILED;
        }

        response.setSystemMessage(systemMessageType);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getCreateUserRequest")
    @ResponsePayload
    public GetCreateUserResponse getCreateUser(@RequestPayload GetCreateUserRequest request) {

        GetCreateUserResponse response = new GetCreateUserResponse();
        UserType new_user = new UserType();
        new_user.setUserType(request.getUserType());
        new_user.setUsername(request.getUsername());
        new_user.setPassword(request.getPassword());
        new_user.setName(request.getName());
        new_user.setSurname(request.getSurname());

        //date should be in the form of YYYY-MM-DD
        new_user.setBirthdate(request.getBirthdate());

        new_user.setGender(request.getGender());
        new_user.setEmail(request.getEmail());

        dbFuncsRepository.insert_user(new_user);

        SystemMessageType systemMessageType = null;
        if(dbFuncsRepository.is_there_such_username(request.getUsername())){
            systemMessageType = SystemMessageType.OPERATION_SUCCESSFUL;
        }
        else{
            systemMessageType = SystemMessageType.OPERATION_FAILED;
        }
        response.setSystemMessage(systemMessageType);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getInboxRequest")
    @ResponsePayload
    public GetInboxResponse getInbox(@RequestPayload GetInboxRequest request) {

        GetInboxResponse response = new GetInboxResponse();
        ArrayList<MessageType> messageList = dbFuncsRepository.select_and_create_rs_message();
        int size=messageList.size();
        for(int i=0;i<size;i++){
            if(request.getUsername().equals(messageList.get(i).getReceiver())) {
                MessageType msg = messageList.get(i);
                BoxReturn new_box = new BoxReturn();
                new_box.setSender(msg.getSender());
                new_box.setReceiver(msg.getReceiver());
                new_box.setSubject(msg.getSubject());
                new_box.setMessageId(msg.getMessageId());
                new_box.setDate(msg.getDate());
                response.getMessageList().add(new_box);
            }
        }
        if(response.getMessageList().size() == 0) response.setInboxSize("EMPTY INBOX.");
        else response.setInboxSize("There are " + ((Integer) response.getMessageList().size()).toString() + " messages in the inbox.");
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getOutboxRequest")
    @ResponsePayload
    public GetOutboxResponse getOutbox(@RequestPayload GetOutboxRequest request) {

        GetOutboxResponse response = new GetOutboxResponse();
        ArrayList<MessageType> messageList = dbFuncsRepository.select_and_create_rs_message();
        int size=messageList.size();
        for(int i=0;i<size;i++){
            if(request.getUsername().equals(messageList.get(i).getSender())) {
                MessageType msg = messageList.get(i);
                BoxReturn new_box = new BoxReturn();

                new_box.setSender(msg.getSender());
                new_box.setReceiver(msg.getReceiver());
                new_box.setSubject(msg.getSubject());
                new_box.setMessageId(msg.getMessageId());
                new_box.setDate(msg.getDate());
                response.getMessageList().add(new_box);
            }
        }
        if(response.getMessageList().size() == 0) response.setOutboxSize("EMPTY OUTBOX.");
        else response.setOutboxSize("There are " + ((Integer) response.getMessageList().size()).toString() + " messages in the outbox.");
        return response;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getReadMessageRequest")
    @ResponsePayload
    public GetReadMessageResponse getReadMessage(@RequestPayload GetReadMessageRequest request) {
        GetReadMessageResponse response = new GetReadMessageResponse();
        ArrayList<MessageType> messageList = dbFuncsRepository.select_and_create_rs_message();
        UserType user = null;
        if((user = dbFuncsRepository.give_me_UserType(request.getUsername())) != null){
            int size=messageList.size();
            for(int i=0;i<size;i++){
                if(request.getMessageId() == messageList.get(i).getMessageId()){
                    if(user.getUserType().equals("NA") && (request.getUsername().equals(messageList.get(i).getReceiver()) || request.getUsername().equals(messageList.get(i).getSender()))){
                        response.setMessage(messageList.get(i));

                        break;
                    }
                    else if(user.getUserType().equals("A")){
                        response.setMessage(messageList.get(i));
                        break;
                    }
                    else{
                        response.setSystemMessage(SystemMessageType.INVALID_MESSAGE_ID_FOR_USER);
                    }
                }
            }
        }
        else{
            response.setSystemMessage(SystemMessageType.NO_SUCH_USER);
        }

        return response;
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getSendMessageRequest")
    @ResponsePayload
    public GetSendMessageResponse getSendMessage(@RequestPayload GetSendMessageRequest request) {
        GetSendMessageResponse response = new GetSendMessageResponse();

        int first_size = dbFuncsRepository.select_and_create_rs_message().size();
        if(dbFuncsRepository.is_there_such_username(request.getReceiver())){
            MessageType msg = new MessageType();
            msg.setSender(request.getSender());
            msg.setReceiver(request.getReceiver());
            msg.setSubject(request.getSubject());
            msg.setMessageContent(request.getMessage());

            DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            Calendar cal = Calendar.getInstance();
            String date = dateFormat.format(cal.getTime());
            msg.setDate(date.toString());

            dbFuncsRepository.add_message_to_db(msg);
            if(dbFuncsRepository.select_and_create_rs_message().size() == (first_size+1))
                response.setSystemMessage(SystemMessageType.OPERATION_SUCCESSFUL);
            else
                response.setSystemMessage(SystemMessageType.OPERATION_FAILED);
            return response;
        }
        else{
            response.setSystemMessage(SystemMessageType.NO_SUCH_USER);
            return response;
        }
    }


    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUpdateUserRequest")
    @ResponsePayload
    public GetUpdateUserResponse getUpdateUser(@RequestPayload GetUpdateUserRequest request) {
        GetUpdateUserResponse response = new GetUpdateUserResponse();
        UserType old_user = dbFuncsRepository.give_me_UserType(request.getUsername());
        dbFuncsRepository.update(request.getUsername(),request.getNewInfo(),request.getWhat());
        UserType new_user = dbFuncsRepository.give_me_UserType(request.getUsername());
        if(new_user.equals(old_user))
            response.setSystemMessage(SystemMessageType.OPERATION_FAILED);
        else
            response.setSystemMessage(SystemMessageType.OPERATION_SUCCESSFUL);

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUpdateMessageRequest")
    @ResponsePayload
    public GetUpdateMessageResponse getUpdateMessage(@RequestPayload GetUpdateMessageRequest request) {
        GetUpdateMessageResponse response = new GetUpdateMessageResponse();

        String prev_cont = dbFuncsRepository.give_me_messageType(request.getMessageId()).getMessageContent();
        if(!prev_cont.equals(request.getMessageContent())){
            dbFuncsRepository.update_msg(request.getMessageId(),request.getMessageContent());
            if(prev_cont.equals(dbFuncsRepository.give_me_messageType(request.getMessageId()).getMessageContent())){
                response.setSystemMessage(SystemMessageType.OPERATION_FAILED);
            }
            else{
                response.setSystemMessage(SystemMessageType.OPERATION_SUCCESSFUL);
            }
            return response;
        }
        else{
            response.setSystemMessage(SystemMessageType.OPERATION_SUCCESSFUL);
            return response;
        }
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getSeeAllInboxRequest")
    @ResponsePayload
    public GetSeeAllInboxResponse getSeeAllInbox(@RequestPayload GetSeeAllInboxRequest request) {

        GetSeeAllInboxResponse response = new GetSeeAllInboxResponse();
        ArrayList<MessageType> messageList = dbFuncsRepository.select_and_create_rs_message();
        int size=messageList.size();
        for(int i=0;i<size;i++){
            MessageType msg = messageList.get(i);
            BoxReturn new_box = new BoxReturn();
            new_box.setSender(msg.getSender());
            new_box.setReceiver(msg.getReceiver());
            new_box.setSubject(msg.getSubject());
            new_box.setMessageId(msg.getMessageId());
            new_box.setDate(msg.getDate());
            response.getMessageList().add(new_box);
        }
        if(response.getMessageList().size() == 0) response.setInboxSize("EMPTY ALL-INBOX.");
        else response.setInboxSize("There are " + ((Integer) response.getMessageList().size()).toString() + " messages in the inbox.");
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getSeeAllUsersRequest")
    @ResponsePayload
    public GetSeeAllUsersResponse getSeeAllUsers(@RequestPayload GetSeeAllUsersRequest request) {

        GetSeeAllUsersResponse response = new GetSeeAllUsersResponse();
        ArrayList<UserType> usersList = dbFuncsRepository.select_and_create_rs_user();
        int size = usersList.size();
        for(int i=0;i<size;i++){
            response.getUserList().add(usersList.get(i));
        }
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getUserInfoRequest")
    @ResponsePayload
    public GetUserInfoResponse getUserInfo(@RequestPayload GetUserInfoRequest request) {

        GetUserInfoResponse response = new GetUserInfoResponse();
        UserType user = dbFuncsRepository.give_me_UserType(request.getUsername());
        if(user != null){
            response.setUser(user);
            response.setSystemMessage(SystemMessageType.OPERATION_SUCCESSFUL);
        }
        else {
            response.setSystemMessage(SystemMessageType.NO_SUCH_USER);
        }
        return response;
    }


}