package me.sun.exceoption;

public class AlreadyReadException extends RuntimeException {
    public AlreadyReadException(String message) {
        super(message);
    }
}
