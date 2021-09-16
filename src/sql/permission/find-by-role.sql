SELECT
  a.*,
  GROUP_CONCAT(c.permissionName) AS permission
FROM
  AdminRole AS a
  LEFT JOIN AdminRolePermission AS b ON b.adminRoleId = a.id
  LEFT JOIN (
    SELECT
      id,
      name AS permissionName,
      STATUS
    FROM
      AdminPermission
    WHERE
      STATUS = 'active'
  ) c ON b.adminPermissionId = c.id
WHERE
  a.id = :id AND a.type = 'admin' AND status = 'active'
GROUP BY
  a.id
