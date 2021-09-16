import { SetMetadata } from '@nestjs/common';

export const AdminPermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
