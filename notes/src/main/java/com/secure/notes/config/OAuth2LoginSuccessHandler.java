package com.secure.notes.config;

import com.secure.notes.models.AppRole;
import com.secure.notes.models.Role;
import com.secure.notes.models.User;
import com.secure.notes.repositories.RoleRepository;
import com.secure.notes.security.jwt.JwtUtils;
import com.secure.notes.security.services.UserDetailsImpl;
import com.secure.notes.services.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Autowired
    private final UserService userService;

    @Autowired
    private final JwtUtils jwtUtils;

    @Autowired
    RoleRepository roleRepository;

    @Value("${frontend.url}")
    private String frontendUrl;

    String username;
    String idAttributeKey;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        // parse the authentication object to OAuth2 Authentication object
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;

        // check which login provider is used and their unique regisratationId
        if ("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()) || "google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {

            // for that user get their principal "here we get username,email"
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();

            // get the attributes
            Map<String, Object> attributes = principal.getAttributes();
            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();

            // for different login providers it have unique word
            // if we get username from github account this line is executed
            if ("github".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = attributes.getOrDefault("login", "").toString();
                idAttributeKey = "id";

                // if goole menas this lines is executed
            } else if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
                username = email.split("@")[0];
                idAttributeKey = "sub";
            } else {
                username = "";
                idAttributeKey = "id";
            }
            System.out.println("HELLO OAUTH: " + email + " : " + name + " : " + username);

            // after extract the mail and username check in db if alreday exists

            // if exists this method is executed
            userService.findByEmail(email)
                    .ifPresentOrElse(user -> {

                        // if present means get their particular roles
                        DefaultOAuth2User oauthUser = new DefaultOAuth2User(
                                List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name())),
                                attributes,
                                idAttributeKey
                        );

                        // Finally set the authentication object to the user in SecurityContext
                        Authentication securityAuth = new OAuth2AuthenticationToken(
                                oauthUser,
                                List.of(new SimpleGrantedAuthority(user.getRole().getRoleName().name())),
                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
                        );
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);

                        // if the user is not persists in database it will create a new user object
                    }, () -> {
                        User newUser = new User();

                        // assign the default role and also check the role is exists in db
                        Optional<Role> userRole = roleRepository.findByRoleName(AppRole.ROLE_USER); // Fetch existing role
                        if (userRole.isPresent()) {
                            newUser.setRole(userRole.get()); // Set existing role
                        } else {
                            // Handle the case where the role is not found
                            throw new RuntimeException("Default role not found");
                        }

                        // save the user
                        newUser.setEmail(email);
                        newUser.setUserName(username);
                        newUser.setSignUpMethod(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                        userService.registerUser(newUser);
                        DefaultOAuth2User oauthUser = new DefaultOAuth2User(
                                List.of(new SimpleGrantedAuthority(newUser.getRole().getRoleName().name())),
                                attributes,
                                idAttributeKey
                        );

                        // set the security-context-holder
                        Authentication securityAuth = new OAuth2AuthenticationToken(
                                oauthUser,
                                List.of(new SimpleGrantedAuthority(newUser.getRole().getRoleName().name())),
                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
                        );
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    });
        }
        this.setAlwaysUseDefaultTargetUrl(true);

        // JWT TOKEN LOGIC
        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauth2User.getAttributes();

        // Extract necessary attributes
        String email = (String) attributes.get("email");
        System.out.println("OAuth2LoginSuccessHandler: " + username + " : " + email);


        // Because we had to get the user role from our database and also github roles send it to the frontend.
        Set<SimpleGrantedAuthority> authorities=new HashSet<>(  oauth2User.getAuthorities().stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                .collect(Collectors.toList()));

        // fetch role from db
        User user=userService.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));
        authorities.add(new SimpleGrantedAuthority(user.getRole().getRoleName().name()));
        // Create UserDetailsImpl instance
        UserDetailsImpl userDetails = new UserDetailsImpl(
                null,
                username,
                email,
                null,
                false,
                authorities
        );

        // Generate JWT token
        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        // Redirect to the frontend with the JWT token
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("token", jwtToken)
                .build().toUriString();
        this.setDefaultTargetUrl(targetUrl);
        super.onAuthenticationSuccess(request, response, authentication);
    }
}