import { Job } from "bullmq";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY || "re_YAtG5w6z_JjajdDfuejzdjaxvPM2ZvgAU");

export const loginWorker = async (job: Job) => {
    try {
        const user = job.data.user;
        console.log("Processing login for user:", user.email);
        
        const { data, error } = await resend.emails.send({
            from: "Mahakama <emmanuelgatwech@gmail.com>",
            to: [user.email],
            subject: `Welcome back to Mahakama, ${user.name}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c3e50;">Welcome Back to Mahakama!</h2>
                    <p>Hello ${user.name},</p>
                    <p>We're excited to see you again! You've successfully logged into your Mahakama account.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #3498db;">Your Account Details:</h3>
                        <ul>
                            <li><strong>Name:</strong> ${user.name}</li>
                            <li><strong>Email:</strong> ${user.email}</li>
                            <li><strong>Location:</strong> ${user.city}, ${user.country}</li>
                            <li><strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</li>
                        </ul>
                    </div>
                    
                    <p>If you didn't attempt to log in, please contact our support team immediately.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #7f8c8d; font-size: 14px;">
                            Best regards,<br>
                            The Mahakama Team
                        </p>
                    </div>
                </div>
            `,
        });

        if (error) {
            logger.error({ error, userId: user.id }, "Failed to send welcome email");
            throw error;
        }

        logger.info({ userId: user.id, emailId: data?.id }, "Welcome email sent successfully");
        return data;
        
    } catch (error) {
        logger.error({ error, jobData: job.data }, "Login worker failed");
        throw error;
    }
};
