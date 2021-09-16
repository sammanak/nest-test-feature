SELECT
  ap.id,
  GROUP_CONCAT(aps.permissionName) AS permissions
FROM
  AdminProfile ap
  INNER JOIN AdminRole ar ON ar.id = ap.roleId
  INNER JOIN AdminRolePermission arp ON arp.adminRoleId = ar.id
  LEFT JOIN (
    SELECT
      id,
      name AS permissionName,
      STATUS
    FROM
      AdminPermission
    WHERE
      STATUS = 'active'
  ) aps ON arp.adminPermissionId = aps.id
WHERE
  ap.id = :id
