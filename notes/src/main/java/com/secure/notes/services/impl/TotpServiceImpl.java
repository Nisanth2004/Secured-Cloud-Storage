package com.secure.notes.services.impl;

import com.secure.notes.services.TotpService;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class TotpServiceImpl implements TotpService {

    private final GoogleAuthenticator gAuth;

    public TotpServiceImpl(GoogleAuthenticator gAuth) {
        this.gAuth = gAuth;
    }


    public TotpServiceImpl( ) {
        this.gAuth = new GoogleAuthenticator();
    }

    // gnerate the secret
    @Override
    public GoogleAuthenticatorKey generateSecret()
    {
        return gAuth.createCredentials();
    }

    // generate the QR-code
    @Override
    public String getQrCodeUrl(GoogleAuthenticatorKey secret,String username)
    {
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("Secure Notes App",username,secret);
    }

    // verify the Code that user enter
    @Override
    public boolean verifyCode(String secret,int code)
    {
        return gAuth.authorize(secret,code);
    }
}
