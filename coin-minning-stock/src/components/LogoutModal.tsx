/** @format */

"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface LogoutModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	title?: string;
	description?: string;
}

export default function LogoutModal({
	isOpen,
	onClose,
	onConfirm,
	title = "Confirm Logout",
	description = "Are you sure you want to logout? You will need to login again to access your dashboard.",
}: LogoutModalProps) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	isLoggingOut;

	const handleConfirm = async () => {
		try {
			setIsLoggingOut(true);
			await onConfirm();
			onClose();
		} catch (error: any) {
			// onClose() // Ensure modal closes even if logout fails
			console.error("Logout error:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						variant='outline'
						onClick={onClose}>
						Cancel
					</Button>

					<Button
						variant='destructive'
						onClick={handleConfirm}>
						Logout
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
