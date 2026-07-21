ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);

INSERT INTO roles (rol)
SELECT 'comprador'
WHERE NOT EXISTS (
  SELECT 1 FROM roles WHERE LOWER(rol) = 'comprador'
);

INSERT INTO roles (rol)
SELECT 'emprendedor'
WHERE NOT EXISTS (
  SELECT 1 FROM roles WHERE LOWER(rol) = 'emprendedor'
);
