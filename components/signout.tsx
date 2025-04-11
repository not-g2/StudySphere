"use client";
import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface LogoutPageProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSession: React.Dispatch<React.SetStateAction<any>>;
}

const LogoutPage: React.FC<LogoutPageProps> = ({
    open,
    setOpen,
    setSession,
}) => {
    const router = useRouter(); // For navigation to home page

    // Close the confirmation dialog without logging out
    const handleClose = () => {
        setOpen(false);
    };

    // Handle logout confirmation
    const handleLogout = () => {
        // Clear the session cookie
        Cookies.remove("session");
        setSession(null);
        handleClose();

        // Redirect to the home page
        router.push("/");
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to log out?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleLogout} color="secondary">
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogoutPage;
