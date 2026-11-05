package com.app.custome_exception;

/** Thrown when a pharmacy resource (medicine, prescription, bill...) does not exist. */
public class ResourceNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

