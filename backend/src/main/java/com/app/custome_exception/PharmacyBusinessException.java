package com.app.custome_exception;

/** Thrown for business-rule violations: insufficient stock, expired medicine, duplicate batch... */
public class PharmacyBusinessException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public PharmacyBusinessException(String message) {
        super(message);
    }
}

