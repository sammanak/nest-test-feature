SELECT
  a.id,
  a.email,
  b.firstName,
  b.lastName,
  b.imageUrl,
  c.name AS role,
  a.createdAt,
  a.updatedAt,
  a.status
FROM
  Accounts a
  JOIN AdminProfile b ON a.id = b.id
  JOIN AdminRole c ON c.id = b.roleId
WHERE
  a.type = 'admin'
LIMIT
  :limit OFFSET :offset
