import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
    id: '0001',
    password: config.super_admin_password,
    email: 'superadmin@gemail.com',
    needsPasswordChange: false,
    isDeleted: false,
    status: 'in-progress',
    role: USER_ROLE.superAdmin,
};

const seedSuerAdmin = async () => {
    const isSuperAdmin = await User.findOne({ role: USER_ROLE.superAdmin });

    if (!isSuperAdmin) {
        await User.create(superUser);
    }
};

export default seedSuerAdmin;
