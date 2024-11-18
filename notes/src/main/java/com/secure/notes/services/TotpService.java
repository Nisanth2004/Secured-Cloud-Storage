package com.secure.notes.services;

import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

public interface TotpService {


    // gnerate the secret
    GoogleAuthenticatorKey generateSecret();

    // generate the QR-code
    String getQrCodeUrl(GoogleAuthenticatorKey secret, String username);

    // verify the Code that user enter
    boolean verifyCode(String secret, int code);
}
