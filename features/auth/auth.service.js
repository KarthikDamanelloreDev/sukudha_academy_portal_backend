const jwt = require('jsonwebtoken');
const User = require('./auth.schema');
const ERROR_MESSAGES = require('../../utils/error-messages');
const { sendOtpEmail } = require('../../utils/email.service');

class AuthService {
    /**
     * Generate JWT Token
     */
    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }

    /**
     * Student Registration
     */
    async registerStudent(userData) {
        const { fullName, email, password } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create new student
        const user = await User.create({
            fullName,
            email,
            password,
            role: 'student'
        });

        // Generate token
        const token = this.generateToken(user._id);

        // Return user data without password
        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        };

        return { user: userResponse, token };
    }

    /**
     * Admin Registration
     */
    async registerAdmin(userData) {
        const { email, password } = userData;

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            throw new Error('Admin with this email already exists');
        }

        // Create new admin
        const user = await User.create({
            email,
            password,
            role: 'admin'
        });

        // Generate token
        const token = this.generateToken(user._id);

        // Return user data without password
        const userResponse = {
            id: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt
        };

        return { user: userResponse, token };
    }

    /**
     * Student Login
     */
    async loginStudent(email, password) {
        // Find user with password field
        const user = await User.findOne({ email, role: 'student' }).select('+password');

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Your account has been deactivated. Please contact support.');
        }

        // Verify password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new Error('Invalid email or password');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        // Return user data without password
        const userResponse = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        return { user: userResponse, token };
    }

    /**
     * Admin Login
     */
    async loginAdmin(email, password) {
        // Find admin with password field
        const user = await User.findOne({ email, role: 'admin' }).select('+password');

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check if admin is active
        if (!user.isActive) {
            throw new Error('Your account has been deactivated. Please contact support.');
        }

        // Verify password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new Error('Invalid email or password');
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        // Return user data without password
        const userResponse = {
            id: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        return { user: userResponse, token };
    }

    /**
     * Verify Token
     */
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only');
            const user = await User.findById(decoded.id);

            if (!user || !user.isActive) {
                throw new Error('Invalid token');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Get User Profile
     */
    async getUserProfile(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Forgot Password
     */
    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found with this email');
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and expiration (1 hour)
        user.resetPasswordOtp = otp;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

        await user.save({ validateBeforeSave: false });

        try {
            await sendOtpEmail(user.email, otp);
            return { message: 'OTP sent to email' };
        } catch (error) {
            user.resetPasswordOtp = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            throw new Error('Email could not be sent. Please try again later.');
        }
    }

    /**
     * Reset Password
     */
    async resetPassword(email, otp, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Search for user with the email and matching Valid OTP
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid OTP or OTP has expired');
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        const token = this.generateToken(user._id);

        return {
            message: 'Password reset successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt
            }
        };
    }
}

module.exports = new AuthService();
