package com.secure.notes.util;

import com.secure.notes.models.User;
import com.secure.notes.repositories.UserRepository;
import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    // This class provide a any information about the user dudring login or authenticatin part

    @Autowired
    UserRepository userRepository;

    // this methods is simply get the logged in user-id
    public Long loggedInUserId()
    {

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        User user=userRepository.findByUserName(authentication.getName())
                .orElseThrow(()->new RuntimeException("User Not found"));

        return user.getUserId();
    }


    // this methods is simply get the logged in user
    public User loggedInUser()
    {

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

       return userRepository.findByUserName(authentication.getName())
                .orElseThrow(()->new RuntimeException("User Not found"));


    }
}
