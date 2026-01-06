function validateUpdateProfile (req, res, next) {
    try {
        const updates = {};
        const { fullName, profileImageUrl, isDiscoverable } = req.body;

        if (typeof fullName === 'string') {
            const trimmedFullName = fullName.trim();
            if (trimmedFullName.length < 2 || trimmedFullName.length > 100) {
                return res.status(400).json({ message: 'Full name must be between 2 and 100 characters' });
            }
            updates.fullName = trimmedFullName;
        }

        if (typeof profileImageUrl === 'string') {
            const trimmedUrl = profileImageUrl.trim();
            try {
                const url = new URL(trimmedUrl);
                if (!['http:', 'https:'].includes(url.protocol)) {
                    return res.status(400).json({ message: 'Profile image URL must use http or https protocol' });
                }
                updates.profileImageUrl = trimmedUrl;
            } catch {
                return res.status(400).json({ message: 'Invalid profile image URL' });
            }
        }

        if (typeof isDiscoverable === 'boolean') {
            updates.isDiscoverable = isDiscoverable;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        req.updates = updates;

        next();
    } catch (error) {
        console.error('Error validating update profile request: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = {validateUpdateProfile};